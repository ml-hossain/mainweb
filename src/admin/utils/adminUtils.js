import { supabase } from '../../lib/supabase'

/**
 * Create a new admin user
 * @param {string} email - Admin email
 * @param {string} password - Admin password 
 * @returns {Promise} - Result of admin user creation
 */
export const createAdminUser = async (email, password) => {
  try {
    // First, create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      throw authError
    }

    // Then add them to the admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          role: 'admin',
          is_active: true
        }
      ])
      .select()

    if (adminError) {
      throw adminError
    }

    return { 
      success: true, 
      data: { 
        user: authData.user, 
        admin: adminData[0] 
      } 
    }

  } catch (error) {
    console.error('Error creating admin user:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to create admin user' 
    }
  }
}

/**
 * Check if a user is an admin
 * @param {string} userId - User ID to check
 * @returns {Promise} - Boolean indicating if user is admin
 */
export const isUserAdmin = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single()

    return { 
      success: true, 
      isAdmin: !!data && !error 
    }
  } catch (error) {
    return { 
      success: false, 
      isAdmin: false, 
      error: error.message 
    }
  }
}

/**
 * Get all admin users
 * @returns {Promise} - List of admin users
 */
export const getAllAdminUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select(`
        *,
        auth_user:auth.users(email, created_at, last_sign_in_at)
      `)
      .eq('is_active', true)

    if (error) {
      throw error
    }

    return { 
      success: true, 
      data 
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }
}

/**
 * Deactivate an admin user
 * @param {string} userId - User ID to deactivate
 * @returns {Promise} - Result of deactivation
 */
export const deactivateAdminUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ is_active: false })
      .eq('id', userId)
      .select()

    if (error) {
      throw error
    }

    return { 
      success: true, 
      data 
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }
}
