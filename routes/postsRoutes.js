const express = require("express");
const postsController = require("./../controllers/postsController");
const router = express.Router();
const auth = require("../Middlewares/auth");



router.get("/", postsController.getPosts);

router.post("/", auth, postsController.createPost);

router.get("/:id", postsController.getPostById);

router.put("/:id", postsController.updatePostById);

router.delete("/:id", postsController.deletePostById);

module.exports = router;
