const prisma = require("../library/PrismaClient");
const slugify = require("slugify");

async function index(req, res) {
  const data = await prisma.post.findMany();

  return res.json(data);
}

async function show(req, res) {
  const data = await prisma.post.findUnique({
    where: {
      slug: "this-is-my-very-first-post",
    },
  });

  return res.json(data);
}

async function store(req, res) {
  const addData = req.body;
  const slug = slugify(addData.title, {
    replacement: "-",
    lower: true,
  });

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

async function update(req, res) {}

async function destroy(req, res) {}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
