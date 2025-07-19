import React, { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, Eye, Search, Filter, MoreVertical, Upload } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FileUploadModal from '../components/common/FileUploadModal';
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMarketplace, setFilterMarketplace] = useState('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabaseAdmin
        .from('marketplace_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      setOpenDropdown(null);
      
      // Show success message
      alert('Product deleted successfully.');
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const toggleDropdown = (productId: string) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  const handleAction = (action: string, product: MarketplaceProduct) => {
    setOpenDropdown(null);
    
    switch (action) {
      case 'view':
        // Handle view action
        console.log('View product:', product);
        break;
      case 'edit':
        // Handle edit action
        console.log('Edit product:', product);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this product?')) {
          handleDeleteProduct(product.id.toString());
        }
        break;
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
            {store ? `${store.name} - Products (${store.platform_enum})` : 'Store Products'}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage marketplace products for this store
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Products</span>
          </button>
          <button 
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-primary">{products.length}</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shopee Products</p>
              <p className="text-2xl font-bold text-tertiary">{products.filter(p => p.marketplace === 'shopee').length}</p>
            </div>
            <div className="bg-tertiary/20 p-3 rounded-lg">
              <Package className="w-6 h-6 text-tertiary" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tokopedia Products</p>
              <p className="text-2xl font-bold text-secondary">{products.filter(p => p.marketplace === 'tokopedia').length}</p>
            </div>
            <div className="bg-secondary/20 p-3 rounded-lg">
              <Package className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-quaternary">
                {products.length > 0 ? 
                  `Rp ${Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length / 1000)}K` : 
                  'Rp 0'
                }
              </p>
            </div>
            <div className="bg-quaternary/20 p-3 rounded-lg">
              <Package className="w-6 h-6 text-quaternary" />
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
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internal Product ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                          {(product.product_name || 'No Name').length > 60 
                            ? `${(product.product_name || 'No Name').substring(0, 60)}...` 
                            : (product.product_name || 'No Name')
                          }
                          </span>
                          {/* New Badge - show if created within last 24 hours */}
                          {product.created_at && 
                           new Date().getTime() - new Date(product.created_at).getTime() < 24 * 60 * 60 * 1000 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              new
                            </span>
                          )}
                        </div>
                        {/* Marketplace SKU Information */}
                        <div className="text-sm text-gray-500 mt-1">
                          {product.marketplace_sku && (
                            <div>
                              <span className="font-medium">SKU:</span> {product.marketplace_sku}
                              {product.marketplace_sku_variant && (
                                <span className="ml-2">
                                  - <span className="font-medium">Variant:</span> {product.marketplace_sku_variant}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {product.variant_name && (
                          <div className="text-sm text-gray-500">
                            {product.variant_name.length > 40 
                              ? `${product.variant_name.substring(0, 40)}...` 
                              : product.variant_name
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {product.specialPrice ? (
                        <div>
                          <div className="font-medium text-black">Rp {product.specialPrice.toLocaleString()}</div>
                          <div className="text-xs line-through text-gray-500">Rp {(product.price || 0).toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="font-medium">Rp {(product.price || 0).toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-black">
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-gray-600">
                      {product.internal_product_id || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(product.id.toString())}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openDropdown === product.id.toString() && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleAction('view', product)}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-4 h-4 text-primary" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleAction('edit', product)}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Edit className="w-4 h-4 text-secondary" />
                              <span>Edit Product</span>
                            </button>
                            <button
                              onClick={() => handleAction('delete', product)}
                              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Product</span>
                            </button>
                          </div>
                        </div>
                      )}
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

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        storeId={storeId || ''}
        storeName={store?.name || ''}
        marketplace={store?.platform_enum || ''}
      />
    </div>
  );
};

export default ProductManagement;