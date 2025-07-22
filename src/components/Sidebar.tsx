import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  CreditCard, 
  ChevronDown, 
  ChevronRight,
  Store,
  Warehouse,
  Settings,
  Calculator,
  FileText,
  DollarSign,
  PieChart,
  Banknote,
  Receipt,
  BookOpen,
  BarChart3,
  Layers
} from 'lucide-react';
import { supabaseAdmin } from '../config/supabaseAdmin';
import { useAuth } from '../contexts/AuthContext';

interface Store {
  id: number;
  name: string;
  status: boolean;
  store_type: string;
  user_id: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  is_active: boolean;
}

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { currentUser, supabaseUser } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [expandedStores, setExpandedStores] = useState<number[]>([]);
  const [isStoresCollapsed, setIsStoresCollapsed] = useState(false);
  const [isWarehousesCollapsed, setIsWarehousesCollapsed] = useState(false);
  const [isIntegrationCollapsed, setIsIntegrationCollapsed] = useState(false);
  const [isAccountingCollapsed, setIsAccountingCollapsed] = useState(false);
  const [expandedWarehouses, setExpandedWarehouses] = useState<string[]>([]);

  // Helper function to check if current page matches store page
  const isCurrentStorePage = (pageType: string, storeId: number) => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPageParam = urlParams.get('page');
    return currentPageParam === `${pageType}/${storeId}`;
  };

  // Helper function to check if current page matches warehouse page
  const isCurrentWarehousePage = (pageType: string, warehouseId: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPageParam = urlParams.get('page');
    return currentPageParam === `${pageType}/${warehouseId}`;
  };

  useEffect(() => {
    if (supabaseUser?.id) {
      fetchStores();
      fetchWarehouses();
    } else {
      fetchWarehouses();
    }
  }, [supabaseUser]);

  // Auto-expand store if user is on a store page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPageParam = urlParams.get('page');
    
    if (currentPageParam && (currentPageParam.startsWith('product/') || 
        currentPageParam.startsWith('sales/') || 
        currentPageParam.startsWith('withdrawal/'))) {
      const storeId = parseInt(currentPageParam.split('/')[1]);
      if (!expandedStores.includes(storeId)) {
        setExpandedStores(prev => [...prev, storeId]);
      }
    }
    
    // Auto-expand warehouse if user is on a warehouse page
    if (currentPageParam && currentPageParam.startsWith('warehouse-products/')) {
      const warehouseId = currentPageParam.split('/')[1];
      if (!expandedWarehouses.includes(warehouseId)) {
        setExpandedWarehouses(prev => [...prev, warehouseId]);
      }
    }
  }, [stores, expandedStores]);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('stores')
        .select('id, name, status, store_type, user_id')
        .eq('user_id', supabaseUser?.id)
        .eq('status', true)
        .order('created_at', { ascending: false });


      if (error) {
        return;
      }
      
      setStores(data || []);
    } catch (err) {
    }
  };

  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('warehouses')
        .select('id, name, location, is_active')
        .eq('user_id', supabaseUser?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching warehouses:', error);
        return;
      }
      
      setWarehouses(data || []);
    } catch (err) {
      console.error('Error in fetchWarehouses:', err);
    }
  };

  const toggleStore = (storeId: number) => {
    setExpandedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const toggleWarehouse = (warehouseId: string) => {
    setExpandedWarehouses(prev => 
      prev.includes(warehouseId) 
        ? prev.filter(id => id !== warehouseId)
        : [...prev, warehouseId]
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home }
  ];

  // Integration menu items
  const integrationItems = [
    { id: 'integration-store', label: 'Store Integration', icon: Store },
    { id: 'integration-warehouse', label: 'Warehouse Integration', icon: Warehouse },
    { id: 'integration-sheets', label: 'Sheets Integration', icon: FileText }
  ];

  // Accounting menu items
  const accountingItems = [
    { id: 'accounting-overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'accounting-general-journal', label: 'Jurnal Umum', icon: BookOpen },
    { id: 'accounting-special-journal', label: 'Jurnal Khusus', icon: Receipt },
    { id: 'accounting-cashflow', label: 'Cashflow', icon: TrendingUp },
    { id: 'accounting-receivables', label: 'Piutang', icon: DollarSign },
    { id: 'accounting-payables', label: 'Hutang', icon: CreditCard },
    { id: 'accounting-cash', label: 'Cash Management', icon: Banknote }
  ];

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen fixed top-0 left-0 z-30 overflow-y-auto">
      {/* Header Space */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white shadow-md">
            <img 
              src="https://bdtmmupmfnowetokvdwx.supabase.co/storage/v1/object/public/avatars/avatars/logome.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
            Coreopz
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <nav className="space-y-1">
          {/* Main Menu Items */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                currentPage === item.id
                  ? 'bg-gray-100 text-gray-800 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-3 border-t border-gray-200">
            {/* Integration Section */}
            <button
              onClick={() => setIsIntegrationCollapsed(!isIntegrationCollapsed)}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Integration
                </span>
              </div>
              {isIntegrationCollapsed ? (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              )}
            </button>
            
            {!isIntegrationCollapsed && (
              <div className="ml-2 mt-1 space-y-1">
                {integrationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-xs ${
                      currentPage === item.id
                        ? 'bg-gray-100 text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label.replace(' Integration', '')}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Accounting Section */}
            <button
              onClick={() => setIsAccountingCollapsed(!isAccountingCollapsed)}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all mt-2"
            >
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Accounting
                </span>
              </div>
              {isAccountingCollapsed ? (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              )}
            </button>
            
            {!isAccountingCollapsed && (
              <div className="ml-2 mt-1 space-y-1">
                {accountingItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-xs ${
                      currentPage === item.id
                        ? 'bg-gray-100 text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label.replace('Dashboard Overview', 'Dashboard')}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Toko Aktif Section */}
            <button
              onClick={() => setIsStoresCollapsed(!isStoresCollapsed)}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all mt-2"
            >
              <div className="flex items-center space-x-2">
                <Store className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Toko Aktif ({stores.length})
                </span>
              </div>
              {isStoresCollapsed ? (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              )}
            </button>
            
            {!isStoresCollapsed && (
              <div className="ml-2 mt-1 space-y-1">
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <div key={store.id} className="space-y-1">
                      <button
                        onClick={() => toggleStore(store.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          isCurrentStorePage('product', store.id) || 
                          isCurrentStorePage('sales', store.id) || 
                          isCurrentStorePage('withdrawal', store.id)
                            ? 'bg-gray-50 text-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium truncate">{store.name}</span>
                        </div>
                        {expandedStores.includes(store.id) ? (
                          <ChevronDown className="w-3 h-3 flex-shrink-0 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedStores.includes(store.id) && (
                        <div className="ml-4 space-y-1">
                          <button
                            onClick={() => {
                              setCurrentPage(`product/${store.id}`);
                              // Update URL to reflect the current store
                              const url = new URL(window.location.href);
                              url.searchParams.set('page', `product/${store.id}`);
                              window.history.pushState({}, '', url.toString());
                            }}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                              isCurrentStorePage('product', store.id)
                                ? 'bg-gray-100 text-gray-800 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>Product</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentPage(`sales/${store.id}`);
                              const url = new URL(window.location.href);
                              url.searchParams.set('page', `sales/${store.id}`);
                              window.history.pushState({}, '', url.toString());
                            }}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                              isCurrentStorePage('sales', store.id)
                                ? 'bg-gray-100 text-gray-800 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>Sales</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentPage(`withdrawal/${store.id}`);
                              const url = new URL(window.location.href);
                              url.searchParams.set('page', `withdrawal/${store.id}`);
                              window.history.pushState({}, '', url.toString());
                            }}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                              isCurrentStorePage('withdrawal', store.id)
                                ? 'bg-gray-100 text-gray-800 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>Withdrawal</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500">
                    {supabaseUser?.id ? 'No active stores' : 'Loading...'}
                  </div>
                )}
              </div>
            )}

            {/* Warehouse Section */}
            <button
              onClick={() => setIsWarehousesCollapsed(!isWarehousesCollapsed)}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all mt-2"
            >
              <div className="flex items-center space-x-2">
                <Warehouse className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Warehouse ({warehouses.length})
                </span>
              </div>
              {isWarehousesCollapsed ? (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              )}
            </button>
            
            {!isWarehousesCollapsed && (
              <div className="ml-2 mt-1 space-y-1">
                {warehouses.length > 0 ? (
                  warehouses.map((warehouse) => (
                    <div key={warehouse.id} className="space-y-1">
                      <button
                        onClick={() => toggleWarehouse(warehouse.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          isCurrentWarehousePage('warehouse-products', warehouse.id)
                            ? 'bg-gray-50 text-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm font-medium truncate">{warehouse.name}</span>
                        {expandedWarehouses.includes(warehouse.id) ? (
                          <ChevronDown className="w-3 h-3 flex-shrink-0 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedWarehouses.includes(warehouse.id) && (
                        <div className="ml-4 space-y-1">
                          <button
                            onClick={() => {
                              setCurrentPage(`warehouse-products/${warehouse.id}`);
                              // Update URL to reflect the current warehouse
                              const url = new URL(window.location.href);
                              url.searchParams.set('page', `warehouse-products/${warehouse.id}`);
                              window.history.pushState({}, '', url.toString());
                            }}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                              isCurrentWarehousePage('warehouse-products', warehouse.id)
                                ? 'bg-gray-100 text-gray-800 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>Manage Product</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500">
                    No active warehouses
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;