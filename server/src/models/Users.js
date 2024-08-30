import mongoose from "mongoose";

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" }, // URL or path to the profile image
  bio: { type: String, default: "" }, // Default empty bio
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Ensure "Recipe" matches the model name
});

// Create a User model from the schema
const UserModel = mongoose.model("User", UserSchema); // "User" should match the model name

export { UserModel };
