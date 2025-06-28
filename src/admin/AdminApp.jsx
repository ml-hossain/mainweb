import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  LinkIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

// Import admin pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Universities from './pages/universities/Universities';
import Programs from './pages/universities/Programs';
import Services from './pages/services/Services';
import Categories from './pages/services/Categories';
import Pages from './pages/content/Pages';
import Sections from './pages/content/Sections';
import MediaLibrary from './pages/content/MediaLibrary';
import Navigation from './pages/navigation/Navigation';
import Users from './pages/users/Users';
import Settings from './pages/settings/Settings';
import Testimonials from './pages/testimonials/Testimonials';
import ContactRequests from './pages/contact/ContactRequests';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, href: '/admin', adminOnly: false },
  {
    name: 'Universities',
    icon: AcademicCapIcon,
    children: [
      { name: 'All Universities', href: '/admin/universities' },
      { name: 'Programs', href: '/admin/universities/programs' }
    ],
    adminOnly: false
  },
  {
    name: 'Services',
    icon: BriefcaseIcon,
    children: [
      { name: 'All Services', href: '/admin/services' },
      { name: 'Categories', href: '/admin/services/categories' }
    ],
    adminOnly: false
  },
  {
    name: 'Content',
    icon: DocumentTextIcon,
    children: [
      { name: 'Pages', href: '/admin/content/pages' },
      { name: 'Sections', href: '/admin/content/sections' },
      { name: 'Media Library', href: '/admin/content/media' }
    ],
    adminOnly: false
  },
  { name: 'Navigation', icon: LinkIcon, href: '/admin/navigation', adminOnly: true },
  { name: 'Users', icon: UserGroupIcon, href: '/admin/users', adminOnly: true },
  { name: 'Testimonials', icon: ChatBubbleLeftIcon, href: '/admin/testimonials', adminOnly: false },
  { name: 'Contact Requests', icon: GlobeAltIcon, href: '/admin/contact-requests', adminOnly: false },
  { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', adminOnly: true }
];

function AdminApp() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserRole(userId) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserRole(data?.role || 'editor');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('editor'); // Default to editor if there's an error
    } finally {
      setLoading(false);
    }
  }

  const toggleMenu = (name) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (href) => location.pathname === href;

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || userRole === 'admin'
  );

  const NavItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isMenuOpen = openMenus[item.name];
    const isCurrentPath = hasChildren 
      ? item.children.some(child => location.pathname === child.href)
      : location.pathname === item.href;

    return (
      <div className="space-y-1">
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.name)}
            className={`${
              isCurrentPath
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md`}
          >
            <item.icon
              className={`${
                isCurrentPath ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
              } mr-3 flex-shrink-0 h-6 w-6`}
              aria-hidden="true"
            />
            <span className="flex-1 text-left">{item.name}</span>
            <svg
              className={`${isMenuOpen ? 'transform rotate-180' : ''} w-5 h-5`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <Link
            to={item.href}
            className={`${
              isCurrentPath
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
          >
            <item.icon
              className={`${
                isCurrentPath ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
              } mr-3 flex-shrink-0 h-6 w-6`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        )}
        {hasChildren && isMenuOpen && (
          <div className="space-y-1 pl-11">
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className={`${
                  isActive(child.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } fixed inset-0 flex z-40 md:hidden`}
      >
        <div
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } fixed inset-0 bg-gray-600 bg-opacity-75`}
          onClick={() => setSidebarOpen(false)}
        />

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-white text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <button
              onClick={handleSignOut}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <ArrowLeftOnRectangleIcon className="text-gray-300 mr-3 h-6 w-6" />
                <div className="text-sm font-medium text-white">Sign Out</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-white text-xl font-bold">Admin Panel</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <button
                onClick={handleSignOut}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <ArrowLeftOnRectangleIcon className="text-gray-300 mr-3 h-6 w-6" />
                  <div className="text-sm font-medium text-white">Sign Out</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/universities/programs" element={<Programs />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/categories" element={<Categories />} />
                <Route path="/content/pages" element={<Pages />} />
                <Route path="/content/sections" element={<Sections />} />
                <Route path="/content/media" element={<MediaLibrary />} />
                <Route path="/navigation" element={<Navigation />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact-requests" element={<ContactRequests />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminApp; 