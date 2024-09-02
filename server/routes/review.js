import express from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../models/Reviews.js";
import { RecipesModel } from "../models/Recipes.js";

const router = express.Router();

// Add a review and update the average rating
router.post("/addreview", async (req, res) => {
  const { recipeId, comment, rating, userId } = req.body;

  if (!recipeId || !comment || !rating || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newReview = new ReviewModel({ recipeId, comment, rating, userId });
    await newReview.save();

    const reviews = await ReviewModel.find({ recipeId }).exec();
    const averageRating = reviews.length
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    await RecipesModel.findByIdAndUpdate(
      recipeId,
      { averageRating }, // Make sure this line is correctly setting the average rating
      { new: true }
    );

    const updatedRecipe = await RecipesModel.findById(recipeId).exec();
    res.status(201).json(updatedRecipe); // Return updated recipe to check the response
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch all reviews for a recipe
router.get("/getallreviews/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: "Invalid recipe id" });
  }

  try {
    const reviews = await ReviewModel.find({ recipeId })
      .populate("userId", "name profileImage")
      .exec();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
});

export { router as reviewRouter };
