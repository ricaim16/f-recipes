import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaBookmark, FaStar, FaSearch } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useGetUserID } from "../hooks/useGetUserID";

const RecipesList = () => {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userID = useGetUserID();
  const backendUrl = "http://localhost:3001"; // Define your backend URL

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipes by category
        const recipesResponse = await axios.get(
          `${backendUrl}/recipes/category/${categoryName}`
        );
        setRecipes(recipesResponse.data);

        if (userID) {
          const savedResponse = await axios.get(
            `${backendUrl}/recipes/savedRecipes/ids/${userID}`
          );
          setSavedRecipes(savedResponse.data.savedRecipes || []);

          const likedResponse = await axios.get(
            `${backendUrl}/recipes/liked/ids/${userID}`
          );
          setLikedRecipes(likedResponse.data.likedRecipes || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, [userID, categoryName]);

  const toggleRecipe = async (recipeID) => {
    if (!userID) return;

    try {
      const isSaved = savedRecipes.includes(recipeID);
      const url = `${backendUrl}/recipes/${isSaved ? "remove" : "save"}`;
      const response = await axios.put(url, { recipeID, userID });
      setSavedRecipes(response.data.savedRecipes || []);
    } catch (err) {
      console.error("Error toggling recipe:", err);
      setError("Failed to toggle recipe.");
    }
  };

  const save = async (recipeID) => {
    if (!userID) return;

    try {
      const url = `${backendUrl}/recipes/toggleLike`;
      const response = await axios.put(url, { recipeID, userID });
      setLikedRecipes(response.data.likedRecipes || []);
    } catch (err) {
      console.error("Error toggling recipe:", err);
      setError("Failed to toggle recipe.");
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);
  const isRecipeLiked = (id) => likedRecipes.includes(id);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        {categoryName} Recipes
      </h2>

      <div className="mb-8 relative w-1/2 mx-auto">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 border border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-100 text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {currentRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
          >
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  {recipe.userOwner?.profileImage ? (
                    <img
                      src={`http://localhost:3001/profilePicture/${recipe.userOwner.profileImage}`}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white">
                      No Image
                    </div>
                  )}
                </div>
                <div className="text-[#C65D3D] text-lg font-semibold">
                  {recipe.userOwner?.name || "Unknown User"}
                </div>
              </div>
              <img
                src={`http://localhost:3001/${recipe.imageUrl}`}
                alt={recipe.name}
                className="w-full h-56 object-cover mb-4"
              />
              <p className="text-gray-700 text-base mb-4">{recipe.name}</p>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    className={`text-lg ${
                      index < recipe.averageRating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600 text-sm">
                  {recipe.averageRating
                    ? recipe.averageRating.toFixed(1)
                    : "0.0"}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700 text-base">
                  Cooking Time: {recipe.cookingTime} minutes
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleRecipe(recipe._id)}
                    className={`p-2 rounded ${
                      isRecipeSaved(recipe._id)
                        ? "text-yellow-500"
                        : "text-gray-500"
                    } transition`}
                  >
                    <FaBookmark className="text-xl" />
                  </button>
                  <button
                    onClick={() => save(recipe._id)}
                    className={`text-2xl ml-4 ${
                      isRecipeLiked(recipe._id)
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {isRecipeLiked(recipe._id) ? (
                      <AiFillHeart />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </button>
                  <span className="text-gray-600 text-sm ml-2">
                    {recipe.likesCount}
                  </span>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <Link
                  to={`/recipes/${recipe._id}`}
                  style={{ color: "#C65D3D" }}
                  className="hover:text-orange-700 underline"
                >
                  Review
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="mx-2 px-4 py-2 bg-orange-500 text-white rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="mx-2 px-4 py-2 bg-orange-500 text-white rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecipesList;
