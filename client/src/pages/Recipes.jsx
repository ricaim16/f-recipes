import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaBookmark, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";

export const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        console.log("Fetched recipes:", response.data); // Log to check averageRating
        setRecipes(response.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes.");
      }
    };

    const fetchSavedRecipes = async () => {
      if (!userID) return;
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
        setError("Failed to fetch saved recipes.");
        setSavedRecipes([]);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    if (!userID) return;
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes || []);
    } catch (err) {
      console.error(
        "Error saving recipe:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to save recipe.");
    }
  };

  const isRecipeSaved = (id) =>
    Array.isArray(savedRecipes) && savedRecipes.includes(id);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    if (rating == null || isNaN(rating)) rating = 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [...Array(5)].map((_, index) => {
      if (index < fullStars)
        return <FaStar key={index} className="text-yellow-500 text-lg" />;
      if (index === fullStars && halfStar)
        return <FaStar key={index} className="text-yellow-500 text-lg" />;
      return <FaStar key={index} className="text-gray-300 text-lg" />;
    });
    return stars;
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Recipes</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <img
                    src={recipe.profileImage}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold">{recipe.name}</div>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-56 object-cover mb-4"
              />
              <p className="text-gray-700 text-base mb-4">
                {recipe.description}
              </p>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-700 text-base">
                  Cooking Time: {recipe.cookingTime} minutes
                </p>
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  className={`p-2 rounded ${
                    isRecipeSaved(recipe._id)
                      ? "text-yellow-500"
                      : "text-gray-500"
                  } transition`}
                >
                  <FaBookmark className="text-xl" />
                </button>
              </div>
              <div className="flex items-center mb-4">
                {renderStars(recipe.averageRating)}
                <span className="ml-2 text-gray-600 text-sm">
                  {recipe.averageRating != null
                    ? recipe.averageRating.toFixed(1)
                    : "0.0"}
                </span>
              </div>
              <div className="flex justify-center mb-4">
                <Link
                  to={`/recipes/${recipe._id}`}
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Review
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
