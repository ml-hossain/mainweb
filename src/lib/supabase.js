import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xietieexqhsrntxwtobp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZXRpZWV4cWhzcm50eHd0b2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTcyMDIsImV4cCI6MjA2NjE5MzIwMn0.5p2IpkY_biqv_TvunMxaw3cslhYTz8WwbBGTjvv8jf4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
