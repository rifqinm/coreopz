import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, CheckCircle, XCircle, MapPin, MoreVertical, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { supabaseAdmin } from '../config/supabaseAdmin';
import { useAuth } from '../contexts/AuthContext';
import CreateWarehouseModal from '../components/common/CreateWarehouseModal';
import EditWarehouseModal from '../components/common/EditWarehouseModal';
import Toast from '../components/common/Toast';

interface WarehouseData {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
  type: 'warehouse' | 'supplier';
  created_at: string;
  updated_at: string;
}

interface WarehouseIntegration extends WarehouseData {
  status: 'connected' | 'disconnected' | 'error';
  productCount: number;
}

const IntegrationWarehouse: React.FC = () => {
  const [integrations, setIntegrations] = useState<WarehouseIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseIntegration | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<WarehouseIntegration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'loading';
    message: string;
  }>({ show: false, type: 'loading', message: '' });
  const { supabaseUser } = useAuth();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      
      let query = supabaseAdmin
        .from('warehouses')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by user if authenticated
      if (supabaseUser?.id) {
        query = query.eq('user_id', supabaseUser.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;

      // Get product counts for each warehouse
      const warehouseIds = (data || []).map(warehouse => warehouse.id);
      const { data: productCounts, error: productError } = await supabaseAdmin
        .from('warehouse_products')
        .select('warehouse_id')
        .in('warehouse_id', warehouseIds);

      if (productError) {
        console.error('Error fetching product counts:', productError);
      }

      // Count products per warehouse
      const productCountMap = (productCounts || []).reduce((acc, product) => {
        acc[product.warehouse_id] = (acc[product.warehouse_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Transform data to include integration-specific fields
      const transformedData: WarehouseIntegration[] = (data || []).map(warehouse => ({
        ...warehouse,
        status: warehouse.is_active ? 'connected' : 'disconnected' as 'connected' | 'disconnected' | 'error',
        productCount: productCountMap[warehouse.id] || 0
      }));

      setIntegrations(transformedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleWarehouseCreated = () => {
    // Refresh the warehouses list after creating a new warehouse
    fetchWarehouses();
  };

  const handleWarehouseUpdated = () => {
    // Refresh the warehouses list after updating a warehouse
    fetchWarehouses();
    setIsEditModalOpen(false);
    setEditingWarehouse(null);
  };

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ show: false, type: 'loading', message: '' });
  };

  const handleViewProducts = (warehouseId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', `warehouse-products/${warehouseId}`);
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const openDeleteModal = (warehouse: WarehouseIntegration) => {
    setWarehouseToDelete(warehouse);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const closeDeleteModal = () => {
    setWarehouseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteWarehouse = async () => {
    if (!warehouseToDelete) return;

    setIsDeleting(true);
    showToast('loading', 'Deleting warehouse and all products...');

    try {
      // First delete all warehouse_products associated with this warehouse
      const { error: productsError } = await supabaseAdmin
        .from('warehouse_products')
        .delete()
        .eq('warehouse_id', warehouseToDelete.id);

      if (productsError) {
        console.error('Error deleting warehouse products:', productsError);
        // Continue with warehouse deletion even if products deletion fails
      }

      // Then delete the warehouse
      const { error } = await supabaseAdmin
        .from('warehouses')
        .delete()
        .eq('id', warehouseToDelete.id);

      if (error) throw error;

      // Remove from local state
      setIntegrations(prev => prev.filter(warehouse => warehouse.id !== warehouseToDelete.id));
      
      showToast('success', `Warehouse "${warehouseToDelete.name}" and all products deleted successfully!`);
      
      // Close modal after success
      setTimeout(() => {
        closeDeleteModal();
        hideToast();
      }, 2000);
    } catch (err: any) {
      showToast('error', 'Failed to delete warehouse: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditWarehouse = (warehouseId: string) => {
    const warehouse = integrations.find(w => w.id === warehouseId);
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setIsEditModalOpen(true);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (warehouseId: string) => {
    setOpenDropdown(openDropdown === warehouseId ? null : warehouseId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        <span className="ml-2 text-gray-600">Loading warehouses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading warehouses: {error}</p>
        <button 
          onClick={fetchWarehouses}
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
          <h1 className="text-3xl font-bold text-gray-800">Warehouse Integration</h1>
          <p className="text-gray-600 mt-1">Manage warehouse management system connections</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create Warehouse</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-800">{integrations.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Warehouse className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-green-600">{integrations.filter(i => i.status === 'connected').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-purple-600">{integrations.reduce((sum, i) => sum + i.productCount, 0)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Warehouse className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      {integrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Warehouse className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.type === 'supplier' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {integration.type === 'supplier' ? 'Supplier' : 'Warehouse'}
                      </span>
                    </div>
                    {integration.location && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-500">{integration.location}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{integration.productCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{integration.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{integration.type === 'supplier' ? 'Supplier' : 'Warehouse'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(integration.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{integration.location || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(integration.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openDropdown === integration.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setOpenDropdown(null)}
                      ></div>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => handleViewProducts(integration.id)}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span>View Products</span>
                          </button>
                          <button
                            onClick={() => handleEditWarehouse(integration.id)}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-500" />
                            <span>Edit Warehouse</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(integration)}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Warehouse</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {integration.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No warehouses found</p>
          <p className="text-gray-400 text-sm mt-2">Create your first warehouse to get started</p>
        </div>
      )}

      {/* Create Warehouse Modal */}
      <CreateWarehouseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onWarehouseCreated={handleWarehouseCreated}
      />

      {/* Edit Warehouse Modal */}
      <EditWarehouseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingWarehouse(null);
        }}
        warehouse={editingWarehouse}
        onWarehouseUpdated={handleWarehouseUpdated}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && warehouseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Warehouse</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800 mb-2">
                      You are about to delete "{warehouseToDelete.name}"
                    </p>
                    <div className="text-red-700 space-y-1">
                      <p>• Warehouse will be permanently deleted</p>
                      <p>• All {warehouseToDelete.productCount} products in this warehouse will be deleted</p>
                      <p>• This action cannot be undone</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Warehouse ID:</span>
                  <p className="font-medium text-gray-800">{warehouseToDelete.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Products:</span>
                  <p className="font-medium text-gray-800">{warehouseToDelete.productCount} items</p>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="font-medium text-gray-800">{warehouseToDelete.location || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium text-gray-800">{warehouseToDelete.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWarehouse}
                disabled={isDeleting}
                className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Warehouse</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
};

export default IntegrationWarehouse;