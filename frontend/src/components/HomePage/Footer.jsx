import React from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, GitHub } from "react-feather";
import NewsletterForm from "../Newsletter/NewsletterForm";

const Footer = ({ isDarkMode }) => {  // ✅ Receive the prop
  return (
    <motion.footer
      className="py-12 text-white bg-purple-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl px-4 mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About Tickify */}
          <div>
            <h3 className="mb-4 text-xl font-bold">About Tickify</h3>
            <p className="text-gray-300">
              Tickify is your fun and useful checklist app. Never forget your
              keys, phone, or even your pants again! 😄
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
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
            <h3 className="mb-4 text-xl font-bold">Follow Us</h3>
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

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Contact Us</h3>
            <p className="text-sm text-gray-300">
              Email: hello@tickify.com
            </p>
            <p className="mt-2 text-sm text-gray-300">
              Support: support@tickify.com
            </p>
          </div>
        </div>

        {/* Newsletter Component */}
        <div className="mt-12">
          <NewsletterForm isDarkMode={isDarkMode} />  {/* ✅ Now works! */}
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 text-center text-gray-300 border-t border-gray-800">
          <p>© 2025 Tickify ✅. Made with ❤️ and a dash of humor!</p>
          <p className="mt-2 text-sm">
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
