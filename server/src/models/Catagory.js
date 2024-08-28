import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["dinner", "lunch", "breakfast", "desserts", "more"], // Valid categories
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("Category", categorySchema);
