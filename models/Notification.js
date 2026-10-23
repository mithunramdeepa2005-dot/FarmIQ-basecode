import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER WHO RECEIVES THE NOTIFICATION
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // NOTIFICATION TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // NOTIFICATION MESSAGE
    // ==========================================

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // NOTIFICATION TYPE
    // ==========================================

    type: {
      type: String,
      enum: [
        "general",
        "weather",
        "market",
        "farm",
        "recommendation",
      ],
      default: "general",
    },

    // ==========================================
    // READ STATUS
    // ==========================================

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// MODEL
// ==========================================

const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;