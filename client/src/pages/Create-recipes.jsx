import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const categories = [
  { id: "dinner", name: "Dinner" },
  { id: "lunch", name: "Lunch" },
  { id: "desserts", name: "Desserts" },
  { id: "breakfast", name: "Breakfast" },
  { id: "drink", name: "Drink" },
  { id: "snacks", name: "Snacks" },
  { id: "fasting", name: "Fasting" },
  { id: "vegetable", name: "Vegetable" },
  { id: "fruits", name: "Fruits" },
  { id: "dairy_egg", name: "Dairy & Egg" },
];

const CreateRecipes = () => {
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    setRecipe((prevRecipe) => {
      const ingredients = [...prevRecipe.ingredients];
      ingredients[index] = value;
      return { ...prevRecipe, ingredients };
    });
  };

  const handleAddIngredient = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, ""],
    }));
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setRecipe((prevRecipe) => {
      let updatedCategories = [...prevRecipe.categories];
      if (checked) {
        if (!updatedCategories.includes(value)) {
          updatedCategories.push(value);
        }
      } else {
        updatedCategories = updatedCategories.filter((cat) => cat !== value);
      }
      return { ...prevRecipe, categories: updatedCategories };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        "http://localhost:3001/recipes",
        { ...recipe },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      navigate("/recipes");
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={recipe.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700"
            >
              Ingredients
            </label>
            {recipe.ingredients.map((ingredient, index) => (
              <input
                key={index}
                type="text"
                name={`ingredient-${index}`}
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, index)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 mb-2"
                required
              />
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-black text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add Ingredient
            </button>
          </div>
          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-700"
            >
              Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={recipe.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="cookingTime"
              className="block text-sm font-medium text-gray-700"
            >
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={recipe.cookingTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={cat._id}
                    value={cat.name}
                    checked={recipe.categories.includes(cat.name)}
                    onChange={handleCategoryChange}
                    className="mr-2"
                  />
                  <label htmlFor={cat._id} className="text-sm text-gray-600">
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>





          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { CreateRecipes };
