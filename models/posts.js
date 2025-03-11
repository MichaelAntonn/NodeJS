const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title"],
      trim: true, 
      maxlength: [100, "A post title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "A post must have content"],
      maxlength: [5000, "A post content cannot exceed 5000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "A post must have an author"],
    },
  },
  { timestamps: true } 
);


postSchema.index({ title: "text", content: "text" }); // Text index for searching
postSchema.index({ author: 1 }); // Index for author field



const Post = mongoose.model("Post", postSchema);
module.exports = Post;