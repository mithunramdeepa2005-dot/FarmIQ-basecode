import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} from "../controllers/postController.js";

const router = express.Router();

// All community actions require login
router.use(authMiddleware);

// Get all posts
router.get("/", getPosts);

// Create post
router.post("/", createPost);

// Update own post
router.put("/:id", updatePost);

// Delete own post
router.delete("/:id", deletePost);

// Like / unlike post
router.post("/:id/like", toggleLike);

// Add comment
router.post("/:id/comments", addComment);

export default router;