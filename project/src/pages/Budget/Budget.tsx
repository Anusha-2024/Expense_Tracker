import AddBudget from './Addbudget';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getBudgets, 
  saveBudget, 
  deleteBudget, 
  getCategories, 
  generateNumericId,
  Budget as BudgetType,
  Category 
} from '../../lib/storage';
import { transactionsAPI } from '../../lib/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

interface BudgetWithCategory extends BudgetType {
  category: Category;
  spent: number;
  remaining: number;
  percentage: number;
}

const Budget: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BudgetWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetWithCategory | null>(null);
  interface FormData {
    categoryId: string;
    amount: string;
    month: string;
  }

  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  });

  useEffect(() => {
    if (user) {
      loadBudgets();
      loadCategories();
    }
  }, [user]);

  const loadCategories = () => {
    const allCategories = getCategories();
    const expenseCategories = allCategories.filter(cat => cat.type === 'expense');
    setCategories(expenseCategories);
  };

  const loadBudgets = async () => {
    try {
      console.log('Loading budgets for user:', user?.id);
      const userBudgets = getBudgets(String(user?.id ?? ''));
      console.log('User budgets loaded:', userBudgets);
      const allCategories = getCategories();

      // Fetch transactions from API
      const transactionsResponse = await transactionsAPI.getAll();
      const userTransactions = transactionsResponse.transactions;

      const budgetsWithData = userBudgets.map((budget: BudgetType) => {
        const category = allCategories.find(cat => cat.id === budget.category_id);
        
        // Calculate spent amount for this category in this month
        const budgetDate = new Date(budget.month + '-01');
        const spent = userTransactions
          .filter((t: any) => 
            t.type === 'expense' && 
            t.category_id === budget.category_id &&
            new Date(t.date).getMonth() === budgetDate.getMonth() &&
            new Date(t.date).getFullYear() === budgetDate.getFullYear()
          )
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
          ...budget,
          category: category || { 
            id: 0, 
            user_id: 'default', 
            name: 'Unknown', 
            type: 'expense' as const, 
            icon: 'Help', 
            color: '#6B7280', 
            createdAt: '' 
          },
          spent,
          remaining,
          percentage,
        };
      });

      setBudgets(budgetsWithData);
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast.error('Failed to load budgets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Removed debug alert
    
    if (!formData.categoryId || !formData.amount || !formData.month) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const budget: BudgetType = {
        id: editingBudget?.id || generateNumericId(),
        user_id: String(user.id),
        category_id: parseInt(formData.categoryId),
        amount: parseFloat(formData.amount),
        month: formData.month,
        createdAt: editingBudget?.createdAt || new Date().toISOString(),
      };

      console.log('Saving budget:', budget);
      saveBudget(budget);
      loadBudgets();
      
      toast.success(editingBudget ? 'Budget updated successfully!' : 'Budget created successfully!');
      resetForm();
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  const handleEdit = (budget: BudgetWithCategory) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.category_id.toString(),
      amount: budget.amount.toString(),
      month: budget.month ? String(budget.month) : '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (budgetId: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        deleteBudget(budgetId);
        loadBudgets();
        toast.success('Budget deleted successfully');
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      month: new Date().toISOString().slice(0, 7),
    });
    setEditingBudget(null);
    setShowAddForm(false);
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-secondary-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (percentage >= 80) return <TrendingUp className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-secondary-500" />;
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600 mt-1">Set and track your spending goals</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                ₹{totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary-100">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${
                totalRemaining >= 0 ? 'text-secondary-600' : 'text-red-600'
              }`}>
                ₹{totalRemaining.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-secondary-100">
              <TrendingUp className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add/Edit Budget Form */}
      {showAddForm && (
        <AddBudget
          categories={categories}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingBudget}
        />
      )}

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${budget.category.color}20` }}
                    >
                      {getStatusIcon(budget.percentage)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {budget.category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(budget.month + '-01').toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(budget.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                  <div className="space-y-3 max-w-full">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">Spent: ₹{budget.spent.toFixed(2)}</span>
                    <span className="text-gray-600 truncate">Budget: ₹{budget.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="w-full max-w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(budget.percentage)}`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${
                      budget.percentage >= 100 ? 'text-red-600' : 
                      budget.percentage >= 80 ? 'text-yellow-600' : 'text-secondary-600'
                    }`}>
                      {budget.percentage.toFixed(1)}% used
                    </span>
                    <span className={`text-sm font-medium ${
                      budget.remaining >= 0 ? 'text-secondary-600' : 'text-red-600'
                    }`}>
                      ₹{Math.abs(budget.remaining).toFixed(2)} {budget.remaining >= 0 ? 'remaining' : 'over budget'}
                    </span>
                  </div>
                  {budget.percentage >= 100 && (
                    <div className="mt-1 text-sm font-semibold text-green-700">
                      Completed
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first budget to track your spending goals.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Budget
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Budget;
