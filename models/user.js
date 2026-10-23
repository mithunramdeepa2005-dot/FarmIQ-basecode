import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // ==========================================
    // USER SETTINGS
    // ==========================================

    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },

      weatherAlerts: {
        type: Boolean,
        default: true,
      },

      marketAlerts: {
        type: Boolean,
        default: false,
      },

      temperatureUnit: {
        type: String,
        enum: ["Celsius", "Fahrenheit"],
        default: "Celsius",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;