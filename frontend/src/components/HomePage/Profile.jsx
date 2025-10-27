import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Award,
  Target,
  Flame,
  Edit2,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    accountName: '',
    userId: '',
    joinDate: ''
  });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    completionRate: 0,
    streak: 0
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const accountName = localStorage.getItem('accountName');
    const userId = localStorage.getItem('userId');
    const joinDate = localStorage.getItem('joinDate') || new Date().toISOString();

    if (!email) {
      toast.error('Please sign in to view your profile');
      navigate('/signin');
      return;
    }

    setUserData({ 
      email, 
      accountName: accountName || 'Tickify User', 
      userId,
      joinDate 
    });
    setNewAccountName(accountName || 'Tickify User');

    // Calculate stats from localStorage or API
    calculateStats();
  }, [navigate]);

  const calculateStats = () => {
    // Get task reminders
    const reminders = localStorage.getItem('tickify_task_reminders');
    let activeTasks = 0;
    
    if (reminders) {
      try {
        const parsed = JSON.parse(reminders);
        activeTasks = Object.keys(parsed).length;
      } catch (e) {
        console.error('Error parsing reminders:', e);
      }
    }

    // Mock stats for now - you can connect to your backend later
    const totalTasks = 47;
    const completedTasks = 32;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const streak = 7; // Days

    setStats({
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      streak
    });
  };

  const handleUpdateName = () => {
    if (!newAccountName.trim()) {
      toast.error('Account name cannot be empty!');
      return;
    }

    localStorage.setItem('accountName', newAccountName);
    setUserData({ ...userData, accountName: newAccountName });
    setIsEditingName(false);
    toast.success('Account name updated!');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const statCards = [
    {
      icon: CheckCircle2,
      label: 'Completed Tasks',
      value: stats.completedTasks,
      color: 'from-green-500 to-emerald-500',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
    },
    {
      icon: Clock,
      label: 'Active Tasks',
      value: stats.activeTasks,
      color: 'from-blue-500 to-cyan-500',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    {
      icon: Target,
      label: 'Total Tasks',
      value: stats.totalTasks,
      color: 'from-purple-500 to-pink-500',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: `${stats.streak} days`,
      color: 'from-orange-500 to-red-500',
      bgColor: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} pt-24 px-4 pb-12`}>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-8`}
        >
          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Avatar */}
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white rounded-full shadow-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
                {getInitials(userData.accountName)}
              </div>
              <div className="absolute p-2 bg-green-500 rounded-full shadow-lg -bottom-2 -right-2">
                <CheckCircle2 className="text-white" size={24} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center gap-3 mb-2 md:justify-start">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      className={`px-3 py-2 rounded-lg text-2xl font-bold ${
                        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={handleUpdateName}
                      className="p-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNewAccountName(userData.accountName);
                      }}
                      className="p-2 text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData.accountName}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className={`p-2 rounded-lg ${
                        isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      } transition`}
                    >
                      <Edit2 size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Mail size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userData.email}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Calendar size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Member since {formatDate(userData.joinDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Completion Rate Badge */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.completionRate / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.completionRate}%
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} ${
                  isDarkMode ? 'bg-opacity-20' : ''
                } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl p-8`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-yellow-500" size={32} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Achievements
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'First Task', emoji: '🎯', unlocked: true },
              { name: 'Week Warrior', emoji: '⚡', unlocked: stats.streak >= 7 },
              { name: 'Task Master', emoji: '🏆', unlocked: stats.completedTasks >= 25 },
              { name: 'Speed Demon', emoji: '🚀', unlocked: false }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-center transition-all ${
                  achievement.unlocked
                    ? isDarkMode
                      ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-600'
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400'
                    : isDarkMode
                    ? 'bg-gray-800 opacity-50'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="mb-2 text-4xl">{achievement.emoji}</div>
                <p className={`text-sm font-semibold ${
                  achievement.unlocked
                    ? isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          <button
            onClick={() => navigate('/checklist')}
            className="px-6 py-3 font-semibold text-white transition-all bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg"
          >
            View My Tasks
          </button>
          <button
            onClick={() => navigate('/settings')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Edit Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
