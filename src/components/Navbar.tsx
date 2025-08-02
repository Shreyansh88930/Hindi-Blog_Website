import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Heart, User, Home, Info, LogOut } from 'lucide-react';
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
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Heart className="h-8 w-8 text-rose-500 group-hover:text-rose-600 transition-colors" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              प्रेरणा
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400' 
                  : 'text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">मुख्य पृष्ठ</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/about') 
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400' 
                  : 'text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400'
              }`}
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">परिचय</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400' 
                      : 'text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">मीडिया प्रबंधन</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">लॉगआउट</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/login') 
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400' 
                    : 'text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">लॉगिन</span>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;