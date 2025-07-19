import React, { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Download } from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import SearchFilter from '../components/common/SearchFilter';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

interface Sale {
  id: number;
  productName: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface SalesManagementProps {
  storeId?: string | null;
}

const SalesManagement: React.FC<SalesManagementProps> = ({ storeId }) => {
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
  ] as const;

  const columns = [
    { key: 'id', label: 'Order ID', render: (value: number) => `#${value.toString().padStart(4, '0')}` },
    { key: 'productName', label: 'Product' },
    { key: 'customerName', label: 'Customer' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'totalAmount', label: 'Total Amount', render: (value: number) => `Rp ${value.toLocaleString()}` },
    { key: 'date', label: 'Date', render: (value: string) => new Date(value).toLocaleDateString('id-ID') },
    { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value} variant="order" /> }
  ];

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
          <StatsCard key={index} {...stat} />
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
      <SearchFilter
        searchTerm=""
        onSearchChange={() => {}}
        searchPlaceholder="Search sales..."
        filters={[
          {
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' }
            ]
          }
        ]}
      />

      {/* Sales Table */}
      <DataTable
        title="Recent Sales"
        columns={columns}
        data={filteredSales}
        emptyMessage="No sales found"
        emptyIcon={ShoppingCart}
      />
    </div>
  );
};

export default SalesManagement;