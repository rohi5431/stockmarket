import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a1128] text-gray-300 py-12 px-6 w-full mx-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr] gap-10 lg:gap-20">
        {/* Left Section */}
        <div className="md:flex-1">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📈</span>
            </div>
            <span className="text-green-400 font-bold text-2xl">Tradevora Pro</span>
          </div>
          <p className="max-w-md text-base leading-relaxed">
            The ultimate virtual trading platform for learning, practicing, and mastering financial markets with real-time data and expert guidance.
          </p>
          <div className="flex space-x-6 mt-5 text-gray-400 text-2xl">
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-white transition">
              <FaGithub />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-white font-bold mb-5 text-lg">Platform</h3>
          <ul className="space-y-3 text-base cursor-pointer">
            <li className="hover:text-white transition">Features</li>
            <li className="hover:text-white transition">Pricing</li>
            <li className="hover:text-white transition">API</li>
            <li className="hover:text-white transition">Documentation</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-white font-bold mb-5 text-lg">Support</h3>
          <ul className="space-y-3 text-base cursor-pointer">
            <li className="hover:text-white transition">Help Center</li>
            <li className="hover:text-white transition">Contact Us</li>
            <li className="hover:text-white transition">Privacy Policy</li>
            <li className="hover:text-white transition">Terms of Service</li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-700 my-10" />

      <p className="text-center text-gray-400 text-base">
        © 2024 Tradevora Pro. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
