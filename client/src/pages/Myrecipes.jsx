import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { FaSearch, FaEllipsisV } from "react-icons/fa";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewRecipeId, setViewRecipeId] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of recipes per page
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3001";
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const token = cookies.access_token;

  useEffect(() => {
    const fetchRecipes = async () => {
      if (userID && token) {
        const url = `${backendUrl}/recipes/user/${userID}`;
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecipes(response.data.userRecipes || []);
        } catch (error) {
          setError("Error fetching recipes. Please try again later.");
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
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeID));
    } catch (error) {
      setError("Error deleting recipe. Please try again later.");
    }
  };

  const handleEdit = (recipeID) => {
    navigate(`/edit-recipe/${recipeID}`);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewRecipe = (recipeId) => {
    setViewRecipeId(viewRecipeId === recipeId ? null : recipeId);
  };

  const toggleOptions = (recipeId) => {
    setShowOptions(showOptions === recipeId ? null : recipeId);
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
    return instructions || "No instructions available.";
  };

  // Pagination Logic
  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">
        My Recipes
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-4 flex justify-center">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search recipes..."
            className="p-2 border border-orange-500 rounded w-64 pl-10 bg-orange-100 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-600"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {currentRecipes.map((recipe) => {
          const userOwnerData = recipe.userOwner || {};
          const isViewing = viewRecipeId === recipe._id;

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
                  <div className="ml-auto relative">
                    <FaEllipsisV
                      className="cursor-pointer text-orange-500"
                      onClick={() => toggleOptions(recipe._id)}
                    />
                    {showOptions === recipe._id && (
                      <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(recipe._id)}
                          className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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

                {isViewing ? (
                  <>
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
                    <button
                      onClick={() => handleViewRecipe(recipe._id)}
                      className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 mb-2"
                    >
                      Hide
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleViewRecipe(recipe._id)}
                    className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 mb-2"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          );
        })}
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


export default MyRecipes;