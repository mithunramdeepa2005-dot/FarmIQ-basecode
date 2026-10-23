import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    crop: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    soilType: {
      type: String,
      enum: [
        "red",
        "black",
        "alluvial",
        "sandy",
        "clay",
      ],
      default: "red",
    },

    irrigation: {
      type: String,
      enum: [
        "rain",
        "drip",
        "sprinkler",
        "canal",
      ],
      default: "rain",
    },

    status: {
      type: String,
      enum: [
        "Healthy",
        "Growing",
        "Needs Water",
        "Harvest Ready",
      ],
      default: "Healthy",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Farm =
  mongoose.models.Farm ||
  mongoose.model("Farm", farmSchema);

export default Farm;