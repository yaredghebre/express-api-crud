const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

// Definisco rotte per le operazioni CRUD

router.get("/", postsController.index);

router.get("/:slug", postsController.show);

router.post("/", postsController.store);

router.put("/:slug", postsController.update);

router.delete("/:slug", postsController.destroy);

module.exports = router;
