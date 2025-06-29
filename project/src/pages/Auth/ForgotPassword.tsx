import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await resetPassword(email);
      setSent(true);
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {sent ? 'Check Your Email' : 'Forgot Password?'}
            </h1>
            <p className="text-gray-600">
              {sent 
                ? 'We\'ve sent a password reset link to your email address.'
                : 'Enter your email address and we\'ll send you a reset link.'
              }
            </p>
          </div>

          <Card>
            {sent ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-secondary-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-4">
                    If an account with that email exists, you'll receive a password reset link shortly.
                  </p>
                  <p className="text-sm text-gray-500">
                    Didn't receive an email? Check your spam folder or try again.
                  </p>
                </div>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Send Another Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail />}
                  required
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  Send Reset Link
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;