import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true,
  },
});

module.exports = mongoose.model("category", CategorySchema);

const CategoryModel = mongoose.model("category", CategorySchema);

export { CategoryModel };
