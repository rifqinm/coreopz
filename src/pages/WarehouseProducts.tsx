import React, { useState } from 'react';
import { Plus, Package, Warehouse } from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import SearchFilter from '../components/common/SearchFilter';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

interface WarehouseProduct {
  id: number;
  name: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  stock: number;
  price: number;
  category: string;
  status: 'active' | 'inactive';
}

const WarehouseProducts: React.FC = () => {
  const [products, setProducts] = useState<WarehouseProduct[]>([
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG',
      sku: 'ASU-ROG-001',
      warehouseId: 1,
      warehouseName: 'Gudang Jakarta',
      stock: 25,
      price: 15000000,
      category: 'Elektronik',
      status: 'active'
    },
    {
      id: 2,
      name: 'Mouse Wireless Logitech',
      sku: 'LOG-002',
      warehouseId: 2,
      warehouseName: 'Gudang Surabaya',
      stock: 100,
      price: 350000,
      category: 'Elektronik',
      status: 'active'
    },
    {
      id: 3,
      name: 'Keyboard Mechanical',
      sku: 'KEY-003',
      warehouseId: 1,
      warehouseName: 'Gudang Jakarta',
      stock: 50,
      price: 800000,
      category: 'Elektronik',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Monitor 24 inch',
      sku: 'MON-004',
      warehouseId: 3,
      warehouseName: 'Gudang Bandung',
      stock: 30,
      price: 2500000,
      category: 'Elektronik',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const warehouses = [
    { id: 1, name: 'Gudang Jakarta' },
    { id: 2, name: 'Gudang Surabaya' },
    { id: 3, name: 'Gudang Bandung' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = filterWarehouse === 'all' || product.warehouseId.toString() === filterWarehouse;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const toggleProductStatus = (id: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };

  const getStockStatusColor = (stock: number) => {
    if (stock > 50) return 'bg-primary/20 text-primary';
    if (stock > 20) return 'bg-secondary/20 text-secondary';
    return 'bg-quaternary/20 text-quaternary';
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Active Products', value: products.filter(p => p.status === 'active').length, icon: Package, color: 'bg-green-500' },
    { label: 'Low Stock', value: products.filter(p => p.stock < 20).length, icon: Package, color: 'bg-orange-500' },
    { label: 'Warehouses', value: warehouses.length, icon: Warehouse, color: 'bg-purple-500' }
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Product',
      render: (value: string, row: WarehouseProduct) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
            <Package className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.category}</div>
          </div>
        </div>
      )
    },
    { key: 'sku', label: 'SKU' },
    { 
      key: 'warehouseName', 
      label: 'Warehouse',
      render: (value: string) => (
        <div className="flex items-center">
          <Warehouse className="w-4 h-4 text-secondary mr-2" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      )
    },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (value: number) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    { key: 'price', label: 'Price', render: (value: number) => `Rp ${value.toLocaleString()}` },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string, row: WarehouseProduct) => (
        <StatusBadge 
          status={value} 
          onClick={() => toggleProductStatus(row.id)}
        />
      )
    }
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Warehouse Products</h1>
          <p className="text-gray-600 mt-1">Manage products across all warehouses</p>
        </div>
        <button
          onClick={() => setIsAddProductOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-secondary to-tertiary text-white px-6 py-3 rounded-lg hover:from-secondary/90 hover:to-tertiary/90 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search products..."
        filters={[
          {
            icon: Warehouse,
            value: filterWarehouse,
            onChange: setFilterWarehouse,
            options: [
              { value: 'all', label: 'All Warehouses' },
              ...warehouses.map(w => ({ value: w.id.toString(), label: w.name }))
            ]
          },
          {
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]
          }
        ]}
      />

      {/* Products Table */}
      <DataTable
        title="Products by Warehouse"
        columns={columns}
        data={filteredProducts}
        emptyMessage="No products found"
        emptyIcon={Package}
      />
    </div>
  );
};

export default WarehouseProducts;