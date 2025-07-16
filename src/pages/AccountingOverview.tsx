import React from 'react';
import { BarChart3, TrendingUp, DollarSign, CreditCard, PieChart, Calculator, FileText, Banknote } from 'lucide-react';

const AccountingOverview: React.FC = () => {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: 'Rp 125.5M', 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    { 
      label: 'Total Expenses', 
      value: 'Rp 87.2M', 
      icon: CreditCard, 
      color: 'bg-red-500',
      change: '+8.3%',
      changeType: 'negative'
    },
    { 
      label: 'Net Profit', 
      value: 'Rp 38.3M', 
      icon: TrendingUp, 
      color: 'bg-blue-500',
      change: '+15.7%',
      changeType: 'positive'
    },
    { 
      label: 'Cash Flow', 
      value: 'Rp 45.8M', 
      icon: Banknote, 
      color: 'bg-purple-500',
      change: '+5.2%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    { label: 'Jurnal Umum', icon: FileText, color: 'bg-blue-500', count: 156 },
    { label: 'Jurnal Khusus', icon: Calculator, color: 'bg-green-500', count: 89 },
    { label: 'Piutang', icon: DollarSign, color: 'bg-yellow-500', count: 45 },
    { label: 'Hutang', icon: CreditCard, color: 'bg-red-500', count: 32 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Accounting Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your financial performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
            <Calculator className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Revenue Trend</h2>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Revenue chart akan ditampilkan di sini</p>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Expense Breakdown</h2>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Expense pie chart akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`${action.color} p-2 rounded-lg`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800">{action.label}</span>
              </div>
              <span className="text-sm text-gray-500">{action.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-01-15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Penjualan Produk Elektronik
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Kas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  Rp 15,000,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  -
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-01-15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Pembelian Inventory
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Inventory
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                  Rp 8,500,000
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-01-14
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Pembayaran Gaji Karyawan
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Beban Gaji
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                  Rp 12,000,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountingOverview;