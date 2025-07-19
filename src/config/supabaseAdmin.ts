import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Admin client dengan service role key untuk operasi yang memerlukan privilege tinggi
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Regular client untuk operasi user biasa
export const supabase = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY)