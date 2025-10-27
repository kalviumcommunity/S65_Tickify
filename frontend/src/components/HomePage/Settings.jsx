import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Lock, 
  Trash2, 
  Download,
  Upload,
  Shield,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Settings = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    accountName: '',
    userId: ''
  });
  const [activeTab, setActiveTab] = useState('account');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const accountName = localStorage.getItem('accountName');
    const userId = localStorage.getItem('userId');

    if (!email) {
      toast.error('Please sign in to access settings');
      navigate('/signin');
      return;
    }

    setUserData({ email, accountName: accountName || 'Main Account', userId });
  }, [navigate]);

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters!');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: userData.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordChange(false);
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Error changing password. Please try again.');
    }
  };

  const handleExportData = () => {
    const allData = {
      email: localStorage.getItem('userEmail'),
      accountName: localStorage.getItem('accountName'),
      taskReminders: localStorage.getItem('tickify_task_reminders'),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickify-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully!');
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ This will clear all your local data including reminders. Are you sure?')) {
      localStorage.removeItem('tickify_task_reminders');
      toast.success('Local data cleared!');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete your account and all data. This cannot be undone!\n\nType "DELETE" to confirm.'
    );

    if (!confirmed) return;

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/users/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: userData.email })
      });

      if (response.ok) {
        localStorage.clear();
        toast.success('Account deleted successfully');
        navigate('/');
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error) {
      toast.error('Error deleting account. Please try again.');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: isDarkMode ? Moon : Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} pt-24 px-4 pb-12`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-8 shadow-lg`}>
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Account Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        } cursor-not-allowed`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={userData.accountName}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        } cursor-not-allowed`}
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="flex items-center gap-2 px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        <Lock size={18} />
                        Change Password
                      </button>

                      {showPasswordChange && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 space-y-4"
                        >
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className={`w-full px-4 py-3 rounded-lg ${
                                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute transform -translate-y-1/2 right-3 top-1/2"
                              >
                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className={`w-full px-4 py-3 rounded-lg ${
                                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute transform -translate-y-1/2 right-3 top-1/2"
                              >
                                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={`w-full px-4 py-3 rounded-lg ${
                                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute transform -translate-y-1/2 right-3 top-1/2"
                              >
                                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={handlePasswordChange}
                              className="flex items-center gap-2 px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                            >
                              <Save size={18} />
                              Save Password
                            </button>
                            <button
                              onClick={() => {
                                setShowPasswordChange(false);
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
                            >
                              <X size={18} />
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Appearance
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Dark Mode
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Toggle between light and dark themes
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          toggleDarkMode();
                          toast.success(`Switched to ${isDarkMode ? 'Light' : 'Dark'} Mode!`);
                        }}
                        className={`relative inline-flex h-12 w-20 items-center rounded-full transition ${
                          isDarkMode ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-8 w-8 transform rounded-full bg-white transition ${
                            isDarkMode ? 'translate-x-10' : 'translate-x-2'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Browser Notifications
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage notification permissions in your checklist page using the System Alarms card.
                      </p>
                      <button
                        onClick={() => navigate('/checklist')}
                        className="px-4 py-2 mt-3 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        Go to Checklist
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Data Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Privacy & Data
                  </h2>

                  <div className="space-y-4">
                    <button
                      onClick={handleExportData}
                      className="flex items-center w-full gap-3 p-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Download size={20} />
                      <div className="text-left">
                        <h3 className="font-semibold">Export Your Data</h3>
                        <p className="text-sm opacity-90">Download all your data as JSON</p>
                      </div>
                    </button>

                    <button
                      onClick={handleClearAllData}
                      className="flex items-center w-full gap-3 p-4 text-white transition bg-yellow-600 rounded-lg hover:bg-yellow-700"
                    >
                      <Trash2 size={20} />
                      <div className="text-left">
                        <h3 className="font-semibold">Clear Local Data</h3>
                        <p className="text-sm opacity-90">Remove all reminders and cached data</p>
                      </div>
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center w-full gap-3 p-4 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={20} />
                      <div className="text-left">
                        <h3 className="font-semibold">Delete Account</h3>
                        <p className="text-sm opacity-90">Permanently delete your account and all data</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
