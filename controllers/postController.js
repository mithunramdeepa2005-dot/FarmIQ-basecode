import Post from "../models/Post.js";
import User from "../models/user.js";

// ==========================================
// GET ALL POSTS
// ==========================================
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate(
        "userId",
        "name accountType farmingType"
      )
      .populate(
        "comments.userId",
        "name"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(
      "Get Posts Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching posts",
    });
  }
};


// ==========================================
// CREATE POST
// ==========================================
export const createPost = async (req, res) => {
  try {
    const { text, tag } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message:
          "Post cannot exceed 1000 characters",
      });
    }

    const post = await Post.create({
      userId: req.user.userId,
      text: text.trim(),
      tag: tag || "Farmer Update",
    });

    const populatedPost =
      await Post.findById(post._id).populate(
        "userId",
        "name accountType farmingType"
      );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error(
      "Create Post Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating post",
    });
  }
};


// ==========================================
// UPDATE POST
// ==========================================
export const updatePost = async (req, res) => {
  try {
    const { text, tag } = req.body;

    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Post content cannot be empty",
        });
      }

      if (text.trim().length > 1000) {
        return res.status(400).json({
          success: false,
          message:
            "Post cannot exceed 1000 characters",
        });
      }

      post.text = text.trim();
    }

    if (tag !== undefined) {
      post.tag = tag;
    }

    await post.save();

    const updatedPost =
      await Post.findById(post._id).populate(
        "userId",
        "name accountType farmingType"
      );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(
      "Update Post Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating post",
    });
  }
};


// ==========================================
// DELETE POST
// ==========================================
export const deletePost = async (req, res) => {
  try {
    const post =
      await Post.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId,
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Post Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting post",
    });
  }
};


// ==========================================
// LIKE / UNLIKE POST
// ==========================================
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId =
      req.user.userId.toString();

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(req.user.userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      message: alreadyLiked
        ? "Post unliked"
        : "Post liked",
    });
  } catch (error) {
    console.error(
      "Toggle Like Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating like",
    });
  }
};


// ==========================================
// ADD COMMENT
// ==========================================
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Comment content is required",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message:
          "Comment cannot exceed 500 characters",
      });
    }

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      userId: req.user.userId,
      text: text.trim(),
    });

    await post.save();

    const updatedPost =
      await Post.findById(post._id)
        .populate(
          "userId",
          "name"
        )
        .populate(
          "comments.userId",
          "name"
        );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(
      "Add Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while adding comment",
    });
  }
};