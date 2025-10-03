import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#e6f2ff] text-gray-700 py-12 px-6 w-full mx-auto border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr] gap-10 lg:gap-20">
        {/* Left Section */}
        <div className="md:flex-1">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 bg-blue-500 p-1 rounded flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📈</span>
            </div>
            <span className="text-blue-700 font-bold text-2xl">Tradevora Pro</span>
          </div>
          <p className="max-w-md text-base leading-relaxed text-gray-600">
            The ultimate virtual trading platform for learning, practicing, and mastering financial markets with real-time data and expert guidance.
          </p>
          <div className="flex space-x-6 mt-5 text-gray-600 text-2xl">
            <a href="#" aria-label="Twitter" className="hover:text-blue-600 transition">
              <FaTwitter />
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-blue-600 transition">
              <FaGithub />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-600 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-blue-700 font-bold mb-5 text-lg">Platform</h3>
          <ul className="space-y-3 text-base cursor-pointer">
            <li className="hover:text-blue-500 transition">Features</li>
            <li className="hover:text-blue-500 transition">Pricing</li>
            <li className="hover:text-blue-500 transition">API</li>
            <li className="hover:text-blue-500 transition">Documentation</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-blue-700 font-bold mb-5 text-lg">Support</h3>
          <ul className="space-y-3 text-base cursor-pointer">
            <li className="hover:text-blue-500 transition">Help Center</li>
            <li className="hover:text-blue-500 transition">Contact Us</li>
            <li className="hover:text-blue-500 transition">Privacy Policy</li>
            <li className="hover:text-blue-500 transition">Terms of Service</li>
          </ul>
        </div>
      </div>

      <hr className="border-blue-200 my-10" />

      <p className="text-center text-gray-600 text-base">
        © {new Date().getFullYear()} Tradevora Pro. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
