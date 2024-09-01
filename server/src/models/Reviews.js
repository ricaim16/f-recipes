import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const ReviewModel = mongoose.model("Review", reviewSchema);
