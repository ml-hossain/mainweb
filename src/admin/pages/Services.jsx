import React, { useState } from 'react'
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Services = ({ onLogout }) => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'University Selection',
      description: 'Comprehensive university selection guidance',
      status: 'active',
      features: 8,
      lastUpdated: '2025-01-14',
      usage: 145
    },
    {
      id: 2,
      name: 'Application Assistance',
      description: 'Complete application support and essay writing',
      status: 'active',
      features: 8,
      lastUpdated: '2025-01-13',
      usage: 98
    },
    {
      id: 3,
      name: 'Visa Processing',
      description: 'Expert visa application guidance',
      status: 'active',
      features: 6,
      lastUpdated: '2025-01-12',
      usage: 76
    },
    {
      id: 4,
      name: 'Scholarship Guidance',
      description: 'Find and apply for scholarships',
      status: 'active',
      features: 7,
      lastUpdated: '2025-01-11',
      usage: 54
    },
    {
      id: 5,
      name: 'Test Preparation',
      description: 'IELTS, TOEFL, SAT preparation',
      status: 'active',
      features: 6,
      lastUpdated: '2025-01-10',
      usage: 89
    },
    {
      id: 6,
      name: 'Interview Preparation',
      description: 'Mock interviews and coaching',
      status: 'active',
      features: 8,
      lastUpdated: '2025-01-09',
      usage: 43
    },
    {
      id: 7,
      name: 'Documentation Support',
      description: 'Document preparation and verification',
      status: 'active',
      features: 10,
      lastUpdated: '2025-01-08',
      usage: 67
    },
    {
      id: 8,
      name: 'Pre-Departure Orientation',
      description: 'Complete pre-departure guidance',
      status: 'active',
      features: 8,
      lastUpdated: '2025-01-07',
      usage: 34
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEdit = (service) => {
    setEditingService(service)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id))
    }
  }

  const handleSave = (serviceData) => {
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...serviceData, lastUpdated: new Date().toISOString().split('T')[0] }
          : service
      ))
    } else {
      const newService = {
        id: Date.now(),
        ...serviceData,
        status: 'active',
        features: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        usage: 0
      }
      setServices([...services, newService])
    }
    setShowModal(false)
    setEditingService(null)
  }

  const ServiceModal = ({ show, onClose, service, onSave }) => {
    const [formData, setFormData] = useState({
      name: service?.name || '',
      description: service?.description || '',
      status: service?.status || 'active'
    })

    if (!show) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter service name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter service description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {service ? 'Update' : 'Create'}
            </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage your educational services and their content</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiUpload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  service.status === 'active' ? 'bg-green-100 text-green-800' :
                  service.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {service.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Features:</span>
                  <span className="font-medium">{service.features}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-medium">{service.usage} students</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{service.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <FiEye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new service.</p>
          </div>
        )}
      </div>

      <ServiceModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingService(null)
        }}
        service={editingService}
        onSave={handleSave}
      />
    </AdminLayout>
  )
}

export default Services
