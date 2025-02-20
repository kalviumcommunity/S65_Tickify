import React, { useState } from "react";
import ChecklistItem from "../ChecklistItem/ChecklistItem";
import { Link } from "react-router-dom";

const ChecklistPage = ({ isDarkMode }) => {
  // Dummy checklist data
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Don't forget your keys! 🗝️", completed: false, priority: "low" },
    { id: 2, text: "Grab your phone! 📱", completed: false, priority: "high" },
    { id: 3, text: "Wear your pants! 👖", completed: false, priority: "low" },
  ]);

  // Toggle completion status
  const handleToggleComplete = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Set priority
  const handleSetPriority = (id, priority) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priority } : item))
    );
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={`min-h-screen p-8 transition-all duration-300 ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
           Your Customizable Checklist
        </h1>

        {/* Checklist Items */}
        <div className="space-y-4">
          {checklist.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggleComplete={handleToggleComplete}
              onSetPriority={handleSetPriority}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-8">
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
