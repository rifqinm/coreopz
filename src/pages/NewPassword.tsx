import React, { useState, useEffect } from 'react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Key, ArrowLeft, Shield } from 'lucide-react';

const NewPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [mode, setMode] = useState('');

  useEffect(() => {
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const oobCodeParam = urlParams.get('oobCode');

    console.log('URL Params:', { mode: modeParam, oobCode: oobCodeParam });

    if (modeParam === 'resetPassword' && oobCodeParam) {
      setMode(modeParam);
      setOobCode(oobCodeParam);
    } else {
      console.error('Missing or invalid parameters');
      setError('Link reset password tidak valid atau sudah kadaluarsa. Silakan minta reset password baru.');
    }
  }, []);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      setError('Kode reset tidak valid. Silakan minta reset password baru.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      switch (error.code) {
        case 'auth/expired-action-code':
          setError('Link reset sudah kadaluarsa. Silakan minta reset password baru.');
          break;
        case 'auth/invalid-action-code':
          setError('Link reset tidak valid. Silakan minta reset password baru.');
          break;
        case 'auth/weak-password':
          setError('Password terlalu lemah. Pilih password yang lebih kuat.');
          break;
        default:
          setError('Gagal mereset password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    window.location.href = '/';
  };

  // Success page
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
              Password Berhasil Direset
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Password Berhasil Diperbarui!
              </h2>
              
              <p className="text-gray-600 mb-8">
                Password Anda telah berhasil diperbarui. Sekarang Anda dapat masuk dengan password baru.
              </p>
              
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

  // Error page for invalid links
  if (error && !oobCode) {
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
              Link Reset Tidak Valid
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Link Tidak Valid
              </h2>
              
              <p className="text-gray-600 mb-8">
                {error}
              </p>
              
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

  // Main new password form
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
            Buat Password Baru
          </h1>
          <p className="text-gray-600 mt-2">
            Masukkan password baru Anda untuk menyelesaikan proses reset.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg mb-6">
            <Shield className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800">Buat Password Baru</p>
              <p className="text-xs text-blue-600">Pilih password yang kuat untuk akun Anda</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Masukkan password baru"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password minimal 6 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Konfirmasi password baru"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  <span>Memperbarui Password...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Perbarui Password</span>
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

export default NewPassword;