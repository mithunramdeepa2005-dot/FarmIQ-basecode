import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    // Optional because we removed the FarmIQ token/auth requirement
    userId: {
      type: String,
      default: null,
    },

    farmId: {
      type: String,
      default: null,
    },

    crop: {
      type: String,
      required: true,
    },

    soilType: {
      type: String,
      required: true,
    },

    farmSize: {
      type: Number,
      required: true,
    },

    irrigation: {
      type: String,
      required: true,
    },

    

suggestedCrops: {
  type: [
    {
      name: { type: String, required: true },
      reason: { type: String, required: true },
    },
  ],
  default: [],
},



    weather: {
      temperature: {
        type: Number,
        default: null,
      },

      humidity: {
        type: Number,
        default: null,
      },

      wind: {
        type: Number,
        default: null,
      },

      location: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },
    },

    waterManagement: {
      type: String,
      required: true,
    },

    fertilizer: {
      type: String,
      required: true,
    },

    cropManagement: {
      type: String,
      required: true,
    },

    soilManagement: {
      type: String,
      required: true,
    },

    irrigationManagement: {
      type: String,
      required: true,
    },

    farmManagement: {
      type: String,
      required: true,
    },

    weatherManagement: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);

export default Recommendation;