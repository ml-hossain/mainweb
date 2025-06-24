import React, { useState } from 'react'
import { 
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiClock,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiMessageSquare
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Consultations = ({ onLogout }) => {
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+60 12-345-6789',
      subject: 'University Selection',
      message: 'I need help choosing the right university for my engineering degree...',
      status: 'pending',
      priority: 'high',
      createdAt: '2025-01-14T10:30:00Z',
      scheduledAt: null,
      assignedTo: null,
      followUpRequired: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+60 11-987-6543',
      subject: 'Visa Processing',
      message: 'I have questions about the visa application process for Malaysia...',
      status: 'scheduled',
      priority: 'medium',
      createdAt: '2025-01-14T09:15:00Z',
      scheduledAt: '2025-01-16T14:00:00Z',
      assignedTo: 'Dr. Ahmad Rahman',
      followUpRequired: false
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+60 13-456-7890',
      subject: 'Scholarship Guidance',
      message: 'Looking for scholarship opportunities for my master\'s degree...',
      status: 'completed',
      priority: 'low',
      createdAt: '2025-01-13T16:45:00Z',
      scheduledAt: '2025-01-14T11:00:00Z',
      assignedTo: 'Ms. Fatima Ali',
      followUpRequired: true
    },
    {
      id: 4,
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      phone: '+60 14-234-5678',
      subject: 'Test Preparation',
      message: 'Need guidance on IELTS preparation and test dates...',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2025-01-13T14:20:00Z',
      scheduledAt: '2025-01-15T10:30:00Z',
      assignedTo: 'Mr. Rahman Ismail',
      followUpRequired: false
    },
    {
      id: 5,
      name: 'David Kumar',
      email: 'david.kumar@email.com',
      phone: '+60 12-876-5432',
      subject: 'General Inquiry',
      message: 'Want to know more about your services and pricing...',
      status: 'pending',
      priority: 'medium',
      createdAt: '2025-01-13T12:10:00Z',
      scheduledAt: null,
      assignedTo: null,
      followUpRequired: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || consultation.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const updateStatus = (id, newStatus) => {
    setConsultations(consultations.map(consultation =>
      consultation.id === id 
        ? { ...consultation, status: newStatus }
        : consultation
    ))
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
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const ConsultationModal = ({ consultation, show, onClose }) => {
    if (!show || !consultation) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Consultation Details</h3>
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
                  <span className="text-sm text-gray-600">{consultation.name}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{consultation.email}</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{consultation.phone}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{formatDate(consultation.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Subject & Message */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Subject</h4>
              <p className="text-sm text-gray-600 mb-4">{consultation.subject}</p>
              
              <h4 className="font-medium text-gray-900 mb-2">Message</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{consultation.message}</p>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                  {consultation.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(consultation.priority)}`}>
                  {consultation.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Assignment & Schedule */}
            {consultation.assignedTo && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Assigned To</h4>
                <p className="text-sm text-gray-600">{consultation.assignedTo}</p>
              </div>
            )}

            {consultation.scheduledAt && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scheduled Date</h4>
                <p className="text-sm text-gray-600">{formatDate(consultation.scheduledAt)}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => updateStatus(consultation.id, 'scheduled')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Schedule
              </button>
              <button
                onClick={() => updateStatus(consultation.id, 'in-progress')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                Start Consultation
              </button>
              <button
                onClick={() => updateStatus(consultation.id, 'completed')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Mark Complete
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

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
            <p className="text-gray-600 mt-1">Manage student consultation requests and appointments</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiCalendar className="w-4 h-4 mr-2" />
              Schedule New
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Requests', value: consultations.length, color: 'blue' },
            { label: 'Pending', value: consultations.filter(c => c.status === 'pending').length, color: 'yellow' },
            { label: 'Scheduled', value: consultations.filter(c => c.status === 'scheduled').length, color: 'purple' },
            { label: 'Completed', value: consultations.filter(c => c.status === 'completed').length, color: 'green' }
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
                  placeholder="Search consultations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
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
                    Priority
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
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                        <div className="text-sm text-gray-500">{consultation.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consultation.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {consultation.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                        {consultation.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(consultation.priority)}`}>
                        {consultation.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(consultation.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation)
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(consultation.id, 'completed')}
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

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      <ConsultationModal
        consultation={selectedConsultation}
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedConsultation(null)
        }}
      />
    </AdminLayout>
  )
}

export default Consultations
