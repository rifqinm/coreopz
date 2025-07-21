import React, { useState } from 'react';
import { X, Warehouse, Loader, AlertCircle, MapPin } from 'lucide-react';
import { supabaseAdmin } from '../../config/supabaseAdmin';
import { useAuth } from '../../contexts/AuthContext';
import Toast from './Toast';

interface CreateWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWarehouseCreated: () => void;
}

const CreateWarehouseModal: React.FC<CreateWarehouseModalProps> = ({
  isOpen,
  onClose,
  onWarehouseCreated
}) => {
  const { supabaseUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'loading';
    message: string;
  }>({ show: false, type: 'loading', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    type: 'warehouse' as 'warehouse' | 'supplier'
  });

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ show: false, type: 'loading', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Warehouse name is required');
      return false;
    }
    if (formData.name.length < 3) {
      setError('Warehouse name must be at least 3 characters');
      return false;
    }
    return true;
  };

  const generateWarehouseId = () => {
    // Generate 8-digit unique number
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!supabaseUser?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError('');
    showToast('loading', 'Creating warehouse...');

    try {
      const warehouseData = {
        id: generateWarehouseId(),
        name: formData.name.trim(),
        location: formData.location.trim() || null,
        description: formData.description.trim() || null,
        type: formData.type,
        user_id: supabaseUser.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseAdmin
        .from('warehouses')
        .insert(warehouseData)
        .select()
        .single();

      if (error) throw error;

      showToast('success', 'Warehouse created successfully!');
      
      // Reset form and close modal after success
      setTimeout(() => {
        resetForm();
        hideToast();
        onClose();
        onWarehouseCreated();
      }, 1500);

    } catch (err: any) {
      console.error('Error creating warehouse:', err);
      setError(err.message || 'Failed to create warehouse');
      showToast('error', err.message || 'Failed to create warehouse');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      type: 'warehouse'
    });
    setError('');
    hideToast();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Warehouse className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Create New Warehouse</h3>
                <p className="text-sm text-gray-600">Add a new warehouse to your system</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter warehouse name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Enter warehouse location"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              >
                <option value="warehouse">Warehouse</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter warehouse description (optional)"
                disabled={isLoading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">8-digit Warehouse ID will be auto-generated</p>
                  <p>A unique 8-digit warehouse ID will be automatically created when you save this warehouse.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Warehouse className="w-4 h-4" />
                    <span>Create Warehouse</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
};

export default CreateWarehouseModal;