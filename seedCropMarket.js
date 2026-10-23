
import mongoose from "mongoose";
import CropMarketPrice from "./models/CropMarketPrice.js";
import dotenv from "dotenv";

dotenv.config();

const demoPrices = [];
const today = new Date();

const crops = [
  { cropName: "Rice", price: 2800 },
  { cropName: "Groundnut", price: 6500 },
  { cropName: "Cotton", price: 7200 },
  { cropName: "Tomato", price: 2500 },
  { cropName: "Onion", price: 3000 },
];

for (const crop of crops) {
  for (let daysAgo = 14; daysAgo >= 0; daysAgo--) {
    const priceDate = new Date(today);
    priceDate.setDate(today.getDate() - daysAgo);

    const variation = 1 + (Math.random() * 0.1 - 0.05);

    demoPrices.push({
      cropName: crop.cropName,
      marketName: "Demo Market",
      district: "Vellore",
      state: "Tamil Nadu",
      price: Number((crop.price * variation).toFixed(2)),
      unit: "quintal",
      priceDate,
      source: "DEMO DATA - NOT LIVE MARKET PRICES",
      isDemo: true,
    });
  }
}

async function seedCropMarket() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await CropMarketPrice.deleteMany({ isDemo: true });
    await CropMarketPrice.insertMany(demoPrices);

    console.log(`Inserted ${demoPrices.length} demo crop price records.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCropMarket();
