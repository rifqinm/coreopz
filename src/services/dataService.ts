import { supabaseAdmin, supabase } from '../config/supabaseAdmin';

// Service untuk operasi data dengan service role
export class DataService {
  
  // Insert data dengan service role (bypass RLS)
  static async insertWithServiceRole(table: string, data: any) {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(table)
        .insert(data)
        .select();

      if (error) {
        console.error(`Error inserting to ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Service role insert error:', error);
      throw error;
    }
  }

  // Insert multiple records dengan service role
  static async insertMultipleWithServiceRole(table: string, dataArray: any[]) {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(table)
        .insert(dataArray)
        .select();

      if (error) {
        console.error(`Error bulk inserting to ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Service role bulk insert error:', error);
      throw error;
    }
  }

  // Update data dengan service role
  static async updateWithServiceRole(table: string, data: any, condition: any) {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(table)
        .update(data)
        .match(condition)
        .select();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Service role update error:', error);
      throw error;
    }
  }

  // Delete data dengan service role
  static async deleteWithServiceRole(table: string, condition: any) {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(table)
        .delete()
        .match(condition)
        .select();

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Service role delete error:', error);
      throw error;
    }
  }

  // Upsert data dengan service role
  static async upsertWithServiceRole(table: string, data: any, onConflict?: string) {
    try {
      let query = supabaseAdmin.from(table).upsert(data);
      
      if (onConflict) {
        query = query.onConflict(onConflict);
      }

      const { data: result, error } = await query.select();

      if (error) {
        console.error(`Error upserting to ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Service role upsert error:', error);
      throw error;
    }
  }

  // Execute raw SQL dengan service role
  static async executeRawSQL(sql: string, params?: any[]) {
    try {
      const { data, error } = await supabaseAdmin.rpc('execute_sql', {
        sql_query: sql,
        params: params || []
      });

      if (error) {
        console.error('Error executing raw SQL:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Raw SQL execution error:', error);
      throw error;
    }
  }
}

// Specific services untuk setiap tabel
export class StoreService {
  static async createStore(storeData: {
    name: string;
    store_type: 'online' | 'offline';
    platform_enum?: string;
    logo_url?: string;
    description?: string;
    user_email: string;
  }) {
    return DataService.insertWithServiceRole('stores', {
      ...storeData,
      created_at: new Date().toISOString(),
      status: true
    });
  }

  static async updateStore(id: number, updateData: any) {
    return DataService.updateWithServiceRole('stores', updateData, { id });
  }

  static async deleteStore(id: number) {
    return DataService.deleteWithServiceRole('stores', { id });
  }
}

export class ProductService {
  static async createProduct(productData: {
    name: string;
    sku: string;
    cattegory?: string;
    sku_variation?: string;
    variation?: string;
    buy_price?: number;
    selling_price?: number;
    wareohouse_id?: string;
    is_active?: boolean;
  }) {
    return DataService.insertWithServiceRole('products', {
      ...productData,
      created_at: new Date().toISOString(),
      is_active: productData.is_active ?? true
    });
  }

  static async createMultipleProducts(productsData: any[]) {
    const productsWithTimestamp = productsData.map(product => ({
      ...product,
      created_at: new Date().toISOString(),
      is_active: product.is_active ?? true
    }));
    
    return DataService.insertMultipleWithServiceRole('products', productsWithTimestamp);
  }
}

export class WarehouseService {
  static async createWarehouse(warehouseData: {
    name: string;
    location?: string;
    description?: string;
    is_active?: boolean;
  }) {
    return DataService.insertWithServiceRole('warehouses', {
      ...warehouseData,
      created_at: new Date().toISOString(),
      is_active: warehouseData.is_active ?? true
    });
  }

  static async createWarehouseProduct(warehouseProductData: {
    warehouse_id: string;
    product_id: number;
    stock_quantity?: number;
    min_stock?: number;
    max_stock?: number;
    location_code?: string;
  }) {
    return DataService.insertWithServiceRole('warehouse_products', {
      ...warehouseProductData,
      created_at: new Date().toISOString(),
      stock_quantity: warehouseProductData.stock_quantity ?? 0,
      min_stock: warehouseProductData.min_stock ?? 0
    });
  }
}

export class EmployeeService {
  static async createEmployee(employeeData: {
    name: string;
    unit?: string;
    department?: string;
    position?: string;
    status?: 'magang' | 'kontrak' | 'tetap';
    birth_date?: string;
    join_date?: string;
    email?: string;
    is_active?: boolean;
    uid_employee?: string;
  }) {
    return DataService.insertWithServiceRole('employees', {
      ...employeeData,
      created_at: new Date().toISOString(),
      is_active: employeeData.is_active ?? true
    });
  }
}

export class SalesService {
  static async createMarketplaceSale(salesData: {
    marketplace: 'shopee' | 'tokopedia' | 'lazada' | 'tiktok';
    store_id?: number;
    order_code?: string;
    order_status?: string;
    marketplace_sku?: string;
    quantity?: number;
    order_date?: string;
    customer_name?: string;
    tracking_number?: string;
    shipping_provider?: string;
    weight_grams?: number;
    product_price?: number;
    discount_seller?: number;
    discount_platform?: number;
    shipping_cost?: number;
    total_payment?: number;
    payment_method?: string;
    shipping_discount?: number;
    done_date?: string;
    address?: string;
    city?: string;
    province?: string;
    buyyer_name?: string;
    admin_fee?: number;
  }) {
    return DataService.insertWithServiceRole('marketplace_sales', {
      ...salesData,
      created_at: new Date().toISOString()
    });
  }
}

export class AccountingService {
  static async createJournalEntry(journalData: {
    tanggal: string;
    keterangan: string;
    debit: number;
    kredit: number;
    akunaccounting: string;
    note_id?: string;
    nota?: string;
    email?: string;
  }) {
    return DataService.insertWithServiceRole('jurnal_umum', journalData);
  }

  static async createAccountingAccount(accountData: {
    kode: number;
    name_account: string;
    normal_balance: string;
    email?: string;
  }) {
    return DataService.insertWithServiceRole('akun_accounting', {
      ...accountData,
      created_at: new Date().toISOString()
    });
  }
}