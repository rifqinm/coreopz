import React, { useState } from 'react';
import { Plus, Package, Edit, Trash2, Search, Filter, Warehouse } from 'lucide-react';

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
    if (stock > 50) return 'bg-green-100 text-green-800';
    if (stock > 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

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
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock < 20).length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Warehouses</p>
              <p className="text-2xl font-bold text-purple-600">{warehouses.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Warehouse className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Warehouse className="w-5 h-5 text-gray-400" />
            <select
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id.toString()}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Products by Warehouse</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Warehouse className="w-4 h-4 text-secondary mr-2" />
                      <span className="text-sm text-gray-900">{product.warehouseName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stock)}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-secondary hover:text-secondary/80 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-quaternary hover:text-quaternary/80 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};

export default WarehouseProducts;