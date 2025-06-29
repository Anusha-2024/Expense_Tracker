import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Shield, 
  TrendingUp, 
  Heart,
  Award,
  Globe,
  Zap,
  User
} from 'lucide-react';
import Card from '../../components/UI/Card';

const About: React.FC = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To empower individuals and families to take control of their financial future through intelligent expense tracking and budgeting tools."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "For Everyone",
      description: "Whether you're a student, professional, or family, our platform adapts to your unique financial needs and goals."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your financial data is yours alone. We use bank-level encryption and never share your personal information."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Insights",
      description: "Advanced analytics help you understand spending patterns and make informed financial decisions."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "$2M+", label: "Tracked Expenses" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.8★", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About 
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}ExpenseTrack
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Created with passion to make personal finance management accessible, 
              secure, and insightful for everyone. Join thousands of users who have 
              transformed their financial habits with our platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose ExpenseTrack?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with care to be more than just an expense tracker - it's a comprehensive 
              financial companion that grows with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-8">My Story</h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                ExpenseTrack was born from a simple frustration: existing financial tools were 
                either too complex for everyday use or too simple to provide meaningful insights. 
                As someone who struggled with personal financial tracking, I decided to build 
                something different.
              </p>
              <p>
                I started with a clear vision: create a platform that's powerful enough for 
                detailed financial analysis, yet simple enough for anyone to use daily. After 
                months of research, design, and testing with real users, ExpenseTrack emerged 
                as the solution I wished I had from the beginning.
              </p>
              <p>
                Today, I'm proud to serve thousands of users worldwide, helping them make 
                informed financial decisions and achieve their goals. But this is just the 
                beginning - I'm constantly innovating to make financial management even more 
                accessible and insightful.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet the Creator</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Passionate about revolutionizing personal finance management for everyone.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center max-w-md">
              <div className="p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Anusha
                </h3>
                <p className="text-primary-400 font-medium mb-4">
                  Founder & Developer
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Creator of ExpenseTrack with a passion for building intuitive financial tools 
                  that help people take control of their money. Dedicated to making personal 
                  finance management simple, secure, and accessible for everyone.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Values</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Heart className="w-6 h-6" />, title: "User-Centric", description: "Every feature is designed with users' needs first." },
              { icon: <Shield className="w-6 h-6" />, title: "Security", description: "Your data security and privacy are non-negotiable." },
              { icon: <Zap className="w-6 h-6" />, title: "Innovation", description: "Continuously evolving to meet changing financial needs." },
              { icon: <Globe className="w-6 h-6" />, title: "Accessibility", description: "Financial tools should be available to everyone, everywhere." }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have already taken control of their financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                Sign In
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;