import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Tag, 
  Calendar, 
  Upload,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { categoriesAPI, transactionsAPI, Category } from '../../lib/api';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Card from '../../components/UI/Card';
import toast from 'react-hot-toast';

const AddTransaction: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    receipt: null as File | null,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const getFilteredCategories = () => {
    return categories.filter(cat => cat.type === formData.type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add transactions');
      return;
    }

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('category_id', formData.category);
      formDataToSend.append('note', formData.note);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('date', formData.date);
      
      if (formData.receipt) {
        formDataToSend.append('receipt', formData.receipt);
      }

      await transactionsAPI.create(formDataToSend);
      
      toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      navigate('/transactions');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add transaction';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, receipt: file }));
    }
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
          <p className="text-gray-600 mt-1">Record your income or expense</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus className="w-6 h-6 mx-auto mb-2 text-secondary-600" />
                <span className="font-medium">Income</span>
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Minus className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <span className="font-medium">Expense</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <Input
              type="number"
              step="0.01"
              label="Amount (₹)"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              icon={null}
              required
            />

            {/* Category */}
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              options={[
                { value: '', label: 'Select a category' },
                ...filteredCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              icon={<Calendar />}
              required
            />

            {/* Tags */}
            <Input
              type="text"
              label="Tags (optional)"
              placeholder="personal, work, etc."
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              icon={<Tag />}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add a note about this transaction..."
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              className="block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200 focus:border-primary-500 focus:ring-primary-500 focus:ring-1"
            />
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Receipt (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.receipt ? formData.receipt.name : 'Click to upload receipt'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Add {formData.type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddTransaction;