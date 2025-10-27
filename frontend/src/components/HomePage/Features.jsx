import React from "react";
import { motion } from "framer-motion";
import { Check, Smile, Bell, Share2, List, Heart } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Features = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Check className="w-12 h-12" />,
      title: "Customizable Checklists",
      description: "Add, edit, and prioritize items with ease",
      action: () => {
        navigate("/checklist");
        toast.success("Let's create your checklist! ✅");
      },
      gradient: "from-blue-500 via-purple-600 to-rose-500"
    },
    {
      icon: <List className="w-12 h-12" />,
      title: "Priority Labels",
      description: "Mark items as high or low priority for better organization",
      action: () => {
        navigate("/high-priority");
        toast.success("Viewing high priority tasks! ⚡");
      },
      gradient: "from-purple-500 via-pink-600 to-red-500"
    },
    {
      icon: <Smile className="w-12 h-12" />,
      title: "Funny Smart Suggestions",
      description: "Get quirky daily suggestions to lighten your day",
      action: () => {
        navigate("/checklist");
        toast("💡 Check out our smart suggestions on the checklist page!", {
          icon: "🎉",
          duration: 4000
        });
      },
      gradient: "from-indigo-500 via-purple-600 to-pink-500"
    },
    {
      icon: <Bell className="w-12 h-12" />,
      title: "Smart Reminders",
      description: "Never forget important items with timely notifications",
      action: () => {
        // Request notification permission
        if ("Notification" in window) {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              navigate("/checklist");
              toast.success("🔔 Smart reminders enabled! Head to your checklist.");
            } else {
              toast.error("Please enable notifications in your browser settings");
            }
          });
        } else {
          navigate("/checklist");
          toast("Visit the checklist page to enable smart reminders!", {
            icon: "🔔"
          });
        }
      },
      gradient: "from-cyan-500 via-blue-600 to-purple-500"
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: "List Sharing",
      description: "Share your lists with friends and family for better coordination",
      action: () => {
        navigate("/checklist");
        toast.success("📤 Create a list to start sharing!");
      },
      gradient: "from-green-500 via-teal-600 to-cyan-500"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Fun & Engaging",
      description: "Stay organized while having fun with Tickify's humorous twist!",
      action: () => {
        navigate("/checklist");
        toast("Let's make task management fun! 🎉", {
          icon: "🚀",
          duration: 3000
        });
      },
      gradient: "from-pink-500 via-rose-600 to-orange-500"
    }
  ];

  return (
    <section
      id="features"
      className={`py-20 px-4 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 bg-clip-text">
            Tickify: Your Ultimate Checklist Companion
          </h2>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } max-w-3xl mx-auto`}
          >
            Discover powerful features designed to make task management fun,
            efficient, and stress-free! 🚀
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={feature.action}
              className="cursor-pointer group"
            >
              <div
                className={`h-full rounded-2xl p-8 shadow-xl transition-all duration-300 bg-gradient-to-br ${feature.gradient} hover:shadow-2xl`}
              >
                {/* Icon */}
                <motion.div
                  className="mb-6 text-white"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-white transition-transform group-hover:scale-105">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mb-4 text-base leading-relaxed text-white/90">
                  {feature.description}
                </p>

                {/* Click Indicator */}
                <motion.div
                  className="flex items-center text-sm font-semibold text-white/80"
                  initial={{ x: 0 }}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Explore →</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link to="/checklist">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 text-xl font-bold text-white transition-all duration-300 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700"
            >
              🚀 Start Creating Your Checklist Now!
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
