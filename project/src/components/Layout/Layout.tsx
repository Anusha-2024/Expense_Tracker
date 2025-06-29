import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const isDarkMode = user.theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <main className="pt-20 md:pt-24 pb-20 md:pb-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className={`border-t-4 text-center py-4 text-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-blue-200 border-blue-600 text-gray-600'}`}>
        © 2025 Expense Tracker by Anusha. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;