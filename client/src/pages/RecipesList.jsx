import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import { useGetUserID } from "../hooks/useGetUserID";

const RecipesList = () => {
  const { categoryName } = useParams(); // Get category from URL params
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userID = useGetUserID(); // Retrieve userID from hook

  // Fetch recipes by category
  useEffect(() => {
    const fetchRecipesByCategory = async () => {
      try {
        console.log("Fetching recipes for category:", categoryName);
        const response = await axios.get(
          `http://localhost:3001/recipes/category/${categoryName}`
        );
        console.log("Response data:", response.data);
        setRecipes(response.data); // Update state with recipes array
      } catch (error) {
        console.error("Error fetching recipes by category:", error);
        setError("Failed to fetch recipes.");
      }
    };

    if (categoryName) {
      fetchRecipesByCategory();
    }
  }, [categoryName]);

  // Fetch saved recipes when userID changes
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!userID) return; // Exit if no userID

      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.log("Error fetching saved recipes:", err);
        setError("Failed to fetch saved recipes.");
        setSavedRecipes([]); // Ensure it's an array
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  // Save recipe
  const saveRecipe = async (recipeID) => {
    console.log("Saving recipe with ID:", recipeID, "for user:", userID);
    try {
       const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      
        
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Ensure this token is set
          },
        }
      );
      console.log("Save response:", response.data);
      setSavedRecipes(response.data.savedRecipes || []);
    } catch (err) {
      console.log(
        "Error saving recipe:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to save recipe."); // Provide user feedback
    }
  };

  // Check if recipe is saved
  const isRecipeSaved = (id) =>
    Array.isArray(savedRecipes) && savedRecipes.includes(id);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        {categoryName} Recipes
      </h2>

      {/* Search input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg" // Adjusted width and border-radius
        />
      </div>

      {error && <p className="text-center text-lg text-red-600">{error}</p>}

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col"
            >
              <div className="relative">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  disabled={isRecipeSaved(recipe._id)}
                  className={`px-4 py-2 rounded text-white ${
                    isRecipeSaved(recipe._id)
                      ? "bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition`}
                >
                  {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                </button>
              </div>
              <div className="p-4 flex-1">
                <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
                <p className="text-gray-700 mb-4">{recipe.description}</p>
                <h4 className="text-lg font-medium mb-2">Ingredients</h4>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))
                  ) : (
                    <li>No ingredients listed</li>
                  )}
                </ul>
                <h4 className="text-lg font-medium mb-2">Instructions</h4>
                <p className="text-gray-600 mb-4">
                  {recipe.instructions || "No instructions available"}
                </p>
                <p className="text-gray-600 mb-4">
                  Cooking Time: {recipe.cookingTime || "Unknown"} minutes
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">
          No recipes found for this category.
        </p>
      )}
    </div>
  );
};

export default RecipesList;
