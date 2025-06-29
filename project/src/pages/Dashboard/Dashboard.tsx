import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as LucidePieChart,
  Plus,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { transactionsAPI, statsAPI, Transaction } from '../../lib/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import toast from 'react-hot-toast';

interface Stats {
  currentMonth: {
    income: number;
    expenses: number;
    balance: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
    balance: number;
  };
  categoryExpenses: Array<{
    name: string;
    color: string;
    total: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [transactionsResponse, statsResponse] = await Promise.all([
        transactionsAPI.getAll(),
        statsAPI.getStats()
      ]);

      setTransactions(transactionsResponse.transactions);
      setStats(statsResponse);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  };

  const calculateMonthlyChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {change >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-secondary-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ml-1 ${
                change >= 0 ? 'text-secondary-600' : 'text-red-600'
              }`}
            >
              {Math.abs(change).toFixed(1)}% from last month
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const recentTransactions = getRecentTransactions();
  const balanceChange = calculateMonthlyChange(stats.currentMonth.balance, stats.previousMonth.balance);
  const incomeChange = calculateMonthlyChange(stats.currentMonth.income, stats.previousMonth.income);
  const expenseChange = calculateMonthlyChange(stats.currentMonth.expenses, stats.previousMonth.expenses);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your financial overview</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          value={`₹${stats.currentMonth.balance.toLocaleString()}`}
          change={balanceChange}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-primary-500"
        />
        <StatCard
          title="Total Income"
          value={`₹${stats.currentMonth.income.toLocaleString()}`}
          change={incomeChange}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-secondary-500"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${stats.currentMonth.expenses.toLocaleString()}`}
          change={expenseChange}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="bg-accent-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Distribution */}
<Card>
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-gray-900">Expense Distribution</h3>
    <LucidePieChart className="w-5 h-5 text-gray-400" />
  </div>

  {stats.categoryExpenses.length > 0 ? (
    <>
      {/* Enforce full width and fixed height */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={stats.categoryExpenses}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              dataKey="total"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {stats.categoryExpenses.map((entry, index) => {
                let fillColor = entry.color || '#8884d8';
                if (!fillColor.startsWith('#')) fillColor = '#' + fillColor;
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {stats.categoryExpenses.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color.startsWith('#') ? item.color : `#${item.color}` }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">
              ₹{item.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="h-64 flex items-center justify-center text-gray-500">
      No expense data available
    </div>
  )}
</Card>

        {/* Monthly Trends */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Link to="/transactions">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${transaction.category_color}20` }}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5" style={{ color: transaction.category_color }} />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" style={{ color: transaction.category_color }} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.note || 'No description'}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.category_name} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-secondary-600' : 'text-gray-900'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions yet.{' '}
              <Link to="/add" className="text-primary-600 hover:text-primary-500">
                Add your first transaction
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/add">
          <Card hover className="text-center p-6 cursor-pointer">
            <Plus className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900">Add Transaction</h4>
            <p className="text-sm text-gray-500 mt-1">Record income or expense</p>
          </Card>
        </Link>

        <Link to="/budget">
          <Card hover className="text-center p-6 cursor-pointer">
            <TrendingUp className="w-8 h-8 text-secondary-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900">Set Budget</h4>
            <p className="text-sm text-gray-500 mt-1">Manage your spending goals</p>
          </Card>
        </Link>

        <Link to="/export">
          <Card hover className="text-center p-6 cursor-pointer">
            <TrendingDown className="w-8 h-8 text-accent-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-500 mt-1">Download your reports</p>
          </Card>
        </Link>

        <Link to="/profile">
          <Card hover className="text-center p-6 cursor-pointer">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900">Profile Settings</h4>
            <p className="text-sm text-gray-500 mt-1">Manage your account</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
