import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  type: 'success' | 'error' | 'loading';
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  show, 
  type, 
  message, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (show && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, type, duration, onClose]);

  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-sm ${getToastStyles()}`}>
        {getIcon()}
        <span className="text-sm font-medium flex-1">{message}</span>
        {type !== 'loading' && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;