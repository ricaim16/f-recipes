import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const categoriesList = [
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

const EditRecipe = () => {
  const { recipeID } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);
  const token = cookies.access_token;

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    cookingTime: "",
    userOwner: "",
    createdBy: "",
    categories: [],
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/${recipeID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecipe(response.data);
      } catch (error) {
        setError("Error fetching recipe.");
      }
    };

    fetchRecipe();
  }, [recipeID, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (e, index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = e.target.value;
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleAddIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRecipe((prev) => ({ ...prev, image: file }));

    // Create a preview URL for the selected image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null); // Clear preview if no file is selected
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setRecipe((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3001/recipes/edit/${recipeID}`,
        recipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    navigate("/my-recipes"); 
    } catch (error) {
      setError("Error updating recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Edit Recipe</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
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
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
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
            {categoriesList.map((cat) => (
              <div key={cat.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={cat.id}
                  value={cat.name}
                  checked={recipe.categories.includes(cat.name)}
                  onChange={handleCategoryChange}
                  className="mr-2"
                />
                <label htmlFor={cat.id} className="text-sm text-gray-600">
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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
