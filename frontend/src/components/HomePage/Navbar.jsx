import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  PlusCircle,
  List,
} from "react-feather";
import "./logoName.css";

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);
  const [newItem, setNewItem] = useState("");

  const randomReminders = [
    "Don't forget your keys! 🗝️",
    "Did you grab your wallet? 💰",
    "Phone charged? 🔋",
    "Check if your pants are on! 👖",
    "Water bottle packed? 💧",
  ];

  const handleSignUp = () => toast.success("Welcome to Tickify! 🎉");
  const handleSignIn = () => toast.success("Welcome back to Tickify! 😊");

  const handleCreateChecklist = () => {
    setShowNewChecklistInput(true);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter a task!");
      return;
    }

    const newItemObj = { text: newItem, completed: false, priority: "low" };

    fetch("http://localhost:5000/api/checklists/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItemObj),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Checklist Added! Stay on track! 🚀");
        setNewItem("");
        setShowNewChecklistInput(false);
        navigate("/checklist");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        toast.error("Failed to add checklist item. Please try again.");
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    toast.success(`Searching for: ${searchQuery}`);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const giveRandomReminder = () => {
    const reminder =
      randomReminders[Math.floor(Math.random() * randomReminders.length)];
    toast.success(reminder);
  };

  // Add toast message when toggling dark/light mode
  const handleToggleDarkMode = () => {
    toggleDarkMode(); // Call the original toggle function
    toast.success(`Switched to ${isDarkMode ? "Light" : "Dark"} Mode!`);
  };

  const textColor = isDarkMode ? "text-gray-200" : "text-gray-950";
  const isChecklistPage = location.pathname === "/checklist";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 w-full p-6 flex justify-between items-center transition-all duration-300 ${textColor}`}
      style={{
        backgroundColor: isScrolled
          ? isDarkMode
            ? "rgba(20, 20, 20, 0.2)"
            : "rgba(255, 255, 255, 0.2)"
          : isDarkMode
          ? "rgba(26, 26, 46, 0.15)"
          : "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        transition: "background-color 0.3s ease-in-out",
        zIndex: 50,
      }}
    >
      {/* Left Side: Dropdown Menu */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDropdown}
            className={`p-2 rounded-full transition ${
              isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-950 hover:bg-gray-200"
            }`}
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg border bg-gray-900 text-white border-gray-700 z-50"
            >
              <ul className="py-2">
                <li>
                  <a
                    href="#profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-800"
                  >
                    <User className="w-5 h-5 mr-2 text-gray-400" /> Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#settings"
                    className="flex items-center px-4 py-2 hover:bg-gray-800"
                  >
                    <Settings className="w-5 h-5 mr-2 text-gray-400" /> Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/high-priority");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 hover:bg-gray-800 w-full"
                  >
                    <List className="w-5 h-5 mr-2 text-gray-400" /> High Priority
                  </button>
                </li>
                <li>
                  <a
                    href="#logout"
                    className="flex items-center px-4 py-2 hover:bg-gray-800"
                  >
                    <LogOut className="w-5 h-5 mr-2 text-gray-400" /> Log Out
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </div>

        {/* Logo */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className={`app-name text-2xl font-bold cursor-pointer transition ${
            isDarkMode ? "text-white" : "text-gray-950"
          }`}
        >
          Tickify ✅
        </motion.h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center flex-grow mx-8 max-w-md"
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-full border focus:outline-none focus:ring-4 focus:ring-purple-500 ${
              isDarkMode ? "bg-gray-100 text-gray-950 border-gray-300" : "bg-white text-black border-gray-300"
            }`}
          />
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
        </div>
      </form>

      {/* Right Side: Buttons */}
      <div className="flex space-x-4 items-center">
        {/* Conditionally render the "Create Checklist" button */}
        {!isChecklistPage && (
          <>
            {showNewChecklistInput ? (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className={`flex-grow p-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-white/30 focus:border-white/100"
                      : "bg-white text-black border-black/30 focus:border-black/100"
                  }`}
                  placeholder="Add a new task..."
                  whileHover={{ scale: 1.02 }}
                />
                <motion.button
                  onClick={handleAddItem}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ➕ Add
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCreateChecklist}
                className="bg-purple-600 text-white font-bold px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
              >
                <PlusCircle className="w-5 h-5 inline mr-1" /> Create Checklist
              </motion.button>
            )}
          </>
        )}

        {/* Sign In / Sign Up Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSignIn}
          className={`font-bold px-6 py-2 rounded-full transition duration-300 border ${
            isDarkMode ? "bg-gray-800 text-white hover:bg-white hover:text-gray-950" : "bg-white text-gray-950 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Sign In
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSignUp}
          className="bg-purple-600 text-white font-bold px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
        >
          Sign Up
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleDarkMode} // Use the new handler
          className={`p-2 rounded-full transition ${
            isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-950 hover:bg-gray-200"
          }`}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.button>

        {/* Quick-Access Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full transition ${
            isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-950 hover:bg-gray-200"
          }`}
          onClick={giveRandomReminder}
        >
          <Bell className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/high-priority")}
          className={`p-2 rounded-full transition ${
            isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-950 hover:bg-gray-200"
          }`}
        >
          <List className="w-6 h-6" /> {/* My Checklists */}
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;