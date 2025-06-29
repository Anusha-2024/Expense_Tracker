import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  HelpCircle,
  Book,
  Mail,
  Phone,
  Clock
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: <Book className="w-6 h-6" />,
      title: "Getting Started",
      description: "Learn the basics of using ExpenseTrack",
      articles: 12
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "Account Management",
      description: "Manage your profile and settings",
      articles: 8
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Transactions",
      description: "Adding, editing, and organizing transactions",
      articles: 15
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Budgets & Goals",
      description: "Setting up and tracking budgets",
      articles: 10
    }
  ];

  const faqs = [
    {
      question: "How do I add my first transaction?",
      answer: "To add your first transaction, click the 'Add Transaction' button on your dashboard or navigate to the 'Add' page. Fill in the amount, select a category, add a description, and choose the date. You can also upload a receipt photo for your records."
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes, absolutely. We use bank-level encryption (AES-256) to protect your data. All information is encrypted both in transit and at rest. We never share your personal financial information with third parties, and you can delete your account and all associated data at any time."
    },
    {
      question: "Can I categorize my expenses?",
      answer: "Yes! ExpenseTrack comes with pre-built categories like Food & Dining, Transportation, Entertainment, etc. You can also create custom categories that fit your specific needs. Categories help you understand where your money goes and track spending patterns."
    },
    {
      question: "How do budgets work?",
      answer: "Budgets help you set spending limits for different categories. Go to the Budget page, select a category, set your monthly limit, and track your progress. The app will show you how much you've spent versus your budget and warn you when you're approaching your limit."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export your transaction data in CSV or PDF format. Go to the Export page, choose your date range and format, then download your data. This is useful for tax preparation or importing into other financial software."
    },
    {
      question: "How do I change my account settings?",
      answer: "Go to your Profile page to update your name, email, password, and preferences. You can also change your theme (light/dark mode) and manage your account security settings from there."
    },
    {
      question: "What if I accidentally delete a transaction?",
      answer: "Currently, deleted transactions cannot be recovered, so please be careful when deleting. We recommend double-checking before confirming any deletion. In future updates, we plan to add a trash/recycle bin feature."
    },
    {
      question: "Can I use ExpenseTrack on my phone?",
      answer: "Yes! ExpenseTrack is fully responsive and works great on mobile devices. Simply open your web browser and go to our website. We're also working on dedicated mobile apps for iOS and Android."
    },
    {
      question: "How do I view my spending trends?",
      answer: "Your Dashboard shows charts and graphs of your spending patterns. You can see monthly trends, category breakdowns, and income vs. expenses. The Calendar view also lets you see transactions by date."
    },
    {
      question: "Is ExpenseTrack free to use?",
      answer: "Yes, ExpenseTrack is completely free to use with all features included. There are no hidden fees, premium tiers, or subscription costs. We believe everyone should have access to good financial tools."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Help 
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}Center
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers to common questions and learn how to get the most out of ExpenseTrack.
            </p>
            
            <div className="max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search />}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Browse by Category</h2>
            <p className="text-gray-300">Find help articles organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {category.description}
                    </p>
                    <span className="text-primary-400 text-sm">
                      {category.articles} articles
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300">Quick answers to the most common questions</p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No results found for "{searchTerm}". Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-gray-300">Our support team is here to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get detailed help via email
                </p>
                <a 
                  href="mailto:krianusha09@gmail.com"
                  className="inline-flex items-center justify-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  krianusha09@gmail.com
                </a>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  <Book className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">User Guide</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Complete step-by-step documentation
                </p>
                <a 
                  href="/guide"
                  className="inline-flex items-center justify-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  View Complete Guide
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;