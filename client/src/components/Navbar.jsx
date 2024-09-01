


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { useGetUserID } from "../hooks/useGetUserID";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isMealsOpen, setIsMealsOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const token = cookies.access_token;
  const userID = useGetUserID();

  useEffect(() => {
    if (token) {
      const fetchCategories = async () => {
        try {
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
        }
      };

      fetchCategories();
    }
  }, [token]);

  useEffect(() => {
    if (token && userID) {
      const fetchData = async () => {
        try {
          const userResponse = await axios.get(
            `http://localhost:3001/auth/getuser/${userID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserProfile(userResponse.data);
          setProfilePicture(userResponse.data.profileImage || "");
        } catch (error) {
          console.error("Error fetching user profile:", error);
          if (error.response && error.response.status === 401) {
            setCookies("access_token", "", { path: "/" });
            navigate("/auth");
          }
        }
      };

      fetchData();
    }
  }, [token, userID, navigate, setCookies]);

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await axios.post(
          `http://localhost:3001/auth/upload/${userID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.profileImage) {
          setProfilePicture(response.data.profileImage);
        }
      } catch (error) {
        console.error(
          "Error uploading profile picture:",
          error.response?.data || error.message
        );
      }
    }
  };

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

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  return (
    <>
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
                              <>
                                {showAllCategories ? (
                                  <>
                                    {category.subcategories
                                      ?.slice(3)
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
                                    <button
                                      onClick={handleViewLessClick}
                                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                    >
                                      View Less
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={handleViewMoreClick}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                  >
                                    View All
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {!showAllCategories && categories.length > 4 && (
                      <button
                        onClick={handleViewMoreClick}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        View All
                      </button>
                    )}
                    {showAllCategories && (
                      <button
                        onClick={handleViewLessClick}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        View Less
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {token && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/saved-recipes"
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <span>Saved Recipes</span>
                </Link>
              </div>
            )}

            <Link
              to="/create-recipes"
              className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
            >
              <span>+Add Recipes</span>
            </Link>

            {!token ? (
              <Link
                to="/auth"
                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
              >
                Login/Register
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <FaUser />
                  <span>Profile</span>
                </button>

                <div
                  id="drawer-example"
                  className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
                    isDrawerOpen ? "translate-x-0" : "translate-x-full"
                  } bg-white w-80`}
                  tabIndex="-1"
                  aria-labelledby="drawer-label"
                >
                  <h5
                    id="drawer-label"
                    className="inline-flex items-center mb-4 text-base font-semibold text-gray-500"
                  >
                    Profile
                  </h5>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-controls="drawer-example"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close menu</span>
                  </button>

                  <div className="flex flex-col items-center p-6 border-b border-gray-200">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-2xl border-4 border-gray-300 overflow-hidden">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt="User Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{userProfile?.name[0].toUpperCase()}</span>
                        )}
                      </div>
                      <label
                        htmlFor="profile-upload"
                        className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-300 shadow-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <input
                          id="profile-upload"
                          type="file"
                          className="hidden"
                          onChange={handleProfilePictureUpload}
                        />
                      </label>
                    </div>
                    {userProfile ? (
                      <>
                        <p className="text-lg font-semibold mt-4">
                          {userProfile.name}
                        </p>
                        <p className="text-lg font-semibold">
                          {userProfile.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userProfile.bio}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600">Loading profile...</p>
                    )}

                    <Link
                      to="/create-recipes"
                      className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                    >
                      <span>+Add Recipes</span>
                    </Link>

                    <Link
                      to="/my-recipes"
                      className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
                    >
                      <span>My Recipes</span>
                    </Link>

                    <button
                      onClick={logout}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 mt-4"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};



