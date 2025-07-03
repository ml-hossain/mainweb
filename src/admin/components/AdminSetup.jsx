import React, { useState, useEffect } from 'react'
import { FiUser, FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { setupAdminUser, checkAdminAccess } from '../utils/setupAdmin'

const AdminSetup = ({ onSetupComplete }) => {
  const [status, setStatus] = useState('checking') // checking, needed, setting-up, complete, error
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkIfAdminExists()
  }, [])

  const checkIfAdminExists = async () => {
    try {
      setStatus('checking')
      setMessage('Checking admin setup...')
      
      // Try to setup the default admin user
      const result = await setupAdminUser('play.rjfahad@gmail.com', '12345')
      
      if (result.success) {
        setStatus('complete')
        setMessage(result.message)
        setTimeout(() => {
          onSetupComplete && onSetupComplete()
        }, 2000)
      } else {
        setStatus('error')
        setError(result.error)
      }
    } catch (error) {
      setStatus('error')
      setError(error.message)
    }
  }

  const retrySetup = () => {
    setError('')
    checkIfAdminExists()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
            {status === 'checking' || status === 'setting-up' ? (
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
            ) : status === 'complete' ? (
              <FiCheck className="w-8 h-8 text-green-600" />
            ) : status === 'error' ? (
              <FiX className="w-8 h-8 text-red-600" />
            ) : (
              <FiUser className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Setup
          </h2>

          {/* Status Message */}
          <div className="mb-6">
            {status === 'checking' && (
              <p className="text-gray-600">Checking admin configuration...</p>
            )}
            
            {status === 'setting-up' && (
              <p className="text-blue-600">Setting up admin user...</p>
            )}
            
            {status === 'complete' && (
              <div className="text-center">
                <p className="text-green-600 font-medium mb-2">✅ Setup Complete!</p>
                <p className="text-gray-600 text-sm">{message}</p>
                <p className="text-gray-500 text-sm mt-2">Redirecting to login...</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-center">
                <p className="text-red-600 font-medium mb-2">❌ Setup Failed</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button
                  onClick={retrySetup}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Retry Setup
                </button>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                status === 'checking' ? 'w-1/4 bg-blue-600' :
                status === 'setting-up' ? 'w-3/4 bg-blue-600' :
                status === 'complete' ? 'w-full bg-green-600' :
                status === 'error' ? 'w-full bg-red-600' :
                'w-0 bg-blue-600'
              }`}
            />
          </div>

          {/* Admin Credentials Info */}
          {(status === 'complete' || status === 'setting-up') && (
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Default Admin Credentials</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Email:</strong> play.rjfahad@gmail.com</p>
                <p><strong>Password:</strong> 12345</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSetup
