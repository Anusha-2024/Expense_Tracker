import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI, usersAPI, User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.user);
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.signup({ name, email, password });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.error || 'Failed to create account';
      toast.error(message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.signin({ email, password });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Welcome back!');
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.error || 'Failed to sign in';
      toast.error(message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // In a real app, you would send an email here
      toast.success('Password reset email sent!');
    } catch (error: unknown) {
      toast.error('Failed to send reset email');
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await usersAPI.updateProfile({
        name: userData.name || user?.name || '',
        email: userData.email || user?.email || '',
        theme: userData.theme || user?.theme || 'light',
      });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};