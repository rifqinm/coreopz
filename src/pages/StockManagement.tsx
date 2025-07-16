import React, { useState } from 'react';
import { Plus, Warehouse, Truck, Package, Search, Filter, Edit, Trash2 } from 'lucide-react';

interface Warehouse {
  id: number;
  name: string;
  type: 'gudang' | 'supplier';
  location: string;
  totalProducts: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  warehouseId: number;
  stock: number;
  price: number;
  category: string;
}

const StockManagement: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: 1, name: 'Gudang Utama Jakarta', type: 'gudang', location: 'Jakarta', totalProducts: 150 },
    { id: 2, name: 'Supplier Elektronik Asia', type: 'supplier', location: 'Surabaya', totalProducts: 75 },
    { id: 3, name: 'Gudang Bandung', type: 'gudang', location: 'Bandung', totalProducts: 200 },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop Gaming ASUS', sku: 'ASU-001', warehouseId: 1, stock: 25, price: 12000000, category: 'Elektronik' },
    { id: 2, name: 'Mouse Wireless Logitech', sku: 'LOG-002', warehouseId: 2, stock: 100, price: 350000, category: 'Elektronik' },
    { id: 3, name: 'Keyboard Mechanical', sku: 'KEY-003', warehouseId: 1, stock: 50, price: 800000, category: 'Elektronik' },
    { id: 4, name: 'Monitor 24 inch', sku: 'MON-004', warehouseId: 3, stock: 30, price: 2500000, category: 'Elektronik' },
  ]);

  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    type: 'gudang' as 'gudang' | 'supplier',
    location: ''
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    warehouseId: 1,
    stock: 0,
    price: 0,
    category: ''
  });

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || warehouse.type === filterType;
    return matchesSearch && matchesType;
  });

  const getWarehouseName = (id: number) => {
    const warehouse = warehouses.find(w => w.id === id);
    return warehouse ? warehouse.name : 'Unknown';
  };

  const handleAddWarehouse = () => {
    if (newWarehouse.name && newWarehouse.location) {
      const warehouse: Warehouse = {
        id: warehouses.length + 1,
        ...newWarehouse,
        totalProducts: 0
      };
      setWarehouses([...warehouses, warehouse]);
      setNewWarehouse({ name: '', type: 'gudang', location: '' });
      setIsAddWarehouseOpen(false);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sku && newProduct.category) {
      const product: Product = {
        id: products.length + 1,
        ...newProduct
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', sku: '', warehouseId: 1, stock: 0, price: 0, category: '' });
      setIsAddProductOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsAddWarehouseOpen(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Warehouse</span>
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="gudang">Gudang</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <div key={warehouse.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {warehouse.type === 'gudang' ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Warehouse className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{warehouse.name}</h3>
                    <p className="text-sm text-gray-500">{warehouse.location}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  warehouse.type === 'gudang' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {warehouse.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{warehouse.totalProducts} products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Products Stock</h2>
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getWarehouseName(product.warehouseId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock > 50 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 20 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
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

      {/* Add Warehouse Modal */}
      {isAddWarehouseOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Warehouse</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse Name
                </label>
                <input
                  type="text"
                  value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newWarehouse.type}
                  onChange={(e) => setNewWarehouse({...newWarehouse, type: e.target.value as 'gudang' | 'supplier'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gudang">Gudang</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newWarehouse.location}
                  onChange={(e) => setNewWarehouse({...newWarehouse, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddWarehouseOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWarehouse}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse
                </label>
                <select
                  value={newProduct.warehouseId}
                  onChange={(e) => setNewProduct({...newProduct, warehouseId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;