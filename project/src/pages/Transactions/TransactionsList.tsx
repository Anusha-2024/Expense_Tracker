import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { transactionsAPI, categoriesAPI, Transaction, Category } from '../../lib/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import toast from 'react-hot-toast';

const TransactionsList: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      const [transactionsResponse, categoriesResponse] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      
      setTransactions(transactionsResponse.transactions);
      setCategories(categoriesResponse.categories);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTransactions = () => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (transaction.tags && transaction.tags.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category_id.toString() === filterCategory;

      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = (a.category_name || '').localeCompare(b.category_name || '');
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredTransactions(filtered);
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.delete(transactionId);
        await loadData();
        toast.success('Transaction deleted successfully');
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const uniqueCategories = [...new Set(transactions.map(t => ({ id: t.category_id, name: t.category_name || 'Unknown' })))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage all your financial transactions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/add">
            <Button>
              Add Transaction
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-secondary-600">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-secondary-100">
              <ArrowUpRight className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-primary-600">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary-100">
              <ArrowDownRight className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-secondary-600' : 'text-red-600'
              }`}>
                ₹{(totalIncome - totalExpenses).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search />}
          />

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
          />

          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...uniqueCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'date', label: 'Sort by Date' },
              { value: 'amount', label: 'Sort by Amount' },
              { value: 'category', label: 'Sort by Category' },
            ]}
          />

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${transaction.category_color}20` }}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-5 h-5" style={{ color: transaction.category_color }} />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" style={{ color: transaction.category_color }} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.note || 'No description'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-secondary-600' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {transaction.tags && transaction.tags.split(',').slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                      {transaction.tags && transaction.tags.split(',').length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{transaction.tags.split(',').length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {transaction.receipt_url && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`http://localhost:3001${transaction.receipt_url}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {transactions.length === 0 
                ? 'No transactions yet. Start by adding your first transaction!'
                : 'No transactions found matching your criteria.'
              }
            </p>
            {transactions.length === 0 && (
              <Link to="/add" className="text-primary-600 hover:text-primary-500 mt-2 inline-block">
                Add Transaction
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TransactionsList;