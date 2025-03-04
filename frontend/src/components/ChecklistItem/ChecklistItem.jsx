import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Trash2, Edit, Save } from "react-feather";

const ChecklistItem = ({
  item,
  isDarkMode,
  onToggleComplete,
  onSetPriority,
  onDelete,
  onEdit,
  isEditing,
  editedText,
  onTextChange,
  onSaveEdit,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative p-4 flex justify-between items-center shadow-md transition-all duration-300"
      style={{
        position: "relative",
        borderRadius: "16px", // Consistent border-radius
        overflow: "hidden", // Ensures border-radius applies correctly
      }}
    >
      {/* Gradient Border (Pseudo-element method) */}
      <div
        style={{
          content: '""',
          position: "absolute",
          inset: 0,
          padding: "0px", // Matches border width
          borderRadius: "inherit", // Inherits the border-radius
          background: "linear-gradient(to right, #3b82f6, #9333ea, #f43f5e)",
          zIndex: -1,
          maskImage: "linear-gradient(white, white)", // Ensures background-clip works properly
          WebkitMaskImage: "linear-gradient(white, white)",
        }}
      />

      {/* Content Wrapper (Dynamic background based on isDarkMode) */}
      <div
        className={`w-full flex justify-between items-center p-3 rounded-[16px] ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
        }`}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ✅ Circular Tick Button */}
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
            item.completed ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={onToggleComplete}
        >
          {item.completed ? <CheckCircle size={26} /> : <Circle size={26} />}
        </button>

        {/* Item Text or Edit Input */}
        <div className="flex-grow ml-4">
          {" "}
          {/* Added margin-left for spacing */}
          {isEditing ? (
            <div
              className="p-2 border-2 transition-all duration-300"
              style={{
                borderRadius: "16px", // Matching outer border-radius
                border: "2px solid #3b82f6", // Border color
                background: isDarkMode ? "gray-800" : "white",
              }}
            >
              <input
                type="text"
                value={editedText}
                onChange={onTextChange}
                className={`w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
                style={{
                  borderRadius: "16px", // Matching inner input border-radius
                  border: "none", // Remove default input border
                }}
              />
            </div>
          ) : (
            <span
              className={`text-lg font-medium transition-all duration-300 ${
                item.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {item.text}
            </span>
          )}
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-3">
          {/* ⭐ Priority Button */}
          <button
            className={`text-2xl transition-all duration-300 ${
              item.priority === "high" ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={onSetPriority}
          >
            {item.priority === "high" ? "⭐" : "☆"}
          </button>

          {/* 🗑️ Delete Button */}
          <motion.button
            whileHover={{ scale: 1.2, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            className="text-red-500 hover:text-red-700 transition-all"
            onClick={onDelete}
          >
            <Trash2 size={24} />
          </motion.button>

          {/* ✏️ Edit Button */}
          {isEditing ? (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-green-500 hover:text-green-700 transition-all"
              onClick={onSaveEdit}
            >
              <Save size={24} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-blue-500 hover:text-blue-700 transition-all"
              onClick={onEdit}
            >
              <Edit size={24} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChecklistItem;