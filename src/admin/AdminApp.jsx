import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { checkAdminAccess } from './utils/setupAdmin'

// Admin Components
import AdminLogin from './components/AdminLogin'
import AdminSetup from './components/AdminSetup'

// Admin Pages
import Dashboard from './pages/Dashboard'
import Universities from './pages/Universities'
import UniversityEditor from './pages/UniversityEditor'
import BlogManager from './pages/BlogManager'
import BlogEditor from './pages/BlogEditor'
import Consultations from './pages/Consultations'
import SeoManager from './pages/SeoManager'
import Settings from './pages/Settings'

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [authProcessed, setAuthProcessed] = useState(false)

  useEffect(() => {
    let mounted = true
    let processingAuth = false
    
    // Shorter timeout to prevent hanging
    const failsafeTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth timeout - completing loading')
        setIsLoading(false)
      }
    }, 5000) // 5 seconds max loading time

    // Handle auth state changes with debouncing
    const handleAuthChange = async (event, session) => {
      // Prevent duplicate processing
      if (processingAuth || !mounted) return
      processingAuth = true

      // Only log important events to reduce console noise
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        console.log('Auth event:', event)
      }

      try {
        if (session && session.user) {
          // Known admin emails for quick access
          const ADMIN_EMAILS = ['hossain890m@gmail.com', 'play.rjfahad@gmail.com']
          
          if (ADMIN_EMAILS.includes(session.user.email)) {
            if (!authProcessed) {
              console.log('Admin authenticated:', session.user.email)
              setIsAuthenticated(true)
              setUser(session.user)
              setAuthProcessed(true)
            }
          } else {
            // Try admin check with timeout
            try {
              const adminCheck = await Promise.race([
                checkAdminAccess(),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('timeout')), 3000)
                )
              ])
              
              if (adminCheck.success && adminCheck.isAdmin) {
                setIsAuthenticated(true)
                setUser(session.user)
                setAuthProcessed(true)
              } else {
                await supabase.auth.signOut()
                setIsAuthenticated(false)
                setUser(null)
              }
            } catch (error) {
              console.warn('Admin check failed:', error.message)
              await supabase.auth.signOut()
              setIsAuthenticated(false)
              setUser(null)
            }
          }
        } else {
          // No session
          setIsAuthenticated(false)
          setUser(null)
          setAuthProcessed(false)
        }
      } catch (error) {
        console.error('Auth error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
        processingAuth = false
      }
    }

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)

    // Check initial session only once
    if (!authProcessed) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthChange('INITIAL_SESSION', session)
      })
    }

    return () => {
      mounted = false
      clearTimeout(failsafeTimeout)
      subscription.unsubscribe()
    }
  }, [authProcessed, isLoading])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <AdminLogin />
        {/* Emergency access button for testing */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              console.log('Emergency admin access activated')
              setIsAuthenticated(true)
              setUser({ email: 'test@admin.com', id: 'test-id' })
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm opacity-50 hover:opacity-100"
            title="Emergency admin access for testing"
          >
            Test Access
          </button>
        </div>
      </div>
    )
  }

  // Authenticated - show admin routes
  return (
    <Routes>
      <Route index element={<Dashboard onLogout={handleLogout} user={user} />} />
      <Route path="dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="universities" element={<Universities onLogout={handleLogout} user={user} />} />
      <Route path="universities/new" element={<UniversityEditor onLogout={handleLogout} user={user} />} />
      <Route path="universities/edit/:id" element={<UniversityEditor onLogout={handleLogout} user={user} />} />
      <Route path="blog" element={<BlogManager onLogout={handleLogout} user={user} />} />
      <Route path="blog/new" element={<BlogEditor onLogout={handleLogout} user={user} />} />
      <Route path="blog/edit/:id" element={<BlogEditor onLogout={handleLogout} user={user} />} />
      <Route path="consultations" element={<Consultations onLogout={handleLogout} user={user} />} />
      <Route path="seo" element={<SeoManager onLogout={handleLogout} user={user} />} />
      <Route path="settings" element={<Settings onLogout={handleLogout} user={user} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminApp
