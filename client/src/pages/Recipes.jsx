import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { FaSearch } from "react-icons/fa"; // Import the search icon from react-icons

export const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null); // Added state for error handling
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log("Error fetching recipes:", err);
        setError("Failed to fetch recipes."); // Provide user feedback
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.log("Error fetching saved recipes:", err);
        setError("Failed to fetch saved recipes."); // Provide user feedback
        setSavedRecipes([]); // Ensure it's an array
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    console.log("Saving recipe with ID:", recipeID, "for user:", userID);
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
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

  const isRecipeSaved = (id) =>
    Array.isArray(savedRecipes) && savedRecipes.includes(id);

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Recipes</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Search Input with Icon */}
      <div className="mb-8 relative w-1/2 mx-auto">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-end mb-4">
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
              <h2 className="text-2xl font-semibold mb-2">{recipe.name}</h2>
              <p className="text-gray-700 text-base mb-4">
                {recipe.description}
              </p>

              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-56 object-cover mb-4"
              />
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-3">Ingredients</h3>
                <ul className="list-disc pl-6 text-gray-700 text-base mb-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h3 className="text-xl font-medium mb-3">Instructions</h3>
                <p className="text-gray-700 text-base mb-5">
                  {recipe.instructions}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-700 text-base">
                    Cooking Time: {recipe.cookingTime} minutes
                  </p>
                 
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
