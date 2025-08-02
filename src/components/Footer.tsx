// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full py-6 text-center bg-white/70 dark:bg-gray-900/70 border-t border-gray-100 dark:border-gray-700 mt-12">
    <span className="text-sm text-gray-500 dark:text-gray-400 font-devanagari">
      © {new Date().getFullYear()} प्रेरणा ब्लॉग. सभी अधिकार सुरक्षित।
    </span>
  </footer>
);

export default Footer;
