import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`
        );
        // Ensure the response data has the expected structure
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.log("Error fetching saved recipes:", err);
        // Handle error, maybe set an empty array or show an error message
        setSavedRecipes([]);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Component */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        {/* Add your navigation code here */}
      </nav>

      <div className="p-6 mx-auto">
        {savedRecipes.length === 0 ? (
          <p className="text-center text-lg text-gray-700">
            No saved recipes found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
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
                      {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))
                      ) : (
                        <li>No ingredients listed</li>
                      )}
                    </ul>
                    <h3 className="text-xl font-medium mb-3">Instructions</h3>
                    <p className="text-gray-700 text-base mb-5">
                      {recipe.instructions || "No instructions available"}
                    </p>
                    <div className="flex justify-between items-center mt-8 mb-4">
                      <p className="text-gray-700 text-base">
                        Cooking Time: {recipe.cookingTime || "Unknown"} minutes
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-10 space-x-2">
                      {/* Add additional buttons or functionality if needed */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
