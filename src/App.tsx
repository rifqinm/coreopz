import React, { useState } from 'react';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import SalesManagement from './pages/SalesManagement';
import WithdrawalManagement from './pages/WithdrawalManagement';
import WarehouseProducts from './pages/WarehouseProducts';
import IntegrationStore from './pages/IntegrationStore';
import IntegrationWarehouse from './pages/IntegrationWarehouse';
import IntegrationSheets from './pages/IntegrationSheets';
import AccountingOverview from './pages/AccountingOverview';
import AccountingGeneralJournal from './pages/AccountingGeneralJournal';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';

function App() {
  // Check if we're on a standalone page that doesn't require auth
  const isStandalonePage = () => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    return path === '/reset-password' || 
           path === '/new-password' || 
           (path === '/' && mode === 'resetPassword');
  };

  // If it's a standalone page, render it immediately without any auth checks
  if (isStandalonePage()) {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    return (
      <AuthProvider>
        {path === '/reset-password' && <ResetPasswordStandalone />}
        {path === '/new-password' && <NewPassword />}
        {path === '/' && mode === 'resetPassword' && <NewPassword />}
      </AuthProvider>
    );
  }

  // For admin pages, continue with normal flow
  const [currentPage, setCurrentPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('page') || 'dashboard';
  });
  
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page?.startsWith('product/') || page?.startsWith('sales/') || page?.startsWith('withdrawal/')) {
      return page.split('/')[1];
    }
    return null;
  });
  
  const [stores, setStores] = useState([
    { id: 1, name: 'Toko Elektronik', status: 'active', type: 'online' },
    { id: 2, name: 'Toko Fashion', status: 'active', type: 'offline' },
    { id: 3, name: 'Toko Makanan', status: 'inactive', type: 'online' }
  ]);

  // Function to get page title based on current page
  const getPageTitle = (page: string) => {
    const titleMap: { [key: string]: string } = {
      'dashboard': 'Dashboard - Coreopz Management',
      'product': 'Product Management - Coreopz Management',
      'sales': 'Sales Management - Coreopz Management',
      'withdrawal': 'Withdrawal Management - Coreopz Management',
      'warehouse-products': 'Warehouse Products - Coreopz Management',
      'integration-store': 'Store Integration - Coreopz Management',
      'integration-warehouse': 'Warehouse Integration - Coreopz Management',
      'integration-sheets': 'Sheets Integration - Coreopz Management',
      'accounting-overview': 'Accounting Dashboard - Coreopz Management',
      'accounting-general-journal': 'Accounting - Jurnal Umum - Coreopz Management',
      'accounting-special-journal': 'Accounting - Jurnal Khusus - Coreopz Management',
      'accounting-cashflow': 'Accounting - Cashflow - Coreopz Management',
      'accounting-receivables': 'Accounting - Piutang - Coreopz Management',
      'accounting-payables': 'Accounting - Hutang - Coreopz Management',
      'accounting-cash': 'Accounting - Cash Management - Coreopz Management',
      'profile': 'Profile - Coreopz Management',
      'reset-password': 'Reset Password - Coreopz Management',
      'new-password': 'Set New Password - Coreopz Management'
    };
    
    // Handle product pages with store ID
    if (page.startsWith('product/')) {
      return 'Store Products - Coreopz Management';
    }
    
    return titleMap[page] || 'Coreopz Management';
  };

  const handlePageChange = (page: string) => {
    // Parse page and store ID if it's a product page
    if (page.startsWith('product/') || page.startsWith('sales/') || page.startsWith('withdrawal/') || page.startsWith('warehouse-products/')) {
      const storeId = page.split('/')[1];
      setCurrentStoreId(storeId);
      setCurrentPage(page.split('/')[0]);
    } else {
      setCurrentStoreId(null);
      setCurrentPage(page);
    }
    
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url.toString());
  };

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page') || 'dashboard';
      
      if (page.startsWith('product/') || page.startsWith('sales/') || page.startsWith('withdrawal/') || page.startsWith('warehouse-products/')) {
        const storeId = page.split('/')[1];
        setCurrentStoreId(storeId);
        setCurrentPage(page.split('/')[0]);
      } else {
        setCurrentStoreId(null);
        setCurrentPage(page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title when page changes
  useEffect(() => {
    const pageForTitle = currentStoreId ? `${currentPage}/${currentStoreId}` : currentPage;
    document.title = getPageTitle(pageForTitle);
  }, [currentPage, currentStoreId]);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stores={stores} setStores={setStores} />;
      case 'product':
        return <ProductManagement storeId={currentStoreId} />;
      case 'sales':
        return <SalesManagement storeId={currentStoreId} />;
      case 'withdrawal':
        return <WithdrawalManagement storeId={currentStoreId} />;
      case 'warehouse-products':
        return <WarehouseProducts warehouseId={currentStoreId} />;
      case 'integration-store':
        return <IntegrationStore />;
      case 'integration-warehouse':
        return <IntegrationWarehouse />;
      case 'integration-sheets':
        return <IntegrationSheets />;
      case 'accounting-overview':
        return <AccountingOverview />;
      case 'accounting-general-journal':
        return <AccountingGeneralJournal />;
      case 'accounting-special-journal':
        return <div className="p-6 text-center text-gray-500">Jurnal Khusus - Coming Soon</div>;
      case 'accounting-cashflow':
        return <div className="p-6 text-center text-gray-500">Cashflow - Coming Soon</div>;
      case 'accounting-receivables':
        return <div className="p-6 text-center text-gray-500">Piutang - Coming Soon</div>;
      case 'accounting-payables':
        return <div className="p-6 text-center text-gray-500">Hutang - Coming Soon</div>;
      case 'accounting-cash':
        return <div className="p-6 text-center text-gray-500">Cash Management - Coming Soon</div>;
      case 'profile':
        return <Profile />;
      case 'reset-password':
        return <ResetPassword />;
      case 'new-password':
        return <NewPassword />;
      default:
        return <Dashboard stores={stores} setStores={setStores} />;
    }
  };

  // For admin pages, wrap with ProtectedRoute
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-tertiary/10">
          <Navbar />
          <div className="flex">
            <Sidebar 
              currentPage={currentPage} 
              setCurrentPage={handlePageChange}
            />
            <main className="flex-1 p-6 ml-64 mt-20">
              {renderContent()}
            </main>
          </div>
          <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
            Produced by Rifqi
          </footer>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;