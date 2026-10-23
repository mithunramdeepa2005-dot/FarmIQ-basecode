import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Paddy",
    category: "Seeds",
    description: "High-quality paddy suitable for farming.",
    price: 2540,
    unit: "Quintal",
    stock: 120,
    seller: "FarmIQ Agriculture",
    location: "Vellore, Tamil Nadu",
    image: "",
    isAvailable: true,
  },

  {
    name: "Banana",
    category: "Seeds",
    description: "Healthy banana planting material.",
    price: 1950,
    unit: "Quintal",
    stock: 85,
    seller: "Green Valley Farms",
    location: "Vellore, Tamil Nadu",
    image: "",
    isAvailable: true,
  },

  {
    name: "Coconut",
    category: "Seeds",
    description: "Quality coconut farming material.",
    price: 3450,
    unit: "Quintal",
    stock: 60,
    seller: "Tamil Farm Supplies",
    location: "Ranipet, Tamil Nadu",
    image: "",
    isAvailable: true,
  },

  {
    name: "Mango",
    category: "Seeds",
    description: "Premium mango planting material.",
    price: 5200,
    unit: "Quintal",
    stock: 45,
    seller: "Green Valley Farms",
    location: "Chennai, Tamil Nadu",
    image: "",
    isAvailable: true,
  },

  {
    name: "Groundnut",
    category: "Seeds",
    description: "Quality groundnut seeds for cultivation.",
    price: 6100,
    unit: "Quintal",
    stock: 100,
    seller: "FarmIQ Agriculture",
    location: "Vellore, Tamil Nadu",
    image: "",
    isAvailable: true,
  },

  {
    name: "Maize",
    category: "Seeds",
    description: "High-quality maize seeds.",
    price: 2250,
    unit: "Quintal",
    stock: 90,
    seller: "Agri Growers",
    location: "Chittoor, Andhra Pradesh",
    image: "",
    isAvailable: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    const existingCount = await Product.countDocuments();

    if (existingCount > 0) {
      console.log(
        `⚠️ Products already exist (${existingCount}).`
      );
      console.log(
        "No new products were inserted."
      );

      await mongoose.connection.close();
      process.exit(0);
    }

    await Product.insertMany(products);

    console.log(
      `✅ ${products.length} products inserted successfully.`
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Product Seed Error:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();