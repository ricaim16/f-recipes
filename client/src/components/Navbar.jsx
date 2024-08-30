import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { FaChevronDown, FaBookmark } from "react-icons/fa";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isMealsOpen, setIsMealsOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = cookies.access_token;
        if (!token) {
          console.warn("No token provided. Redirecting to login...");
          navigate("/auth"); // Redirect to login if token is not available
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/category/getcategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Optionally, handle token expiration or invalid token
        if (error.response && error.response.status === 401) {
          navigate("/auth"); // Redirect to login if unauthorized
        }
      }
    };

    fetchCategories();
  }, [cookies.access_token, navigate]);

  const logout = () => {
    setCookies("access_token", "", { path: "/" });
    window.localStorage.clear();
    navigate("/auth");
  };

  const toggleDropdown = (setter) => () => setter((prev) => !prev);

  const handleMealHover = (mealType) => {
    setActiveMeal(mealType);
  };

  const handleMealCategoryClick = (category) => {
    navigate(`/recipes/category/${category}`);
  };

  const handleViewMoreClick = () => {
    setShowAllCategories(true);
  };

  const handleViewLessClick = () => {
    setShowAllCategories(false);
  };

  const handleCategoryMouseEnter = (category) => {
    setActiveCategory(category);
  };

  const handleCategoryMouseLeave = () => {
    setActiveCategory(null);
  };

  // Display a limited number of categories and show all if needed
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  return (
    <div>
      <div className="bg-black text-white w-screen absolute top-0 left-0 right-0 z-10">
        <div className="text-center py-2 text-sm">Food Recipes.......</div>
      </div>

      <div className="bg-white text-black shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/path-to-your-logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          <button
            onClick={toggleDropdown(setIsMenuOpen)}
            className="lg:hidden px-4 py-2 rounded hover:bg-gray-200"
          >
            <FaChevronDown
              className={`transform ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`lg:flex lg:items-center lg:space-x-4 ${
              isMenuOpen ? "block" : "hidden"
            } lg:block`}
          >
            <div className="flex-grow flex items-center justify-center space-x-4">
              <Link to="/" className="hover:text-gray-600">
                Home
              </Link>

              <div className="relative">
                <button
                  onClick={toggleDropdown(setIsRecipesOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <span>Recipes</span>
                  <FaChevronDown />
                </button>
                {isRecipesOpen && (
                  <div className="absolute mt-2 left-0 bg-white text-black rounded shadow-lg w-48">
                    <Link
                      to="/recipes"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      All Recipes
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={toggleDropdown(setIsMealsOpen)}
                  onMouseEnter={() => handleMealHover("meals")}
                  onMouseLeave={() => handleMealHover(null)}
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <span>Meals</span>
                  <FaChevronDown />
                </button>
                {(isMealsOpen || activeMeal) && (
                  <div className="absolute mt-2 left-0 bg-white text-black rounded shadow-lg w-64">
                    {visibleCategories.map((category) => (
                      <div
                        key={category._id}
                        className="relative"
                        onMouseEnter={() =>
                          handleCategoryMouseEnter(category.name)
                        }
                        onMouseLeave={handleCategoryMouseLeave}
                      >
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleMealCategoryClick(category.name)}
                        >
                          {category.name}
                        </div>
                        {activeCategory === category.name && (
                          <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-64">
                            {category.subcategories
                              ?.slice(0, 3)
                              .map((subcat) => (
                                <div
                                  key={subcat._id}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    handleMealCategoryClick(subcat.name)
                                  }
                                >
                                  {subcat.name}
                                </div>
                              ))}
                            {category.subcategories?.length > 3 && (
                              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center">
                                <Link
                                  to={`/recipes/category/${category.name}`}
                                  className="block"
                                >
                                  View All
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {categories.length > 4 && (
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center">
                        {showAllCategories ? (
                          <button
                            onClick={handleViewLessClick}
                            className="w-full"
                          >
                            View Less
                          </button>
                        ) : (
                          <button
                            onClick={handleViewMoreClick}
                            className="w-full"
                          >
                            View More
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex items-center space-x-4">
                <Link
                  to="/saved-recipes"
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <FaBookmark />
                  <span>Saved Recipes</span>
                </Link>
                <Link
                  to="/create-recipes"
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <span>+Add recipes</span>
                </Link>

                {!cookies.access_token ? (
                  <Link
                    to="/auth"
                    className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                  >
                    Login/Register
                  </Link>
                ) : (
                  <button
                    onClick={logout}
                    className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
