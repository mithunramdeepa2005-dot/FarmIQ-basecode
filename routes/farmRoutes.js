import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createFarm,
  getMyFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} from "../controllers/farmController.js";

const router = express.Router();

// All farm routes require login
router.use(authMiddleware);

// Create a new farm
router.post("/", createFarm);

// Get all farms belonging to logged-in user
router.get("/", getMyFarms);

// Get one farm
router.get("/:id", getFarmById);

// Update farm
router.put("/:id", updateFarm);

// Delete farm
router.delete("/:id", deleteFarm);

export default router;