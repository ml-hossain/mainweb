import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Admin Components
import AdminLogin from './components/AdminLogin'

// Admin Pages
import Dashboard from './pages/Dashboard'
import Universities from './pages/Universities'
import Services from './pages/Services'
import Consultations from './pages/Consultations'
import Content from './pages/Content'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (status) => {
    setIsAuthenticated(status)
    if (status) {
      localStorage.setItem('adminAuthenticated', 'true')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
  }

  // Show loading state while checking authentication
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
    return <AdminLogin onLogin={handleLogin} />
  }

  // Show admin dashboard if authenticated
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/universities" element={<Universities onLogout={handleLogout} />} />
      <Route path="/admin/services" element={<Services onLogout={handleLogout} />} />
      <Route path="/admin/consultations" element={<Consultations onLogout={handleLogout} />} />
      <Route path="/admin/content" element={<Content onLogout={handleLogout} />} />
      <Route path="/admin/users" element={<Users onLogout={handleLogout} />} />
      <Route path="/admin/analytics" element={<Analytics onLogout={handleLogout} />} />
      <Route path="/admin/settings" element={<Settings onLogout={handleLogout} />} />
      
      {/* Service subpages - could be individual service management pages */}
      <Route path="/admin/services/*" element={<Services onLogout={handleLogout} />} />
      <Route path="/admin/content/*" element={<Content onLogout={handleLogout} />} />
      
      {/* Catch-all redirect to main dashboard */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminApp
