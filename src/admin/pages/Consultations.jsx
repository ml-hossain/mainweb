import React, { useState, useEffect } from 'react'
import { FiUser, FiMail, FiPhone, FiCalendar, FiMessageSquare, FiEye, FiCheck, FiX, FiDownload, FiFilter, FiSearch, FiTrash2, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Consultations = ({ onLogout, user }) => {
  const [consultations, setConsultations] = useState([])
  const [contactRequests, setContactRequests] = useState([])
  const [activeTab, setActiveTab] = useState('consultations')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      // Fetch consultations
      const consultationsPromise = supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: consultationsData, error: consultationsError } = await Promise.race([consultationsPromise, timeoutPromise])
      if (consultationsError) throw consultationsError

      // Fetch contact requests
      const contactPromise = supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: contactData, error: contactError } = await Promise.race([contactPromise, timeoutPromise])
      if (contactError) throw contactError

      setConsultations(consultationsData || [])
      setContactRequests(contactData || [])
      console.log('Data loaded successfully:', { consultations: consultationsData?.length, contacts: contactData?.length })
    } catch (error) {
      console.error('Error fetching data:', error)
      // Show error but don't alert, just log
      setConsultations([])
      setContactRequests([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      // Fetch consultations
      const consultationsPromise = supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: consultationsData, error: consultationsError } = await Promise.race([consultationsPromise, timeoutPromise])
      if (consultationsError) throw consultationsError

      // Fetch contact requests
      const contactPromise = supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: contactData, error: contactError } = await Promise.race([contactPromise, timeoutPromise])
      if (contactError) throw contactError

      setConsultations(consultationsData || [])
      setContactRequests(contactData || [])
      console.log('Data refreshed successfully:', { consultations: consultationsData?.length, contacts: contactData?.length })
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const updateStatus = async (id, status, table) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Update local state instead of refetching
      if (table === 'consultations') {
        setConsultations(prev => prev.map(item => 
          item.id === id ? { ...item, status } : item
        ))
      } else {
        setContactRequests(prev => prev.map(item => 
          item.id === id ? { ...item, status } : item
        ))
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const deleteItem = async (id, table) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state instead of refetching
      if (table === 'consultations') {
        setConsultations(prev => prev.filter(item => item.id !== id))
      } else {
        setContactRequests(prev => prev.filter(item => item.id !== id))
      }
      
      setShowDeleteModal(false)
      setItemToDelete(null)
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const handleSendEmail = (item) => {
    const subject = activeTab === 'consultations' ? 
      `Re: Your consultation request - ${item.consultation_type}` : 
      'Re: Your contact request'
    
    const body = activeTab === 'consultations' ? 
      `Dear ${item.full_name || item.name},\n\nThank you for your consultation request regarding ${item.consultation_type}.\n\nWe have received your request and will get back to you soon.\n\nBest regards,\nMA Education Team` :
      `Dear ${item.name},\n\nThank you for contacting us.\n\nWe have received your message and will get back to you soon.\n\nBest regards,\nMA Education Team`

    const mailtoLink = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_self')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-purple-100 text-purple-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const currentData = activeTab === 'consultations' ? consultations : contactRequests
  const filteredData = currentData.filter(item => {
    const matchesSearch = searchTerm === '' ||
      (item.full_name || item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const ItemModal = ({ item, show, onClose, type }) => {
    if (!show || !item) return null

    const handleStatusUpdate = async (id, status, table) => {
      await updateStatus(id, status, table)
      onClose() // Close modal after update to see changes
    }

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {type === 'consultation' ? 'Consultation Details' : 'Contact Request Details'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{item.full_name || item.name}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{item.email}</span>
                </div>
                {item.phone && (
                <div className="flex items-center">
                  <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{item.phone}</span>
                </div>
                )}
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{formatDate(item.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Consultation specific details */}
            {type === 'consultation' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Consultation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                    <span className="font-medium text-gray-700">Education Level:</span>
                    <span className="ml-2 text-gray-600">{item.study_level}</span>
              </div>
              <div>
                    <span className="font-medium text-gray-700">Consultation Type:</span>
                    <span className="ml-2 text-gray-600">{item.consultation_type}</span>
              </div>
                  {item.preferred_destination && (
                    <div>
                      <span className="font-medium text-gray-700">Preferred Destination:</span>
                      <span className="ml-2 text-gray-600">{item.preferred_destination}</span>
            </div>
                  )}
                  {item.preferred_time && (
              <div>
                      <span className="font-medium text-gray-700">Preferred Time:</span>
                      <span className="ml-2 text-gray-600">{item.preferred_time}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message */}
            {item.message && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {type === 'consultation' ? 'Additional Information' : 'Message'}
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>
                </div>
              </div>
            )}

            {/* Status and Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleStatusUpdate(item.id, 'in_progress', type === 'consultation' ? 'consultations' : 'contact_requests')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusUpdate(item.id, 'completed', type === 'consultation' ? 'consultations' : 'contact_requests')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Mark Complete
              </button>
              {type === 'consultation' && (
                <button
                  onClick={() => handleStatusUpdate(item.id, 'scheduled', 'consultations')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Schedule
                </button>
              )}
              <button 
                onClick={() => handleSendEmail(item)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
        {/* Redesigned Header - Modern & Attractive */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-300 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-purple-300 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              {/* Left Content */}
              <div className="flex-1 mb-8 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <FiMessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      Contact Management
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-200 text-sm font-medium">Live Dashboard</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-blue-100 text-base md:text-lg font-medium mb-6 max-w-2xl">
                  Efficiently manage consultation requests and contact submissions with our advanced dashboard
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiMessageSquare className="w-4 h-4 mr-2 text-blue-300" />
                    <span className="text-white font-semibold">{currentData.length}</span>
                    <span className="text-blue-200 ml-1">Total Items</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{currentData.filter(c => c.status === 'pending').length}</span>
                    <span className="text-blue-200 ml-1">Pending</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{currentData.filter(c => c.status === 'completed').length}</span>
                    <span className="text-blue-200 ml-1">Completed</span>
                  </div>
                </div>
              </div>
              
              {/* Right Actions */}
              <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:gap-3">
                <button 
                  onClick={refreshData}
                  disabled={refreshing}
                  className="group flex items-center justify-center px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiRefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{refreshing ? 'Refreshing...' : 'Refresh Data'}</div>
                    <div className="text-blue-200 text-xs">Update records</div>
                  </div>
                </button>
                
                <button className="group flex items-center justify-center px-6 py-3 bg-gradient-to-br from-white to-blue-50 text-blue-900 rounded-xl hover:from-blue-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiDownload className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Export Data</div>
                    <div className="text-blue-600 text-xs">Download CSV</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'consultations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Consultations ({consultations.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact Requests ({contactRequests.length})
            </button>
          </nav>
        </div>

        {/* Stats Cards with Refresh Indicator */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-300 ${refreshing ? 'opacity-50 animate-pulse' : ''}`}>
          {[
            { 
              label: 'Total Requests', 
              value: currentData.length, 
              gradient: 'from-blue-600 to-cyan-500',
              bgGradient: 'from-blue-50/80 to-cyan-50/80',
              icon: FiMessageSquare,
              shadowColor: 'shadow-blue-200/50'
            },
            { 
              label: 'Pending', 
              value: currentData.filter(c => c.status === 'pending').length, 
              gradient: 'from-amber-500 to-orange-500',
              bgGradient: 'from-amber-50/80 to-orange-50/80',
              icon: FiCalendar,
              shadowColor: 'shadow-amber-200/50'
            },
            { 
              label: 'In Progress', 
              value: currentData.filter(c => c.status === 'in_progress').length, 
              gradient: 'from-purple-600 to-pink-500',
              bgGradient: 'from-purple-50/80 to-pink-50/80',
              icon: FiUser,
              shadowColor: 'shadow-purple-200/50'
            },
            { 
              label: 'Completed', 
              value: currentData.filter(c => c.status === 'completed').length, 
              gradient: 'from-emerald-500 to-teal-500',
              bgGradient: 'from-emerald-50/80 to-teal-50/80',
              icon: FiCheck,
              shadowColor: 'shadow-emerald-200/50'
            }
          ].map((stat, index) => (
            <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md border border-white/30 rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 ${stat.shadowColor} group`}>
              {/* Refresh indicator overlay */}
              {refreshing && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
                  <FiRefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              )}
              
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10">
                <div className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl`}></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {stat.value}
                  </p>
                </div>
                <div className={`relative w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="lg:w-56">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">🟡 Pending</option>
                  <option value="in_progress">🔵 In Progress</option>
                  <option value="completed">🟢 Completed</option>
                  {activeTab === 'consultations' && <option value="scheduled">🟣 Scheduled</option>}
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of <span className="font-semibold text-gray-900">{currentData.length}</span> {activeTab === 'consultations' ? 'consultations' : 'contact requests'}
            </p>
          </div>
        </div>

        {/* Data Table - Desktop with Refresh Indicator */}
        <div className={`hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${refreshing ? 'opacity-60' : ''}`}>
          {/* Refresh overlay for table */}
          {refreshing && (
            <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <FiRefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-700 font-medium">Refreshing contact data...</span>
                </div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {activeTab === 'consultations' ? 'Type' : 'Subject'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <FiUser className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{item.full_name || item.name}</div>
                          <div className="text-sm text-gray-500">{item.email}</div>
                          {item.phone && (
                            <div className="text-xs text-gray-400">{item.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {activeTab === 'consultations' ? item.consultation_type : (item.message?.split('\n')[0] || 'General Inquiry')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setShowModal(true)
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'completed', activeTab === 'consultations' ? 'consultations' : 'contact_requests')}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="Mark Complete"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Layout - Mobile & Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-4">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.full_name || item.name}</h3>
                    <p className="text-sm text-gray-500">{item.email}</p>
                    {item.phone && <p className="text-xs text-gray-400">{item.phone}</p>}
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'consultations' ? 'Consultation Type:' : 'Subject:'}
                </p>
                <p className="text-sm text-gray-600">
                  {activeTab === 'consultations' ? item.consultation_type : (item.message?.split('\n')[0] || 'General Inquiry')}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedItem(item)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="View Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'completed', activeTab === 'consultations' ? 'consultations' : 'contact_requests')}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                    title="Mark Complete"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      <ItemModal
        item={selectedItem}
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedItem(null)
        }}
        type={activeTab === 'consultations' ? 'consultation' : 'contact'}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this {activeTab === 'consultations' ? 'consultation request' : 'contact message'} from <strong>{itemToDelete.full_name || itemToDelete.name}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setItemToDelete(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteItem(itemToDelete.id, activeTab === 'consultations' ? 'consultations' : 'contact_requests')}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Consultations
