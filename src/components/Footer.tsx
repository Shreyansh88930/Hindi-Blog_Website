import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full py-8 px-4 text-center bg-gradient-to-r from-rose-100 via-white to-rose-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16 shadow-inner">
    <div className="flex flex-col items-center space-y-2">
      <span className="text-lg font-semibold text-rose-700 dark:text-rose-300 font-devanagari tracking-wide">
        PL Foundation ब्लॉग
      </span>
      <span className="text-sm text-gray-600 dark:text-gray-400 font-devanagari">
        © {new Date().getFullYear()} सभी अधिकार सुरक्षित।
      </span>
      <div className="flex space-x-4 mt-2">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-500 hover:text-rose-700 transition-colors"
        >
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
          </svg>
        </a>
        <a
          href="mailto:pyarelal50@gmail.com"
          className="text-rose-500 hover:text-rose-700 transition-colors"
          aria-label="Email"
        >
          <svg
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="transition-transform duration-200 hover:scale-110 drop-shadow"
          >
            <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" opacity="0.15" />
            <path d="M12 13.065l-8.485-6.065h16.97zm10.485-7.065h-20.97c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20.97c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm0 2v.511l-10.485 7.489-10.485-7.489v-.511h20.97zm-20.97 12v-9.489l10.485 7.489 10.485-7.489v9.489h-20.97z" />
            <polyline points="4 8 12 14 20 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;