import React, { useState } from 'react';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StockManagement from './pages/StockManagement';
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

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('page') || 'dashboard';
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
      'stock': 'Stock Management - Coreopz Management',
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
      'accounting-cash': 'Accounting - Cash Management - Coreopz Management'
      'profile': 'Profile - Coreopz Management'
    };
    
    return titleMap[page] || 'Coreopz Management';
  };
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url.toString());
  };

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setCurrentPage(urlParams.get('page') || 'dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const renderContent = () => {
  // Update document title when page changes
  useEffect(() => {
    document.title = getPageTitle(currentPage);
  }, [currentPage]);
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stores={stores} setStores={setStores} />;
      case 'stock':
        return <StockManagement />;
      case 'product':
        return <ProductManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'withdrawal':
        return <WithdrawalManagement />;
      case 'warehouse-products':
        return <WarehouseProducts />;
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
      default:
        return <Dashboard stores={stores} setStores={setStores} />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-tertiary/10">
          <Navbar />
          <div className="flex">
            <Sidebar 
              currentPage={currentPage} 
              setCurrentPage={handlePageChange}
              stores={stores}
            />
            <main className="flex-1 p-6">
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