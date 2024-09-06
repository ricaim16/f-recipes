import mongoose from "mongoose";

const recipeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    categories: [{ type: String }],
    review: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }],
    averageRating: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    }], // List of users who liked the recipe
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Users",
    //   required: true,
    // },
  },
  { timestamps: true }
);

export const RecipesModel = mongoose.model("Recipes", recipeSchema);
