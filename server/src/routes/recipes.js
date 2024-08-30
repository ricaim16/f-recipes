import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";
import { CategoryModel } from "../models/Category.js";

const router = express.Router();


// Get all recipes, sorted by creation date (newest first)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; // Get category from query parameters

    let query = {};
    if (category) {
      query = { categories: category };
    }

    const result = await RecipesModel.find(query).sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching recipes:", err);
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
    categories,
    userOwner,
  } = req.body;

  try {
    const newRecipe = new RecipesModel({
      name,
      description,
      ingredients,
      instructions,
      imageUrl,
      cookingTime,
      userOwner,
      categories,
    });

    await newRecipe.save();

    for (const category of categories) {
      const existingCategory = await CategoryModel.findOne({ name: category });
      if (!existingCategory) {
        const newCategory = new CategoryModel({ name: category });
        await newCategory.save();
      }
    }

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
    console.error("Error fetching recipe:", err);
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
    console.error("Error saving recipe:", err);
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
    console.error("Error fetching saved recipe IDs:", err);
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
      });
      res.status(200).json({ savedRecipes });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get recipes by category
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log("Category name:", categoryName); // Debugging
    const recipes = await RecipesModel.find({
      categories: { $in: [categoryName] },
    });
    console.log("Recipes found:", recipes); // Debugging
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes by category:", err);
    res.status(500).json({ error: err.message });
  }
});

export { router as recipesRouter };
