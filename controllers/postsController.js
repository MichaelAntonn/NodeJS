const APIError = require("../util/APIError");
const Post = require("../models/posts");

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const data = req.body;
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json({ status: "success", data: { post } });
  } catch (error) {
    next(error);
  }
};

// Get all posts
const getPosts = async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const userId = req.user?._id;

  const postsCount = await Post.countDocuments();
  const numberOfPages = Math.ceil(postsCount / limit);

  const posts = await Post.find()
    .skip((page - 1) * limit) // get posts for the current page
    .limit(limit)
    .populate("author", "name email");
  if (!posts?.length) {
    throw new APIError(404, "No posts found");
  }
  const postsWithFlag = posts.map((post) => ({
    ...post.toObject(),
    isMine: userId && post.author._id.toString() === userId.toString(),
  }));
  const pagination = {
    page,
    numberOfPages,
    total: postsCount,
    next: page < numberOfPages,
    prev: page > 1,
  };

  res.status(200).json({ posts: postsWithFlag , pagination });};

// Get a single post by ID
const getPostById = async (req, res) => {
  const userId = req.user?._id;
  const post = await Post.findById(req.params.id).populate("author");
  if (!post) {
    throw new APIError(404, "Post not found");
  }
  const postWithFlag = {
    ...post.toObject(),
    isMine: userId && post.author._id.toString() === userId.toString(),
  };
  res.status(200).json(postWithFlag);
};

// Update a post by ID
const updatePostById = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const postData = req.body;
  const post = await Post.findOne({ _id: postId, author: userId });

  if (!post) {
    throw new APIError(404, `Post with id: ${postId} not found or you are not authorized to update it`);
  }

  const updatedPost = await Post.findOne(
    { _id: postId, author: userId },
    { title: postData.title, content: postData.content },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPost) {
    throw new APIError(404, `Post with id: ${postId} not found`);
  }

  res.status(200).json({ status: "success", data: { post: updatedPost } });
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id; 


  const deletedPost = await Post.findOneAndDelete({ _id: postId, author: userId });

  if (!deletedPost) {
    throw new APIError(404, `Post with id: ${postId} not found or you are not authorized to delete it`);
  }

  res.status(204).json(); 
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
