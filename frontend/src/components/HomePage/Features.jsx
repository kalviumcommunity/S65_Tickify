import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Smile, Bell, Share2, List, Heart } from "react-feather";
import { Link } from "react-router-dom";
import "./logoName.css";
import ShareList from "../SharePage/ShareList";
import toast from "react-hot-toast";

const features = [
  {
    icon: <Check className="w-8 h-8 text-white" />,
    title: "Customizable Checklists",
    description: "Add, edit, and prioritize items with ease",
    link: "/checklist",
  },
  {
    icon: <List className="w-8 h-8 text-white" />,
    title: "Priority Labels",
    description: "Mark items as high or low priority for better organization",
    link: "/high-priority",
  },
  {
    icon: <Smile className="w-8 h-8 text-white" />,
    title: "Funny Smart Suggestions",
    description: "Get quirky daily suggestions to lighten your day",
  },
  {
    icon: <Bell className="w-8 h-8 text-white" />,
    title: "Smart Reminders",
    description: "Never forget important items with timely notifications",
  },
  {
    icon: <Share2 className="w-8 h-8 text-white" />,
    title: "List Sharing",
    description:
      "Share your lists with friends and family for better coordination",
    link: "#",
  },
  {
    icon: <Heart className="w-8 h-8 text-white" />,
    title: "Fun & Engaging",
    description:
      "Stay organized while having fun with Tickify's humorous twist!",
  },
];

const Features = ({ isDarkMode }) => {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [checklist, setChecklist] = useState([]); // Store checklist items

  // Fetch checklist when component mounts (if not already available)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/checklists/get`)
      .then((res) => res.json())
      .then((data) => setChecklist(data))
      .catch((err) => console.error("Error fetching checklist:", err));
  }, []);

  return (
    <div
      className={`relative -mt-1 pt-40 pb-40 z-10 transition-all duration-0 ${
        isDarkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
          Tickify: Your Ultimate Checklist Companion
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              to={feature.link}
              key={index}
              className="block"
              onClick={(e) => {
                if (feature.title === "List Sharing") {
                  e.preventDefault();
                  setShareModalOpen(true);
                  toast.success("Opening Share Options... 📤");
                }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-xl shadow-2xl text-center text-white bg-gradient-to-r from-blue-500 via-purple-600 to-rose-500 min-h-56 flex flex-col justify-between"
              >
                <div className="h-20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <ShareList
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        checklist={checklist}
      />
    </div>
  );
};

export default Features;
