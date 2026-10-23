import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ==========================================
// GET CURRENT USER PROFILE
// ==========================================

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
    } = req.body;

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (
      name !== undefined &&
      typeof name === "string" &&
      name.trim() !== ""
    ) {
      user.name = name.trim();
    }

    // Update phone
    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    // Update location
    if (location !== undefined) {
      user.location = String(location).trim();
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user.userId
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});


// ==========================================
// GET USER SETTINGS
// ==========================================

router.get(
  "/settings",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select("settings");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Make sure default settings exist
      const settings = {
        notifications:
          user.settings?.notifications ?? true,

        weatherAlerts:
          user.settings?.weatherAlerts ?? true,

        marketAlerts:
          user.settings?.marketAlerts ?? false,

        temperatureUnit:
          user.settings?.temperatureUnit ??
          "Celsius",
      };

      res.status(200).json({
        success: true,
        settings,
      });
    } catch (error) {
      console.error(
        "Get Settings Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to get settings",
      });
    }
  }
);


// ==========================================
// UPDATE USER SETTINGS
// ==========================================

router.put(
  "/settings",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        notifications,
        weatherAlerts,
        marketAlerts,
        temperatureUnit,
      } = req.body;

      const user = await User.findById(
        req.user.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // ======================================
      // UPDATE SETTINGS
      // ======================================

      if (
        notifications !== undefined
      ) {
        user.settings.notifications =
          Boolean(notifications);
      }

      if (
        weatherAlerts !== undefined
      ) {
        user.settings.weatherAlerts =
          Boolean(weatherAlerts);
      }

      if (
        marketAlerts !== undefined
      ) {
        user.settings.marketAlerts =
          Boolean(marketAlerts);
      }

      if (
        temperatureUnit !== undefined
      ) {
        if (
          temperatureUnit !== "Celsius" &&
          temperatureUnit !== "Fahrenheit"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid temperature unit",
          });
        }

        user.settings.temperatureUnit =
          temperatureUnit;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Settings updated successfully",
        settings: {
          notifications:
            user.settings.notifications,

          weatherAlerts:
            user.settings.weatherAlerts,

          marketAlerts:
            user.settings.marketAlerts,

          temperatureUnit:
            user.settings.temperatureUnit,
        },
      });
    } catch (error) {
      console.error(
        "Update Settings Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update settings",
      });
    }
  }
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      // Validate input
      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
      }

      // Password length validation
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
      }

      // Find user
      const user = await User.findById(
        req.user.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check current password
      const isPasswordCorrect =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to change password",
      });
    }
  }
);


export default router;