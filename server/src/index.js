import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js"; 
import { categoryRouter } from "./routes/category.js"; // Import the router

const app = express();
const port = 3001;

// MongoDB connection URI
const mongoURI = "mongodb://127.0.0.1:27017/recipes";

// Connect to MongoDB
mongoose
  .connect(mongoURI, {})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure code
  });

// Middleware
app.use(cors());
app.use(express.json());

// Use the userRouter for routes starting with /auth

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
app.use("/category", categoryRouter);
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
