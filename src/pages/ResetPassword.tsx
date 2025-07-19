import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Key, Send } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword, currentUser } = useAuth();

  const handleSendResetLink = async () => {
    const emailToReset = currentUser?.email;
    
    if (!emailToReset) {
      setError('No email address found. Please login first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(emailToReset);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    window.location.href = '/';
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden bg-white shadow-lg">
              <img 
                src="https://bdtmmupmfnowetokvdwx.supabase.co/storage/v1/object/public/avatars/avatars/logome.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              Check Your Email
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Reset Link Sent!
              </h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-800">{currentUser?.email}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-8">
                <p className="mb-2">Please check your email and click the link to reset your password.</p>
                <p>If you don't see the email, check your spam folder.</p>
              </div>
              
              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Login</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Produced by Rifqi
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden bg-white shadow-lg">
            <img 
              src="https://bdtmmupmfnowetokvdwx.supabase.co/storage/v1/object/public/avatars/avatars/logome.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-gray-600 mt-2">
            Click the button below to send a password reset link to your registered email.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg mb-6 text-center">
            <Key className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800">Password Reset</p>
              <p className="text-xs text-blue-600">We'll send a secure reset link to your registered email</p>
            </div>
          </div>

          {/* Display current user email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reset link will be sent to:
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">
                  {currentUser?.email || 'No email found'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleSendResetLink}
            disabled={isLoading || !currentUser?.email}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Reset Link...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Reset Link</span>
              </div>
            )}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Produced by Rifqi
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;