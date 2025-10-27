import React, { useState, useEffect, useContext } from "react";
import ChecklistItem from "../ChecklistItem/ChecklistItem";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ShareList from "../SharePage/ShareList";
import "./ChecklistPage.css";
import Navbar from "../HomePage/Navbar";
import toast from "react-hot-toast";
import { AuthContext } from "../../App";
import SmartReminders from "../SmartReminders/SmartReminders";
import SmartSuggestions from "../SmartSuggestions/SmartSuggestions";
import FunMotivation from "../FunMotivation/FunMotivation";
import { addNotification } from "../../utils/notificationHelper";

// ⭐ UPDATED: Added searchQuery and setSearchQuery props
const ChecklistPage = ({ isDarkMode, toggleDarkMode, searchQuery = "", setSearchQuery }) => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const [checklist, setChecklist] = useState([]);
  const [filteredChecklist, setFilteredChecklist] = useState([]); // ⭐ NEW: Filtered list
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const userId = authState.userId;
  const userEmail = authState.userEmail;

  // ⭐ FIXED: Load guest tasks or fetch from database
  useEffect(() => {
    // For guest users (no userId), load from localStorage
    if (!userId) {
      console.log("Guest mode - loading from localStorage");
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      setChecklist(guestTasks);
      setLoading(false);
      setError(null);
      return;
    }

    console.log("Fetching checklist for user:", userId);
    setLoading(true);

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/user/${userId}`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch checklist: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setChecklist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching checklist:", err);
        setError(`Failed to load checklist: ${err.message}`);
        setLoading(false);
      });
  }, [userId]);

  // ⭐ NEW: Filter checklist based on search query
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setFilteredChecklist(checklist);
    } else {
      const filtered = checklist.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChecklist(filtered);
    }
  }, [searchQuery, checklist]);

  // ⭐ UPDATED: Add item with notifications
  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter a task!");
      return;
    }

    // ⭐ For guest users - save to localStorage
    if (!userId) {
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
      setChecklist(guestTasks);

      toast.success("Task added! Sign up to save permanently! 🚀");

      // ⭐ ADD NOTIFICATION
      addNotification("Task Added (Guest)", `Task: "${newItem}"`, "info");

      setNewItem("");
      return;
    }

    // For logged-in users
    const newItemObj = {
      text: newItem,
      completed: false,
      priority: "low",
      created_by: userId,
    };

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newItemObj),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`Failed to add task: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        toast.success("Task added successfully! 🚀");

        // ⭐ ADD NOTIFICATION
        addNotification("New Task Added", `Task: "${newItem}"`, "info");

        setChecklist((prevList) => [...prevList, data]);
        setNewItem("");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        toast.error(`Failed to add task`);
      });
  };

  // ⭐ UPDATED: Toggle complete with notifications
  const handleToggleComplete = (id, completed) => {
    const item = checklist.find((i) => i._id === id);

    // ⭐ For guest users
    if (!userId) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const updatedTasks = guestTasks.map((task) =>
        task._id === id ? { ...task, completed: !completed } : task
      );
      localStorage.setItem("guestTasks", JSON.stringify(updatedTasks));
      setChecklist(updatedTasks);

      const isCompleted = !completed;
      toast.success(`Task ${isCompleted ? "completed" : "uncompleted"}! ✅`);

      // ⭐ ADD NOTIFICATION when task is completed
      if (isCompleted && item) {
        addNotification(
          "Task Completed! 🎉",
          `You completed: "${item.text}"`,
          "completed"
        );
      }
      return;
    }

    // For logged-in users
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed, created_by: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );

        const isCompleted = !completed;
        toast.success(`Task ${isCompleted ? "completed" : "uncompleted"}! ✅`);

        // ⭐ ADD NOTIFICATION when task is completed
        if (isCompleted && item) {
          addNotification(
            "Task Completed! 🎉",
            `You completed: "${item.text}"`,
            "completed"
          );
        }
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.error("Failed to update task");
      });
  };

  // Set priority
  // ⭐ UPDATED: Set priority with Low/Medium/High options
  const handleSetPriority = (id, newPriority) => {
    // ⭐ For guest users
    if (!userId) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const updatedTasks = guestTasks.map((task) =>
        task._id === id ? { ...task, priority: newPriority } : task
      );
      localStorage.setItem("guestTasks", JSON.stringify(updatedTasks));
      setChecklist(updatedTasks);
      toast.success(`Priority set to ${newPriority}! ⚡`);
      return;
    }

    // For logged-in users
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority, created_by: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update priority");
        return res.json();
      })
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        toast.success(`Priority set to ${newPriority}! ⚡`);
      })
      .catch((error) => {
        console.error("Error updating priority:", error);
        toast.error("Failed to update priority");
      });
  };

  // Delete item
  const handleDeleteItem = (id) => {
    // ⭐ For guest users
    if (!userId) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const updatedTasks = guestTasks.filter((task) => task._id !== id);
      localStorage.setItem("guestTasks", JSON.stringify(updatedTasks));
      setChecklist(updatedTasks);
      toast.success("Task deleted! 🗑️");
      return;
    }

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ created_by: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        return res.json();
      })
      .then(() => {
        setChecklist((prev) => prev.filter((item) => item._id !== id));
        toast.success("Task deleted! 🗑️");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete task");
      });
  };

  // Edit item
  const handleEditItem = (id, text) => {
    setEditingItemId(id);
    setEditedText(text);
  };

  // Save edit
  const handleSaveEdit = (id) => {
    if (!editedText.trim()) {
      toast.error("Task cannot be empty!");
      return;
    }

    // ⭐ For guest users
    if (!userId) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const updatedTasks = guestTasks.map((task) =>
        task._id === id ? { ...task, text: editedText } : task
      );
      localStorage.setItem("guestTasks", JSON.stringify(updatedTasks));
      setChecklist(updatedTasks);
      setEditingItemId(null);
      setEditedText("");
      toast.success("Task updated! ✅");
      return;
    }

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText, created_by: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingItemId(null);
        setEditedText("");
        toast.success("Task updated! ✅");
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.error("Failed to update task");
      });
  };

  // Keyboard shortcut
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newItem.trim()) {
      handleAddItem();
    }
  };

  // Open/Close share modal
  const handleOpenShareModal = () => setIsShareModalOpen(true);
  const handleCloseShareModal = () => setIsShareModalOpen(false);

  // Handle navigation items
  useEffect(() => {
    if (location.state?.newItem && userId && !loading) {
      const itemToAdd = location.state.newItem;
      const newItemObj = {
        text: itemToAdd,
        completed: false,
        priority: "low",
        created_by: userId,
      };

      fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newItemObj),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to add task: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          toast.success("Task added! 🚀");
          setChecklist((prevList) => [...prevList, data]);
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          toast.error("Failed to add task");
        });

      window.history.replaceState({}, document.title);
    }
  }, [location.state, userId, loading]);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ⭐ UPDATED: Navbar with search handler */}
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <div className="max-w-6xl px-4 py-8 mx-auto mt-20">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-5xl font-bold text-center text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 bg-clip-text"
        >
          Your Customizable Checklist
        </motion.h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar - Smart Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 lg:col-span-1"
          >
            {!loading && !error && (
              <>
                {/* Fun Motivation Card */}
                <FunMotivation checklist={checklist} />

                {/* Smart Reminders Toggle */}
                <SmartReminders checklist={checklist} />
              </>
            )}
          </motion.div>

          {/* Main Content Area - Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 lg:col-span-2"
          >
            {/* Smart Suggestions */}
            {!loading && !error && (
              <SmartSuggestions
                onAddSuggestion={(suggestion) => {
                  setNewItem(suggestion);
                  toast.success("💡 Suggestion added! Press Enter to add it");
                }}
              />
            )}

            {/* Add New Task Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`rounded-2xl shadow-xl p-6 ${
                isDarkMode
                  ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black"
                  : "bg-gradient-to-r from-white via-gray-50 to-gray-100"
              } border-2 ${
                isDarkMode ? "border-purple-500/30" : "border-purple-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="✨ Add a new task..."
                  className={`flex-1 px-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 text-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500/30"
                      : "bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:ring-purple-200"
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddItem}
                  disabled={loading}
                  className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl"
                >
                  {loading && !checklist.length ? "⏳" : "➕ Add"}
                </motion.button>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && checklist.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-b-4 border-purple-600 rounded-full animate-spin"></div>
                <p className="text-xl text-gray-500">
                  Loading your tasks... ⏳
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-12 text-center bg-red-100 border-2 border-red-300 rounded-2xl"
              >
                <p className="text-xl font-semibold text-red-600">⚠️ {error}</p>
              </motion.div>
            )}

            {/* ⭐ UPDATED: Checklist Items with filtered results */}
            {!loading && !error && (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredChecklist.length > 0 ? (
                    filteredChecklist.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ChecklistItem
                          item={item}
                          isDarkMode={isDarkMode}
                          onToggleComplete={() =>
                            handleToggleComplete(item._id, item.completed)
                          }
                          onSetPriority={(newPriority) =>
                            handleSetPriority(item._id, newPriority)
                          }
                          onDelete={() => handleDeleteItem(item._id)}
                          onEdit={() => handleEditItem(item._id, item.text)}
                          isEditing={editingItemId === item._id}
                          editedText={editedText}
                          onTextChange={(e) => setEditedText(e.target.value)}
                          onSaveEdit={() => handleSaveEdit(item._id)}
                        />
                      </motion.div>
                    ))
                  ) : searchQuery ? (
                    // ⭐ NEW: No results state
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-center py-20 px-6 rounded-2xl ${
                        isDarkMode
                          ? "bg-gray-800/50 border-2 border-gray-700"
                          : "bg-white border-2 border-gray-200"
                      }`}
                    >
                      <div className="mb-6 text-8xl">🔍</div>
                      <h3 className="mb-3 text-2xl font-bold">No results found</h3>
                      <p className="mb-6 text-lg opacity-70">
                        No tasks match "{searchQuery}"
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="px-6 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        Clear Search
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-center py-20 px-6 rounded-2xl ${
                        isDarkMode
                          ? "bg-gray-800/50 border-2 border-gray-700"
                          : "bg-white border-2 border-gray-200"
                      }`}
                    >
                      <div className="mb-6 text-8xl">📝</div>
                      <h3 className="mb-3 text-2xl font-bold">No tasks yet!</h3>
                      <p className="mb-6 text-lg opacity-70">
                        Start by adding your first task above, or try a smart
                        suggestion! 💡
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between gap-4 mt-8">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-2xl"
                >
                  ⬅️ Back to Home
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenShareModal}
                className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 hover:shadow-2xl"
              >
                📤 Share Checklist
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareList
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        checklist={checklist}
      />
    </div>
  );
};

export default ChecklistPage;
