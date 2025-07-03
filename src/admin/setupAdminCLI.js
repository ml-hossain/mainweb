#!/usr/bin/env node

/**
 * Admin Setup CLI - Run this script to manually create admin users
 * Usage: node src/admin/setupAdminCLI.js [email] [password]
 */

import { setupAdminUser } from './utils/setupAdmin.js'

const main = async () => {
  // Get arguments from command line
  const args = process.argv.slice(2)
  const email = args[0] || 'play.rjfahad@gmail.com'
  const password = args[1] || '12345'

  console.log('🚀 MA Education Admin Setup CLI')
  console.log('================================')
  console.log(`Email: ${email}`)
  console.log(`Password: ${'*'.repeat(password.length)}`)
  console.log('================================')

  try {
    console.log('Setting up admin user...')
    
    const result = await setupAdminUser(email, password)
    
    if (result.success) {
      console.log('✅ Success!', result.message)
      if (result.user) {
        console.log(`👤 User ID: ${result.user.id}`)
        console.log(`📧 Email: ${result.user.email}`)
      }
    } else {
      console.log('❌ Failed!', result.error)
      process.exit(1)
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
    process.exit(1)
  }

  console.log('================================')
  console.log('🎉 Admin setup completed!')
  console.log('You can now log in to the admin portal with these credentials.')
  process.exit(0)
}

// Run the script
main().catch(error => {
  console.error('💥 Script failed:', error.message)
  process.exit(1)
})
