import React, { useState, useEffect, useCallback } from 'react'
import {
  FiUsers,
  FiGlobe,
  FiMessageSquare,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiMail,
  FiAlertCircle,
  FiBookOpen,
  FiEdit,
  FiTarget,
  FiLoader,
  FiEye,
  FiCopy,
  FiDownload,
  FiSearch
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Dashboard = ({ onLogout, user }) => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeConsultations: 0,
    universitiesPartners: 0,
    successRate: 0,
    pendingApplications: 0,
    completedConsultations: 0
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = useCallback(async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch data with timeout to prevent hanging
        const timeoutDuration = 8000 // 8 seconds
        
        const fetchWithTimeout = async (promise, timeoutMs) => {
          const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          )
          return Promise.race([promise, timeout])
        }

        // Fetch all data concurrently for better performance
        const [universitiesResponse, contactRequestsResponse, consultationsResponse, successStoriesResponse] = await Promise.allSettled([
          fetchWithTimeout(
            supabase.from('universities').select('id, name, is_active, featured, created_at'),
            timeoutDuration
          ),
          fetchWithTimeout(
            supabase.from('contact_requests').select('id, name, created_at, status'),
            timeoutDuration
          ),
          fetchWithTimeout(
            supabase.from('consultations').select('id, full_name, status, created_at'),
            timeoutDuration
          ),
          fetchWithTimeout(
            supabase.from('success_stories').select('id, student_name, created_at'),
            timeoutDuration
          )
        ])

        // Process results
        const universities = universitiesResponse.status === 'fulfilled' ? universitiesResponse.value.data || [] : []
        const contacts = contactRequestsResponse.status === 'fulfilled' ? contactRequestsResponse.value.data || [] : []
        const consultations = consultationsResponse.status === 'fulfilled' ? consultationsResponse.value.data || [] : []
        const stories = successStoriesResponse.status === 'fulfilled' ? successStoriesResponse.value.data || [] : []

        // Only log if there are errors
        const failures = [universitiesResponse, contactRequestsResponse, consultationsResponse, successStoriesResponse]
          .filter(r => r.status === 'rejected')
        
        if (failures.length > 0) {
          console.warn('Some dashboard data failed to load:', failures.length, 'failures')
        }

      const totalContacts = contacts.length
      const pendingConsultations = consultations.filter(c => c.status === 'pending').length
      const inProgressConsultations = consultations.filter(c => c.status === 'in_progress').length
      const completedConsultations = consultations.filter(c => c.status === 'completed').length
      const activeUniversities = universities.filter(u => u.is_active !== false).length
      const featuredUniversities = universities.filter(u => u.featured).length

      // Calculate success rate based on completed vs total consultations
      const successRate = consultations.length > 0 
        ? Math.round((completedConsultations / consultations.length) * 100)
        : 0

        setStats({
        totalContacts,
        activeConsultations: pendingConsultations + inProgressConsultations,
        universitiesPartners: activeUniversities,
        successRate,
          pendingApplications: pendingConsultations,
          completedConsultations
        })

      // Generate recent activities from real data
        const activities = []

      // Add recent contacts
      if (contacts.length > 0) {
        const recentContact = contacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
          activities.push({
            id: 1,
          type: 'contact',
          message: `New contact request from ${recentContact.name}`,
          time: formatTimeAgo(recentContact.created_at),
          icon: FiMail,
            color: 'text-blue-600'
          })
        }

      // Add recent consultations
      if (consultations.length > 0) {
        const recentConsultation = consultations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
          activities.push({
            id: 2,
            type: 'consultation',
          message: `New consultation booking from ${recentConsultation.full_name}`,
          time: formatTimeAgo(recentConsultation.created_at),
            icon: FiMessageSquare,
            color: 'text-green-600'
          })
        }

      // Add university activities
      if (universities.length > 0) {
        const recentUni = universities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
          activities.push({
            id: 3,
          type: 'university',
          message: `University added: ${recentUni.name}`,
          time: formatTimeAgo(recentUni.created_at),
          icon: FiGlobe,
            color: 'text-purple-600'
          })
        }

      // Add success story activity
      if (stories.length > 0) {
        const recentStory = stories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        activities.push({
          id: 4,
          type: 'success',
          message: `New success story: ${recentStory.student_name}`,
          time: formatTimeAgo(recentStory.created_at),
          icon: FiAward,
          color: 'text-yellow-600'
        })
      }

      setRecentActivities(activities.slice(0, 5)) // Show max 5 activities

      // Generate monthly data based on actual data
      const monthlyStats = generateMonthlyStats(consultations, contacts)
        setMonthlyData(monthlyStats)

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      setError(error.message)
    } finally {
        setIsLoading(false)
      }
    }, [])

    useEffect(() => {
      loadDashboardData()
    }, [loadDashboardData])

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time'
    
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  }

  const generateMonthlyStats = (consultations, contacts) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      // Only show data for months up to current month
      if (index > currentMonth) {
        return { month, students: 0, revenue: 0 }
      }
      
      // Calculate approximate monthly values based on current data
      const monthMultiplier = (index + 1) / (currentMonth + 1)
      const monthlyConsultations = Math.floor(consultations.length * monthMultiplier)
      const monthlyContacts = Math.floor(contacts.length * monthMultiplier)
      
      return {
        month,
        students: monthlyContacts + monthlyConsultations,
        revenue: monthlyConsultations * 500 // Estimated revenue per consultation
      }
    })
  }

  const getChangePercentage = (current, total) => {
    if (total === 0) return 0
    return Math.round((current / total) * 100)
  }

  const StatCard = ({ title, value, change, icon: Icon, color, trend, isLoading, suffix = '' }) => (
    <div className="bg-white rounded-lg shadow p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{title}</p>
          {isLoading ? (
            <div className="h-6 lg:h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
              {typeof value === 'number' && value === 0 ? '--' : `${value}${suffix}`}
            </p>
          )}
          {change && !isLoading && (
            <div className={`flex items-center mt-2 text-xs lg:text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {trend === 'up' ? <FiArrowUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" /> : 
               trend === 'down' ? <FiArrowDown className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" /> : null}
              <span className="truncate">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-2 lg:p-3 rounded-full ${color} flex-shrink-0 ml-3 ${isLoading ? 'opacity-50' : ''}`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="text-center py-8">
      <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )

  const LoadingState = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )

  if (error) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
        {/* Modern Header - Similar to other pages */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-indigo-300 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-pink-300 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              {/* Left Content */}
              <div className="flex-1 mb-8 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <FiTrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      Dashboard Overview
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-indigo-200 text-sm font-medium">Live Analytics</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-indigo-100 text-base md:text-lg font-medium mb-6 max-w-2xl">
                  Welcome back! Monitor your education consultancy performance and manage student interactions
                </p>
                
                {/* Quick Stats Row */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiUsers className="w-4 h-4 mr-2 text-indigo-300" />
                    <span className="text-white font-semibold">{stats.totalContacts}</span>
                    <span className="text-indigo-200 ml-1">Total Contacts</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{stats.activeConsultations}</span>
                    <span className="text-indigo-200 ml-1">Active</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiGlobe className="w-3 h-3 mr-2 text-purple-300" />
                    <span className="text-white font-semibold">{stats.universitiesPartners}</span>
                    <span className="text-indigo-200 ml-1">Universities</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{stats.successRate}%</span>
                    <span className="text-indigo-200 ml-1">Success Rate</span>
                  </div>
                </div>
              </div>
              
              {/* Right Actions */}
              <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:gap-3">
                <button 
                  onClick={loadDashboardData}
                  className="group flex items-center justify-center px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiLoader className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">Refresh Data</div>
                    <div className="text-indigo-200 text-xs">Update stats</div>
                  </div>
                </button>
                
                <button className="group flex items-center justify-center px-6 py-3 bg-gradient-to-br from-white to-indigo-50 text-indigo-900 rounded-xl hover:from-indigo-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiDownload className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Export Report</div>
                    <div className="text-indigo-600 text-xs">Download CSV</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            title="Total Contact Requests"
            value={stats.totalContacts}
            change={stats.totalContacts > 0 ? "From website forms" : null}
            icon={FiMail}
            color="bg-blue-500"
            trend="neutral"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Consultations"
            value={stats.activeConsultations}
            change={stats.activeConsultations > 0 ? "Pending & in progress" : null}
            icon={FiMessageSquare}
            color="bg-green-500"
            trend="up"
            isLoading={isLoading}
          />
          <StatCard
            title="Partner Universities"
            value={stats.universitiesPartners}
            change={stats.universitiesPartners > 0 ? "Active partnerships" : null}
            icon={FiGlobe}
            color="bg-purple-500"
            trend="up"
            isLoading={isLoading}
          />
          <StatCard
            title="Completed Consultations"
            value={stats.completedConsultations}
            change={stats.completedConsultations > 0 ? "Successfully finished" : null}
            icon={FiBookOpen}
            color="bg-emerald-500"
            trend="up"
            isLoading={isLoading}
          />
          <StatCard
            title="Success Rate"
            value={stats.successRate}
            change={stats.successRate > 0 ? "Consultation completion" : null}
            icon={FiAward}
            color="bg-yellow-500"
            trend="up"
            isLoading={isLoading}
            suffix="%"
          />
          <StatCard
            title="Pending Applications"
            value={stats.pendingApplications}
            change={stats.pendingApplications > 0 ? "Requires attention" : null}
            icon={FiCalendar}
            color="bg-red-500"
            trend="down"
            isLoading={isLoading}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6 max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button
              onClick={loadDashboardData}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Refresh
            </button>
          </div>
          {isLoading ? (
            <LoadingState />
          ) : recentActivities.length > 0 ? (
            <div className="space-y-3 lg:space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 ${activity.color} flex-shrink-0`}>
                      <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm text-gray-900 break-words">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={FiMessageSquare}
              title="No Recent Activity"
              description="Recent activities will appear here as users interact with your platform."
            />
          )}
        </div>


      </div>
    </AdminLayout>
  )
}

export default Dashboard
