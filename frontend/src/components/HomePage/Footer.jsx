import React from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, GitHub } from "react-feather";


const Footer = () => {
  return (
    <motion.footer
      className="bg-purple-900  text-white py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Tickify */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Tickify</h3>
            <p className="text-gray-300">
              Tickify is your fun and useful checklist app. Never forget your
              keys, phone, or even your pants again! 😄
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="text-gray-300">
              <li className="mb-2">
                <a href="#features" className="hover:text-purple-400">
                  Features
                </a>
              </li>
              <li className="mb-2">
                <a href="#how-it-works" className="hover:text-purple-400">
                  How It Works
                </a>
              </li>
              <li className="mb-2">
                <a href="#pricing" className="hover:text-purple-400">
                  Pricing
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="hover:text-purple-400">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-300 hover:text-purple-400"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-purple-400"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-300 hover:text-purple-400"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-300 hover:text-purple-400"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com"
                className="text-gray-300 hover:text-purple-400"
              >
                <GitHub className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <form
              className="flex"
              onSubmit={(e) => e.preventDefault()} // Prevents page reload
            >
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-full focus:outline-none text-black"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded-r-full hover:bg-purple-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>© 2025 Tickify ✅. Made with ❤️ and a dash of humor!</p>
          <p className="text-sm mt-2">
            {" "}
            ✨ "Thank you for visiting! We appreciate your support and hope you
            have a great experience. 🚀 Thanks for checking out Tickify ✅! Stay
            organized, stay awesome! 🎉"
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
