import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true } // This ensures createdAt and updatedAt are added
);
export const ReviewModel = mongoose.model("Review", reviewSchema);
