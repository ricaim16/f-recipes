// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import { FaChevronDown, FaBookmark } from "react-icons/fa";

// export const Navbar = () => {
//   const [cookies, setCookies] = useCookies(["access_token"]);
//   const [isRecipesOpen, setIsRecipesOpen] = useState(false);
//   const [isMealsOpen, setIsMealsOpen] = useState(false);
//   const [activeMeal, setActiveMeal] = useState(null);
//   const [activeMealCategory, setActiveMealCategory] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3001/category/getcategories"
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);



  
//   const logout = () => {
//     setCookies("access_token", "", { path: "/" });
//     window.localStorage.clear();
//     navigate("/auth");
//   };

//   const toggleDropdown = (setter) => () => setter((prev) => !prev);

//   const handleMealHover = (mealType) => {
//     setActiveMeal(mealType);
//   };

//   const handleMealCategoryClick = (category) => {
//     setActiveMealCategory(category);
//   };

//   return (
//     <div>
//       {/* Full-width promotion section */}
//       <div className="bg-black text-white w-screen absolute top-0 left-0 right-0 z-10">
//         <div className="text-center py-2 text-sm">Food Recipes.......</div>
//       </div>

//       {/* Navigation Bar */}
//       <div className="bg-white text-black shadow-md sticky top-0 z-50 border-b border-gray-200">
//         <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/">
//               <img src="/path-to-your-logo.png" alt="Logo" className="h-8" />
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={toggleDropdown(setIsMenuOpen)}
//             className="lg:hidden px-4 py-2 rounded hover:bg-gray-200"
//           >
//             <FaChevronDown
//               className={`transform ${isMenuOpen ? "rotate-180" : ""}`}
//             />
//           </button>

//           {/* Navigation Links for Desktop */}
//           <div
//             className={`lg:flex lg:items-center lg:space-x-4 ${
//               isMenuOpen ? "block" : "hidden"
//             } lg:block`}
//           >
//             <div className="flex-grow flex items-center justify-center space-x-4">
//               <Link to="/" className="hover:text-gray-600">
//                 Home
//               </Link>

//               {/* Recipes Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={toggleDropdown(setIsRecipesOpen)}
//                   className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
//                 >
//                   <span>Recipes</span>
//                   <FaChevronDown />
//                 </button>
//                 {isRecipesOpen && (
//                   <div className="absolute mt-2 left-0 bg-white text-black rounded shadow-lg w-48">
//                     <Link
//                       to="/recipes"
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       All Recipes
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* Meals Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={toggleDropdown(setIsMealsOpen)}
//                   onMouseEnter={() => handleMealHover("meals")}
//                   onMouseLeave={() => handleMealHover(null)}
//                   className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
//                 >
//                   <span>Meals</span>
//                   <FaChevronDown />
//                 </button>
//                 {(isMealsOpen || activeMeal) && (
//                   <div className="absolute mt-2 left-0 bg-white text-black rounded shadow-lg w-64">

                    
//                     {/* Dinner Dropdown */}
//                     <div
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
//                       onMouseEnter={() => handleMealHover("dinner")}
//                       onMouseLeave={() => handleMealHover(null)}
//                     >
//                       Dinner
//                       {activeMeal === "dinner" && (
//                         <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48">
//                           <Link
//                             to="/recipes/pizza"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Pizza
//                           </Link>
//                           <Link
//                             to="/recipes/lasagna"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Lasagna
//                           </Link>
//                           <Link
//                             to="/recipes/dorowet"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Dorowet
//                           </Link>
//                           <button
//                             onClick={() => handleMealCategoryClick("dinner")}
//                             className="block px-4 py-2 hover:bg-gray-100 w-full text-right text-orange-700"
//                           >
//                             View All
//                           </button>
//                           {activeMealCategory === "dinner" && (
//                             <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48 mt-2">
//                               <Link
//                                 to="/recipes/shiro"
//                                 className="block px-4 py-2 hover:bg-gray-100"
//                               >
//                                 Shiro
//                               </Link>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     {/* Lunch Dropdown */}
//                     <div
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
//                       onMouseEnter={() => handleMealHover("lunch")}
//                       onMouseLeave={() => handleMealHover(null)}
//                     >
//                       Lunch
//                       {activeMeal === "lunch" && (
//                         <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48">
//                           <Link
//                             to="/recipes/noodles"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Noodles
//                           </Link>
//                           <Link
//                             to="/recipes/tebs"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Tebs
//                           </Link>
//                           <Link
//                             to="/recipes/kitfo"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Kitfo
//                           </Link>
//                           <button
//                             onClick={() => handleMealCategoryClick("lunch")}
//                             className="block px-4 py-2 hover:bg-gray-100 w-full text-right text-orange-700"
//                           >
//                             View All
//                           </button>
//                           {activeMealCategory === "lunch" && (
//                             <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48 mt-2">
//                               <Link
//                                 to="/recipes/salad"
//                                 className="block px-4 py-2 hover:bg-gray-100"
//                               >
//                                 Salad
//                               </Link>
//                               <Link
//                                 to="/recipes/soup"
//                                 className="block px-4 py-2 hover:bg-gray-100"
//                               >
//                                 Soup
//                               </Link>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     {/* Desserts Dropdown */}
//                     <div
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
//                       onMouseEnter={() => handleMealHover("desserts")}
//                       onMouseLeave={() => handleMealHover(null)}
//                     >
//                       Desserts
//                       {activeMeal === "desserts" && (
//                         <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48">
//                           <Link
//                             to="/recipes/cake"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Cake
//                           </Link>
//                           <Link
//                             to="/recipes/chocolate-cake"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Chocolate Cake
//                           </Link>
//                           <button
//                             onClick={() => handleMealCategoryClick("desserts")}
//                             className="block px-4 py-2 hover:bg-gray-100 w-full text-right text-orange-700"
//                           >
//                             View All
//                           </button>
//                           {activeMealCategory === "desserts" && (
//                             <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48 mt-2">
//                               <Link
//                                 to="/recipes/ice-cream"
//                                 className="block px-4 py-2 hover:bg-gray-100"
//                               >
//                                 Ice Cream
//                               </Link>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     {/* Breakfast Dropdown */}
//                     <div
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
//                       onMouseEnter={() => handleMealHover("breakfast")}
//                       onMouseLeave={() => handleMealHover(null)}
//                     >
//                       Breakfast
//                       {activeMeal === "breakfast" && (
//                         <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48">
//                           <Link
//                             to="/recipes/pancakes"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Pancakes
//                           </Link>
//                           <Link
//                             to="/recipes/ferfer"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Ferfer
//                           </Link>
//                           <button
//                             onClick={() => handleMealCategoryClick("breakfast")}
//                             className="block px-4 py-2 hover:bg-gray-100 w-full text-right text-orange-700"
//                           >
//                             View All
//                           </button>
//                           {activeMealCategory === "breakfast" && (
//                             <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48 mt-2">
//                               <Link
//                                 to="/recipes/waffles"
//                                 className="block px-4 py-2 hover:bg-gray-100"
//                               >
//                                 Waffles
//                               </Link>
//                               <Link
//                                 to="/recipes/sandwich"
//                                 className="block px-4 py-2 hover:bg-gray-100"
//                               >
//                                 Sandwich
//                               </Link>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     {/* More Dropdown */}
//                     <div
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
//                       onMouseEnter={() => handleMealHover("more")}
//                       onMouseLeave={() => handleMealHover(null)}
//                     >
//                       More
//                       {activeMeal === "more" && (
//                         <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48">
//                           <Link
//                             to="/recipes/drinks"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Drinks
//                           </Link>
//                           <Link
//                             to="/recipes/snacks"
//                             className="block px-4 py-2 hover:bg-gray-100"
//                           >
//                             Snacks
//                           </Link>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* User Profile and Logout */}
//               <div className="flex-shrink-0 flex items-center space-x-4">
//                 <Link
//                   to="/saved-recipes"
//                   className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200"
//                 >
//                   <FaBookmark />
//                   <span>SavedRecipes</span>
//                 </Link>

