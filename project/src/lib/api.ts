import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  theme: 'light' | 'dark';
  created_at: string;
}

export interface Category {
  id: number;
  user_id?: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  category_id: number;
  note: string;
  type: 'income' | 'expense';
  tags: string;
  date: string;
  receipt_url?: string;
  created_at: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  category_type?: string;
}

export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  month: string;
  created_at: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

// Auth API
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  signin: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (data: { name: string; email: string; theme?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: { name: string; type: 'income' | 'expense'; icon: string; color: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post('/transactions', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

// Budgets API
export const budgetsAPI = {
  getAll: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },

  create: async (data: { category_id: number; amount: number; month: string }) => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  update: async (id: number, data: { category_id: number; amount: number; month: string }) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

// Stats API
export const statsAPI = {
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;