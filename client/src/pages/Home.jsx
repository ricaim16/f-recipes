import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // Import the useCookies hook

const backendUrl = "http://localhost:3001"; // Define your backend URL

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <img
        src={`${backendUrl}/${recipe.imageUrl}`}
        alt={recipe.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
        <p className="text-gray-700 mb-2">{recipe.description}</p>
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              className={`text-lg ${
                index < recipe.averageRating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-gray-600 text-sm">
            {recipe.averageRating ? recipe.averageRating.toFixed(1) : "0.0"}
          </span>
        </div>
        <p className="text-gray-500">
          Cooking Time: {recipe.cookingTime} minutes
        </p>
      </div>
    </div>
  );
};

const formatCategoryName = (category) => {
  return category.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_");
};

export const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dinnerRecipes, setDinnerRecipes] = useState([]);
  const [drinkRecipes, setDrinkRecipes] = useState([]);
  const [snackRecipes, setSnackRecipes] = useState([]);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const slideWidth = useRef(0);
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]); // Use cookies to check authentication status

  const images = ["/images/1.webp", "/images/4.jpeg", "/images/2.jpg"];

  useEffect(() => {
    // Calculate slide width and initialize interval
    if (carouselRef.current) {
      slideWidth.current =
        carouselRef.current.querySelector(".carousel-item").clientWidth;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const totalSlides = images.length;
        const nextIndex = (prevIndex + 1) % totalSlides;
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${
        currentIndex * slideWidth.current
      }px)`;
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const totalSlides = images.length;
      return (prevIndex + 1) % totalSlides;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const totalSlides = images.length;
      return (prevIndex - 1 + totalSlides) % totalSlides;
    });
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const responses = await Promise.all([
          axios.get(`${backendUrl}/recipes/category/Dinner`),
          axios.get(`${backendUrl}/recipes/category/Drink`),
          axios.get(`${backendUrl}/recipes/category/Snacks`),
        ]);

        setDinnerRecipes(responses[0].data);
        setDrinkRecipes(responses[1].data);
        setSnackRecipes(responses[2].data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes.");
      }
    };

    fetchRecipes();
  }, []);

  const handleViewAllRecipes = () => {
    if (!cookies.access_token) {
      // If not logged in, redirect to login page
      navigate("/login");
    } else {
      navigate("/recipes");
    }
  };

  const renderSection = (title, recipes = [], category) => (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-left pl-4">{title}</h2>{" "}
      {/* Align title to the left */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-start pl-4">
          {" "}
          {/* Align items to the left */}
          {(Array.isArray(recipes) ? recipes.slice(0, 4) : []).map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
          {Array.isArray(recipes) && recipes.length > 4 && (
            <div
              className="bg-yellow-500 text-white flex items-center justify-center rounded-lg h-10 w-10 absolute right-0 top-0 transform translate-x-full mt-10 mr-8 cursor-pointer"
              onClick={() => navigate(`/recipes/category/${category}`)}
            >
              <button className="flex items-center">
                <FaArrowRight className="ml-1 animate w-5 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="p-6 mx-auto">
      {/* Carousel Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-10 mb-10">
        <div className="lg:col-span-3 flex justify-center items-center overflow-hidden relative">
          <div
            className="whitespace-nowrap transition-transform duration-300 ease-in-out"
            ref={carouselRef}
            style={{
              transform: `translateX(-${currentIndex * slideWidth.current}px)`,
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="carousel-item inline-block">
                {src.endsWith(".mp4") ? (
                  <video
                    src={src}
                    controls
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Description ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
            onClick={handlePrev}
          >
            &#10094;
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
            onClick={handleNext}
          >
            &#10095;
          </button>
        </div>

        {/* Lorem Text */}
        <div className="lg:col-span-1 flex justify-center items-center">
          <p className="text-sm md:text-base lg:text-lg italic font-bold mb-4 ">
            Explore the flavors of Ethiopia with dishes like Doro Wat, Kitfo,
            and Tibs. Enjoy the spices of Berbere and Mitmita, and savor injera,
            a tangy flatbread, with stews and lentils.
          </p>
        </div>
      </div>

      <p
        className="text-3xl text-white font-bold mb-6 text-center"
        style={{
          backgroundColor: "rgb(230, 138, 0)",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        Most Popular Food in Ethiopia
      </p>

      {renderSection("Dinner Recipes", dinnerRecipes, "Dinner")}
      {renderSection("Drink Recipes", drinkRecipes, "Drink")}
      {renderSection("Snack Recipes", snackRecipes, "Snacks")}

      {/* Full-width background section */}
      <div className="relative -mx-6 px-6 bg-yellow-100 py-6 mb-12">
        <div className="max-w-screen-lg mx-auto flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-center">
            <p className="text-3xl font-semibold mb-4"> Add Your Recipes </p>
            <button
              onClick={handleViewAllRecipes} // Use this function to check login before viewing recipes
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-end"
            >
              <span className="text-lg">View All Recipes</span>
              <FaArrowRight className="ml-2 animate-bounce w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <video
              src="/dorowet.mp4"
              controls
              autoPlay
              muted
              className="w-full h-auto max-w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="py-12">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: "rgb(230, 138, 0)" }}
          >
            About Us
          </h2>
          <p className="text-lg mb-6 font-serif">
            Welcome to Ethiopian Recipes! We are passionate about bringing the
            best and most delicious Ethiopian dishes to your table. Our platform
            offers a wide variety of recipes, ranging from classic favorites
            like Doro Wat and Kitfo, to exciting new dishes from Ethiopia.
            Whether you're a seasoned chef or a beginner in the kitchen, our
            recipes are designed to make cooking fun and easy. Join us in
            exploring the rich flavors and culture of Ethiopian cuisine!
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg mb-4">
            Feel free to get in touch with us anytime!
          </p>
          <p className="text-lg mb-2">
            Phone:{" "}
            <a href="tel:+251988765324" className="text-yellow-500">
              +251 988 765 324
            </a>
          </p>
          <p className="text-lg mb-4">
            Or check out our social media for the latest updates and delicious
            recipes:
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://www.facebook.com/EthiopianRecipes"
              className="text-white hover:text-yellow-500"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com/EthiopianRecipes"
              className="text-white hover:text-yellow-500"
            >
              Twitter
            </a>
            <a
              href="https://www.instagram.com/EthiopianRecipes"
              className="text-white hover:text-yellow-500"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
