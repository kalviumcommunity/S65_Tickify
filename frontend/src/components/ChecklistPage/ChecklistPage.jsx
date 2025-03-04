import React, { useState, useEffect } from "react";
import ChecklistItem from "../ChecklistItem/ChecklistItem";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ShareList from "../SharePage/ShareList";
import "./ChecklistPage.css";
import Navbar from "../HomePage/Navbar";
import toast from "react-hot-toast";

const ChecklistPage = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Fetch checklist from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/get`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Checklists:", data);
        setChecklist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching checklist:", err);
        setError("Failed to load checklist");
        setLoading(false);
      });
  }, []);

  // Add a new item
  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter a task!");
      return;
    }

    const newItemObj = { text: newItem, completed: false, priority: "low" };

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItemObj),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Checklist Added! Stay on track! 🚀");
        setChecklist([...checklist, data]);
        setNewItem("");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        toast.error("Failed to add checklist item. Please try again.");
      });
  };

  // Toggle completion status
  const handleToggleComplete = (id, completed) => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        toast.success(
          `Task marked as ${!completed ? "completed" : "incomplete"}! ✅`
        );
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.error("Failed to update task status. Please try again.");
      });
  };

  // Set priority
  const handleSetPriority = (id, priority) => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        toast.success(`Priority set to ${priority}! ⚡`);
      })
      .catch((error) => {
        console.error("Error updating priority:", error);
        toast.error("Failed to update priority. Please try again.");
      });
  };

  // Delete item
  const handleDeleteItem = (id) => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setChecklist((prev) => prev.filter((item) => item._id !== id));
        toast.success("Task deleted successfully! 🗑️");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete task. Please try again.");
      });
  };

  // Edit item
  const handleEditItem = (id, text) => {
    setEditingItemId(id);
    setEditedText(text);
    toast.success("Editing task... ✏️");
  };

  // Save edited item
  const handleSaveEdit = (id) => {
    if (!editedText.trim()) {
      toast.error("Please enter a task!");
      return;
    }

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingItemId(null);
        setEditedText("");
        toast.success("Task updated successfully! ✅");
      })
      .catch((error) => {
        console.error("Error updating item text:", error);
        toast.error("Failed to update task. Please try again.");
      });
  };

  // Open Share Modal
  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
    toast.success("Opening Share Options... 📤");
  };

  // Close Share Modal
  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Handle new item from Navbar
  useEffect(() => {
    if (location.state?.newItem) {
      setNewItem(location.state.newItem);
      handleAddItem();
    }
  }, [location.state]);

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        isDarkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="max-w-4xl mx-auto p-8 mt-20">
        {/* Main Content */}
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
          Your Customizable Checklist
        </h1>

        {/* Add New Checklist Item */}
        <motion.div
          className="flex items-center gap-3 mb-8 p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
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

        {/* Loading and Error Handling */}
        {loading && (
          <p className="text-center text-lg mb-8">Loading checklist... ⏳</p>
        )}
        {error && <p className="text-center text-red-500 mb-8">{error}</p>}

        {/* Checklist Items */}
        {!loading && !error && (
          <motion.div className="space-y-6">
            {checklist.map((item) => (
              <ChecklistItem
                key={item._id}
                item={item}
                isDarkMode={isDarkMode}
                onToggleComplete={() =>
                  handleToggleComplete(item._id, item.completed)
                }
                onSetPriority={() =>
                  handleSetPriority(
                    item._id,
                    item.priority === "high" ? "low" : "high"
                  )
                }
                onDelete={() => handleDeleteItem(item._id)}
                onEdit={() => handleEditItem(item._id, item.text)}
                isEditing={editingItemId === item._id}
                editedText={editedText}
                onTextChange={(e) => setEditedText(e.target.value)}
                onSaveEdit={() => handleSaveEdit(item._id)}
              />
            ))}
          </motion.div>
        )}

        {/* Buttons Container */}
        <div className="flex justify-between mt-10">
          {/* Back to Home Button */}
          <Link
            to="/"
            onClick={() => toast.success("Returning back to Home! 🏠")}
            className="inline-block px-6 py-3 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 hover:opacity-90 shadow-lg transform hover:scale-105 transition duration-300"
          >
            ⬅️ Back to Home
          </Link>

          {/* Share Checklist Button */}
          <button
            onClick={handleOpenShareModal}
            className="inline-block px-6 py-3 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 hover:opacity-90 shadow-lg transform hover:scale-105 transition duration-300"
          >
            📤 Share Checklist
          </button>
        </div>
      </div>

      {/* ShareList Modal */}
      <ShareList
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        checklist={checklist}
      />
    </div>
  );
};

export default ChecklistPage;