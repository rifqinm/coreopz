import React, { useState } from 'react';
import { Store, Plus, Settings, Link, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface StoreIntegration {
  id: number;
  name: string;
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  products: number;
  orders: number;
}

const IntegrationStore: React.FC = () => {
  const [integrations, setIntegrations] = useState<StoreIntegration[]>([
    {
      id: 1,
      name: 'Toko Elektronik',
      platform: 'Shopify',
      status: 'connected',
      lastSync: '2024-01-15 10:30',
      products: 150,
      orders: 45
    },
    {
      id: 2,
      name: 'Toko Fashion',
      platform: 'WooCommerce',
      status: 'connected',
      lastSync: '2024-01-15 09:15',
      products: 200,
      orders: 32
    },
    {
      id: 3,
      name: 'Toko Makanan',
      platform: 'Tokopedia',
      status: 'error',
      lastSync: '2024-01-14 15:20',
      products: 75,
      orders: 12
    }
  ]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Store Integration</h1>
          <p className="text-gray-600 mt-1">Manage your store connections and synchronization</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add Integration</span>
        </button>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.platform}</p>
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
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
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
    </div>
  );
};

export default IntegrationStore;