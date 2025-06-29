import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database,
  UserCheck,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/UI/Card';

const PrivacyPolicy: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "All your financial data is encrypted using AES-256 encryption, the same standard used by banks and government agencies."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Secure Storage",
      description: "Your data is stored in secure, SOC 2 compliant data centers with multiple layers of physical and digital security."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Access Controls",
      description: "Strict access controls ensure only you can access your financial information. We use multi-factor authentication and regular security audits."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Privacy by Design",
      description: "We collect only the minimum data necessary to provide our services and never sell or share your personal information."
    }
  ];

  const dataTypes = [
    {
      category: "Account Information",
      items: ["Name", "Email address", "Password (encrypted)", "Profile preferences"],
      purpose: "To create and manage your account"
    },
    {
      category: "Financial Data",
      items: ["Transaction amounts", "Categories", "Notes", "Dates", "Receipt images"],
      purpose: "To provide expense tracking and budgeting features"
    },
    {
      category: "Usage Data",
      items: ["App interactions", "Feature usage", "Performance metrics"],
      purpose: "To improve our service and user experience"
    },
    {
      category: "Device Information",
      items: ["Browser type", "Operating system", "IP address", "Device identifiers"],
      purpose: "For security and technical support"
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
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Privacy & 
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}Security
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your financial data security and privacy are our top priorities. 
              Learn how we protect your information and respect your privacy.
            </p>
            <div className="inline-flex items-center space-x-2 bg-secondary-500/20 text-secondary-400 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Bank-level security • Zero data sharing • Full transparency</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How We Protect Your Data</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We implement multiple layers of security to ensure your financial information 
              remains private and secure at all times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4 text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Data We Collect</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We believe in transparency. Here's exactly what information we collect and why we need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataTypes.map((dataType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {dataType.category}
                    </h3>
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">What we collect:</p>
                      <ul className="space-y-1">
                        {dataType.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-300 text-sm flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-gray-400 mb-1">Purpose:</p>
                      <p className="text-gray-300 text-sm">{dataType.purpose}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Privacy Principles</h2>
            <p className="text-gray-300">
              These core principles guide how we handle your data every day.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Data Minimization",
                description: "We only collect data that's necessary to provide our services. No unnecessary tracking or data harvesting."
              },
              {
                title: "Purpose Limitation",
                description: "Your data is used only for the purposes you've agreed to. We never repurpose your data without explicit consent."
              },
              {
                title: "Transparency",
                description: "We're clear about what data we collect, how we use it, and who we share it with (spoiler: we don't share it)."
              },
              {
                title: "User Control",
                description: "You have full control over your data. You can view, edit, export, or delete your information at any time."
              },
              {
                title: "Security First",
                description: "We implement industry-leading security measures to protect your data from unauthorized access or breaches."
              },
              {
                title: "No Selling",
                description: "We never sell your personal data to third parties. Your information is not a product to us."
              }
            ].map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-6 flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-gray-300">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Your Rights</h2>
            <p className="text-gray-300">
              You have complete control over your personal data. Here's what you can do:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Access", description: "View all the data we have about you" },
              { title: "Rectification", description: "Correct any inaccurate information" },
              { title: "Erasure", description: "Delete your account and all associated data" },
              { title: "Portability", description: "Export your data in a standard format" },
              { title: "Restriction", description: "Limit how we process your data" },
              { title: "Objection", description: "Object to certain types of data processing" }
            ].map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {right.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {right.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-3xl font-bold text-white mb-4">Questions About Privacy?</h2>
            <p className="text-gray-300 mb-8">
              If you have any questions about our privacy practices or want to exercise your rights, 
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@expensetrack.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Contact Privacy Team
              </a>
              <a
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                Visit Help Center
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;