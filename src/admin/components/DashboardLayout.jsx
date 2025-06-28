import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  HomeIcon, DocumentTextIcon, PhotoIcon, AcademicCapIcon, 
  CurrencyDollarIcon, BriefcaseIcon, MenuIcon as Bars3Icon, XIcon as XMarkIcon,
  CollectionIcon as Square3Stack3DIcon, TagIcon, ChevronDownIcon, ArrowRightOnRectangleIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  {
    name: 'Content',
    icon: DocumentTextIcon,
    children: [
      { name: 'Pages', href: '/admin/content/pages' },
      { name: 'Sections', href: '/admin/content/sections' },
      { name: 'Media Library', href: '/admin/content/media', icon: PhotoIcon },
    ],
  },
  {
    name: 'Universities',
    icon: AcademicCapIcon,
    children: [
      { name: 'All Universities', href: '/admin/universities' },
      { name: 'Programs', href: '/admin/universities/programs' },
      { name: 'Fees', href: '/admin/universities/fees', icon: CurrencyDollarIcon },
    ],
  },
  {
    name: 'Services',
    icon: BriefcaseIcon,
    children: [
      { name: 'All Services', href: '/admin/services' },
      { name: 'Categories', href: '/admin/services/categories', icon: Squares2X2Icon },
      { name: 'Pricing', href: '/admin/services/pricing', icon: TagIcon },
    ],
  },
]

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState({})
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const toggleMenu = (name) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openMenus[item.name]

    return (
      <div className="space-y-1">
        <button
          onClick={() => hasChildren ? toggleMenu(item.name) : navigate(item.href)}
          className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-gray-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon
            className={`mr-3 h-6 w-6 flex-shrink-0 ${
              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
            }`}
            aria-hidden="true"
          />
          <span className="flex-1 text-left">{item.name}</span>
          {hasChildren && (
            <ChevronDownIcon
              className={`ml-3 h-5 w-5 transform transition-transform duration-150 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>
        {hasChildren && isOpen && (
          <div className="ml-8 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.name}
                to={child.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === child.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex items-center justify-between px-4">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-5 space-y-1 px-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="mx-auto flex flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                >
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 inline-flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout 