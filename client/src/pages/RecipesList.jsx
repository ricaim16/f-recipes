import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaBookmark, FaStar, FaSearch } from "react-icons/fa";
import { useGetUserID } from "../hooks/useGetUserID";

const RecipesList = () => {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipesByCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/category/${categoryName}`
        );
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes by category:", error);
        setError("Failed to fetch recipes.");
      }
    };

    if (categoryName) {
      fetchRecipesByCategory();
    }
  }, [categoryName]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!userID) return;

      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.log("Error fetching saved recipes:", err);
        setError("Failed to fetch saved recipes.");
        setSavedRecipes([]);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes",
        { recipeID, userID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setSavedRecipes(response.data.savedRecipes || []);
    } catch (err) {
      console.log(
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
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-lg ${
          index < fullStars ? "text-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        {categoryName} Recipes
      </h2>

      <div className="relative mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
      </div>

      {error && <p className="text-center text-lg text-red-600">{error}</p>}

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col"
            >
              <div className="p-4 flex items-center border-b border-gray-200">
                <img
                  src={recipe.profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                />
                <h3 className="text-xl font-semibold ml-4">{recipe.name}</h3>
              </div>
              <div className="relative flex flex-col flex-1">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-[calc(100%-2rem)] mx-auto h-64 object-cover rounded-t-lg"
                />
                <div className="p-4 flex-1">
                  <p className="text-gray-700 text-base mb-4">
                    {recipe.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-700 text-base">
                      Cooking Time: {recipe.cookingTime} minutes
                    </p>
                    <div className="flex items-center">
                      {renderStars(recipe.averageRating)}
                      <span className="ml-2 text-gray-600 text-sm">
                        {recipe.averageRating != null
                          ? recipe.averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
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
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  className={`absolute bottom-4 right-4 p-2 rounded-full ${
                    isRecipeSaved(recipe._id)
                      ? "text-yellow-500"
                      : "text-gray-500"
                  } transition`}
                >
                  <FaBookmark className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600 mt-8">
          No recipes found for this category.
        </p>
      )}
    </div>
  );
};

export default RecipesList;
