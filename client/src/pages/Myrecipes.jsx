import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID"; // Assuming this is a custom hook you have
import { FaSearch } from "react-icons/fa"; // If you're using this in your component
import { Link } from "react-router-dom"; // If you're using Link in your component

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3001";
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const token = cookies.access_token;

  useEffect(() => {
    const fetchRecipes = async () => {
      if (userID && token) {
        const url = `${backendUrl}/recipes/user/${userID}`;
        console.log("Requesting URL:", url);

        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response data:", response.data);
          setRecipes(response.data.userRecipes || []);
        } catch (error) {
          setError("Error fetching recipes. Please try again later.");
          console.error("Error fetching recipes:", error.message);
        }
      } else {
        setError("User not authenticated.");
      }
    };

    fetchRecipes();
  }, [userID, token, backendUrl]);

  const handleDelete = async (recipeID) => {
    try {
      await axios.delete(`${backendUrl}/recipes/delete/${recipeID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipes(recipes.filter(recipe => recipe._id !== recipeID));
    } catch (error) {
      setError("Error deleting recipe. Please try again later.");
      console.error("Error deleting recipe:", error.message);
    }
  };

  const handleEdit = (recipeID) => {
    navigate(`/edit-recipe/${recipeID}`);
  };

  // Filter recipes based on searchQuery
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating || 0);
    return (
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < filledStars ? "text-yellow-500" : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderInstructions = (instructions) => {
    if (!instructions) {
      return "No instructions available.";
    }
    return instructions;
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">My Recipes</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search recipes..."
          className="p-2 border border-gray-300 rounded"
        />
        <FaSearch className="ml-2 text-gray-500" />
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
                        src={`${backendUrl}/profilePicture/${userOwnerData.profileImage}`}
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
                  src={`${backendUrl}/${recipe.imageUrl}`}
                  alt={recipe.name}
                  className="w-full h-56 object-cover mb-4"
                />
                <p className="text-gray-700 text-base mb-4">{recipe.name}</p>
                <p className="text-gray-700 text-left text-base my-2">
                  Cooking Time: {recipe.cookingTime} minutes
                </p>

                <p className="text-gray-700 text-base mb-4">
                  {recipe.description}
                </p>

                <h3 className="text-xl font-medium mb-3">Ingredients</h3>
                <ul className="list-disc pl-6 text-gray-700 text-base mb-4 list-inside">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="mb-1.5">
                        {ingredient}
                      </li>
                    ))
                  ) : (
                    <p>No ingredients available.</p>
                  )}
                </ul>

                <h3 className="text-xl font-medium mb-3">Instructions</h3>
                <p className="text-gray-700 text-base mb-5">
                  {renderInstructions(recipe.instructions)}
                </p>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(recipe._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRecipes;
