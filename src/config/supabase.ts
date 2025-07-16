import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  provider: string
  birth_date?: string
  created_at: string
  updated_at: string
}