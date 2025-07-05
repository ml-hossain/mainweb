import { supabase } from '../../lib/supabase'

/**
 * Setup admin user - Creates the admin user in both auth and admin_users table
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 */
export const setupAdminUser = async (email, password) => {
  try {
    console.log('Setting up admin user...')

    // Note: Cannot use auth.admin.listUsers() with anon key, skip auth user check
    // Just proceed with signup/signin flow

    let authData
    let isNewUser = false

    // Try to sign up the user first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('User already exists in auth, trying to sign in...')
        
        // User exists, try to sign in to get the user data
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          throw new Error(`User exists but password incorrect: ${signInError.message}`)
        }

        authData = signInData
      } else {
        throw signUpError
      }
    } else {
      authData = signUpData
      isNewUser = true
      console.log('New user created in auth')
    }

    if (!authData?.user) {
      throw new Error('No user data received from auth')
    }

    // Check if user already exists in admin_users table
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected for new admin
      throw checkError
    }

    if (existingAdmin) {
      console.log('Admin user already exists in admin_users table')
      
      // Update to ensure they're active
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id)

      if (updateError) {
        throw updateError
      }

      return {
        success: true,
        message: 'Admin user already exists and is now active',
        user: authData.user,
        isNew: false
      }
    }

    // Insert new admin user
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (adminError) {
      throw adminError
    }

    console.log('Admin user setup completed successfully')

    return {
      success: true,
      message: isNewUser ? 'New admin user created successfully' : 'Existing user promoted to admin',
      user: authData.user,
      admin: adminData,
      isNew: isNewUser
    }

  } catch (error) {
    console.error('Error setting up admin user:', error)
    return {
      success: false,
      error: error.message || 'Failed to setup admin user'
    }
  }
}

/**
 * Check admin access for current user
 */
export const checkAdminAccess = async () => {
  try {
    console.log('Starting admin access check...')
    
    // First get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('User error:', userError)
      return {
        success: false,
        isAdmin: false,
        message: `User error: ${userError.message}`
      }
    }
    
    if (!user) {
      console.log('No authenticated user found')
      return {
        success: false,
        isAdmin: false,
        message: 'No authenticated user'
      }
    }

    console.log('User found:', user.email, 'ID:', user.id)

    // Check if user email is in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .eq('is_active', true)
      .single()

    if (adminError) {
      if (adminError.code === 'PGRST116') {
        // No rows found - user is not an admin
        console.log('User not found in admin_users table')
        return {
          success: true,
          isAdmin: false,
          user,
          message: 'User does not have admin access'
        }
      } else {
        // Some other error
        console.error('Admin check error:', adminError)
        throw adminError
      }
    }

    console.log('Admin data found:', adminData)
    const isAdmin = !!adminData

    return {
      success: true,
      isAdmin,
      user,
      adminData,
      message: isAdmin ? 'User has admin access' : 'User does not have admin access'
    }

  } catch (error) {
    console.error('Error checking admin access:', error)
    return {
      success: false,
      isAdmin: false,
      error: error.message
    }
  }
}

/**
 * Initialize admin setup - call this on first load
 */
export const initializeAdmin = async () => {
  try {
    console.log('Initializing admin setup...')
    
    // Try to setup the default admin user
const result = await setupAdminUser('hossain890m@gmail.com', 'admin123456')
    
    if (result.success) {
      console.log('✅ Admin initialization successful:', result.message)
    } else {
      console.log('❌ Admin initialization failed:', result.error)
    }

    return result

  } catch (error) {
    console.error('Error initializing admin:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
