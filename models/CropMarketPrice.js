
import mongoose from "mongoose";

const cropMarketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Rice",
        "Groundnut",
        "Cotton",
        "Tomato",
        "Onion",
        "Wheat",
        "Maize",
        "Sugarcane",
        "Potato",
        "Other",
      ],
    },

    variety: {
      type: String,
      trim: true,
      default: "",
    },

    marketName: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      default: "Tamil Nadu",
    },

    // Prices in Indian rupees per specified unit
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      enum: ["quintal", "kg", "tonne"],
      default: "quintal",
    },

    priceDate: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Efficient lookup of a crop's price history
cropMarketPriceSchema.index({
  cropName: 1,
  marketName: 1,
  priceDate: -1,
});

const CropMarketPrice =
  mongoose.models.CropMarketPrice ||
  mongoose.model(
    "CropMarketPrice",
    cropMarketPriceSchema
  );

export default CropMarketPrice;
