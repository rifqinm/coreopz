import React, { useState } from 'react';
import { Plus, Store, TrendingUp, Package, Users, Eye, Edit, Trash2, DollarSign, CreditCard, BarChart3, PieChart, ArrowUp, ArrowDown } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  status: string;
  type: string;
  totalSales: number;
  monthlyGrowth: number;
  orders: number;
  revenue: number;
}

interface DashboardProps {
  stores: Store[];
  setStores: (stores: Store[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stores, setStores }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    type: 'online',
    status: 'active'
  });

  // Enhanced store data with sales information
  const enhancedStores = stores.map(store => ({
    ...store,
    totalSales: Math.floor(Math.random() * 50000000) + 10000000, // Random sales data
    monthlyGrowth: Math.floor(Math.random() * 30) - 10, // Random growth -10% to +20%
    orders: Math.floor(Math.random() * 500) + 50,
    revenue: Math.floor(Math.random() * 30000000) + 5000000
  }));

  // Financial data
  const financialData = {
    totalRevenue: enhancedStores.reduce((sum, store) => sum + store.revenue, 0),
    totalSales: enhancedStores.reduce((sum, store) => sum + store.totalSales, 0),
    cashflow: 45800000,
    receivables: 12500000, // Piutang
    payables: 8300000,     // Hutang
    netProfit: 0
  };

  financialData.netProfit = financialData.totalRevenue - financialData.payables;

  const handleCreateStore = () => {
    if (newStore.name.trim()) {
      const store = {
        id: stores.length + 1,
        ...newStore
      };
      setStores([...stores, store]);
      setNewStore({ name: '', type: 'online', status: 'active' });
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteStore = (id: number) => {
    setStores(stores.filter(store => store.id !== id));
  };

  const toggleStoreStatus = (id: number) => {
    setStores(stores.map(store => 
      store.id === id 
        ? { ...store, status: store.status === 'active' ? 'inactive' : 'active' }
        : store
    ));
  };

  const mainStats = [
    { 
      label: 'Total Revenue', 
      value: `Rp ${(financialData.totalRevenue / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    { 
      label: 'Total Sales', 
      value: `Rp ${(financialData.totalSales / 1000000).toFixed(1)}M`, 
      icon: TrendingUp, 
      color: 'bg-blue-500',
      change: '+8.3%',
      changeType: 'positive'
    },
    { 
      label: 'Cashflow', 
      value: `Rp ${(financialData.cashflow / 1000000).toFixed(1)}M`, 
      icon: BarChart3, 
      color: 'bg-purple-500',
      change: '+5.7%',
      changeType: 'positive'
    },
    { 
      label: 'Net Profit', 
      value: `Rp ${(financialData.netProfit / 1000000).toFixed(1)}M`, 
      icon: TrendingUp, 
      color: 'bg-primary',
      change: '+15.2%',
      changeType: 'positive'
    }
  ];

  const financialStats = [
    { 
      label: 'Piutang (Receivables)', 
      value: `Rp ${(financialData.receivables / 1000000).toFixed(1)}M`, 
      icon: CreditCard, 
      color: 'bg-yellow-500',
      description: 'Outstanding receivables'
    },
    { 
      label: 'Hutang (Payables)', 
      value: `Rp ${(financialData.payables / 1000000).toFixed(1)}M`, 
      icon: CreditCard, 
      color: 'bg-red-500',
      description: 'Outstanding payables'
    },
    { 
      label: 'Total Toko', 
      value: enhancedStores.length, 
      icon: Store, 
      color: 'bg-secondary',
      description: 'Active stores'
    },
    { 
      label: 'Total Orders', 
      value: enhancedStores.reduce((sum, store) => sum + store.orders, 0), 
      icon: Package, 
      color: 'bg-tertiary',
      description: 'This month'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your business performance</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Create Toko</span>
        </button>
      </div>

      {/* Main Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Total Sales Trend</h2>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Mock Chart Visualization */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-48 px-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                <div key={month} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t-md w-8 mb-2 transition-all hover:bg-blue-600"
                    style={{ height: `${Math.random() * 120 + 40}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{month}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2">
              <p className="text-sm font-medium text-gray-700">Avg: Rp 25.3M/month</p>
            </div>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Revenue Distribution</h2>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center relative">
            {/* Mock Pie Chart */}
            <div className="w-32 h-32 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-primary" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }}></div>
              <div className="absolute inset-0 bg-secondary" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
              <div className="absolute inset-0 bg-tertiary" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%, 50% 0%)' }}></div>
            </div>
            <div className="absolute top-4 right-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-gray-600">Online (45%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-xs text-gray-600">Offline (35%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tertiary rounded-full"></div>
                <span className="text-xs text-gray-600">Others (20%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Store Performance */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Store Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {enhancedStores.map((store) => (
              <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{store.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.type === 'online' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        {store.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStoreStatus(store.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      store.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {store.status}
                  </button>
                </div>
                
                {/* Store Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Sales</span>
                    <span className="font-semibold text-gray-800">
                      Rp {(store.totalSales / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold text-gray-800">
                      Rp {(store.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Orders</span>
                    <span className="font-semibold text-gray-800">{store.orders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Growth</span>
                    <div className="flex items-center">
                      {store.monthlyGrowth >= 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`font-semibold ${
                        store.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {store.monthlyGrowth}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Chart for Store */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-end justify-between h-16">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div 
                        key={day}
                        className="bg-primary/60 rounded-t-sm w-3 transition-all hover:bg-primary"
                        style={{ height: `${Math.random() * 50 + 10}px` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Last 7 days performance</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-secondary hover:text-secondary/80 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-quaternary hover:text-quaternary/80 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Store Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Toko</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Toko
                </label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan nama toko"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Toko
                </label>
                <select
                  value={newStore.type}
                  onChange={(e) => setNewStore({...newStore, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateStore}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;