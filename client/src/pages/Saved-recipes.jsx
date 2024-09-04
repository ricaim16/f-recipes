import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
        setError("Error fetching saved recipes");
      }
    };

    if (userID) {
      fetchSavedRecipes();
    }
  }, [userID]);

  useEffect(() => {
    setFilteredRecipes(
      savedRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, savedRecipes]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
      <h1 className="text-4xl font-bold mb-8 text-center">Saved Recipes</h1>
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
        {filteredRecipes.map((recipe) => {
          const userOwnerData = recipe.userOwner || {};

          return (
            <div
              key={recipe._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    {userOwnerData.profileImage ? (
                      <img
                        src={`http://localhost:3001/profilePicture/${userOwnerData.profileImage}`}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-semibold">
                    {userOwnerData.name || "Unknown User"}
                  </div>
                </div>
                <img
                  src={`http://localhost:3001/${recipe.imageUrl}`}
                  alt={recipe.name}
                  className="w-full h-56 object-cover mb-4"
                />

                <p className="text-gray-700 text-base mb-4">{recipe.name}</p>
                <p className="text-gray-700 text-left text-base my-2">
                  Cooking Time: {recipe.cookingTime} minutes
                </p>
                

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
          );
        })}
      </div>
    </div>
  );
};
