import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";
import { CategoryModel } from "../models/Category.js";
import multer from "multer";
import path from "path";
const router = express.Router();

// Get all recipes, sorted by creation date (newest first)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; // Get category from query parameters

    const query = category ? { categories: category } : {};
    const result = await RecipesModel.find(query).populate('userOwner').sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'recipePic/');
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



router.post("/", upload.single("image"), verifyToken, async (req, res) => {
  const {
    name,
    description,
    ingredients,
    instructions,
    cookingTime,
    userOwner,
    categories,
  } = req.body;

  const imageUrl = req.file ? req.file.path : null;

  // Log the received file information
  console.log("Uploaded file info:", req.file);

  if (!imageUrl) {
    return res
      .status(400)
      .json({ message: "Image upload failed. Image is required." });
  }

  try {
    const newRecipe = new RecipesModel({
      name,
      description,
      ingredients,
      instructions,
      imageUrl,
      cookingTime,
      userOwner,
      categories: JSON.parse(categories), // Ensure this is correctly parsed
    });

    await newRecipe.save();

    for (const category of JSON.parse(categories)) {
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
      "categories"
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

  if (
    !mongoose.Types.ObjectId.isValid(recipeID) ||
    !mongoose.Types.ObjectId.isValid(userID)
  ) {
    return res.status(400).json({ message: "Invalid recipe ID or user ID" });
  }

  try {
    const recipe = await RecipesModel.findById(recipeID);
    const user = await UserModel.findById(userID);

    if (!recipe || !user) {
      return res.status(404).json({ message: "User or recipe not found" });
    }

    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID);
      await user.save();
    }

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

// Get recipes by category
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const recipes = await RecipesModel.find({
      categories: { $in: [categoryName] },
    });
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes by category:", err);
    res.status(500).json({ error: err.message });
  }
});

export { router as recipesRouter };
