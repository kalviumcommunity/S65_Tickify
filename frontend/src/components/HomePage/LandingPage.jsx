import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import toast from "react-hot-toast";

const LandingPage = ({ isDarkMode, toggleDarkMode }) => {
  // Apply dark mode to the body
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <Hero isDarkMode={isDarkMode} />

      {/* Features Section */}
      <Features isDarkMode={isDarkMode} />

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default LandingPage;