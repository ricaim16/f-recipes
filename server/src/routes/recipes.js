import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// Get all recipes, sorted by creation date (newest first)
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    description,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner,
    category,
  } = req.body;

  try {
    if (!name || !description || !ingredients || !instructions || !userOwner) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const recipe = new RecipesModel({
      _id: new mongoose.Types.ObjectId(),
      name,
      description,
      ingredients,
      instructions,
      imageUrl,
      cookingTime,
      userOwner,
      category,
    });

    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: result,
    });
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId).populate(
      "category"
    );
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const { recipeID, userID } = req.body;

  try {
    const recipe = await RecipesModel.findById(recipeID);
    const user = await UserModel.findById(userID);

    if (!recipe || !user) {
      return res.status(404).json({ message: "User or recipe not found" });
    }

    user.savedRecipes.push(recipeID);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ids of saved recipes
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    if (user) {
      res.status(200).json({ savedRecipes: user.savedRecipes });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get saved recipes
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    if (user) {
      const savedRecipes = await RecipesModel.find({
        _id: { $in: user.savedRecipes },
      }).populate("category");
      res.status(200).json({ savedRecipes });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as recipesRouter };
