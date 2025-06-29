import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions, getCategories } from '../../lib/storage';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import Input from '../../components/UI/Input';
import toast from 'react-hot-toast';

const Export: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    categories: 'all',
    transactionType: 'all',
  });

  const handleExport = async () => {
    if (!user) {
      toast.error('You must be logged in to export data');
      return;
    }

    try {
      setLoading(true);
      
      // Get transactions and categories
      const transactions = getTransactions(user.id);
      const categories = getCategories();
      
      // Filter transactions based on config
      let filteredTransactions = transactions;
      
      // Filter by date range
      if (exportConfig.dateRange === 'custom' && exportConfig.startDate && exportConfig.endDate) {
        filteredTransactions = filteredTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          const startDate = new Date(exportConfig.startDate);
          const endDate = new Date(exportConfig.endDate);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      } else if (exportConfig.dateRange === 'last30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
      } else if (exportConfig.dateRange === 'last90') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= ninetyDaysAgo);
      } else if (exportConfig.dateRange === 'thisYear') {
        const currentYear = new Date().getFullYear();
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date).getFullYear() === currentYear);
      }
      
      // Filter by transaction type
      if (exportConfig.transactionType !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === exportConfig.transactionType);
      }
      
      // Prepare data with category names
      const exportData = filteredTransactions.map(transaction => {
        const category = categories.find(cat => cat.id === transaction.categoryId);
        return {
          Date: transaction.date,
          Type: transaction.type,
          Amount: transaction.amount,
          Category: category?.name || 'Unknown',
          Note: transaction.note,
          Tags: transaction.tags.join(', '),
          'Created At': new Date(transaction.createdAt).toLocaleDateString(),
        };
      });

      if (exportConfig.format === 'csv') {
        exportToCSV(exportData);
      } else {
        exportToPDF(exportData);
      }
      
      toast.success(`Data exported successfully! (${filteredTransactions.length} transactions)`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expense-tracker-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: any[]) => {
    // For demo purposes, we'll create a simple text-based PDF export
    // In a real app, you would use a library like jsPDF
    const content = [
      'EXPENSE TRACKER EXPORT',
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Total transactions: ${data.length}`,
      '',
      'TRANSACTIONS:',
      ...data.map((transaction, index) => 
        `${index + 1}. ${transaction.Date} - ${transaction.Type} - $${transaction.Amount} - ${transaction.Category} - ${transaction.Note}`
      )
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expense-tracker-export-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTransactionCount = () => {
    if (!user) return 0;
    const transactions = getTransactions(user.id);
    
    let filteredCount = transactions.length;
    
    if (exportConfig.dateRange === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filteredCount = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo).length;
    } else if (exportConfig.dateRange === 'last90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      filteredCount = transactions.filter(t => new Date(t.date) >= ninetyDaysAgo).length;
    } else if (exportConfig.dateRange === 'thisYear') {
      const currentYear = new Date().getFullYear();
      filteredCount = transactions.filter(t => new Date(t.date).getFullYear() === currentYear).length;
    } else if (exportConfig.dateRange === 'custom' && exportConfig.startDate && exportConfig.endDate) {
      const startDate = new Date(exportConfig.startDate);
      const endDate = new Date(exportConfig.endDate);
      filteredCount = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      }).length;
    }
    
    if (exportConfig.transactionType !== 'all') {
      filteredCount = transactions.filter(t => 
        t.type === exportConfig.transactionType &&
        (exportConfig.dateRange === 'all' || 
         (exportConfig.dateRange === 'last30' && new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
         (exportConfig.dateRange === 'last90' && new Date(t.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
         (exportConfig.dateRange === 'thisYear' && new Date(t.date).getFullYear() === new Date().getFullYear()))
      ).length;
    }
    
    return filteredCount;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600 mt-1">Download your transaction data in various formats</p>
      </div>

      {/* Export Configuration */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Settings</h3>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportConfig(prev => ({ ...prev, format: 'csv' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportConfig.format === 'csv'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">CSV</span>
                <p className="text-xs text-gray-500 mt-1">Spreadsheet format</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportConfig(prev => ({ ...prev, format: 'pdf' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportConfig.format === 'pdf'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Download className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">PDF</span>
                <p className="text-xs text-gray-500 mt-1">Document format</p>
              </motion.button>
            </div>
          </div>

          {/* Date Range */}
          <Select
            label="Date Range"
            value={exportConfig.dateRange}
            onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'last30', label: 'Last 30 Days' },
              { value: 'last90', label: 'Last 90 Days' },
              { value: 'thisYear', label: 'This Year' },
              { value: 'custom', label: 'Custom Range' },
            ]}
          />

          {/* Custom Date Range */}
          {exportConfig.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={exportConfig.startDate}
                onChange={(e) => setExportConfig(prev => ({ ...prev, startDate: e.target.value }))}
                icon={<Calendar />}
              />
              <Input
                type="date"
                label="End Date"
                value={exportConfig.endDate}
                onChange={(e) => setExportConfig(prev => ({ ...prev, endDate: e.target.value }))}
                icon={<Calendar />}
              />
            </div>
          )}

          {/* Transaction Type */}
          <Select
            label="Transaction Type"
            value={exportConfig.transactionType}
            onChange={(e) => setExportConfig(prev => ({ ...prev, transactionType: e.target.value }))}
            options={[
              { value: 'all', label: 'All Transactions' },
              { value: 'income', label: 'Income Only' },
              { value: 'expense', label: 'Expenses Only' },
            ]}
          />
        </div>
      </Card>

      {/* Export Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Format:</span>
            <span className="font-medium">{exportConfig.format.toUpperCase()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date Range:</span>
            <span className="font-medium">
              {exportConfig.dateRange === 'all' && 'All Time'}
              {exportConfig.dateRange === 'last30' && 'Last 30 Days'}
              {exportConfig.dateRange === 'last90' && 'Last 90 Days'}
              {exportConfig.dateRange === 'thisYear' && 'This Year'}
              {exportConfig.dateRange === 'custom' && 'Custom Range'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Transaction Type:</span>
            <span className="font-medium">
              {exportConfig.transactionType === 'all' && 'All Transactions'}
              {exportConfig.transactionType === 'income' && 'Income Only'}
              {exportConfig.transactionType === 'expense' && 'Expenses Only'}
            </span>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-gray-600">Transactions to Export:</span>
            <span className="font-bold text-primary-600">{getTransactionCount()}</span>
          </div>
        </div>
      </Card>

      {/* Export Button */}
      <Card>
        <div className="text-center">
          <Button
            onClick={handleExport}
            loading={loading}
            disabled={getTransactionCount() === 0}
            size="lg"
            className="w-full"
          >
            <Download className="w-5 h-5 mr-2" />
            Export {getTransactionCount()} Transaction{getTransactionCount() !== 1 ? 's' : ''}
          </Button>
          
          {getTransactionCount() === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No transactions match your export criteria
            </p>
          )}
        </div>
      </Card>

      {/* Export Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">CSV Format</p>
              <p className="text-sm text-gray-600">Perfect for importing into Excel, Google Sheets, or other spreadsheet applications.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">PDF Format</p>
              <p className="text-sm text-gray-600">Great for sharing reports or keeping printed records of your transactions.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Data Privacy</p>
              <p className="text-sm text-gray-600">All exports are generated locally in your browser. Your data never leaves your device.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Export;