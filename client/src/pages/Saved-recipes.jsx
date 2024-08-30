import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();
  const token = localStorage.getItem("access_token"); // Ensure this token is correct and available

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`,

          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure the token is correct
            },
          }
        );

        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.log("Error fetching saved recipes:", err);
      }
    };

    fetchSavedRecipes();
  }, [token]);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Saved Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {savedRecipes.length === 0 ? (
          <p className="text-center text-lg text-gray-700">
            No saved recipes found.
          </p>
        ) : (
          savedRecipes.map((recipe) => (
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
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                  <h3 className="text-xl font-medium mb-3">Instructions</h3>
                  <p className="text-gray-700 text-base mb-5">
                    {recipe.instructions}
                  </p>
                  <div className="flex justify-between items-center mt-8 mb-4">
                    <p className="text-gray-700 text-base">
                      Cooking Time: {recipe.cookingTime} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
