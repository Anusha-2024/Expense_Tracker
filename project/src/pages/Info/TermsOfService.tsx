import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Scale,
  Lock,
  Globe
} from 'lucide-react';
import Card from '../../components/UI/Card';

const TermsOfService: React.FC = () => {
  const securityHighlights = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection",
      description: "Your financial data is protected with bank-level encryption and security measures."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privacy Guarantee",
      description: "We never sell, share, or monetize your personal financial information."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Rights",
      description: "You maintain full ownership and control over your data at all times."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Compliance",
      description: "We comply with GDPR, CCPA, and other international privacy regulations."
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
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Terms of 
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}Service
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Our commitment to providing secure, reliable financial tracking services 
              while protecting your privacy and data.
            </p>
            <div className="inline-flex items-center space-x-2 bg-secondary-500/20 text-secondary-400 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Last updated: December 2024</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Highlights */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Security Commitments</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              These terms ensure your financial data remains secure and private while using our service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center h-full">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                      {highlight.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {highlight.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Service Description</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      ExpenseTrack provides a web-based personal finance management platform that allows users to:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary-400 mr-2 mt-0.5 flex-shrink-0" />
                        Track income and expenses with detailed categorization
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary-400 mr-2 mt-0.5 flex-shrink-0" />
                        Set and monitor budgets for different spending categories
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary-400 mr-2 mt-0.5 flex-shrink-0" />
                        Generate reports and analytics on spending patterns
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary-400 mr-2 mt-0.5 flex-shrink-0" />
                        Export financial data for external use
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Data Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Data Security & Privacy</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We implement industry-leading security measures to protect your financial data:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Encryption</h4>
                        <p className="text-sm">AES-256 encryption for all data, both in transit and at rest</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Access Control</h4>
                        <p className="text-sm">Multi-factor authentication and strict access controls</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Data Isolation</h4>
                        <p className="text-sm">Your data is completely isolated from other users</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Regular Audits</h4>
                        <p className="text-sm">Continuous security monitoring and regular audits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* User Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>To maintain the security and integrity of our service, users agree to:</p>
                    <ul className="space-y-3 ml-6">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        Provide accurate information when creating an account
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        Keep login credentials secure and not share account access
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        Use the service only for personal financial tracking purposes
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        Report any security concerns or unauthorized access immediately
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Service Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Service Availability</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We strive to provide reliable, continuous service with minimal downtime:
                    </p>
                    <div className="bg-white/5 rounded-lg p-6 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-2xl font-bold text-secondary-400 mb-1">99.9%</div>
                          <div className="text-sm">Uptime Target</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary-400 mb-1">24/7</div>
                          <div className="text-sm">Monitoring</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary-400 mb-1">&lt;1min</div>
                          <div className="text-sm">Response Time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Data Ownership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Data Ownership & Control</h2>
                  <div className="space-y-4 text-gray-300">
                    <p className="font-medium text-white">
                      You retain complete ownership of your financial data.
                    </p>
                    <p>
                      ExpenseTrack serves as a secure custodian of your data, but you maintain full rights to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                        <span>Access your data at any time</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                        <span>Export your data in standard formats</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                        <span>Modify or delete your information</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                        <span>Request complete account deletion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Service Limitations</h2>
                  <div className="space-y-4 text-gray-300">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-400 mb-2">Important Notice</p>
                          <p className="text-sm">
                            ExpenseTrack is a financial tracking tool and does not provide financial advice. 
                            Users are responsible for their own financial decisions and should consult 
                            qualified professionals for financial planning advice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-300 mb-8">
              If you have any questions about these terms or our security practices, 
              our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@expensetrack.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Contact Legal Team
              </a>
              <a
                href="/privacy"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                View Privacy Policy
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;