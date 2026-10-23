import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    tag: {
      type: String,
      enum: [
        "Crop Management",
        "Weather Update",
        "Ask Farmers",
        "Market Prices",
        "Organic Farming",
        "Irrigation",
        "Farmer Update",
      ],
      default: "Farmer Update",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        text: {
          type: String,
          trim: true,
          maxlength: 500,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post =
  mongoose.models.Post ||
  mongoose.model("Post", postSchema);

export default Post;