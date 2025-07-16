import React, { useState } from 'react';
import { Plus, Package, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  image: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG',
      sku: 'ASU-ROG-001',
      price: 15000000,
      stock: 25,
      category: 'Elektronik',
      status: 'active',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'iPhone 14 Pro Max',
      sku: 'APL-IP14-001',
      price: 18000000,
      stock: 15,
      category: 'Elektronik',
      status: 'active',
      image: 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Nike Air Jordan',
      sku: 'NK-AJ-001',
      price: 2500000,
      stock: 50,
      category: 'Fashion',
      status: 'inactive',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Elektronik', 'Fashion', 'Makanan', 'Olahraga', 'Kecantikan'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Stats */}
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
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {(products.reduce((sum, p) => sum + (p.price * p.stock), 0) / 1000000).toFixed(0)}M
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-blue-600">
                  Rp {product.price.toLocaleString()}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  product.stock > 20 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button className="text-green-600 hover:text-green-800 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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

export default ProductManagement;