import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = ({ isDarkMode, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const baseUrl =
        import.meta.env.MODE === "development"
          ? import.meta.env.VITE_BASE_URI_DEV
          : import.meta.env.VITE_BASE_URI_PROD;

      const response = await fetch(`${baseUrl}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json().catch(() => null);
      const message =
        data?.message ||
        (response.ok ? "User created successfully!" : "Registration failed");

      if (response.ok) {
        toast.success(message);
        onSignupSuccess();
        navigate("/signin");
      } else {
        toast.error(message);
        setServerError(message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        "Connection error. Please check your network or try again later.";
      toast.error(errorMessage);
      setServerError(errorMessage);
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
      <form
        onSubmit={handleSubmit}
        className={`p-6 rounded-lg shadow-md w-96 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 text-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Sign Up
        </h2>

        <label
          className={`block mt-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

        <label
          className={`block mt-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}

        {serverError && (
          <p className="mt-2 text-sm text-red-500">{serverError}</p>
        )}

        <button
          type="submit"
          className={`w-full p-2 mt-4 rounded transition ${
            isDarkMode
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-purple-600 text-white hover:bg-purple-700"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="mt-4 text-center">
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Already have an account?{" "}
            <span
  className="text-purple-500 cursor-pointer"
  onClick={() => navigate("/signin")}
>
  Sign In
</span>

          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;

