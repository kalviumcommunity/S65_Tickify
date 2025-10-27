import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signin = ({ isDarkMode, onSigninSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const baseUrl =
        import.meta.env.MODE === "development"
          ? import.meta.env.VITE_BASE_URI_DEV
          : import.meta.env.VITE_BASE_URI_PROD;

      const response = await fetch(`${baseUrl}/api/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Invalid credentials");
      }

      // Store all authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("accountName", data.accountName || "");
      localStorage.setItem("isLoggedIn", "true");

      // Call success handler if provided
      if (onSigninSuccess) {
        onSigninSuccess(data.userId, data.email, data.token, data.accountName);
      }

      toast.success(data.message || "Login successful!");

      // Navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Signin error:", error);
      const errorMessage = error.message || "Login failed. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg w-full max-w-sm ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-6 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Sign In
        </h2>
        {message && (
          <p
            className={`text-center mb-4 ${
              isDarkMode ? "text-red-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              isLoading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p
          className={`text-sm text-center mt-4 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-purple-500 hover:text-purple-600"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
