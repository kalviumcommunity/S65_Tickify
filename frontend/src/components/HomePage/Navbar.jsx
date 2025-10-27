import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordModal from "./PasswordModal";
import CreateAccountModal from "./CreateAccountModal";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Search,
  Sun,
  Moon,
  PlusCircle,
  List,
  ChevronDown,
} from "react-feather";
import "./logoName.css";
import NotificationCenter from "./NotificationCenter";
import { addNotification } from "../../utils/notificationHelper";

// ⭐ UPDATED: Added onSearchChange prop
const Navbar = ({
  isDarkMode,
  toggleDarkMode,
  onUserSelect,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    userId: "",
    accountName: "",
  });
  const [userAccounts, setUserAccounts] = useState([]);
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserForSwitch, setSelectedUserForSwitch] = useState(null);
  const [password, setPassword] = useState("");
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    accountName: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Base URL handling for dev/prod
  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_URI_DEV
      : import.meta.env.VITE_BASE_URI_PROD;

  // ⭐ NEW: Autocomplete states
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  // Helper function to extract clean username from email
  const getUsernameFromEmail = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    const cleanUsername = username.replace(/[^a-zA-Z]/g, "");
    return cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
      const email = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");
      const accountName = localStorage.getItem("accountName");

      setIsLoggedIn(loggedInStatus && !!token);

      if (email || userId || accountName) {
        setUserData({
          email,
          userId,
          accountName,
        });
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && userData.email) {
      fetchUserAccounts();
    }
  }, [isLoggedIn, userData]);

  // ⭐ NEW: Fetch all tasks for autocomplete
  useEffect(() => {
    const fetchAllTasks = () => {
      // For guest users
      if (!isLoggedIn) {
        const guestTasks = JSON.parse(
          localStorage.getItem("guestTasks") || "[]"
        );
        setAllTasks(guestTasks);
        return;
      }

      // For logged-in users
      const userId = localStorage.getItem("userId");
      if (userId) {
        fetch(`${baseUrl}/api/checklists/user/${userId}`)
          .then((res) => res.json())
          .then((data) => setAllTasks(data))
          .catch((err) => console.error("Error fetching tasks:", err));
      }
    };

    fetchAllTasks();
  }, [isLoggedIn, userData.userId]);

  const fetchUserAccounts = async () => {
    try {
      if (!userData.email) return;
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${baseUrl}/api/users/accounts?email=${userData.email}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch user accounts");
      }

      const result = await response.json();
      setUserAccounts(result.data || []);
    } catch (error) {
      console.error("Error fetching user accounts:", error);
      toast.error(error.message);
      if (error.message.includes("Session expired")) {
        navigate("/signin");
      }
    }
  };

  const handleCreateAccount = async () => {
    try {
      const { accountName, password, confirmPassword } = newAccountData;

      if (!accountName || !password || !confirmPassword) {
        toast.error("All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      const accountExists = userAccounts.some(
        (acc) => acc.accountName?.toLowerCase() === accountName.toLowerCase()
      );

      if (accountExists) {
        toast.error(`An account named "${accountName}" already exists`);
        setNewAccountData((prev) => ({ ...prev, accountName: "" }));
        return;
      }

      const createResponse = await fetch(
        `${baseUrl}/api/users/accounts`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: userData.email,
            password,
            accountName,
          }),
        }
      );

      const data = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      toast.success(`Account ${accountName} created successfully!`);

      localStorage.setItem("userId", data.data._id);
      localStorage.setItem("accountName", data.data.accountName);
      setUserData((prev) => ({
        ...prev,
        userId: data.data._id,
        accountName: data.data.accountName,
      }));

      setShowCreateAccountModal(false);
      setNewAccountData({
        accountName: "",
        password: "",
        confirmPassword: "",
      });
      await fetchUserAccounts();

      handleUserSelect({
        _id: data.data._id,
        email: userData.email,
        accountName: data.data.accountName,
      });
    } catch (error) {
      console.error("Account creation error:", error);

      if (error.message.includes("already exists")) {
        toast.error(
          `An account named "${newAccountData.accountName}" already exists. Please choose a different name.`,
          { duration: 5000 }
        );
        setNewAccountData((prev) => ({
          ...prev,
          accountName: "",
        }));
      } else {
        toast.error(error.message || "Failed to create account");
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUserForSwitch(user);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!password || password.trim() === "") {
      toast.error("Password is required");
      return;
    }

    if (!selectedUserForSwitch || !selectedUserForSwitch.email) {
      toast.error("No user selected for switching");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/users/verify`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: selectedUserForSwitch.email,
            password: password,
            accountName: selectedUserForSwitch.accountName || null,
          }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Password verification failed (Status: ${response.status})`
        );
      }

      localStorage.setItem("userEmail", selectedUserForSwitch.email);
      localStorage.setItem("userId", selectedUserForSwitch._id);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "accountName",
        selectedUserForSwitch.accountName || ""
      );

      setUserData({
        email: selectedUserForSwitch.email,
        userId: selectedUserForSwitch._id,
        accountName: selectedUserForSwitch.accountName || "",
      });

      setShowPasswordModal(false);
      setShowUserFilter(false);
      setPassword("");

      toast.success(
        `Switched to account ${
          selectedUserForSwitch.accountName || "Main Account"
        }`
      );

      if (onUserSelect) {
        onUserSelect(selectedUserForSwitch._id);
      }

      if (
        location.pathname === "/checklist" ||
        location.pathname === "/high-priority"
      ) {
        navigate("/");
        setTimeout(() => {
          navigate(location.pathname);
        }, 50);
      }
    } catch (error) {
      console.error("Password verification error:", error);

      if (error.message.includes("network")) {
        toast.error("Network error - please check your connection");
      } else if (error.message.includes("Invalid credentials")) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error(error.message || "An error occurred during verification");
      }
    }
  };

  const handleShowAllUsers = () => {
    toast.success("Showing tasks from all accounts");

    if (onUserSelect) {
      onUserSelect("all");
    }

    setShowUserFilter(false);

    if (
      location.pathname === "/checklist" ||
      location.pathname === "/high-priority"
    ) {
      navigate("/");
      setTimeout(() => {
        navigate(location.pathname);
      }, 50);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("accountName");
    setIsLoggedIn(false);
    setUserData({
      email: "",
      userId: "",
      accountName: "",
    });
    toast.success("Logged out successfully!");
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  const handleCreateChecklist = () => {
    setShowNewChecklistInput(true);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter a task!");
      return;
    }

    // For guest users - save to localStorage
    if (!isLoggedIn) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const newGuestTask = {
        _id: Date.now().toString(),
        text: newItem,
        completed: false,
        priority: "low",
        created_by: "guest",
        createdAt: new Date().toISOString(),
      };

      guestTasks.push(newGuestTask);
      localStorage.setItem("guestTasks", JSON.stringify(guestTasks));

      toast.success("Task added! Sign up to save permanently! 🚀");

      addNotification("Task Added (Guest)", `Task: "${newItem}"`, "info");

      setNewItem("");
      setShowNewChecklistInput(false);
      navigate("/checklist");
      return;
    }

    // For logged-in users
    const newItemObj = {
      text: newItem,
      completed: false,
      priority: "low",
      created_by: userData.userId,
    };

    fetch(`${baseUrl}/api/checklists/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItemObj),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Checklist Added! Stay on track! 🚀");

        addNotification("New Task Added", `Task: "${newItem}"`, "info");

        setNewItem("");
        setShowNewChecklistInput(false);
        navigate("/checklist");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        toast.error("Failed to add checklist item. Please try again.");
      });
  };

  // ⭐ UPDATED: Real search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      // Navigate to checklist if not already there
      if (location.pathname !== "/checklist") {
        navigate("/checklist");
      }
      toast.success(`Searching for: ${searchQuery}`);
    }
  };

  // ⭐ NEW: Handle search input change with autocomplete
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Show suggestions if there's input
    if (value.trim()) {
      const filtered = allTasks
        .filter((task) => task.text.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }

    // Update parent component's search
    if (onSearchChange && location.pathname === "/checklist") {
      onSearchChange(value);
    }
  };

  // ⭐ NEW: Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);

    if (location.pathname !== "/checklist") {
      navigate("/checklist");
    }

    if (onSearchChange) {
      onSearchChange(suggestion.text);
    }

    toast.success(`Searching for: ${suggestion.text}`);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleUserFilter = () => setShowUserFilter(!showUserFilter);

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    toast.success(`Switched to ${isDarkMode ? "Light" : "Dark"} Mode!`);
  };

  const textColor = isDarkMode ? "text-gray-200" : "text-gray-950";
  const isChecklistPage = location.pathname === "/checklist";

  const getDisplayName = () => {
    if (!userData.email) return "";
    return getUsernameFromEmail(userData.email);
  };

  const displayName = getDisplayName();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 w-full p-6 flex justify-between items-center transition-all duration-300 ${
        isDarkMode ? "text-gray-200" : "text-gray-950"
      }`}
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
              isDarkMode
                ? "text-white hover:bg-gray-800"
                : "text-gray-950 hover:bg-gray-200"
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
              className="absolute left-0 z-50 w-48 mt-2 text-white bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
            >
              <ul className="py-2">
                {isLoggedIn && (
                  <li className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400">Logged in</p>
                      </div>
                    </div>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800"
                  >
                    <User className="w-5 h-5 mr-2 text-gray-400" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/high-priority");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800"
                  >
                    <List className="w-5 h-5 mr-2 text-gray-400" /> High
                    Priority
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/checklist");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800"
                  >
                    <List className="w-5 h-5 mr-2 text-gray-400" /> All
                    Checklists
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800"
                  >
                    <Settings className="w-5 h-5 mr-2 text-gray-400" /> Settings
                  </button>
                </li>

                {isLoggedIn ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-800"
                    >
                      <LogOut className="w-5 h-5 mr-2 text-gray-400" /> Log Out
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/signin");
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-800"
                    >
                      <LogOut className="w-5 h-5 mr-2 text-gray-400" /> Sign In
                    </button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Logo */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className={`app-name text-2xl font-bold cursor-pointer transition ${
            isDarkMode ? "text-white" : "text-gray-950"
          }`}
        >
          Tickify ✅
        </motion.h1>
      </div>

      {/* ⭐ UPDATED: Search Bar with Autocomplete Dropdown */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center flex-grow max-w-md mx-8"
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={`w-full px-4 py-2 pl-10 pr-10 rounded-full border focus:outline-none focus:ring-4 focus:ring-purple-500 ${
              isDarkMode
                ? "bg-gray-100 text-gray-950 border-gray-300"
                : "bg-white text-black border-gray-300"
            }`}
          />
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowSuggestions(false);
                if (onSearchChange) onSearchChange("");
              }}
              className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
            >
              ✕
            </button>
          )}

          {/* ⭐ NEW: Autocomplete Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-2xl overflow-hidden z-50 ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion._id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-100 text-gray-900"
                  } ${
                    index !== 0
                      ? isDarkMode
                        ? "border-t border-gray-700"
                        : "border-t border-gray-200"
                      : ""
                  }`}
                >
                  <Search className="flex-shrink-0 w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate">{suggestion.text}</span>
                  {suggestion.priority === "high" && (
                    <span className="px-2 py-1 text-xs text-white bg-red-500 rounded">
                      High
                    </span>
                  )}
                  {suggestion.priority === "medium" && (
                    <span className="px-2 py-1 text-xs text-white bg-yellow-500 rounded">
                      Med
                    </span>
                  )}
                  {suggestion.completed && (
                    <span className="px-2 py-1 text-xs text-white bg-green-500 rounded">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </form>

      {/* Right Side: Buttons */}
      <div className="flex items-center space-x-4">
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
                  className="px-6 py-3 text-black transition-all duration-300 rounded-lg shadow-lg bg-white/10 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover:shadow-xl"
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
                className="px-6 py-2 font-bold text-white transition duration-300 bg-purple-600 rounded-full hover:bg-purple-700"
              >
                <PlusCircle className="inline w-5 h-5 mr-1" /> Create Checklist
              </motion.button>
            )}
          </>
        )}

        {/* User Account Selector - Only visible when logged in */}
        {isLoggedIn ? (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleUserFilter}
              className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100"
              } shadow-md transition-all duration-300 border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <User className="w-6 h-6 text-purple-500" />
              <span className="text-base font-medium truncate max-w-[160px]">
                {displayName}
              </span>
              <ChevronDown className="w-5 h-5" />
            </motion.button>

            {showUserFilter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-50 w-auto mt-8 text-white bg-gray-900 border border-gray-700 rounded-lg shadow-lg min-w-fit"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <User className="w-6 h-6 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-base font-semibold">
                        {getUsernameFromEmail(userData.email)}
                      </p>
                      <p className="text-xs text-gray-400">{userData.email}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold bg-purple-600 rounded-full">
                      Current
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/signin")}
              className={`font-bold px-6 py-2 rounded-full transition duration-300 border ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-white hover:text-gray-950"
                  : "bg-white text-gray-950 hover:bg-gray-800 hover:text-white"
              }`}
            >
              Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/signup")}
              className="px-6 py-2 font-bold text-white transition duration-300 bg-purple-600 rounded-full hover:bg-purple-700"
            >
              Sign Up
            </motion.button>
          </>
        )}

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleDarkMode}
          className={`p-2 rounded-full transition ${
            isDarkMode
              ? "text-white hover:bg-gray-800"
              : "text-gray-950 hover:bg-gray-200"
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </motion.button>

        {/* Notification Center */}
        <NotificationCenter isDarkMode={isDarkMode} />

        {/* High Priority Link */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/high-priority")}
          className={`p-2 rounded-full transition ${
            isDarkMode
              ? "text-white hover:bg-gray-800"
              : "text-gray-950 hover:bg-gray-200"
          }`}
        >
          <List className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Password Verification Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        password={password}
        setPassword={setPassword}
        isDarkMode={isDarkMode}
      />

      {/* Create Account Modal */}
      <CreateAccountModal
        isDarkMode={isDarkMode}
        showCreateAccountModal={showCreateAccountModal}
        setShowCreateAccountModal={setShowCreateAccountModal}
        handleCreateAccount={handleCreateAccount}
        newAccountData={newAccountData}
        setNewAccountData={setNewAccountData}
        userAccounts={userAccounts}
      />
    </motion.nav>
  );
};

export default Navbar;
