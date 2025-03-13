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
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json().catch(() => null);
      const responseMessage = data?.message || (response.ok ? "Sign in successful" : "Invalid credentials");

      if (response.ok) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");
        onSigninSuccess();
        toast.success(responseMessage);
        navigate("/");
      } else {
        setMessage(responseMessage);
        toast.error(responseMessage);
      }
    } catch (error) {
      console.error("Signin error:", error);
      const errorMessage = "Connection error. Please check your network or try again later.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-lg shadow-lg w-full max-w-sm ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>Sign In</h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-6">
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 font-semibold rounded-md transition ${
              isDarkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className={`text-sm text-center mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          New to Tickify? <a href="/signup" className="text-purple-500 font-semibold">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;