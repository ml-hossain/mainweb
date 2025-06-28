import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'eduglobal-web'
    }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options)

// Error handling helper
export const handleSupabaseError = (error) => {
  if (error instanceof Error) {
    console.error('Supabase error:', error.message)
    return {
      message: error.message,
      code: error?.code || 'UNKNOWN_ERROR'
    }
  }
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  }
}

// Data fetching helper
export async function fetchData(table, query) {
  try {
    const { data, error } = await query
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    const formattedError = handleSupabaseError(error)
    console.error(`Error fetching from ${table}:`, formattedError)
    return { data: null, error: formattedError }
  }
}

// Data mutation helper
export async function mutateData(table, operation, payload) {
  try {
    const { data, error } = await operation
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    const formattedError = handleSupabaseError(error)
    console.error(`Error in ${table} operation:`, formattedError)
    return { data: null, error: formattedError }
  }
}
