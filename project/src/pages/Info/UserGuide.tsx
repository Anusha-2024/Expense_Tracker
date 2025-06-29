import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus,
  LogIn,
  Settings,
  Plus,
  Target,
  BarChart3,
  Book,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Mail,
  Lock,
  User,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const UserGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const guideSteps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Create Your Account",
      subtitle: "Get started with ExpenseTrack in minutes",
      color: "from-blue-500 to-blue-600",
      details: [
        {
          title: "Visit the Sign-Up Page",
          description: "Go to ExpenseTrack homepage and click 'Get Started' or 'Sign Up'",
          tips: ["Look for the prominent blue button on the homepage", "You can also access signup from the navigation menu"]
        },
        {
          title: "Enter Your Information",
          description: "Fill in the registration form with your details",
          tips: [
            "Full Name: Enter your real name for personalization",
            "Email: Use a valid email address - you'll need it for account recovery",
            "Password: Create a strong password with at least 6 characters",
            "Confirm Password: Make sure both passwords match exactly"
          ]
        },
        {
          title: "Accept Terms & Create Account",
          description: "Review and accept our terms of service and privacy policy",
          tips: [
            "Read through our privacy policy to understand how we protect your data",
            "Check the agreement box to proceed",
            "Click 'Create Account' to complete registration"
          ]
        },
        {
          title: "Automatic Sign-In",
          description: "You'll be automatically logged in and redirected to your dashboard",
          tips: [
            "No need to sign in again after registration",
            "Your account is immediately ready to use",
            "You'll see a welcome message on your dashboard"
          ]
        }
      ]
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Set Up Your Profile",
      subtitle: "Customize your account settings and preferences",
      color: "from-purple-500 to-purple-600",
      details: [
        {
          title: "Access Profile Settings",
          description: "Navigate to your profile page from the main menu",
          tips: [
            "Click 'Profile' in the navigation bar",
            "On mobile, access it through the hamburger menu",
            "You can also click your name in the top-right corner"
          ]
        },
        {
          title: "Update Personal Information",
          description: "Add or modify your profile details",
          tips: [
            "Upload a profile picture by clicking the camera icon",
            "Update your name or email if needed",
            "Changes are saved automatically when you click 'Save Changes'"
          ]
        },
        {
          title: "Choose Your Theme",
          description: "Select between light and dark mode",
          tips: [
            "Go to the 'Preferences' tab in your profile",
            "Toggle between light and dark themes",
            "Your choice is saved and applied immediately"
          ]
        },
        {
          title: "Security Settings",
          description: "Set up additional security measures",
          tips: [
            "Change your password in the 'Security' tab",
            "Always use a strong, unique password",
            "Consider enabling two-factor authentication when available"
          ]
        }
      ]
    },
    {
      icon: <Plus className="w-8 h-8" />,
      title: "Add Your First Transaction",
      subtitle: "Start tracking your income and expenses",
      color: "from-green-500 to-green-600",
      details: [
        {
          title: "Navigate to Add Transaction",
          description: "Access the transaction creation form",
          tips: [
            "Click 'Add Transaction' from the dashboard",
            "Use the '+' button in the navigation menu",
            "On mobile, use the bottom navigation bar"
          ]
        },
        {
          title: "Choose Transaction Type",
          description: "Select whether this is income or an expense",
          tips: [
            "Income: Money coming into your account (salary, freelance, gifts)",
            "Expense: Money going out of your account (food, rent, shopping)",
            "The form will update based on your selection"
          ]
        },
        {
          title: "Enter Transaction Details",
          description: "Fill in all the necessary information",
          tips: [
            "Amount: Enter the exact amount with cents (e.g., 25.50)",
            "Category: Choose from pre-built categories or create custom ones",
            "Date: Set when the transaction actually occurred",
            "Description: Add a note to remember what this was for"
          ]
        },
        {
          title: "Add Optional Information",
          description: "Include tags and receipts for better organization",
          tips: [
            "Tags: Add keywords like 'work', 'personal', 'urgent' for easy filtering",
            "Receipt: Upload a photo of your receipt for record-keeping",
            "Multiple tags can be separated by commas"
          ]
        },
        {
          title: "Save Your Transaction",
          description: "Review and submit your transaction",
          tips: [
            "Double-check all information before saving",
            "Click 'Add Transaction' to save it to your account",
            "You'll see a confirmation message when successful"
          ]
        }
      ]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Create Your First Budget",
      subtitle: "Set spending limits and achieve financial goals",
      color: "from-orange-500 to-orange-600",
      details: [
        {
          title: "Go to Budget Management",
          description: "Access the budgeting tools",
          tips: [
            "Click 'Budget' in the main navigation menu",
            "You'll see an overview of all your budgets",
            "New users will see a prompt to create their first budget"
          ]
        },
        {
          title: "Select Budget Category",
          description: "Choose which expense category to budget for",
          tips: [
            "Start with your largest expense categories (rent, food, transportation)",
            "Only expense categories can have budgets (not income)",
            "You can create multiple budgets for different categories"
          ]
        },
        {
          title: "Set Your Budget Amount",
          description: "Determine how much you want to spend in this category",
          tips: [
            "Be realistic based on your past spending",
            "Consider your income and other expenses",
            "You can always adjust the amount later"
          ]
        },
        {
          title: "Choose Budget Period",
          description: "Select the month this budget applies to",
          tips: [
            "Budgets are set monthly for better control",
            "You can create budgets for future months",
            "Past month budgets help with historical analysis"
          ]
        },
        {
          title: "Monitor Your Progress",
          description: "Track your spending against your budget",
          tips: [
            "View progress bars showing percentage used",
            "Get visual warnings when approaching limits",
            "See remaining budget amounts in real-time"
          ]
        }
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Explore Your Dashboard",
      subtitle: "Understand your financial overview and insights",
      color: "from-indigo-500 to-indigo-600",
      details: [
        {
          title: "Financial Summary Cards",
          description: "View your current month's financial overview",
          tips: [
            "Total Balance: Your income minus expenses for the month",
            "Total Income: All money coming in this month",
            "Total Expenses: All money going out this month",
            "Percentage changes show comparison to last month"
          ]
        },
        {
          title: "Expense Distribution Chart",
          description: "See where your money is going with a pie chart",
          tips: [
            "Each slice represents a different expense category",
            "Colors match your category settings",
            "Hover over slices to see exact amounts",
            "Helps identify your biggest spending areas"
          ]
        },
        {
          title: "Monthly Trends Graph",
          description: "Track your financial progress over time",
          tips: [
            "Shows 6 months of income and expense trends",
            "Green line represents income, blue line represents expenses",
            "Look for patterns and seasonal changes",
            "Use this to plan for future months"
          ]
        },
        {
          title: "Recent Transactions",
          description: "Quick view of your latest financial activity",
          tips: [
            "Shows your 5 most recent transactions",
            "Click 'View All' to see complete transaction history",
            "Each transaction shows category, amount, and date",
            "Quick way to verify recent entries"
          ]
        },
        {
          title: "Quick Action Cards",
          description: "Fast access to common tasks",
          tips: [
            "Add Transaction: Quickly record new income or expenses",
            "Set Budget: Create spending limits for categories",
            "Export Data: Download your financial information",
            "Profile Settings: Manage your account preferences"
          ]
        }
      ]
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: "Master Advanced Features",
      subtitle: "Get the most out of ExpenseTrack's powerful tools",
      color: "from-red-500 to-red-600",
      details: [
        {
          title: "Calendar View",
          description: "See your transactions organized by date",
          tips: [
            "Click on any date to see transactions for that day",
            "Navigate between months using arrow buttons",
            "Visual indicators show days with transactions",
            "Great for reviewing spending patterns by date"
          ]
        },
        {
          title: "Transaction Management",
          description: "Filter, search, and organize your financial data",
          tips: [
            "Use the search bar to find specific transactions",
            "Filter by type (income/expense) or category",
            "Sort by date, amount, or category",
            "Edit or delete transactions as needed"
          ]
        },
        {
          title: "Data Export",
          description: "Download your financial information",
          tips: [
            "Export in CSV format for spreadsheet analysis",
            "PDF format for printed reports",
            "Choose date ranges and transaction types",
            "Perfect for tax preparation or financial planning"
          ]
        },
        {
          title: "Custom Categories",
          description: "Create categories that fit your lifestyle",
          tips: [
            "Add new income or expense categories",
            "Choose custom colors and icons",
            "Organize transactions exactly how you want",
            "Categories can be edited or deleted anytime"
          ]
        },
        {
          title: "Advanced Budgeting",
          description: "Set up comprehensive budget management",
          tips: [
            "Create multiple budgets for different categories",
            "Set budgets for future months",
            "Track budget performance over time",
            "Get alerts when approaching budget limits"
          ]
        },
        {
          title: "Receipt Management",
          description: "Keep digital records of your purchases",
          tips: [
            "Upload receipt photos when adding transactions",
            "View receipts anytime from transaction details",
            "Helps with expense verification and tax records",
            "Supports common image formats (JPG, PNG)"
          ]
        }
      ]
    }
  ];

  const quickTips = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Start Simple",
      description: "Begin with just tracking basic income and expenses, then add budgets as you get comfortable."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Be Consistent",
      description: "Try to add transactions daily or weekly for the most accurate financial picture."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Use Categories",
      description: "Proper categorization helps you understand spending patterns and create effective budgets."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Review Regularly",
      description: "Check your dashboard weekly to stay on top of your financial goals and budget progress."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
              <Book className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              User 
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}Guide
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Complete step-by-step guide to get started with ExpenseTrack and master 
              all features for effective financial management.
            </p>
            <div className="inline-flex items-center space-x-2 bg-secondary-500/20 text-secondary-400 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>From signup to advanced features • Everything you need to know</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Tips for Success</h2>
            <p className="text-gray-300">Essential tips to get the most out of ExpenseTrack</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center h-full">
                  <div className="p-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                      {tip.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {tip.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {tip.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Complete Step-by-Step Guide</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Follow these detailed steps to become an ExpenseTrack expert and take full control of your finances.
            </p>
          </div>

          <div className="space-y-8">
            {guideSteps.map((step, stepIndex) => (
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: stepIndex * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
                  <button
                    onClick={() => setActiveStep(activeStep === stepIndex ? null : stepIndex)}
                    className="w-full p-8 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-300 text-lg">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {step.details.length} steps
                        </div>
                      </div>
                      {activeStep === stepIndex ? (
                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {activeStep === stepIndex && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-8 space-y-8">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex space-x-6">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {detailIndex + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold text-white mb-3">
                                {detail.title}
                              </h4>
                              <p className="text-gray-300 mb-4 leading-relaxed">
                                {detail.description}
                              </p>
                              <div className="space-y-2">
                                {detail.tips.map((tip, tipIndex) => (
                                  <div key={tipIndex} className="flex items-start space-x-3">
                                    <ArrowRight className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                      {tip}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Help */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Need Additional Help?</h2>
            <p className="text-gray-300 mb-8">
              If you have questions not covered in this guide, we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:krianusha09@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
              <a
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <Book className="w-5 h-5 mr-2" />
                Help Center
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ready to Start */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your financial journey today with ExpenseTrack's powerful and intuitive tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Free Account
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UserGuide;