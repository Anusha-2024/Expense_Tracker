import React, { createContext, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { getBudgets } from '../lib/storage';

const NotificationContext = createContext({});

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkNotifications = () => {
      const budgets = getBudgets(String(user.id));
      const lowBalanceThreshold = 1000; // Example threshold for low balance
      // TODO: Fetch current balance from API or context
      // For demo, assume balance is 5000
      const currentBalance = 5000;

      budgets.forEach((budget: any) => {
        const spent = (budget as any).spent || 0;
        const remaining = budget.amount - spent;
        const percentageUsed = (spent / budget.amount) * 100;

        if (percentageUsed >= 90 && percentageUsed < 100) {
          toast('Budget for category ' + budget.category_id + ' is almost full (' + percentageUsed.toFixed(0) + '%)', { icon: '⚠️' });
        } else if (percentageUsed >= 100) {
          toast.error('Budget for category ' + budget.category_id + ' exceeded!');
        }
      });

      if (currentBalance <= lowBalanceThreshold) {
        toast.error('Your account balance is low!');
      }
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [user]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};
