import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Trash2, Edit, Save, ChevronDown } from "react-feather";

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
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  // Priority configuration
  const priorityOptions = [
    { value: 'low', label: 'Low', emoji: '🟢', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', emoji: '🟡', color: 'text-yellow-500' },
    { value: 'high', label: 'High', emoji: '🔴', color: 'text-red-500' }
  ];

  const currentPriority = priorityOptions.find(p => p.value === (item.priority || 'low')) || priorityOptions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className="relative p-1 mb-4 rounded-2xl" // ⭐ Removed overflow-hidden
      style={{
        background:
          item.completed
            ? "linear-gradient(135deg, #10b981, #14b8a6, #06b6d4)"
            : item.priority === "high"
            ? "linear-gradient(135deg, #ef4444, #f43f5e, #ec4899)"
            : item.priority === "medium"
            ? "linear-gradient(135deg, #f59e0b, #f97316, #fb923c)"
            : "linear-gradient(135deg, #8b5cf6, #a855f7, #d946ef)",
        zIndex: showPriorityMenu ? 100 : 1, // ⭐ Higher z-index when menu is open
      }}
    >
      {/* Content Wrapper */}
      <div
        className={`relative flex items-center gap-4 p-4 rounded-xl ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* ✅ Circular Tick Button */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleComplete}
          className="flex-shrink-0"
        >
          {item.completed ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <Circle className="w-8 h-8 text-gray-400" />
          )}
        </motion.button>

        {/* Item Text or Edit Input */}
        <div className="flex-1 ml-2">
          {isEditing ? (
            <input
              type="text"
              value={editedText}
              onChange={onTextChange}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-50 text-gray-900 border-gray-300"
              }`}
              autoFocus
            />
          ) : (
            <span
              className={`text-lg font-medium ${
                item.completed
                  ? "line-through opacity-60"
                  : isDarkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {item.text}
            </span>
          )}
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-3">
          {/* ⭐ Priority Dropdown */}
          <div className="relative" style={{ zIndex: showPriorityMenu ? 200 : 10 }}> {/* ⭐ Super high z-index */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="text-xl">{currentPriority.emoji}</span>
              <span className={`text-sm font-semibold ${currentPriority.color}`}>
                {currentPriority.label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </motion.button>

            {/* Priority Menu - ⭐ FIXED POSITIONING */}
            <AnimatePresence>
              {showPriorityMenu && (
                <>
                  {/* Invisible backdrop to close menu when clicking outside */}
                  <div
                    className="fixed inset-0"
                    style={{ zIndex: 150 }}
                    onClick={() => setShowPriorityMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-40 rounded-lg shadow-2xl ${
                      isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                    style={{ zIndex: 200 }} // ⭐ Very high z-index
                  >
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => {
                          onSetPriority(priority.value);
                          setShowPriorityMenu(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left transition first:rounded-t-lg last:rounded-b-lg ${
                          item.priority === priority.value
                            ? isDarkMode
                              ? "bg-gray-700"
                              : "bg-gray-100"
                            : isDarkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-xl">{priority.emoji}</span>
                        <span className={`font-semibold ${priority.color}`}>
                          {priority.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* 🗑️ Delete Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-6 h-6" />
          </motion.button>

          {/* ✏️ Edit/Save Button */}
          {isEditing ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSaveEdit}
              className="text-green-500 hover:text-green-600"
            >
              <Save className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-600"
            >
              <Edit className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChecklistItem;
