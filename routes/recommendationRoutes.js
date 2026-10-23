
import express from "express";

import {
  generateRecommendation,
  getRecommendationHistory,
} from "../controllers/recommendationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateRecommendation
);

router.get(
  "/history",
  authMiddleware,
  getRecommendationHistory
);

export default router;
