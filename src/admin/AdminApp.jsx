import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Admin Components
import AdminLogin from './components/AdminLogin'

// Admin Pages
import Dashboard from './pages/Dashboard'
import Universities from './pages/Universities'
import Consultations from './pages/Consultations'
import Contacts from './pages/Contacts'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import UniversityEditor from './pages/UniversityEditor'

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true

    // Check if user is admin
    const checkAdminStatus = (user) => {
      if (!user) return false
      const adminEmails = ['play.rjfahad@gmail.com', 'admin@maeducation.com']
      return adminEmails.includes(user.email)
    }

    // Handle auth state changes
    const handleAuthChange = async (event, session) => {
      console.log('Auth event:', event, 'Session:', !!session)

      if (!mounted) return

      if (session && session.user) {
        // User is signed in
        if (checkAdminStatus(session.user)) {
          console.log('User is admin - authenticated')
          setIsAuthenticated(true)
          setUser(session.user)
        } else {
          console.log('User is not admin - signing out')
          await supabase.auth.signOut()
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        // No session
        console.log('No session - not authenticated')
        setIsAuthenticated(false)
        setUser(null)
      }

      setIsLoading(false)
    }

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange('INITIAL_SESSION', session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

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
    return <AdminLogin />
  }

  // Authenticated - show admin routes
  return (
    <Routes>
      <Route index element={<Dashboard onLogout={handleLogout} />} />
      <Route path="dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="universities" element={<Universities onLogout={handleLogout} />} />
      <Route path="universities/new" element={<UniversityEditor onLogout={handleLogout} />} />
      <Route path="universities/edit/:id" element={<UniversityEditor onLogout={handleLogout} />} />
      <Route path="consultations" element={<Consultations onLogout={handleLogout} />} />
      <Route path="contacts" element={<Contacts onLogout={handleLogout} />} />
      <Route path="analytics" element={<Analytics onLogout={handleLogout} />} />
      <Route path="settings" element={<Settings onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminApp
