// Review schema and model
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users", // Ensure this matches the User model name
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Recipes", // Ensure this matches the Recipe model name
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("Reviews", ReviewSchema); // Use a singular name if consistent

export { ReviewModel };
