import React, { useState, useEffect } from "react";
import ChecklistItem from "../ChecklistItem/ChecklistItem";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./ChecklistPage.css";

const ChecklistPage = ({ isDarkMode }) => {
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null); // Track which item is being edited
  const [editedText, setEditedText] = useState(""); // Store the edited text

  // Fetch checklist from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/checklists/get")
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
    if (!newItem.trim()) return;

    const newItemObj = { text: newItem, completed: false, priority: "low" };

    fetch("http://localhost:5000/api/checklists/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItemObj),
    })
      .then((res) => res.json())
      .then((data) => {
        setChecklist([...checklist, data]);
        setNewItem(""); // Clear input after adding
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  // Toggle completion status
  const handleToggleComplete = (id, completed) => {
    fetch(`http://localhost:5000/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  // Set priority
  const handleSetPriority = (id, priority) => {
    fetch(`http://localhost:5000/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error("Error updating priority:", error));
  };

  // Delete item
  const handleDeleteItem = (id) => {
    fetch(`http://localhost:5000/api/checklists/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setChecklist((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  // Edit item
  const handleEditItem = (id, text) => {
    setEditingItemId(id); // Set the item being edited
    setEditedText(text); // Set the current text for editing
  };

  // Save edited item
  const handleSaveEdit = (id) => {
    if (!editedText.trim()) return;

    fetch(`http://localhost:5000/api/checklists/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setChecklist((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingItemId(null); // Exit edit mode
        setEditedText(""); // Clear the edited text
      })
      .catch((error) => console.error("Error updating item text:", error));
  };

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
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
                onEdit={() => handleEditItem(item._id, item.text)} // Pass edit handler
                isEditing={editingItemId === item._id} // Check if this item is being edited
                editedText={editedText}
                onTextChange={(e) => setEditedText(e.target.value)} // Handle text change
                onSaveEdit={() => handleSaveEdit(item._id)} // Save edited text
              />
            ))}
          </motion.div>
        )}

        {/* Back to Home Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/"
            className="inline-block px-6 py-3 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 hover:opacity-90 shadow-lg transform hover:scale-105 transition duration-300"
          >
            ⬅️ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;