//                 <Link
//                   to="/create-recipes"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                 >
//                   + ADD RECIPES
//                 </Link>

//                 {!cookies.access_token ? (
//                   <Link
//                     to="/auth"
//                     className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
//                   >
//                     Login/Register
//                   </Link>
//                 ) : (
//                   <button
//                     onClick={logout}
//                     className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
//                   >
//                     Logout
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };








import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios"; // Make sure axios is installed
import { FaChevronDown, FaBookmark } from "react-icons/fa";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isMealsOpen, setIsMealsOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState(null);
  const [activeMealCategory, setActiveMealCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/category/getcategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
    setActiveMealCategory(category);
  };

  return (
    <div>
      {/* Full-width promotion section */}
      <div className="bg-black text-white w-screen absolute top-0 left-0 right-0 z-10">
        <div className="text-center py-2 text-sm">Food Recipes.......</div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white text-black shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/path-to-your-logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleDropdown(setIsMenuOpen)}
            className="lg:hidden px-4 py-2 rounded hover:bg-gray-200"
          >
            <FaChevronDown
              className={`transform ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Navigation Links for Desktop */}
          <div
            className={`lg:flex lg:items-center lg:space-x-4 ${
              isMenuOpen ? "block" : "hidden"
            } lg:block`}
          >
            <div className="flex-grow flex items-center justify-center space-x-4">
              <Link to="/" className="hover:text-gray-600">
                Home
              </Link>

              {/* Recipes Dropdown */}
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

              {/* Meals Dropdown */}
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
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                        onMouseEnter={() => handleMealHover(category.name)}
                        onMouseLeave={() => handleMealHover(null)}
                      >
                        {category.name}
                        {activeMeal === category.name && (
                          <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48">
                            {category.recipes.map((recipe) => (
                              <Link
                                key={recipe._id}
                                to={`/recipes/${recipe.slug}`}
                                className="block px-4 py-2 hover:bg-gray-100"
                              >
                                {recipe.name}
                              </Link>
                            ))}
                            <button
                              onClick={() =>
                                handleMealCategoryClick(category.name)
                              }
                              className="block px-4 py-2 hover:bg-gray-100 w-full text-right text-orange-700"
                            >
                              View All
                            </button>
                            {activeMealCategory === category.name &&
                              category.subcategories && (
                                <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg w-48 mt-2">
                                  {category.subcategories.map((subcategory) => (
                                    <Link
                                      key={subcategory._id}
                                      to={`/recipes/${subcategory.slug}`}
                                      className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile and Logout */}
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
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  + ADD RECIPES
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
