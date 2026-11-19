import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-glowalchemy-charcoal text-white">
      {/* Middle Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 py-12 border-b border-glowalchemy-sand">
        {/* GlowAlchemy */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">GlowAlchemy</h3>
          <p className="text-sm text-glowalchemy-ivory leading-relaxed mb-4">
            Your one-stop shop for amazing products. Quality, style, and affordability all in one place.
          </p>
          <div className="flex space-x-3 text-lg">
            <a href="#" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors duration-200 hover:scale-110 transform">
              <FaFacebookF />
            </a>
            <a href="#" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors duration-200 hover:scale-110 transform">
              <FaYoutube />
            </a>
            <a href="#" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors duration-200 hover:scale-110 transform">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">QUICK LINKS</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Home</Link></li>
            <li><Link to="/ProductListing" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Products</Link></li>
            <li><Link to="/cart" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">CUSTOMER SERVICE</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Contact Us</Link></li>
            <li><Link to="/about" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">About Us</Link></li>
            <li><Link to="/shipping-policy" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Shipping Policy</Link></li>
            <li><Link to="/privacy-policy" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-glowalchemy-ivory hover:text-glowalchemy-terracotta transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-center px-6 py-8">
        {/* Copyright */}
        <p className="text-sm text-glowalchemy-ivory">© 2026 GlowAlchemy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
