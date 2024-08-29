import mongoose from "mongoose";

// Define the recipe schema
const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    cookingTime: {
      type: Number,
      required: true,
    },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "CategoryModel" },
  },
  { timestamps: true }
);

export const RecipesModel = mongoose.model("Recipes", recipeSchema);
