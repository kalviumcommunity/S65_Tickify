import React from "react";
import { motion } from "framer-motion";

const PasswordModal = ({ isOpen, onClose, onSubmit, password, setPassword, isDarkMode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg w-96`}
        style={{
          position: 'fixed',
          top: '500%',
          left: '40.3%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-lg font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Enter Password
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-2 border rounded mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          placeholder="Enter your password"
          autoFocus
        />
        <div className="flex justify-center gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordModal;