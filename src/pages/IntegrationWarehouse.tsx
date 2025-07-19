import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, Settings, Link, CheckCircle, XCircle, RefreshCw, MapPin } from 'lucide-react';
import { supabaseAdmin } from '../config/supabaseAdmin';

interface WarehouseData {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WarehouseIntegration extends WarehouseData {
  system: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  products: number;
  capacity: number;
}

const IntegrationWarehouse: React.FC = () => {
  const [integrations, setIntegrations] = useState<WarehouseIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('warehouses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include integration-specific fields
      const transformedData: WarehouseIntegration[] = (data || []).map(warehouse => ({
        ...warehouse,
        system: ['SAP WMS', 'Oracle WMS', 'Custom WMS', 'Manhattan WMS'][Math.floor(Math.random() * 4)],
        status: warehouse.is_active ? 'connected' : 'disconnected' as 'connected' | 'disconnected' | 'error',
        lastSync: new Date(Date.now() - Math.random() * 86400000).toISOString().slice(0, 16).replace('T', ' '),
        products: Math.floor(Math.random() * 2000) + 500,
        capacity: Math.floor(Math.random() * 40) + 40 // 40-80%
      }));

      setIntegrations(transformedData);
    } catch (err: any) {
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

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 80) return 'text-red-600';
    if (capacity >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSync = async (warehouseId: string) => {
    // Simulate sync process
    setIntegrations(prev => prev.map(warehouse => 
      warehouse.id === warehouseId 
        ? { ...warehouse, lastSync: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : warehouse
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        <span className="ml-2 text-gray-600">Loading warehouses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading warehouses: {error}</p>
        <button 
          onClick={fetchWarehouses}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Warehouse Integration</h1>
          <p className="text-gray-600 mt-1">Manage warehouse management system connections</p>
        </div>
        <button className="flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-800">{integrations.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Warehouse className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-green-600">{integrations.filter(i => i.status === 'connected').length}</p>
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
              <Warehouse className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Capacity</p>
              <p className="text-2xl font-bold text-orange-600">
                {integrations.length > 0 ? Math.round(integrations.reduce((sum, i) => sum + i.capacity, 0) / integrations.length) : 0}%
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Warehouse className="w-6 h-6 text-orange-600" />
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
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Warehouse className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-500">{integration.location || 'Location not set'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">System:</span>
                  <span className="font-medium">{integration.system}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{integration.products.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className={`font-medium ${getCapacityColor(integration.capacity)}`}>
                    {integration.capacity}%
                  </span>
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
              
              {/* Capacity Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Storage Capacity</span>
                  <span>{integration.capacity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      integration.capacity >= 80 ? 'bg-red-500' :
                      integration.capacity >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${integration.capacity}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleSync(integration.id)}
                  className="flex items-center space-x-1 text-secondary hover:text-secondary/80 transition-colors"
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
          <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No warehouses found</p>
          <p className="text-gray-400 text-sm mt-2">Create your first warehouse to get started</p>
        </div>
      )}
    </div>
  );
};

export default IntegrationWarehouse;