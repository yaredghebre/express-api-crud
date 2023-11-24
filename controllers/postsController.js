const Validation = require("../exceptions/ValidationError");
const NotFound = require("../exceptions/notFound");
const prisma = require("../library/PrismaClient");
const slugify = require("slugify");

async function index(req, res, next) {
  // Filtri
  const filters = req.query.filter;
  const queryFilter = {};
  // Pagination
  const page = req.query.page || 1;
  const perPage = 5;

  if (filters && filters.title) {
    queryFilter.title = {
      contains: filters.title,
    };
  }
  // Risultati
  const total = await prisma.post.count({ where: queryFilter });

  const data = await prisma.post.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    where: queryFilter,
  });

  if (data.length === 0) {
    return next(new NotFound("No posts found"));
  }

  return res.json({ data, page, perPage, total });
}

async function show(req, res, next) {
  const slug = req.params.slug;
  const data = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!data) {
    // in async function uso parametro next()
    next(new NotFound("Post Not Found"));
  }

  return res.json(data);
}

async function store(req, res, next) {
  const addData = req.body;
  if (!addData.title) {
    return next(new Validation("Title missing!"));
  }
  let slug = slugify(addData.title, {
    replacement: "-",
    lower: true,
  });

  let existingPosts = await prisma.post.findMany({
    where: {
      slug: {
        startsWith: slug,
      },
    },
  });

  const nextSlugCount = existingPosts.length;

  if (nextSlugCount > 0) {
    slug = `${slug}-${nextSlugCount}`;
  }

  const newPost = await prisma.post.create({
    data: {
      title: addData.title,
      slug: slug,
      image: addData.image,
      content: addData.content,
      published: addData.published,
    },
  });

  return res.json(newPost);
}

async function update(req, res) {
  const slug = req.params.slug;
  const postData = req.body;

  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post Not Found" });
    }

    const updatedPost = await prisma.post.update({
      where: {
        slug: slug,
      },
      data: {
        title: postData.title,
        image: postData.image,
        content: postData.content,
      },
    });
    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: "Something when wrong!" });
  }
}

async function destroy(req, res) {
  const slug = req.params.slug;
  //   const deleteData = req.body;

  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post Not Found" });
    }

    const deletedPost = await prisma.post.delete({
      where: {
        slug: slug,
      },
    });
    return res.json({ message: "Post deleted!" });
  } catch (error) {
    return res.status(500).json({ error: "Something when wrong!" });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
