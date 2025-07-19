import React, { useState } from 'react';
import { Plus, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useDataService } from '../hooks/useDataService';
import { StoreService, ProductService, WarehouseService, EmployeeService, SalesService, AccountingService } from '../services/dataService';

const DataInsertExample: React.FC = () => {
  const { loading, error, insertData, insertMultipleData, clearError } = useDataService();
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Example: Insert Store
  const handleInsertStore = async () => {
    try {
      const storeData = {
        name: 'Toko Elektronik Baru',
        store_type: 'online' as const,
        platform_enum: 'shopee' as const,
        description: 'Toko elektronik dengan produk berkualitas',
        user_email: 'admin@example.com'
      };

      const result = await StoreService.createStore(storeData);
      setSuccessMessage(`Store created successfully with ID: ${result[0].id}`);
      console.log('Store created:', result);
    } catch (err) {
      console.error('Failed to create store:', err);
    }
  };

  // Example: Insert Product
  const handleInsertProduct = async () => {
    try {
      const productData = {
        name: 'Laptop Gaming ROG',
        sku: 'ROG-001',
        cattegory: 'Elektronik',
        sku_variation: 'ROG-001-16GB',
        variation: '16GB RAM',
        buy_price: 12000000,
        selling_price: 15000000,
        is_active: true
      };

      const result = await ProductService.createProduct(productData);
      setSuccessMessage(`Product created successfully with ID: ${result[0].id}`);
      console.log('Product created:', result);
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  // Example: Insert Multiple Products
  const handleInsertMultipleProducts = async () => {
    try {
      const productsData = [
        {
          name: 'iPhone 14 Pro',
          sku: 'IP14-001',
          cattegory: 'Elektronik',
          selling_price: 18000000
        },
        {
          name: 'Samsung Galaxy S23',
          sku: 'SAM-001',
          cattegory: 'Elektronik',
          selling_price: 16000000
        },
        {
          name: 'MacBook Air M2',
          sku: 'MBA-001',
          cattegory: 'Elektronik',
          selling_price: 20000000
        }
      ];

      const result = await ProductService.createMultipleProducts(productsData);
      setSuccessMessage(`${result.length} products created successfully`);
      console.log('Products created:', result);
    } catch (err) {
      console.error('Failed to create products:', err);
    }
  };

  // Example: Insert Warehouse
  const handleInsertWarehouse = async () => {
    try {
      const warehouseData = {
        name: 'Gudang Jakarta Pusat',
        location: 'Jakarta Pusat, DKI Jakarta',
        description: 'Gudang utama untuk wilayah Jakarta'
      };

      const result = await WarehouseService.createWarehouse(warehouseData);
      setSuccessMessage(`Warehouse created successfully with ID: ${result[0].id}`);
      console.log('Warehouse created:', result);
    } catch (err) {
      console.error('Failed to create warehouse:', err);
    }
  };

  // Example: Insert Employee
  const handleInsertEmployee = async () => {
    try {
      const employeeData = {
        name: 'John Doe',
        unit: 'IT Department',
        department: 'Technology',
        position: 'Software Developer',
        status: 'tetap' as const,
        birth_date: '1990-01-15',
        join_date: '2024-01-01',
        email: 'john.doe@company.com'
      };

      const result = await EmployeeService.createEmployee(employeeData);
      setSuccessMessage(`Employee created successfully with ID: ${result[0].id}`);
      console.log('Employee created:', result);
    } catch (err) {
      console.error('Failed to create employee:', err);
    }
  };

  // Example: Insert Marketplace Sale
  const handleInsertSale = async () => {
    try {
      const salesData = {
        marketplace: 'shopee' as const,
        store_id: 1,
        order_code: 'ORD-001',
        order_status: 'completed',
        marketplace_sku: 'ROG-001',
        quantity: 1,
        order_date: '2024-01-15',
        customer_name: 'Jane Smith',
        product_price: 15000000,
        total_payment: 15000000,
        payment_method: 'Credit Card'
      };

      const result = await SalesService.createMarketplaceSale(salesData);
      setSuccessMessage(`Sale created successfully with ID: ${result[0].id}`);
      console.log('Sale created:', result);
    } catch (err) {
      console.error('Failed to create sale:', err);
    }
  };

  // Example: Insert Journal Entry
  const handleInsertJournalEntry = async () => {
    try {
      const journalData = {
        tanggal: '2024-01-15',
        keterangan: 'Penjualan produk elektronik',
        debit: 15000000,
        kredit: 0,
        akunaccounting: 'Kas',
        nota: 'INV-001',
        email: 'admin@example.com'
      };

      const result = await AccountingService.createJournalEntry(journalData);
      setSuccessMessage(`Journal entry created successfully with ID: ${result[0].id}`);
      console.log('Journal entry created:', result);
    } catch (err) {
      console.error('Failed to create journal entry:', err);
    }
  };

  // Example: Direct insert with service
  const handleDirectInsert = async () => {
    try {
      const userData = {
        email: 'newuser@example.com',
        full_name: 'New User',
        status: true,
        provider: 'email',
        created_at: new Date().toISOString()
      };

      const result = await insertData('users', userData);
      setSuccessMessage(`User created successfully with ID: ${result[0].id}`);
      console.log('User created:', result);
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    clearError();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Insert Examples</h2>
          <p className="text-gray-600 mt-1">Examples using Supabase Service Role Key</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg">
          <Database className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Service Role</span>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button onClick={clearMessages} className="ml-auto text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{successMessage}</span>
          <button onClick={clearMessages} className="ml-auto text-green-500 hover:text-green-700">
            ×
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={handleInsertStore}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Store</span>
        </button>

        <button
          onClick={handleInsertProduct}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Product</span>
        </button>

        <button
          onClick={handleInsertMultipleProducts}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Multiple Products</span>
        </button>

        <button
          onClick={handleInsertWarehouse}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Warehouse</span>
        </button>

        <button
          onClick={handleInsertEmployee}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Employee</span>
        </button>

        <button
          onClick={handleInsertSale}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Sale</span>
        </button>

        <button
          onClick={handleInsertJournalEntry}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Journal Entry</span>
        </button>

        <button
          onClick={handleDirectInsert}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Direct Insert User</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Processing...</span>
        </div>
      )}

      {/* Code Examples */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700">1. Using Service Classes:</h4>
            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`import { StoreService } from '../services/dataService';

const result = await StoreService.createStore({
  name: 'My Store',
  store_type: 'online',
  user_email: 'user@example.com'
});`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">2. Using Hook:</h4>
            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`const { insertData, loading, error } = useDataService();

const result = await insertData('products', {
  name: 'Product Name',
  sku: 'PROD-001'
});`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-700">3. Direct Service Usage:</h4>
            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`import { DataService } from '../services/dataService';

const result = await DataService.insertWithServiceRole('table_name', data);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInsertExample;