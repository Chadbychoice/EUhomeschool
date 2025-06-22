import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe, Map, Users, Home, LogIn, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuthStore } from '../../stores/authStore';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Generate a default avatar based on user's name
  const getDefaultAvatar = (name: string): string => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=ffffff&size=80&font-size=0.6`;
  };

  const displayAvatar = user?.avatarUrl || (user ? getDefaultAvatar(user.name) : '');

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white bg-opacity-95 shadow-md dark:bg-neutral-900 dark:bg-opacity-95' : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Globe className="text-primary-600 dark:text-primary-400" size={28} />
              <span className="text-xl font-bold font-display text-primary-800 dark:text-primary-200">
                EUhomeschool
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <Home size={18} />
                  <span>Home</span>
                </div>
              </Link>
              <Link 
                to="/destinations" 
                className={`nav-link ${location.pathname.includes('/destinations') ? 'nav-link-active' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <Map size={18} />
                  <span>Destination Guide</span>
                </div>
              </Link>
              <Link 
                to="/community" 
                className={`nav-link ${location.pathname === '/community' ? 'nav-link-active' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <Users size={18} />
                  <span>Community</span>
                </div>
              </Link>
              
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  onClick={toggleDarkMode} 
                  className="p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <img
                        src={displayAvatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {user.name}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1">
                        <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{user.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-2"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          <span>Edit Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Navigation Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 mr-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={toggleMenu}
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                aria-label="Open menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white dark:bg-neutral-900 pt-20 animate-fadeIn">
            <div className="container-custom py-6">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Home size={20} />
                    <span>Home</span>
                  </div>
                </Link>
                <Link 
                  to="/destinations" 
                  className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Map size={20} />
                    <span>Destination Guide</span>
                  </div>
                </Link>
                <Link 
                  to="/community" 
                  className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Users size={20} />
                    <span>Community</span>
                  </div>
                </Link>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
                  {isAuthenticated && user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <img
                          src={displayAvatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">{user.name}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="w-full text-left py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Settings size={20} />
                          <span>Edit Profile</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut size={20} />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full text-left py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <LogIn size={20} />
                        <span>Sign In</span>
                      </div>
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;