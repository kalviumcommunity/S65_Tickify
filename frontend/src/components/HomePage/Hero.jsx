import React from "react";
import { motion } from "framer-motion";
import "./logoName.css";

const Hero = ({ isDarkMode }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 text-white">
      {/* Main Hero Content */}
      <motion.div
        className="flex flex-col items-center justify-center text-center py-72 px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg ml-[140px]"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          Never Forget Again! 🚀
        </motion.h1>

        <p className="text-xl text-white max-w-2xl mb-8 opacity-90">
          Tickify is your fun and useful checklist app. Remember your keys,
          phone, and even your pants - with a smile! 😄
        </p>

        <div className="flex space-x-4">
          <motion.button
            className={`bg-white ${
              isDarkMode ? "text-purple-700" : "text-black"
            } font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition duration-300 shadow-lg ${
              isDarkMode ? "hover:text-black" : ""
            }`}
            whileHover={{ scale: 1.1 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-purple-700 transition duration-300 shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* Wave Effect at the Bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          key={isDarkMode} // Ensures re-render when dark mode changes
          className="relative block w-full h-24 dark:fill-gray-950 fill-gray-50 transition-colors duration-0"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160L60,149.3C120,139,240,117,360,133.3C480,149,600,203,720,213.3C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;