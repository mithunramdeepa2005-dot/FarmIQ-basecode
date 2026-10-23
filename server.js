
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cropMarketRoutes from "./routes/cropMarketRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow local development and the deployed Vercel frontend

const allowedOrigins = [
  "http://localhost:5173",
  "https://farm-iq-alpha.vercel.app",
  "https://farm-iq-git-main-mithunramdeepa2005-dots-projects.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FarmIQ Backend is running successfully!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/products", productRoutes);
app.use("/api/crop-market", cropMarketRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`FarmIQ Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();