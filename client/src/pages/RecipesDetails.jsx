import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import format from "date-fns/format";
import { useUserID } from "../hooks/useUserID";

const RecipeDetails = () => {
  const { id } = useParams();
  const { user } = useUserID();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 5 });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const backendUrl = "http://localhost:3001";

  useEffect(() => {
const fetchRecipe = async () => {
  try {
    const response = await axios.get(`${backendUrl}/recipes/${id}`);
    let ingredients = response.data.ingredients;

    // Check if ingredients is an array with a single string element
    if (
      Array.isArray(ingredients) &&
      ingredients.length === 1 &&
      typeof ingredients[0] === "string"
    ) {
      try {
        // Attempt to parse the string to an array
        ingredients = JSON.parse(ingredients[0]);
      } catch (parseError) {
        console.error("Failed to parse ingredients JSON:", parseError);
        ingredients = []; // Default to empty array if parsing fails
        setErrorMessage("Failed to parse ingredients data.");
      }
    }

    console.log(ingredients); // Check the type and contents
    setRecipe({ ...response.data, ingredients });
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    setErrorMessage("Failed to load recipe details.");
  }
};

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/reviews/getallreviews/${id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setErrorMessage("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
    fetchReviews();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.comment.trim()) {
      setErrorMessage("Please enter a comment.");
      return;
    }

    if (!user) {
      setErrorMessage("You need to be logged in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/reviews/addreview`, {
        recipeId: id,
        comment: newReview.comment,
        rating: newReview.rating,
        userId: user._id,
      });

      setReviews((prev) => [response.data, ...prev]);
      setNewReview({ comment: "", rating: 5 });
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to add review:", error);
      setErrorMessage("Failed to submit review. Please try again later.");
    }
  };

  const renderInstructions = () => {
    if (Array.isArray(recipe.instructions)) {
      return recipe.instructions.join(", ");
    } else if (typeof recipe.instructions === "string") {
      return recipe.instructions;
    } else {
      return "No instructions available.";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : format(date, "MMM d, yyyy h:mm a");
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-700">Loading recipe details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      {recipe ? (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            <img
              src={`http://localhost:3001/${recipe.imageUrl}`}
              alt={recipe.name}
              className="w-full h-56 object-cover mb-4"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">{recipe.name}</h2>
            <p className="text-gray-700 text-base mb-4">{recipe.description}</p>

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
              {renderInstructions()}
            </p>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700 text-base">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Reviews
            </h2>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 bg-gray-200 rounded-lg shadow-md flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={
                          review.userId?.profileImage
                            ? `${backendUrl}${review.userId.profileImage}`
                            : "/default-profile.png"
                        }
                        alt={review.userId?.name || "Anonymous"}
                        className="w-12 h-12 object-cover rounded-full border border-gray-300"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">
                          {review.userId?.name || "Anonymous"}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`text-xl ${
                                index < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <span className="text-xs text-gray-500 block mt-2">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              )}
            </div>

            {user ? (
              <form
                onSubmit={handleSubmitReview}
                className="mt-8 bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-4">
                  Add Your Moment and Rate the Recipe
                </h3>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  placeholder="Write your review..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  required
                ></textarea>
                <div className="flex items-center mb-4">
                  <label className="mr-4 text-gray-700 font-medium">
                    Rating:
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-2xl cursor-pointer ${
                          newReview.rating >= star
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(star)}
                      />
                    ))}
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-red-500 mb-4">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  className="py-2 px-4 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="text-gray-600">Please log in to add a review.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-700">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
