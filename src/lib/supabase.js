import { createClient } from '@supabase/supabase-js'

// Fallback to actual values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xietieexqhsrntxwtobp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZXRpZWV4cWhzcm50eHd0b2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTcyMDIsImV4cCI6MjA2NjE5MzIwMn0.5p2IpkY_biqv_TvunMxaw3cslhYTz8WwbBGTjvv8jf4'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables or configuration.')
}

console.log('Supabase configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
