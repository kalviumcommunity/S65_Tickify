import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Zap, Heart, Target, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = ({ isDarkMode }) => {
  const navigate = useNavigate();
  
  // ⭐ Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const features = [
    {
      icon: CheckCircle,
      title: 'Smart Task Management',
      description: 'Organize your tasks with intelligent priority labels and customizable checklists.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Add tasks in seconds with our streamlined interface. No unnecessary clicks or confusion.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Built with care to make your daily planning enjoyable and stress-free.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Share & Collaborate',
      description: 'Share your lists with friends, family, or colleagues. Work together seamlessly.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Stay Focused',
      description: 'System-wide alarm notifications keep you on track even when using other apps.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Award,
      title: 'Achieve More',
      description: 'Track your progress and celebrate your accomplishments with our achievement system.',
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500K+', label: 'Tasks Completed' },
    { number: '99%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Always Available' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative px-6 py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block p-4 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="mb-6 text-5xl font-extrabold md:text-6xl">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Tickify</span>
          </h1>
          
          <p className="mb-8 text-xl opacity-90">
            Your ultimate checklist companion that makes task management fun, efficient, and stress-free! 🚀
          </p>

          {/* ⭐ UPDATED: Conditional buttons based on login status */}
          <div className="flex justify-center gap-4">
            {isLoggedIn ? (
              // Show "Go to Dashboard" for logged-in users
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checklist')}
                className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl"
              >
                Go to Dashboard →
              </motion.button>
            ) : (
              // Show "Sign Up" and "Try for Free" for guests
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl"
                >
                  Sign Up Free →
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/checklist')}
                  className={`px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 border-2 ${
                    isDarkMode 
                      ? 'border-white text-white hover:bg-white hover:text-gray-900' 
                      : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  Try for Free
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Story Section */}
      <div className="max-w-4xl px-6 py-16 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}
        >
          <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
          <p className="mb-4 text-lg leading-relaxed opacity-90">
            Tickify was born from a simple idea: <strong>task management shouldn't be complicated</strong>. We noticed that most to-do apps were either too complex with features nobody used, or too simple to be actually helpful.
          </p>
          <p className="mb-4 text-lg leading-relaxed opacity-90">
            So we built Tickify - a <strong>perfect balance</strong> between simplicity and functionality. Whether you're planning your day, managing a project, or just trying to remember to buy milk, Tickify makes it <strong>easy and enjoyable</strong>.
          </p>
          <p className="text-lg leading-relaxed opacity-90">
            With features like <strong>smart reminders</strong>, <strong>priority labels</strong>, <strong>funny suggestions</strong>, and <strong>collaboration tools</strong>, Tickify helps you stay organized without the overwhelm.
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16">
        <div className="grid max-w-6xl grid-cols-2 gap-8 mx-auto md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 text-center rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}
            >
              <div className="mb-2 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {stat.number}
              </div>
              <div className="text-sm opacity-70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-4xl font-bold text-center">Why Choose Tickify?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                  <div className={`inline-block p-3 mb-4 rounded-lg bg-gradient-to-br ${feature.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="opacity-70">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`max-w-4xl mx-auto p-12 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl text-center`}
        >
          <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
          <p className="mb-6 text-xl leading-relaxed">
            To help people accomplish more by making task management <strong>simple, fun, and effective</strong>.
          </p>
          <p className="text-lg opacity-70">
            We believe productivity tools should enhance your life, not complicate it.
          </p>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl p-12 mx-auto text-center bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mb-8 text-xl text-white opacity-90">
            Join thousands of users who are already staying organized with Tickify!
          </p>
          
          {/* ⭐ UPDATED: Conditional CTA buttons */}
          <div className="flex justify-center gap-4">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checklist')}
                className="px-8 py-4 text-lg font-bold text-purple-600 transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl"
              >
                Continue to Dashboard →
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 text-lg font-bold text-purple-600 transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl"
                >
                  Create Free Account
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/checklist')}
                  className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 border-2 border-white rounded-full hover:bg-white hover:text-purple-600"
                >
                  Try as Guest
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
