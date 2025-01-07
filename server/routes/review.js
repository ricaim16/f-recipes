import express from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../models/Reviews.js";
import { RecipesModel } from "../models/Recipes.js";

const router = express.Router();

// Add a review and update the average rating
router.post("/addreview", async (req, res) => {
  const { recipeId, comment, rating, userId } = req.body;

  // Validate required fields
  if (!recipeId || !comment || !rating || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create and save the new review
    const newReview = new ReviewModel({ recipeId, comment, rating, userId });
    await newReview.save();

    // Calculate the average rating for the recipe
    const reviews = await ReviewModel.find({ recipeId }).exec();
    const averageRating = reviews.length
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    // Update the recipe's average rating
    await RecipesModel.findByIdAndUpdate(
      recipeId,
      { averageRating },
      { new: true }
    );

    // Return the new review in the response
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch all reviews for a recipe
router.get("/getallreviews/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  // Validate recipe ID
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: "Invalid recipe id" });
  }

  try {
    // Fetch reviews and populate user data
    const reviews = await ReviewModel.find({ recipeId })
      .populate("userId", "name profileImage") // Populate userId with name and profileImage
      .exec();

    console.log("Fetched Reviews:", reviews); // Log the fetched reviews for debugging
    res.status(200).json(reviews); // Return the reviews in the response
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
});

export { router as reviewRouter };
