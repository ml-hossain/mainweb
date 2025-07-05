// Environment Test Utility
console.log('🔧 Development Environment Check');

// Check environment variables
const envVars = {
  'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  'VITE_IMGBB_API_KEY': import.meta.env.VITE_IMGBB_API_KEY ? '✅ Set' : '❌ Missing'
};

console.table(envVars);

// Check if we're in development mode
if (import.meta.env.DEV) {
  console.log('🔥 Development mode active');
  
  // Check for hot reload
  if (import.meta.hot) {
    console.log('⚡ Hot Module Replacement active');
  }
}

// Test connection to Supabase
import { supabase } from '../lib/supabase';

const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('universities').select('id').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful:', data);
    }
  } catch (err) {
    console.error('Supabase test failed:', err);
  }
};

// Only run test in development
if (import.meta.env.DEV) {
  testConnection();
}

export default {};
