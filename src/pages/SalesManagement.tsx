import React, { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Filter, Download } from 'lucide-react';

interface Sale {
  id: number;
  productName: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      productName: 'Laptop Gaming ASUS ROG',
      customerName: 'John Doe',
      quantity: 1,
      totalAmount: 15000000,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      productName: 'iPhone 14 Pro Max',
      customerName: 'Jane Smith',
      quantity: 2,
      totalAmount: 36000000,
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      productName: 'Nike Air Jordan',
      customerName: 'Mike Johnson',
      quantity: 1,
      totalAmount: 2500000,
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: 4,
      productName: 'Laptop Gaming ASUS ROG',
      customerName: 'Sarah Wilson',
      quantity: 1,
      totalAmount: 15000000,
      date: '2024-01-12',
      status: 'cancelled'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredSales = sales.filter(sale => {
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    return matchesStatus;
  });

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalOrders = sales.length;
  const completedOrders = sales.filter(s => s.status === 'completed').length;
  const pendingOrders = sales.filter(s => s.status === 'pending').length;

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+12.5%'
    },
    { 
      label: 'Total Orders', 
      value: totalOrders, 
      icon: ShoppingCart, 
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    { 
      label: 'Completed Orders', 
      value: completedOrders, 
      icon: TrendingUp, 
      color: 'bg-purple-500',
      change: '+15.3%'
    },
    { 
      label: 'Pending Orders', 
      value: pendingOrders, 
      icon: Users, 
      color: 'bg-orange-500',
      change: '-2.1%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.change?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Trend</h2>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Sales chart akan ditampilkan di sini</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Sales</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{sale.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{sale.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rp {sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No sales found</p>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;