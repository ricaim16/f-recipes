import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js"; // Ensure this path and model name are correct
import { ReviewModel } from "../models/Reviews.js"; // Ensure this path and model name are correct

const router = express.Router();

router.get("/getallreviews/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received ID:", id); // Log ID for debugging

  if (!id) return res.status(400).json({ message: "Recipe id is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid recipe id" });

  try {
    const reviews = await ReviewModel.find({ recipeId: id })
      .populate("userId", "name email profileImage") // Ensure this matches your Review schema field
      .exec();
    console.log("Found Reviews:", reviews); // Log reviews for debugging
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
});


// Add review
router.post("/addreview", async (req, res) => {
  const { recipeId, comment, rating, userId } = req.body;

  if (!recipeId || !comment || !rating || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingReview = await ReviewModel.findOne({ recipeId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this recipe" });
    }

    // Create and save the new review
    const newReview = new ReviewModel({ recipeId, comment, rating, userId });
    await newReview.save();

    // Update the recipe document to include the new review ID
    await RecipesModel.findByIdAndUpdate(
      recipeId,
      { $push: { reviews: newReview._id } }, // Ensure this field matches your Recipe schema
      { new: true }
    );

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
});

export { router as reviewRouter };
