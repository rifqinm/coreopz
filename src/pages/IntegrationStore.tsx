import React, { useState, useEffect } from 'react';
import { Store, CheckCircle, Package, Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { supabaseAdmin } from '../config/supabaseAdmin';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import CreateStoreModal from '../components/common/CreateStoreModal';
import EditStoreModal from '../components/common/EditStoreModal';

interface StoreData {
  id: number;
  name: string;
  store_type: 'online' | 'offline';
  platform_enum: string | null;
  logo_url: string | null;
  description: string | null;
  status: boolean;
  created_at: string;
  user_email: string;
  user_id: string;
}

interface StoreIntegration extends StoreData {
  productCount: number;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

const IntegrationStore: React.FC = () => {
  const { currentUser, supabaseUser } = useAuth();
  const [integrations, setIntegrations] = useState<StoreIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreIntegration | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    if (supabaseUser?.id) {
      fetchStores();
    } else {
      setLoading(false);
    }
  }, [supabaseUser]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get stores for this specific user using service role
      const { data, error } = await supabaseAdmin
        .from('stores')
        .select('*')
        .eq('user_id', supabaseUser?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Get product counts for each store
      const storeIds = (data || []).map(store => store.id);
      const { data: productCounts, error: productError } = await supabaseAdmin
        .from('marketplace_products')
        .select('store_id')
        .in('store_id', storeIds);

      if (productError) {
        console.error('Error fetching product counts:', productError);
      }

      // Count products per store
      const productCountMap = (productCounts || []).reduce((acc, product) => {
        acc[product.store_id] = (acc[product.store_id] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Transform data to include integration-specific fields
      const transformedData: StoreIntegration[] = (data || []).map(store => ({
        ...store,
        productCount: productCountMap[store.id] || 0,
        connectionStatus: store.status ? 'connected' : 'disconnected' as 'connected' | 'disconnected' | 'error'
      }));

      setIntegrations(transformedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProducts = (storeId: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', `product/${storeId}`);
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleSync = async (storeId: number) => {
    // Simulate sync process
    setIntegrations(prev => prev.map(store => 
      store.id === storeId 
        ? { ...store, lastSync: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : store
    ));
  };

  const handleStoreCreated = () => {
    // Refresh the stores list after creating a new store
    fetchStores();
  };

  const handleStoreUpdated = () => {
    // Refresh the stores list after updating a store
    fetchStores();
    setIsEditModalOpen(false);
    setEditingStore(null);
  };

  const handleDeleteStore = async (storeId: number) => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete all marketplace_products associated with this store
      const { error: productsError } = await supabaseAdmin
        .from('marketplace_products')
        .delete()
        .eq('store_id', storeId);

      if (productsError) {
        console.error('Error deleting marketplace products:', productsError);
        // Continue with store deletion even if products deletion fails
      }

      // Then delete the store
      const { error } = await supabaseAdmin
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;

      // Remove from local state
      setIntegrations(prev => prev.filter(store => store.id !== storeId));
      setOpenDropdown(null);
      
      alert('Store and all associated products have been deleted successfully.');
    } catch (err: any) {
      alert('Failed to delete store: ' + err.message);
    }
  };

  const handleEditStore = (storeId: number) => {
    const store = integrations.find(s => s.id === storeId);
    if (store) {
      setEditingStore(store);
      setIsEditModalOpen(true);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (storeId: number) => {
    setOpenDropdown(openDropdown === storeId ? null : storeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading stores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading stores: {error}</p>
        <button 
          onClick={fetchStores}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
        <div className="mt-2 text-sm text-gray-600">
          <p>Debug info:</p>
          <p>User ID: {supabaseUser?.id || 'Not found'}</p>
          <p>User Email: {supabaseUser?.email || 'Not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Store Integration</h1>
          <p className="text-gray-600 mt-1">Manage your store connections and synchronization</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Create Store</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          label="Total Stores"
          value={integrations.length}
          icon={Store}
          color="bg-blue-500"
        />
        <StatsCard
          label="Connected"
          value={integrations.filter(i => i.connectionStatus === 'connected').length}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          label="Total Products"
          value={integrations.reduce((sum, i) => sum + i.productCount, 0)}
          icon={Package}
          color="bg-purple-500"
        />
        <StatsCard
          label="Active Stores"
          value={integrations.filter(i => i.connectionStatus === 'connected').length}
          icon={Store}
          color="bg-orange-500"
        />
      </div>

      {/* Integration Cards */}
      {integrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {integration.logo_url ? (
                      <img src={integration.logo_url} alt={integration.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{integration.store_type} • {integration.platform_enum || 'Custom'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={integration.connectionStatus} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{integration.productCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{integration.store_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-medium capitalize">{integration.platform_enum}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(integration.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(integration.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openDropdown === integration.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setOpenDropdown(null)}
                      ></div>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => handleViewProducts(integration.id)}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span>View Products</span>
                          </button>
                          <button
                            onClick={() => handleEditStore(integration.id)}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-500" />
                            <span>Edit Store</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStore(integration.id)}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Store</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {integration.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No stores found</p>
          <p className="text-gray-400 text-sm mt-2">Create your first store to get started</p>
        </div>
      )}

      {/* Create Store Modal */}
      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* Edit Store Modal */}
      <EditStoreModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStore(null);
        }}
        store={editingStore}
        onStoreUpdated={handleStoreUpdated}
      />
    </div>
  );
};

export default IntegrationStore;