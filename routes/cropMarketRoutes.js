
import express from "express";

import {
  getCropMarketPrices,
  getCropPriceHistory,
} from "../controllers/cropMarketController.js";

const router = express.Router();

router.get("/", getCropMarketPrices);

router.get("/history/:cropName", getCropPriceHistory);

export default router;
