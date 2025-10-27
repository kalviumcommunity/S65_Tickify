import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CreateAccountModal = ({ 
  isDarkMode,
  showCreateAccountModal,
  setShowCreateAccountModal,
  handleCreateAccount,
  newAccountData,
  setNewAccountData,
  userAccounts = []
}) => {
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form when modal opens
  useEffect(() => {
    if (showCreateAccountModal) {
      setNewAccountData({
        accountName: "",
        password: "",
        confirmPassword: ""
      });
      setNameError('');
    }
  }, [showCreateAccountModal]);

  // Check for duplicate account names
  useEffect(() => {
    if (!newAccountData.accountName) {
      setNameError('');
      return;
    }

    const accountExists = userAccounts.some(
      acc => acc.accountName?.toLowerCase() === newAccountData.accountName.toLowerCase()
    );

    if (accountExists) {
      setNameError(`An account named "${newAccountData.accountName}" already exists`);
    }
  }, [newAccountData.accountName, userAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (nameError) {
      return; // Don't submit if there's an error
    }

    // Basic validation
    if (!newAccountData.accountName || !newAccountData.password || !newAccountData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newAccountData.password !== newAccountData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newAccountData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleCreateAccount();
      setShowCreateAccountModal(false); // Close on success
    } catch (error) {
      if (error.message.includes("already exists")) {
        setNameError(error.message);
        setNewAccountData(prev => ({ ...prev, accountName: "" }));
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCreateAccountModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className={`p-6 rounded-lg shadow-xl w-full max-w-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{
          position: 'fixed',
          top: '500%', // Keeping your preferred position
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001
        }}
      >
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Create New User
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                User Name
              </label>
              <input
                type="text"
                name="accountName"
                value={newAccountData.accountName}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" 
                    : "bg-white border-gray-300 text-black focus:border-purple-500"
                } ${nameError ? 'border-red-500' : ''}`}
                placeholder="Enter a unique name"
                required
                autoFocus
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={newAccountData.password}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" 
                    : "bg-white border-gray-300 text-black focus:border-purple-500"
                }`}
                placeholder="At least 6 characters"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={newAccountData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" 
                    : "bg-white border-gray-300 text-black focus:border-purple-500"
                }`}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowCreateAccountModal(false)}
              className={`px-4 py-2 rounded ${
                isDarkMode 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded ${
                isSubmitting || nameError
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={isSubmitting || !!nameError}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;