import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaBookmark, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export const Recipes = () => {
	const [recipes, setRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [likedRecipes, setLikedRecipe] = useState([]);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const backendUrl = "http://localhost:3001";
	const userID = useGetUserID();
	const navigate = useNavigate();

	const formatCategoryName = (category) => {
		return category.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_");
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const recipesResponse = await axios.get(`${backendUrl}/recipes`);
				setRecipes(recipesResponse.data);

				if (userID) {
					const savedResponse = await axios.get(
						`${backendUrl}/recipes/savedRecipes/ids/${userID}`
					);
					setSavedRecipes(savedResponse.data.savedRecipes || []);
				}
				if (userID) {
					const likedResponse = await axios.get(
						`${backendUrl}/recipes/liked/ids/${userID}`
          );
          
					setLikedRecipe(likedResponse.data.likedRecipes || []);
				}
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Failed to fetch data.");
			}
		};

		fetchData();
	}, [likedRecipes]);

	const toggleRecipe = async (recipeID) => {
		if (!userID) return;
		try {
			const isSaved = savedRecipes.includes(recipeID);
			const url = `${backendUrl}/recipes/${isSaved ? "remove" : "save"}`;
			const response = await axios.put(url, { recipeID, userID });
			setSavedRecipes(response.data.savedRecipes || []);
		} catch (err) {
			console.error(
				"Error toggling recipe:",
				err.response ? err.response.data : err.message
			);
			setError("Failed to toggle recipe.");
		}
	};
	const save = async (recipeID) => {
		if (!userID) return;
		try {
      // const isSaved = savedRecipes.includes(recipeID);
      // console.log(isSaved);
      
			// const url = `${backendUrl}/recipes/${isSaved ? "unlike" : "like"}`;
			const url = `${backendUrl}/recipes/toggleLike`;
			const response = await axios.put(url, { recipeID, userID });
			setLikedRecipe(response.data.likedRecipe || []);
		} catch (err) {
			console.error(
				"Error toggling recipe:",
				err.response ? err.response.data : err.message
			);
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

	const renderStars = (rating) => {
		if (rating == null || isNaN(rating)) rating = 0;
		const fullStars = Math.floor(rating);
		const halfStar = rating % 1 >= 0.5;
		return [...Array(5)].map((_, index) => {
			if (index < fullStars)
				return <FaStar key={index} className="text-yellow-500 text-lg" />;
			if (index === fullStars && halfStar)
				return <FaStar key={index} className="text-yellow-500 text-lg" />;
			return <FaStar key={index} className="text-gray-300 text-lg" />;
		});
	};

	return (
		<div className="p-6 mx-auto">
			<h1 className="text-4xl font-bold mb-8 text-center">Recipes</h1>
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

			{/* Categories section */}
			<section className="mb-12">
				<div className="flex overflow-x-auto space-x-4 mx-8 px-4 justify-center">
					{[
						"Dinner",
						"Lunch",
						"Desserts",
						"Breakfast",
						"Drink",
						"Snacks",
						"Fasting",
						"Vegetable",
					].map((category) => (
						<div
							key={category}
							className="flex-shrink-0 flex flex-col items-center cursor-pointer p-2 mx-2"
							onClick={() => navigate(`/recipes/category/${category}`)}
						>
							<img
								src={`/images/${formatCategoryName(category)}.jpg`}
								alt={category}
								className="w-24 h-24 object-cover rounded-full mb-2"
							/>
							<p className="text-xs font-semibold text-center">{category}</p>
						</div>
					))}
				</div>
			</section>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
				{filteredRecipes.map((recipe) => {
					const userOwner = recipe.userOwner || {};
					return (
						<div
							key={recipe._id}
							className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
						>
							<div className="flex-1 p-6 flex flex-col">
								<div className="flex items-center mb-4">
									<div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
										{userOwner.profileImage ? (
											<img
												src={`http://localhost:3001/profilePicture/${userOwner.profileImage}`}
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
										{userOwner.name || "Unknown User"}
									</div>
								</div>
								<img
									src={`http://localhost:3001/${recipe.imageUrl}`}
									alt={recipe.name}
									className="w-full h-56 object-cover mb-4"
								/>
								<p className="text-gray-700 text-base mb-4">{recipe.name}</p>
								<div className="flex items-center justify-between mb-2">
									<p className="text-gray-700 text-base">
										Cooking Time: {recipe.cookingTime} minutes
									</p>
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
								</div>
								<div className="flex items-center mb-4">
									{renderStars(recipe.averageRating)}
									<span className="ml-2 text-gray-600 text-sm">
										{recipe.averageRating != null
											? recipe.averageRating.toFixed(1)
											: "0.0"}
									</span>
								</div>

								<div className="flex justify-center mb-4">
									<button
										onClick={() => save(recipe._id)}
										className={`text-2xl ${
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
									<span className="ml-2 text-gray-600 text-sm">
										{recipe.likesCount}
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
