import React, { useState } from 'react'
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiSettings, 
  FiBarChart2, 
  FiMessageSquare,
  FiAward,
  FiGlobe,
  FiFileText,
  FiCreditCard,
  FiSend,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const AdminLayout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Universities', href: '/admin/universities', icon: FiGlobe },
    { name: 'Services', href: '/admin/services', icon: FiBook, submenu: [
      { name: 'University Selection', href: '/admin/services/university-selection' },
      { name: 'Application Assistance', href: '/admin/services/application-assistance' },
      { name: 'Visa Processing', href: '/admin/services/visa-processing' },
      { name: 'Scholarship Guidance', href: '/admin/services/scholarship-guidance' },
      { name: 'Test Preparation', href: '/admin/services/test-preparation' },
      { name: 'Interview Preparation', href: '/admin/services/interview-preparation' },
      { name: 'Documentation Support', href: '/admin/services/documentation-support' },
      { name: 'Pre-Departure Orientation', href: '/admin/services/pre-departure-orientation' },
    ]},
    { name: 'Consultations', href: '/admin/consultations', icon: FiMessageSquare },
    { name: 'Content', href: '/admin/content', icon: FiFileText, submenu: [
      { name: 'Hero Section', href: '/admin/content/hero' },
      { name: 'Statistics', href: '/admin/content/statistics' },
      { name: 'About Page', href: '/admin/content/about' },
      { name: 'CEO Section', href: '/admin/content/ceo' },
    ]},
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
              
              {/* Submenu */}
              {item.submenu && isActive(item.href) && (
                <div className="ml-8 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className={`block px-6 py-2 text-sm transition-colors ${
                        location.pathname === subItem.href
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@maeducation.com</p>
            </div>            <button
              onClick={() => {
                if (onLogout) {
                  onLogout()
                } else {
                  // Fallback logout
                  localStorage.removeItem('adminAuthenticated')
                  window.location.reload()
                }
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <FiMessageSquare className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <FiBarChart2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
