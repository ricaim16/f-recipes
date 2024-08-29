import express from "express";
import mongoose from "mongoose";
import { CategoryModel } from "../models/Category.js"; // Ensure this path is correct

const router = express.Router();

// GET ALL CATEGORIES
router.get("/getcategories", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD CATEGORY
router.post("/addcategory", async (req, res) => {
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
