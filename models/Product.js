
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        // Crop categories
        "Rice",
        "Groundnut",
        "Cotton",
        "Tomato",
        "Onion",
        "Wheat",
        "Maize",
        "Sugarcane",
        "Vegetables",
        "Fruits",
        "Other Crops",

        // Existing farm-supply categories
        "Seeds",
        "Fertilizers",
        "Pesticides",
        "Tools",
        "Equipment",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    previousPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    seller: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default Product;
