import express from "express";
import { CategoryModel } from "../models/Category.js"; // Ensure this path is correct
import { verifyToken } from "./users.js"; // Adjust path as necessary

const router = express.Router();

// GET ALL CATEGORIES
router.get("/getcategories", verifyToken, async (req, res) => {
  console.log("Received request for /getcategories");
  try {
    const categories = await CategoryModel.find();
    console.log("Categories fetched:", categories);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
});



// ADD CATEGORY
router.post("/addcategory", verifyToken, async (req, res) => {
  const { name } = req.body;

  // Check for existing category
  const existingCategory = await CategoryModel.findOne({ name });
  if (existingCategory) {
    return res
      .status(400)
      .json({ message: `Category with name "${name}" already exists` });
  }

  try {
    const newCategory = new CategoryModel({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as categoryRouter };
