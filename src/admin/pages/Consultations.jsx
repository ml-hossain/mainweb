import React, { useState, useEffect } from 'react'
import { FiUser, FiMail, FiPhone, FiCalendar, FiMessageSquare, FiEye, FiCheck, FiX, FiDownload, FiFilter, FiSearch } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Consultations = ({ onLogout }) => {
  const [consultations, setConsultations] = useState([])
  const [contactRequests, setContactRequests] = useState([])
  const [activeTab, setActiveTab] = useState('consultations')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch consultations
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      if (consultationsError) throw consultationsError

      // Fetch contact requests
      const { data: contactData, error: contactError } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (contactError) throw contactError

      setConsultations(consultationsData || [])
      setContactRequests(contactData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status, table) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
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
                onClick={() => updateStatus(item.id, 'in_progress', type === 'consultation' ? 'consultations' : 'contact_requests')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => updateStatus(item.id, 'completed', type === 'consultation' ? 'consultations' : 'contact_requests')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Mark Complete
              </button>
              {type === 'consultation' && (
                <button
                  onClick={() => updateStatus(item.id, 'scheduled', 'consultations')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Schedule
                </button>
              )}
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
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
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage consultation requests and contact form submissions</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Requests', value: currentData.length, color: 'blue' },
            { label: 'Pending', value: currentData.filter(c => c.status === 'pending').length, color: 'yellow' },
            { label: 'In Progress', value: currentData.filter(c => c.status === 'in_progress').length, color: 'purple' },
            { label: 'Completed', value: currentData.filter(c => c.status === 'completed').length, color: 'green' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <FiMessageSquare className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                {activeTab === 'consultations' && <option value="scheduled">Scheduled</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'consultations' ? 'Type' : 'Subject'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.full_name || item.name}</div>
                          <div className="text-sm text-gray-500">{item.email}</div>
                      </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activeTab === 'consultations' ? item.consultation_type : (item.message?.split('\n')[0] || 'General Inquiry')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'completed', activeTab === 'consultations' ? 'consultations' : 'contact_requests')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </AdminLayout>
  )
}

export default Consultations
