import React, { useState, useEffect } from 'react'
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiMessageSquare,
  FiAward,
  FiGlobe,
  FiCreditCard,
  FiSend,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiFileText,
  FiSearch,
  FiChevronRight,
  FiMoon,
  FiSun,
  FiGrid,
  FiTrendingUp,
  FiActivity,
  FiPhone,
  FiMail,
  FiTarget
} from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const AdminLayout = ({ children, onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: FiGrid,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      description: 'Overview & Analytics'
    },
    { 
      name: 'Universities', 
      href: '/admin/universities', 
      icon: FiGlobe,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      description: 'Partner Institutions'
    },
    { 
      name: 'Blog Management', 
      href: '/admin/blog', 
      icon: FiFileText,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      description: 'Content Publishing'
    },
    { 
      name: 'Contact Management', 
      href: '/admin/consultations', 
      icon: FiUsers,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      description: 'Student Inquiries'
    },
    { 
      name: 'Success Stories', 
      href: '/admin/success-stories', 
      icon: FiAward,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      description: 'Student Achievements'
    },
    { 
      name: 'Ad Manager', 
      href: '/admin/ads', 
      icon: FiBarChart2,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      description: 'Advertisement Management'
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: FiSettings,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50',
      description: 'System Configuration'
    },
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Modern Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Elegant Sidebar Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          <div className="relative flex items-center justify-between h-20 px-6 border-b border-white/10">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 border border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MA</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MA Education</h1>
                <p className="text-blue-100 text-sm font-medium">Admin Dashboard</p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Modern Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                to={item.href}
                className={`group relative flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 ${isActive(item.href)
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split(' ')[1]}/30 transform scale-105`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:shadow-md hover:scale-102'
                  }`}
              >
                {/* Background decoration for active item */}
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"></div>
                )}
                
                {/* Icon container */}
                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                  isActive(item.href) 
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                  }`} />
                </div>
                
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold transition-colors duration-300 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    isActive(item.href) ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
                
                {/* Active indicator */}
                {isActive(item.href) && (
                  <FiChevronRight className="w-4 h-4 text-white/80" />
                )}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Main content wrapper with fixed positioning */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        {/* Fixed Modern Enhanced Top Header */}
        <header className="fixed top-0 left-0 right-0 z-40 lg:left-72 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3 transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumb for desktop */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="text-sm text-gray-500">Dashboard</div>
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <div className="text-sm font-semibold text-gray-900">
                  {navigation.find(item => isActive(item.href))?.name || 'Overview'}
                </div>
              </div>
              
              {/* Mobile title */}
              <h2 className="text-xl font-bold text-gray-900 lg:hidden">
                {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
              </h2>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="hidden md:flex items-center relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                {/* Notifications */}
                <button className="relative p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    3 new notifications
                  </span>
                </button>
                
                {/* Messages */}
                <button className="relative p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                  <FiMail className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    5 new messages
                  </span>
                </button>
                
                {/* Analytics */}
                <button className="relative p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                  <FiActivity className="w-5 h-5" />
                  <span className="absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    View analytics
                  </span>
                </button>
                
                {/* Dark mode toggle */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="relative p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                  <span className="absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {darkMode ? 'Light mode' : 'Dark mode'}
                  </span>
                </button>
              </div>
              
              {/* User Profile with Logout */}
              <div className="relative ml-4 flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-3 p-2 rounded-xl">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">MA Education Admin</div>
                    <div className="text-xs text-gray-500">{user?.email || 'admin@maeducation.com'}</div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    if (onLogout) {
                      onLogout()
                    } else {
                      // Fallback logout without page reload
                      localStorage.removeItem('adminAuthenticated')
                      // Instead of reloading, redirect to login page
                      window.location.href = '/admin'
                    }
                  }}
                  className="p-3 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content with top padding for fixed header */}
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-24 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
