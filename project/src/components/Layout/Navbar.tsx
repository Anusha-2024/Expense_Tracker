import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Plus, 
  Receipt, 
  Target, 
  Calendar, 
  User, 
  Download,
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, updateUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/add', icon: Plus, label: 'Add Transaction' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/budget', icon: Target, label: 'Budget' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/export', icon: Download, label: 'Export' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleTheme = async () => {
    try {
      const newTheme = user?.theme === 'light' ? 'dark' : 'light';
      await updateUser({ theme: newTheme });
    } catch (error) {
      // Handle error if needed
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between w-full">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Expense Track</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {user?.theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Expense Track</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-t border-gray-200 px-4 py-4"
          >
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
