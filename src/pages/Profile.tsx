import React, { useState } from 'react';
import { User, Mail, Calendar, Key, Camera, Save, Edit3, Shield, Globe, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser, supabaseUser, resetPassword, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState(currentUser?.email || '');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: supabaseUser?.full_name || currentUser?.displayName || '',
    birth_date: supabaseUser?.birth_date || ''
  });

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }

    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset link has been sent to your email.');
      setResetError('');
    } catch (error: any) {
      setResetError(error.message);
      setResetMessage('');
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      await updateUserProfile({
        full_name: editForm.full_name,
        birth_date: editForm.birth_date || null
      });
      
      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google.com':
        return '🔍';
      case 'password':
        return '📧';
      default:
        return '🔐';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google.com':
        return 'Google';
      case 'password':
        return 'Email';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-tertiary rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-white/20 backdrop-blur-sm">
                {supabaseUser?.avatar_url ? (
                  <img 
                    src={supabaseUser.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {supabaseUser?.full_name || currentUser?.displayName || 'User Profile'}
              </h1>
              <p className="text-white/80 text-lg">
                {currentUser?.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm">{getProviderIcon(supabaseUser?.provider || 'password')}</span>
                <span className="text-white/70 text-sm">
                  {getProviderName(supabaseUser?.provider || 'password')} Account
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
          >
            <Edit3 className="w-5 h-5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Personal Information
            </h2>

            {/* Success/Error Messages */}
            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">{updateSuccess}</p>
              </div>
            )}

            {updateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{updateError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-800">
                    {currentUser?.email?.split('@')[0] || 'Not available'}
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {supabaseUser?.full_name || currentUser?.displayName || 'Not set'}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-800">
                    {currentUser?.email || 'Not available'}
                  </span>
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Birth Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.birth_date}
                    onChange={(e) => setEditForm({...editForm, birth_date: e.target.value})}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {formatDate(supabaseUser?.birth_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Security Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">Password</p>
                    <p className="text-sm text-gray-600">Reset your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsResetPasswordOpen(true)}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span>Reset Password</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">Login Provider</p>
                    <p className="text-sm text-gray-600">
                      {getProviderName(supabaseUser?.provider || 'password')} Authentication
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  supabaseUser?.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {supabaseUser?.status ? 'Active' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Role</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Administrator
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="text-sm text-gray-800">
                  {supabaseUser?.created_at ? 
                    new Date(supabaseUser.created_at).toLocaleDateString('id-ID') : 
                    'Recently'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Profile viewed</p>
                  <p className="text-xs text-gray-600">Just now</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Dashboard accessed</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Settings updated</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Reset Password</h3>
              <button
                onClick={() => {
                  setIsResetPasswordOpen(false);
                  setResetError('');
                  setResetMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Key className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Password Reset</p>
                  <p className="text-xs text-blue-600">We'll send a reset link to your email</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              {resetError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{resetError}</p>
                </div>
              )}

              {resetMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{resetMessage}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleResetPassword}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>Send Reset Link</span>
              </button>
              <button
                onClick={() => {
                  setIsResetPasswordOpen(false);
                  setResetError('');
                  setResetMessage('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;