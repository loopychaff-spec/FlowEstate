import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Null-safe check to prevent build crashes in Vercel if keys aren't added yet
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Cloud listing features will be disabled until they are added to environment variables.")
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

