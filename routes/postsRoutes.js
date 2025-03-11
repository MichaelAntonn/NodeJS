const express = require("express");
const postsController = require("./../controllers/postsController");
const router = express.Router();
const auth = require("../Middlewares/auth");

router.use(auth);

router.get("/", postsController.getPosts);

router.post("/",  postsController.createPost);

router.get("/:id", postsController.getPostById);

router.put("/:id", postsController.updatePostById);

router.delete("/:id", postsController.deletePostById);

module.exports = router;
