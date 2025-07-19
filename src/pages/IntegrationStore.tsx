import React, { useState, useEffect } from 'react';
import { Store, Plus, Settings, Link, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

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
    console.log('Current User:', currentUser);
    console.log('Supabase User:', supabaseUser);
    
    if (supabaseUser?.id) {
      fetchStores();
    } else {
      console.log('No supabase user ID found');
      setLoading(false);
    }
  }, [supabaseUser]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching stores for user_id:', supabaseUser?.id);
      
      const { data, error, count } = await supabase
        .from('stores')
        .select('*', { count: 'exact' })
        .eq('user_id', supabaseUser?.id)
        .order('created_at', { ascending: false });

      console.log('Supabase query result:', { data, error, count });

      if (error) {
        console.error('Supabase error:', error);
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

      console.log('Transformed data:', transformedData);
      setIntegrations(transformedData);
    } catch (err: any) {
      console.error('Error fetching stores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <button 
          onClick={() => window.location.href = '/?page=dashboard'}
          className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Store</span>
        </button>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-sm text-yellow-700">User ID: {supabaseUser?.id || 'Not found'}</p>
          <p className="text-sm text-yellow-700">User Email: {supabaseUser?.email || 'Not found'}</p>
          <p className="text-sm text-yellow-700">Stores Count: {integrations.length}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold text-gray-800">{integrations.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-green-600">{integrations.filter(i => i.connectionStatus === 'connected').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-purple-600">{integrations.reduce((sum, i) => sum + i.products, 0)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Store className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-orange-600">{integrations.reduce((sum, i) => sum + i.orders, 0)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Store className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
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
                  {getStatusIcon(integration.connectionStatus)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.connectionStatus)}`}>
                    {integration.connectionStatus}
                  </span>
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
                  onClick={() => handleSync(integration.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Sync Now</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
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
          <button 
            onClick={() => window.location.href = '/?page=dashboard'}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Create Store
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationStore;