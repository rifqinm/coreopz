import React, { useState } from 'react';
import { FileText, Plus, Settings, Download, Upload, CheckCircle, XCircle, RefreshCw, Calendar } from 'lucide-react';

interface SheetIntegration {
  id: number;
  name: string;
  type: 'Google Sheets' | 'Excel Online' | 'Airtable';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  records: number;
  autoSync: boolean;
}

const IntegrationSheets: React.FC = () => {
  const [integrations, setIntegrations] = useState<SheetIntegration[]>([
    {
      id: 1,
      name: 'Product Inventory',
      type: 'Google Sheets',
      status: 'connected',
      lastSync: '2024-01-15 12:30',
      records: 1250,
      autoSync: true
    },
    {
      id: 2,
      name: 'Sales Report',
      type: 'Excel Online',
      status: 'connected',
      lastSync: '2024-01-15 11:15',
      records: 890,
      autoSync: false
    },
    {
      id: 3,
      name: 'Customer Database',
      type: 'Airtable',
      status: 'syncing',
      lastSync: '2024-01-15 10:45',
      records: 2150,
      autoSync: true
    },
    {
      id: 4,
      name: 'Financial Records',
      type: 'Google Sheets',
      status: 'disconnected',
      lastSync: '2024-01-14 16:20',
      records: 450,
      autoSync: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
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
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Google Sheets':
        return '📊';
      case 'Excel Online':
        return '📈';
      case 'Airtable':
        return '🗃️';
      default:
        return '📄';
    }
  };

  const toggleAutoSync = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, autoSync: !integration.autoSync }
        : integration
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sheets Integration</h1>
          <p className="text-gray-600 mt-1">Connect and sync data with spreadsheet applications</p>
        </div>
        <button className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sheets</p>
              <p className="text-2xl font-bold text-gray-800">{integrations.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Auto Sync</p>
              <p className="text-2xl font-bold text-purple-600">{integrations.filter(i => i.autoSync).length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-orange-600">{integrations.reduce((sum, i) => sum + i.records, 0).toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all">
            <RefreshCw className="w-4 h-4" />
            <span>Sync All</span>
          </button>
          <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all">
            <Calendar className="w-4 h-4" />
            <span>Schedule Sync</span>
          </button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                  {getTypeIcon(integration.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.type}</p>
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
                <span className="text-gray-600">Records:</span>
                <span className="font-medium">{integration.records.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Sync:</span>
                <span className="font-medium">{integration.lastSync}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600">Auto Sync:</span>
                <button
                  onClick={() => toggleAutoSync(integration.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    integration.autoSync ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      integration.autoSync ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Sync</span>
                </button>
                <button className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
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

export default IntegrationSheets;