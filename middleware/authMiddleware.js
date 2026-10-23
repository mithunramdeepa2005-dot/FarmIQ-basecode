import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // ==========================================
    // CHECK AUTHORIZATION HEADER
    // ==========================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // ==========================================
    // CHECK JWT SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env");

      return res.status(500).json({
        success: false,
        message: "JWT configuration error",
      });
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // NORMALIZE USER ID
    // ==========================================

    const userId =
      decoded.userId ||
      decoded.id ||
      decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: user ID missing",
      });
    }

    // ==========================================
    // STORE USER INFORMATION
    // ==========================================

    req.user = {
      ...decoded,
      userId,
    };

    next();

  } catch (error) {
    console.error("❌ Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authMiddleware;