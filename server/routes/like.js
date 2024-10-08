import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { LikeModel } from "../models/Like.js";

const router = express.Router();

router.post("/addlike", async (req, res) => {
  const { likedBy, recipeOwner, recipeId } = req.body;

  if (!likedBy || !recipeOwner || !recipeId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(likedBy) ||
    !mongoose.Types.ObjectId.isValid(recipeId) ||
    !mongoose.Types.ObjectId.isValid(recipeOwner)
  ) {
    return res.status(400).json({ message: "Invalid ID(s)" });
  }

  try {
    const alreadyLiked = await LikeModel.findOne({ likedBy, recipeId });

    if (alreadyLiked) {
      await LikeModel.deleteOne({ _id: alreadyLiked._id });
      await RecipesModel.findByIdAndUpdate(
        recipeId,
        { $inc: { likesCount: -1 } },
        { new: true }
      );
      res.status(200).json({ message: "Like removed" });
    } else {
      const newLike = new LikeModel({ likedBy, recipeOwner, recipeId });
      await newLike.save();
      await RecipesModel.findByIdAndUpdate(
        recipeId,
        { $inc: { likesCount: 1 } },
        { new: true }
      );
      res.status(201).json({ message: "Like added" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding/removing like", error: error.message });
  }
});


// Get like count for a recipe
router.get("/countLikes/:recipeId", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ totalLikes: recipe.likesCount });
  } catch (err) {
    console.error("Error fetching like count:", err);
    res.status(500).json({ error: err.message });
  }
});



// Get users who liked a specific recipe
router.get("/getlikes/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    // Find likes for the given recipeId and populate likedBy
    const likers = await LikeModel.find({ recipeId })
      .populate("likedBy", "name") // Populate the likedBy field with user data
      .exec();

    // Debugging: Log the result of the query
    console.log("Likers with populated data:", likers);

    // Map the results to include only necessary details
    const likersDetails = likers.map((like) => ({
      likedBy: like.likedBy ? like.likedBy.name : "Unknown",
    }));

    res.status(200).json({ likers: likersDetails });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching likers", error: error.message });
  }
});




// Get liked recipes by a specific user
router.get("/likedrecipes/:userID", async (req, res) => {
  const { userID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const likes = await LikeModel.find({ likedBy: userID }).populate(
      "recipeId",
      "title"
    );
    const likedRecipes = likes.map((like) => ({
      recipeId: like.recipeId._id,
      title: like.recipeId.title,
    }));
    res.status(200).json(likedRecipes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching liked recipes", error: error.message });
  }
});

export { router as likeRouter };
