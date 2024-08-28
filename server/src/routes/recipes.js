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
  } = req.body;

  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name,
    description,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        description: result.description,
        ingredients: result.ingredients,
        instructions: result.instructions,
        imageUrl: result.imageUrl,
        cookingTime: result.cookingTime,
        _id: result._id,
        createdAt: result.createdAt, // Include createdAt timestamp
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
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
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get ids of saved recipes
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

export { router as recipesRouter };
