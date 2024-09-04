import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipeOwner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LikeModel = mongoose.model("Like", likeSchema);
