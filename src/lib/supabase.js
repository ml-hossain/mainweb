import { createClient } from '@supabase/supabase-js'

// Fallback to actual values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xietieexqhsrntxwtobp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZXRpZWV4cWhzcm50eHd0b2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTcyMDIsImV4cCI6MjA2NjE5MzIwMn0.5p2IpkY_biqv_TvunMxaw3cslhYTz8WwbBGTjvv8jf4'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables or configuration.')
}

// Only log in development
if (import.meta.env.DEV) {
  console.log('Supabase configuration:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  })
}

// Configure Supabase with better connection settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    timeout: 20000,
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (retryCount) => Math.min(1000 * Math.pow(2, retryCount), 30000)
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'ma-education@1.0.0'
    }
  }
})
