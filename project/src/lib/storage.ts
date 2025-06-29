// Local storage utilities for data persistence
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  theme: 'light' | 'dark';
  createdAt: string;
}

export interface Category {
  id: number;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  user_id: string;
  amount: number;
  category_id: number;
  note: string;
  type: 'income' | 'expense';
  tags: string[];
  date: string;
  receipt_url?: string;
  createdAt: string;
}

export interface Budget {
  id: number;
  user_id: string;
  category_id: number;
  amount: number;
  month: string;
  createdAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'expense_tracker_users',
  CATEGORIES: 'expense_tracker_categories',
  TRANSACTIONS: 'expense_tracker_transactions',
  BUDGETS: 'expense_tracker_budgets',
  CURRENT_USER: 'expense_tracker_current_user',
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateNumericId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// User management
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const getCurrentUser = (): User | null => {
  const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!currentUserId) return null;
  
  const users = getUsers();
  return users.find(user => user.id === currentUserId) || null;
};

export const setCurrentUser = (userId: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Categories management
export const getCategories = (userId?: string): Category[] => {
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const allCategories = categories ? JSON.parse(categories) : [];
  
  if (userId) {
    return allCategories.filter((cat: Category) => cat.user_id === userId || cat.user_id === 'default');
  }
  
  return allCategories;
};

export const saveCategory = (category: Category): void => {
  const categories = getCategories();
  const existingIndex = categories.findIndex(c => c.id === category.id);
  
  if (existingIndex >= 0) {
    categories[existingIndex] = category;
  } else {
    categories.push(category);
  }
  
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const initializeDefaultCategories = (): void => {
  const existingCategories = getCategories();
  if (existingCategories.length > 0) return;

  const defaultCategories: Category[] = [
    { id: 1, user_id: 'default', name: 'Salary', type: 'income', icon: 'DollarSign', color: '#10B981', createdAt: new Date().toISOString() },
    { id: 2, user_id: 'default', name: 'Freelance', type: 'income', icon: 'Briefcase', color: '#3B82F6', createdAt: new Date().toISOString() },
    { id: 3, user_id: 'default', name: 'Investment', type: 'income', icon: 'TrendingUp', color: '#8B5CF6', createdAt: new Date().toISOString() },
    { id: 4, user_id: 'default', name: 'Food & Dining', type: 'expense', icon: 'Coffee', color: '#F97316', createdAt: new Date().toISOString() },
    { id: 5, user_id: 'default', name: 'Rent & Utilities', type: 'expense', icon: 'Home', color: '#EF4444', createdAt: new Date().toISOString() },
    { id: 6, user_id: 'default', name: 'Transportation', type: 'expense', icon: 'Car', color: '#06B6D4', createdAt: new Date().toISOString() },
    { id: 7, user_id: 'default', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#EC4899', createdAt: new Date().toISOString() },
    { id: 8, user_id: 'default', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#84CC16', createdAt: new Date().toISOString() },
    { id: 9, user_id: 'default', name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#F59E0B', createdAt: new Date().toISOString() },
    { id: 10, user_id: 'default', name: 'Travel', type: 'expense', icon: 'Plane', color: '#6366F1', createdAt: new Date().toISOString() },
  ];

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
};

// Transactions management
export const getTransactions = (userId?: string): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const allTransactions = transactions ? JSON.parse(transactions) : [];
  
  if (userId) {
    return allTransactions.filter((t: Transaction) => t.user_id === userId);
  }
  
  return allTransactions;
};

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  const existingIndex = transactions.findIndex(t => t.id === transaction.id);
  
  if (existingIndex >= 0) {
    transactions[existingIndex] = transaction;
  } else {
    transactions.push(transaction);
  }
  
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const deleteTransaction = (transactionId: number): void => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== transactionId);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTransactions));
};

// Budgets management
export const getBudgets = (userId?: string): Budget[] => {
  const budgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  const allBudgets = budgets ? JSON.parse(budgets) : [];
  
  if (userId) {
    return allBudgets.filter((b: Budget) => b.user_id === userId);
  }
  
  return allBudgets;
};

export const saveBudget = (budget: Budget): void => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(b => b.id === budget.id);
  
  if (existingIndex >= 0) {
    budgets[existingIndex] = budget;
  } else {
    budgets.push(budget);
  }
  
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
};

export const deleteBudget = (budgetId: number): void => {
  const budgets = getBudgets();
  const filteredBudgets = budgets.filter(b => b.id !== budgetId);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(filteredBudgets));
};

// Initialize default data
export const initializeApp = (): void => {
  initializeDefaultCategories();
};