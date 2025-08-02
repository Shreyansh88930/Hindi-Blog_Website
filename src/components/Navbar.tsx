import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User, Home, Info, LogOut, Sparkle, GalleryHorizontal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="src/assets/favicon.jpg" className="h-10 w-10 text-rose-500 group-hover:text-rose-600 transition duration-300" alt="Logo" />
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
              PL Foundation
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              to="/"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                isActive('/')
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>मुख्य पृष्ठ</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                isActive('/about')
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>परिचय</span>
            </Link>

            <Link
              to="/allposts"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                isActive('/allposts')
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <GalleryHorizontal className="h-4 w-4" />
              <span>सभी पोस्ट</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>मीडिया प्रबंधन</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>लॉगआउट</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  isActive('/login')
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <User className="h-4 w-4" />
                <span>लॉगिन</span>
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
