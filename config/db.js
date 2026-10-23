
import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ MONGO_URI is missing from environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    console.log("✅ Connected to MongoDB");
    console.log(`📦 Database: ${mongoose.connection.name}`);

    mongoose.connection.on("disconnected", () => {
      console.error("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error.message);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
