import React, { useState, useEffect } from 'react';
import { Store, CheckCircle, RefreshCw, Package } from 'lucide-react';
import { supabaseAdmin } from '../config/supabaseAdmin';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';

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
  lastSync: string;
  products: number;
  orders: number;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

const IntegrationStore: React.FC = () => {
  const { currentUser, supabaseUser } = useAuth();
  const [integrations, setIntegrations] = useState<StoreIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // Transform data to include integration-specific fields
      const transformedData: StoreIntegration[] = (data || []).map(store => ({
        ...store,
        lastSync: new Date(Date.now() - Math.random() * 86400000).toISOString().slice(0, 16).replace('T', ' '),
        products: Math.floor(Math.random() * 500) + 50,
        orders: Math.floor(Math.random() * 100) + 10,
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
          value={integrations.reduce((sum, i) => sum + i.products, 0)}
          icon={Package}
          color="bg-purple-500"
        />
        <StatsCard
          label="Total Orders"
          value={integrations.reduce((sum, i) => sum + i.orders, 0)}
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
                  <span className="font-medium">{integration.products}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Orders:</span>
                  <span className="font-medium">{integration.orders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium">{integration.lastSync}</span>
                </div>
                {integration.description && (
                  <div className="text-sm text-gray-600 mt-2">
                    <p className="truncate">{integration.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleViewProducts(integration.id)}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm">View Products</span>
                </button>
                <button 
                  onClick={() => handleSync(integration.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Sync Now</span>
                </button>
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
    </div>
  );
};

export default IntegrationStore;