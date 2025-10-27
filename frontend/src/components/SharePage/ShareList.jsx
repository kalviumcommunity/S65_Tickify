import React, { useState } from "react";
import {
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaReddit,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaXTwitter,
  FaXmark,
} from "react-icons/fa6";
import toast from "react-hot-toast";

const ShareList = ({ isOpen, onClose, checklist = [] }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false); // ✅ Fixed missing state

  // Format the checklist items with status and priority
  const formattedList =
  checklist.length > 0
    ? checklist
        .map((item) => {
          const status = item.completed ? "✅" : "❌";
          const priority = item.priority === "high" ? "⭐" : "☆";
          return `${status} ${priority} ${item.text}`;
        })
        .join("\n")
    : "No checklist items yet! Start creating one on Tickify ✅";

  const shareMessage = `Check out my checklist on Tickify! ✅\n\n${formattedList}`;

  // Sharing URLs
  const whatsappURL = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  const emailSubject = "My Checklist from Tickify ✅";
  const emailBody = `Hey there! 👋\n\nI just created a checklist on Tickify ✅, and I think you'll love it!\n\nHere's what I’ve got:\n\n${formattedList}\n\nCheck it out and start ticking off tasks like a pro! 🚀`;
  const emailURL = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const linkedinURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareMessage)}`;
  const redditURL = `https://www.reddit.com/submit?url=${encodeURIComponent(shareMessage)}`;
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://tickify.com")}`;
  const instagramURL = `https://www.instagram.com/`;
  const telegramURL = `https://web.telegram.org/k/#/im?text=${encodeURIComponent(shareMessage)}`;
  const xURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;

  // Copy link functionality
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareMessage)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard! 📋");
        setTimeout(() => setCopied(false), 2000); // Reset after 2s
      })
      .catch(() => toast.error("Failed to copy link. Please try again."));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg text-center w-96">
        {/* Header with Close Button (X) */}
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex-grow text-center">Share Your List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
          >
            <FaXmark size={24} />
          </button>
        </div>

        {/* Link Section */}
        <div className="mb-4 flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
            {shareMessage}
          </p>
          <button
            onClick={handleCopyLink}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Social Media Icons */}
        <div className="grid grid-cols-4 gap-4">
          <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaWhatsapp size={24} className="text-green-500" />
            <span className="text-xs mt-1">WhatsApp</span>
          </a>
          <a href={emailURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaEnvelope size={24} className="text-blue-500" />
            <span className="text-xs mt-1">Email</span>
          </a>
          <a href={linkedinURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaLinkedin size={24} className="text-blue-700" />
            <span className="text-xs mt-1">LinkedIn</span>
          </a>
          <a href={facebookURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaFacebook size={24} className="text-blue-600" />
            <span className="text-xs mt-1">Facebook</span>
          </a>
          <a href={xURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaXTwitter size={24} className="text-black dark:text-white" />
            <span className="text-xs mt-1">Twitter</span>
          </a>
          <a href={telegramURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaTelegram size={24} className="text-blue-400" />
            <span className="text-xs mt-1">Telegram</span>
          </a>
          <a href={redditURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaReddit size={24} className="text-orange-500" />
            <span className="text-xs mt-1">Reddit</span>
          </a>
          <a href={instagramURL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaInstagram size={24} className="text-pink-500" />
            <span className="text-xs mt-1">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareList;
