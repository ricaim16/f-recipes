import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for name (signup only)
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [error, setError] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    if (cookies.access_token) {
      navigate("/"); // Redirect to the home page if already logged in
    }
  }, [cookies.access_token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login request
        const result = await axios.post("http://localhost:3001/auth/login", {
          email,
          password,
        });

        // Set cookies and localStorage
        setCookie("access_token", result.data.token, { path: "/" });
        window.localStorage.setItem("userID", result.data.userID);
        navigate("/");
      } else {
        // Registration request
        await axios.post("http://localhost:3001/auth/register", {
          email,
          password,
          name,
        });

        setSuccessMessage("Registration completed! Now you can log in.");
        setEmail("");
        setPassword("");
        setName("");
        // Optionally, redirect to login page
        setTimeout(() => setIsLogin(true), 1000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      // Handle different error cases
      if (error.response) {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else if (error.request) {
        setError(
          "No response from the server. Please check your network connection."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Description Section */}
      <div
        className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gray-800 text-white p-4 md:p-6 lg:p-12"
        style={{ height: "100vh" }}
      >
        <div className="max-w-xs md:max-w-sm lg:max-w-md text-center">
          <h2 className="text-lg md:text-xl lg:text-3xl font-bold mb-4">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>
          <p className="text-sm md:text-base lg:text-lg">
            {isLogin
              ? "Sign in to continue to your account and access your personalized dashboard."
              : "Create an account to get started with our service and enjoy all the benefits!"}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 md:p-6 lg:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-md p-6 md:p-8 bg-white"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">
            {isLogin ? "Login to Your Account" : "Create a New Account"}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}

          {/* Conditionally Render Fields Based on Form Type */}
          {!isLogin && (
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
