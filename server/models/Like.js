import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    recipeOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipes" },
  },
  {
    timestamps: true,
  }
);

export const LikeModel = mongoose.model("Like", likeSchema);
