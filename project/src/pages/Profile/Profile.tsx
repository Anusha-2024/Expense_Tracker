import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  Trash2,
  Moon,
  Sun,
  Download,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await updateUser({
        name: formData.name,
        email: formData.email,
      });
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      // In a real app, you would verify the current password and update it
      toast.success('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = async () => {
    try {
      const newTheme = user?.theme === 'light' ? 'dark' : 'light';
      await updateUser({ theme: newTheme });
    } catch (error) {
      // Error handled in context
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This is your final warning. Are you absolutely sure you want to delete your account?'
      );
      
      if (doubleConfirm) {
        try {
          // In a real app, you would call an API to delete the account
          toast.success('Account deletion initiated. You will be signed out.');
          setTimeout(() => {
            signOut();
          }, 2000);
        } catch (error) {
          toast.error('Failed to delete account');
        }
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'profile' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  icon={<User />}
                  required
                />
                <Input
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  icon={<Mail />}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <Input
                  type="password"
                  label="Current Password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  icon={<Lock />}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="password"
                    label="New Password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    icon={<Lock />}
                    required
                  />
                  <Input
                    type="password"
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    icon={<Lock />}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'preferences' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Theme</h4>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <Button variant="outline" onClick={handleThemeToggle}>
                  {user?.theme === 'light' ? (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light Mode
                    </>
                  )}
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Export Data</h4>
                    <p className="text-sm text-gray-500">Download all your transaction data</p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;