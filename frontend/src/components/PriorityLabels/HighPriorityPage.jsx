import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ChecklistItem from "../ChecklistItem/ChecklistItem";
import "../ChecklistPage/ChecklistPage.css";
import Navbar from "../HomePage/Navbar";
import toast from "react-hot-toast";

const HighPriorityPage = ({ isDarkMode, toggleDarkMode }) => {
  const [highPriorityItems, setHighPriorityItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedText, setEditedText] = useState("");

  // Fetch checklist from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/get`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch checklist");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Checklists:", data);
        const highPriority = data.filter((item) => item.priority === "high");
        setHighPriorityItems(highPriority);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching checklist:", err);
        setError("Failed to load checklist");
        setLoading(false);
      });
  }, []);

  const handleToggleComplete = (id, completed) => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setHighPriorityItems((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const handleSetPriority = (id, priority) => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        // If the priority is changed to "low", remove the item from the list
        if (priority === "low") {
          setHighPriorityItems((prev) => prev.filter((item) => item._id !== id));
        } else {
          // Otherwise, update the item in the list
          setHighPriorityItems((prev) =>
            prev.map((item) => (item._id === id ? updatedItem : item))
          );
        }
      })
      .catch((error) => console.error("Error updating priority:", error));
  };

  const handleDeleteItem = (id) => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setHighPriorityItems((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  const handleEditItem = (id, text) => {
    setEditingItemId(id);
    setEditedText(text);
  };

  const handleSaveEdit = (id) => {
    if (!editedText.trim()) return;

    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setHighPriorityItems((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingItemId(null);
        setEditedText("");
      })
      .catch((error) => console.error("Error updating item text:", error));
  };

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="max-w-4xl mx-auto p-8 mt-20">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
          High Priority Items
        </h1>

        {/* Loading and Error Handling */}
        {loading && (
          <p className="text-center text-lg mb-8">Loading high priority items... ⏳</p>
        )}
        {error && <p className="text-center text-red-500 mb-8">{error}</p>}

        {/* High Priority Items */}
        {!loading && !error && highPriorityItems.length > 0 ? (
          <motion.div className="space-y-6">
            {highPriorityItems.map((item) => (
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
        ) : (
          !loading && !error && (
            <p className="text-center text-lg mb-8">No high priority items found.</p>
          )
        )}

        {/* Back to Home Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/"
            onClick={() => toast.success("Returning back to Home! 🏠")}
            className="inline-block px-6 py-3 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 hover:opacity-90 shadow-lg transform hover:scale-105 transition duration-300"
          >
            ⬅️ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HighPriorityPage;