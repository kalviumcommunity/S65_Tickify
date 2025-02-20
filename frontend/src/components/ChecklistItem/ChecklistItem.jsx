import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Trash2 } from "react-feather";

const ChecklistItem = ({ item, onToggleComplete, onSetPriority, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex justify-between items-center px-5 py-4 rounded-lg shadow-md transition-all duration-300 bg-white !bg-white"
      style={{ backgroundColor: item.backgroundColor || "white" }} // Ensure white BG
    >
      <div className="flex items-center gap-4">
        {/* ✅ Circular Tick Button */}
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
            item.completed ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onToggleComplete(item.id)}
        >
          {item.completed ? (
            <CheckCircle size={26} />
          ) : (
            <Circle size={26} />
          )}
        </button>

        <span className={`text-lg ${item.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
          {item.text}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* ⭐ Priority Button */}
        <button
          className={`text-2xl transition-all duration-300 ${
            item.priority === "high" ? "text-yellow-500" : "text-gray-400"
          }`}
          onClick={() => onSetPriority(item.id, item.priority === "high" ? "low" : "high")}
        >
          {item.priority === "high" ? "⭐" : "☆"}
        </button>

        {/* 🗑️ Delete Button */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          className="text-red-500 hover:text-red-700 transition-all"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChecklistItem;
