import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Key, Send } from 'lucide-react';

const ResetPasswordStandalone: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
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
              Periksa Email Anda
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Link Reset Terkirim!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Kami telah mengirim link reset password ke:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-800">{email}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-8">
                <p className="mb-2">Silakan periksa email Anda dan klik link untuk mereset password.</p>
                <p>Jika tidak melihat email, periksa folder spam Anda.</p>
              </div>
              
              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Login</span>
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
            Masukkan alamat email Anda dan kami akan mengirim link untuk mereset password.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg mb-6">
            <Key className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800">Password Reset</p>
              <p className="text-xs text-blue-600">Kami akan mengirim link reset yang aman ke email Anda</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSendResetLink} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Masukkan alamat email Anda"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mengirim Link Reset...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Kirim Link Reset</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Login</span>
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

export default ResetPasswordStandalone;