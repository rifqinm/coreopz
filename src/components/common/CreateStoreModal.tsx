import React, { useState } from 'react';
import { X, Store, Loader, AlertCircle } from 'lucide-react';
import { supabaseAdmin } from '../../config/supabaseAdmin';
import { useAuth } from '../../contexts/AuthContext';
import Toast from './Toast';

interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  type: 'warehouse' | 'supplier';
}

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreCreated: () => void;
}

const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onStoreCreated
}) => {
  const { currentUser, supabaseUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'loading';
    message: string;
  }>({ show: false, type: 'loading', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    store_type: 'online' as 'online' | 'offline',
    platform_enum: 'shopee' as 'shopee' | 'tokopedia' | 'lazada' | 'tiktok',
    description: '',
    logo_url: '',
    warehouse_id: ''
  });

  // Fetch warehouses when modal opens
  React.useEffect(() => {
    if (isOpen && supabaseUser?.id) {
      fetchWarehouses();
    }
  }, [isOpen, supabaseUser]);

  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('warehouses')
        .select('id, name, location, type')
        .eq('user_id', supabaseUser?.id)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setWarehouses(data || []);
    } catch (err: any) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ show: false, type: 'loading', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Store name is required');
      return false;
    }
    if (formData.name.length < 3) {
      setError('Store name must be at least 3 characters');
      return false;
    }
    return true;
  };

  const generateStoreId = () => {
    // Generate 8-digit unique number
    return Math.floor(10000000 + Math.random() * 90000000);
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
    showToast('loading', 'Creating store...');

    try {
      const storeData = {
        id: generateStoreId(),
        name: formData.name.trim(),
        store_type: formData.store_type,
        platform_enum: formData.platform_enum,
        description: formData.description.trim() || null,
        logo_url: formData.logo_url.trim() || null,
        user_email: currentUser?.email || '',
        user_id: supabaseUser.id,
        status: true,
        created_at: new Date().toISOString(),
        warehouse_id: formData.warehouse_id || null
      };

      const { data, error } = await supabaseAdmin
        .from('stores')
        .insert(storeData)
        .select()
        .single();

      if (error) throw error;

      showToast('success', 'Store created successfully!');
      
      // Reset form and close modal after success
      setTimeout(() => {
        resetForm();
        hideToast();
        onClose();
        onStoreCreated();
      }, 1500);

    } catch (err: any) {
      console.error('Error creating store:', err);
      setError(err.message || 'Failed to create store');
      showToast('error', err.message || 'Failed to create store');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      store_type: 'online',
      platform_enum: 'shopee',
      description: '',
      logo_url: '',
      warehouse_id: ''
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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Create New Store</h3>
                <p className="text-sm text-gray-600">Add a new store to your integration</p>
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
                Store Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter store name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Type *
                </label>
                <select
                  name="store_type"
                  value={formData.store_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <select
                  name="platform_enum"
                  value={formData.platform_enum}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                >
                  <option value="shopee">Shopee</option>
                  <option value="tokopedia">Tokopedia</option>
                  <option value="lazada">Lazada</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse (Optional)
              </label>
              <select
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} {warehouse.location ? `(${warehouse.location})` : ''} - {warehouse.type === 'supplier' ? 'Supplier' : 'Warehouse'}
                  </option>
                ))}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter store description (optional)"
                disabled={isLoading}
              />
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
                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4" />
                    <span>Create Store</span>
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

export default CreateStoreModal;