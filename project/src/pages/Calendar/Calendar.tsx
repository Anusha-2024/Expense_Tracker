import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getCategories, Transaction, Category } from '../../lib/storage';
import { transactionsAPI } from '../../lib/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface TransactionWithCategory extends Transaction {
  category: Category;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  transactions: TransactionWithCategory[];
  totalIncome: number;
  totalExpenses: number;
}

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const transactionsResponse = await transactionsAPI.getAll();
      const userTransactions = transactionsResponse.transactions;
      const categories = getCategories();
      
      const transactionsWithCategories = userTransactions.map((transaction: any) => {
        const category = categories.find(cat => cat.id === transaction.category_id);
        return {
          ...transaction,
          category: category || { 
            id: 0, 
            user_id: '', 
            name: 'Unknown', 
            type: transaction.type, 
            icon: 'Help', 
            color: '#6B7280', 
            createdAt: '' 
          }
        };
      });

      setTransactions(transactionsWithCategories);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dayTransactions = getTransactionsForDate(date);
      days.push({
        date,
        isCurrentMonth: false,
        transactions: dayTransactions,
        totalIncome: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTransactions = getTransactionsForDate(date);
      days.push({
        date,
        isCurrentMonth: true,
        transactions: dayTransactions,
        totalIncome: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dayTransactions = getTransactionsForDate(date);
      days.push({
        date,
        isCurrentMonth: false,
        transactions: dayTransactions,
        totalIncome: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    
    return days;
  };

const getTransactionsForDate = (date: Date): TransactionWithCategory[] => {
  return transactions.filter(t => {
    const txnDate = new Date(t.date);
    return (
      txnDate.getFullYear() === date.getFullYear() &&
      txnDate.getMonth() === date.getMonth() &&
      txnDate.getDate() === date.getDate()
    );
  });
};


  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDay(null);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View your transactions by date</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-48 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" onClick={() => navigateMonth('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    p-2 min-h-24 border rounded-lg cursor-pointer transition-all
                    ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                    ${isToday(day.date) ? 'ring-2 ring-primary-500' : 'border-gray-200'}
                    ${selectedDay?.date.toDateString() === day.date.toDateString() ? 'bg-primary-50 border-primary-300' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    {day.date.getDate()}
                  </div>
                  
                  {day.transactions.length > 0 && (
                    <div className="space-y-1">
                      {day.totalIncome > 0 && (
                        <div className="flex items-center text-xs text-secondary-600">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          ${day.totalIncome.toFixed(0)}
                        </div>
                      )}
                      {day.totalExpenses > 0 && (
                        <div className="flex items-center text-xs text-red-600">
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                          ${day.totalExpenses.toFixed(0)}
                        </div>
                      )}
                      {day.transactions.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{day.transactions.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Selected Day Details */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDay 
                ? selectedDay.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'Select a date'
              }
            </h3>

            {selectedDay ? (
              selectedDay.transactions.length > 0 ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary-50 rounded-lg">
                      <p className="text-sm text-gray-600">Income</p>
                      <p className="text-lg font-semibold text-secondary-600">
                        ${selectedDay.totalIncome.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Expenses</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${selectedDay.totalExpenses.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Transactions</h4>
                    {selectedDay.transactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${transaction.category.color}20` }}
                          >
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="w-4 h-4" style={{ color: transaction.category.color }} />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" style={{ color: transaction.category.color }} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {transaction.note || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.category.name}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-secondary-600' : 'text-gray-900'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No transactions on this date</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Click on a date to view transactions</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;