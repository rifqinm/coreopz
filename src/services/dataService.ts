import { supabaseAdmin, supabase } from '../config/supabaseAdmin';

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
    const { data: result, error } = await supabaseAdmin
      .from('stores')
      .insert({
      ...storeData,
      created_at: new Date().toISOString(),
      status: true
      })
      .select();

    if (error) throw error;
    return result;
  }

  static async updateStore(id: number, updateData: any) {
    const { data: result, error } = await supabaseAdmin
      .from('stores')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return result;
  }

  static async deleteStore(id: number) {
    const { data: result, error } = await supabaseAdmin
      .from('stores')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return result;
  }
}
