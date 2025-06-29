import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import { initializeApp } from './lib/storage';

// Landing Page
import Landing from './pages/Landing/Landing';

// Info Pages
import About from './pages/Info/About';
import HelpCenter from './pages/Info/HelpCenter';
import UserGuide from './pages/Info/UserGuide';
import PrivacyPolicy from './pages/Info/PrivacyPolicy';
import TermsOfService from './pages/Info/TermsOfService';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import AddTransaction from './pages/Transactions/AddTransaction';
import TransactionsList from './pages/Transactions/TransactionsList';
import Budget from './pages/Budget/Budget';
import Calendar from './pages/Calendar/Calendar';
import Profile from './pages/Profile/Profile';
import Export from './pages/Export/Export';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Pages - No Layout */}
            <Route path="/" element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } />
            
            {/* Info Pages - No Layout */}
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/guide" element={<UserGuide />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Auth Pages - No Layout */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            {/* Protected Pages - With Layout */}
            <Route path="/dashboard" element={
              <Layout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/add" element={
              <Layout>
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/transactions" element={
              <Layout>
                <ProtectedRoute>
                  <TransactionsList />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/budget" element={
              <Layout>
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/calendar" element={
              <Layout>
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/export" element={
              <Layout>
                <ProtectedRoute>
                  <Export />
                </ProtectedRoute>
              </Layout>
            } />
            
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


