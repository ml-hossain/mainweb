import React, { useState, useEffect } from 'react'
import { 
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEye,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiX,
  FiAlertCircle
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Contacts = ({ onLogout }) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching contacts...')
      
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Current session:', session ? 'Authenticated' : 'Not authenticated', sessionError)
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }
      
      if (!session) {
        throw new Error('No active session. Please log in again.')
      }

      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      
      console.log('Contacts fetched successfully:', data?.length || 0, 'records')
      setContacts(data || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.phone && contact.phone.includes(searchTerm)) ||
                         (contact.message && contact.message.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateContactStatus = async (id, newStatus) => {
    try {
      console.log('Updating contact status:', id, 'to', newStatus)
      
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Update error:', error)
        throw error
      }
      
      // Update local state
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, status: newStatus } : contact
      ))
      
      console.log('Contact status updated successfully')
    } catch (error) {
      console.error('Error updating contact status:', error)
      alert(`Error updating status: ${error.message}`)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
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
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubject = (message) => {
    if (!message) return 'No subject'
    const lines = message.split('\n')
    const subjectLine = lines.find(line => line.startsWith('Subject:'))
    if (subjectLine) {
      return subjectLine.replace('Subject:', '').trim() || 'General Inquiry'
    }
    // If no subject line, return first 50 characters
    return message.length > 50 ? message.substring(0, 50) + '...' : message
  }

  const getMessageContent = (message) => {
    if (!message) return ''
    const lines = message.split('\n')
    const subjectLineIndex = lines.findIndex(line => line.startsWith('Subject:'))
    if (subjectLineIndex !== -1 && lines.length > subjectLineIndex + 1) {
      // Skip subject line and empty line, return the rest
      return lines.slice(subjectLineIndex + 2).join('\n').trim()
    }
    return message
  }

  const ContactModal = ({ contact, show, onClose }) => {
    if (!show || !contact) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{contact.name}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{formatDate(contact.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Subject</h4>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{getSubject(contact.message)}</p>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Message</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{getMessageContent(contact.message) || contact.message}</p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => updateContactStatus(contact.id, 'in_progress')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => updateContactStatus(contact.id, 'completed')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Mark Complete
              </button>
              <button
                onClick={() => updateContactStatus(contact.id, 'archived')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Archive
              </button>
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
          <p className="ml-4 text-gray-600">Loading contacts...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Contacts</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
          <button
            onClick={fetchContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Contact Requests</h1>
            <p className="text-gray-600 mt-1">Manage and respond to contact form submissions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchContacts}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Contacts', value: contacts.length, color: 'blue', icon: FiMessageSquare },
            { label: 'Pending', value: contacts.filter(c => c.status === 'pending').length, color: 'yellow', icon: FiClock },
            { label: 'In Progress', value: contacts.filter(c => c.status === 'in_progress').length, color: 'blue', icon: FiUser },
            { label: 'Completed', value: contacts.filter(c => c.status === 'completed').length, color: 'green', icon: FiCheck }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
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
                  placeholder="Search contacts..."
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
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
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
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          {contact.phone && (
                            <div className="text-sm text-gray-500">{contact.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getSubject(contact.message)}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {getMessageContent(contact.message) || contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact)
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateContactStatus(contact.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark Complete"
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

        {filteredContacts.length === 0 && contacts.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filter settings.
            </p>
          </div>
        )}

        {contacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact requests yet</h3>
            <p className="text-gray-600">
              Contact requests will appear here when users submit the contact form.
            </p>
          </div>
        )}
      </div>

      <ContactModal
        contact={selectedContact}
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedContact(null)
        }}
      />
    </AdminLayout>
  )
}

export default Contacts
