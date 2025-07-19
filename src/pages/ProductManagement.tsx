import React, { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { supabaseAdmin } from '../config/supabaseAdmin';

interface MarketplaceProduct {
  id: number;
  name: string;
  marketplace_sku: string;
  marketplace_sku_variant?: string;
  price: number;
  stock: number;
  marketplace: string;
  variant_name?: string;
  product_code?: string;
  specialPrice?: number;
  created_at: string;
  updated_at: string;
}

interface Store {
  id: number;
  name: string;
  store_type: string;
  platform_enum: string;
}

interface ProductManagementProps {
  storeId: string | null;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ storeId }) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMarketplace, setFilterMarketplace] = useState('all');

  const marketplaces = ['shopee', 'tokopedia', 'lazada', 'tiktok'];

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
      fetchProducts();
    }
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('stores')
        .select('id, name, store_type, platform_enum')
        .eq('id', storeId)
        .single();

      if (error) throw error;
      setStore(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('marketplace_products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (product.marketplace_sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesMarketplace = filterMarketplace === 'all' || product.marketplace === filterMarketplace;
    
    return matchesSearch && matchesMarketplace;
  });

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('marketplace_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBackToStores = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'integration-store');
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!storeId) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No store selected</p>
        <p className="text-gray-400 text-sm mt-2">Please select a store from the sidebar</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading products: {error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleBackToStores}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Stores
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {store ? `${store.name} - Products` : 'Store Products'}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage marketplace products for this store
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Store Info Card */}
      {store && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{store.name}</h2>
              <p className="opacity-90">
                {store.store_type} • {store.platform_enum}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm opacity-90">Total Products</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Package className="w-5 h-5 text-gray-400" />
            <select
              value={filterMarketplace}
              onChange={(e) => setFilterMarketplace(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Marketplaces</option>
              {marketplaces.map(marketplace => (
                <option key={marketplace} value={marketplace}>
                  {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
                </option>
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
              <p className="text-sm text-gray-600">Shopee Products</p>
              <p className="text-2xl font-bold text-green-600">{products.filter(p => p.marketplace === 'shopee').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tokopedia Products</p>
              <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.marketplace === 'tokopedia').length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-purple-600">
                {products.length > 0 ? 
                  `Rp ${Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length / 1000)}K` : 
                  'Rp 0'
                }
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Marketplace Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
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
                        <div className="font-medium text-gray-900">{product.product_name || 'No Name'}</div>
                        {product.variant_name && (
                          <div className="text-sm text-gray-500">{product.variant_name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{product.marketplace_sku || 'No SKU'}</div>
                      {product.marketplace_sku_variant && (
                        <div className="text-xs text-gray-500">{product.marketplace_sku_variant}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={product.marketplace || 'unknown'} 
                      variant="product" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">Rp {(product.price || 0).toLocaleString()}</div>
                      {product.specialPrice && (
                        <div className="text-xs text-red-600">Special: Rp {product.specialPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (product.stock || 0) > 20 ? 'bg-primary/20 text-primary' :
                      (product.stock || 0) > 5 ? 'bg-secondary/20 text-secondary' :
                      'bg-quaternary/20 text-quaternary'
                    }`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.updated_at ? new Date(product.updated_at).toLocaleDateString('id-ID') : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-2">
            {products.length === 0 ? 
              'This store has no products yet' : 
              'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;