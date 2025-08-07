import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShoppingCart, FaClipboardList } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <FaBox className="text-white text-xs" />
              </div>
              <span className="text-lg font-bold">TechGadgets</span>
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaFacebook className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaTwitter className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaInstagram className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  <FaShoppingCart className="text-xs" />
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2">
                  <FaClipboardList className="text-xs" />
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              © 2024 TechGadgets. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white text-xs transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white text-xs transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 