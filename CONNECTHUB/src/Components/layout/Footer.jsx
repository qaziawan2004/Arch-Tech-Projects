import React from 'react';
import { APP_NAME } from '../../utils/constants';

// ===== FOOTER COMPONENT =====
const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-gray-200 py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} {APP_NAME}. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="/about" className="text-sm text-gray-600 hover:text-blue-600">
              About
            </a>
            <a href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
              Terms
            </a>
            <a href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ===== EXPORT DEFAULT =====
export default Footer;