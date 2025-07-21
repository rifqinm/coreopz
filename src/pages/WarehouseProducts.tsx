import React, { useState, useEffect } from 'react';
import { Plus, Package, Warehouse, Upload, MoreVertical } from 'lucide-react';
import { supabaseAdmin } from '../config/supabaseAdmin';
import StatsCard from '../components/common/StatsCard';
import SearchFilter from '../components/common/SearchFilter';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import WarehouseUploadModal from '../components/common/WarehouseUploadModal';

interface WarehouseProduct {
  id: string;
  warehouse_id: string;
  sku: string;
  product_name: string;
  stock_quantity: number;
  min_stock: number;
  max_stock: number | null;
  buy_price: number | null;
  sell_price: number | null;
  created_at: string;
  updated_at: string;
}

interface WarehouseData {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
  type: 'warehouse' | 'supplier';
}

interface WarehouseProductsProps {
  warehouseId?: string | null;
}

const WarehouseProducts: React.FC<WarehouseProductsProps> = ({ warehouseId }) => {
  const [products, setProducts] = useState<WarehouseProduct[]>([]);
  const [warehouse, setWarehouse] = useState<WarehouseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (warehouseId) {
      fetchWarehouseData();
      fetchProducts();
    }
  }, [warehouseId]);

  const fetchWarehouseData = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('warehouses')
        .select('id, name, location, description, is_active, type')
        .eq('id', warehouseId)
        .single();

      if (error) throw error;
      setWarehouse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('warehouse_products')
        .select('*')
        .eq('warehouse_id', warehouseId)
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
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabaseAdmin
        .from('warehouse_products')
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

  const handleDeleteProductLocal = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const toggleDropdown = (productId: string) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  const handleAction = (action: string, product: WarehouseProduct) => {
    setOpenDropdown(null);
    
    switch (action) {
      case 'view':
        console.log('View product:', product);
        break;
      case 'edit':
        console.log('Edit product:', product);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this product?')) {
          handleDeleteProduct(product.id);
        }
        break;
    }
  };

  const handleBackToWarehouses = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'integration-warehouse');
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!warehouseId) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No warehouse selected</p>
        <p className="text-gray-400 text-sm mt-2">Please select a warehouse from the sidebar</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
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

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Low Stock', value: products.filter(p => p.stock_quantity <= (p.min_stock || 10)).length, icon: Package, color: 'bg-orange-500' },
    { label: 'Out of Stock', value: products.filter(p => p.stock_quantity === 0).length, icon: Package, color: 'bg-red-500' },
    { label: 'Total Value', value: `Rp ${Math.round(products.reduce((sum, p) => sum + (p.stock_quantity * (p.sell_price || 0)), 0) / 1000000)}M`, icon: Warehouse, color: 'bg-purple-500' }
  ];

  const columns = [
    { 
      key: 'product_name', 
      label: 'Product',
      render: (value: string, row: WarehouseProduct) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
            <Package className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 max-w-xs">
              {(value || 'No Name').length > 60 
                ? `${(value || 'No Name').substring(0, 60)}...` 
                : (value || 'No Name')
              }
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <div>SKU: {row.sku}</div>
              {row.variant_sku && (
                <div>Variant SKU: {row.variant_sku}</div>
              )}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'buy_price', 
      label: 'Buy Price',
      render: (value: number | null) => value ? `Rp ${value.toLocaleString()}` : '-'
    },
    { 
      key: 'sell_price', 
      label: 'Sell Price',
      render: (value: number | null) => value ? `Rp ${value.toLocaleString()}` : '-'
    },
    { 
      key: 'stock_quantity', 
      label: 'Stock',
      render: (value: number) => (
        <span className="text-sm font-medium text-black">
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleBackToWarehouses}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Warehouses
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {warehouse ? `${warehouse.name} - Products` : 'Warehouse Products'}
          </h1>
          <p className="text-gray-600 mt-1">
            {warehouse 
              ? `Manage products in ${warehouse.name}${warehouse.location ? ` (${warehouse.location})` : ''}`
              : 'Manage products across all warehouses'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Products</span>
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-secondary to-tertiary text-white px-6 py-3 rounded-lg hover:from-secondary/90 hover:to-tertiary/90 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
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
      />

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{`Products in ${warehouse?.name || 'Warehouse'}`}</h2>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(product[column.key as keyof WarehouseProduct], product) : product[column.key as keyof WarehouseProduct]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(product.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openDropdown === product.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleAction('view', product)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleAction('edit', product)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAction('delete', product)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                            >
                              Delete
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-lg text-sm ${
                        currentPage === pageNum
                          ? 'bg-secondary text-white border-secondary'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        
        {paginatedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              {products.length === 0 ? 
                'Add your first product to get started' :
                'Try adjusting your search criteria'
              }
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <WarehouseUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        warehouseId={warehouseId || ''}
        warehouseName={warehouse?.name || 'Warehouse'}
        warehouseType={warehouse?.type || 'warehouse'}
      />
    </div>
  );
};

export default WarehouseProducts;