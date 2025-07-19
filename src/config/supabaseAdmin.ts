import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Admin client dengan service role key untuk operasi yang memerlukan privilege tinggi
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Export supabaseAdmin as default supabase client for this project
export const supabase = supabaseAdmin

// Keep original anon client if needed for specific cases
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)