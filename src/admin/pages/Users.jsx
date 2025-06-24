import React, { useState } from 'react'
import { 
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload,
  FiPlus,
  FiUserCheck,
  FiUserX,
  FiUsers,
  FiShield
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Users = ({ onLogout }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+60 12-345-6789',
      status: 'active',
      role: 'student',
      registrationDate: '2025-01-10',
      lastLogin: '2025-01-14T09:30:00Z',
      location: 'Kuala Lumpur, Malaysia',
      university: 'University of Malaya',
      program: 'Computer Science',
      applicationStatus: 'in-progress',
      consultations: 3,
      documents: 8
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+60 11-987-6543',
      status: 'active',
      role: 'student',
      registrationDate: '2025-01-08',
      lastLogin: '2025-01-13T14:20:00Z',
      location: 'Penang, Malaysia',
      university: 'Universiti Sains Malaysia',
      program: 'Engineering',
      applicationStatus: 'completed',
      consultations: 5,
      documents: 12
    },
    {
      id: 3,
      name: 'Dr. Ahmad Rahman',
      email: 'ahmad.rahman@maeducation.com',
      phone: '+60 3-1234-5678',
      status: 'active',
      role: 'admin',
      registrationDate: '2024-01-01',
      lastLogin: '2025-01-14T10:00:00Z',
      location: 'Kuala Lumpur, Malaysia',
      university: null,
      program: null,
      applicationStatus: null,
      consultations: 156,
      documents: 0
    },
    {
      id: 4,
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      phone: '+60 14-234-5678',
      status: 'inactive',
      role: 'student',
      registrationDate: '2025-01-05',
      lastLogin: '2025-01-10T16:45:00Z',
      location: 'Johor Bahru, Malaysia',
      university: 'Universiti Teknologi Malaysia',
      program: 'Business Administration',
      applicationStatus: 'pending',
      consultations: 2,
      documents: 5
    },
    {
      id: 5,
      name: 'Ms. Fatima Ali',
      email: 'fatima.ali@maeducation.com',
      phone: '+60 3-2345-6789',
      status: 'active',
      role: 'counselor',
      registrationDate: '2024-06-15',
      lastLogin: '2025-01-14T08:45:00Z',
      location: 'Kuala Lumpur, Malaysia',
      university: null,
      program: null,
      applicationStatus: null,
      consultations: 89,
      documents: 0
    },
    {
      id: 6,
      name: 'David Kumar',
      email: 'david.kumar@email.com',
      phone: '+60 12-876-5432',
      status: 'pending',
      role: 'student',
      registrationDate: '2025-01-14',
      lastLogin: null,
      location: 'Selangor, Malaysia',
      university: null,
      program: null,
      applicationStatus: 'not-started',
      consultations: 0,
      documents: 0
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const updateUserStatus = (id, newStatus) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user
    ))
  }

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: dateString.includes('T') ? '2-digit' : undefined,
      minute: dateString.includes('T') ? '2-digit' : undefined
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'counselor': return 'bg-blue-100 text-blue-800'
      case 'student': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return FiShield
      case 'counselor': return FiUsers
      case 'student': return FiUser
      default: return FiUser
    }
  }

  const UserModal = ({ user, show, onClose }) => {
    if (!show || !user) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{user.location}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Joined: {formatDate(user.registrationDate)}</span>
                </div>
                <div className="flex items-center">
                  <FiUserCheck className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Last Login: {formatDate(user.lastLogin)}</span>
                </div>
              </div>
            </div>

            {/* Academic Info (for students) */}
            {user.role === 'student' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">University:</span>
                    <p className="text-gray-900">{user.university || 'Not selected'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Program:</span>
                    <p className="text-gray-900">{user.program || 'Not selected'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Application Status:</span>
                    <p className="text-gray-900 capitalize">{user.applicationStatus?.replace('-', ' ') || 'Not started'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{user.consultations}</div>
                <div className="text-sm text-gray-600">Consultations</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{user.documents}</div>
                <div className="text-sm text-gray-600">Documents</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                className={`px-4 py-2 text-white rounded-lg text-sm ${
                  user.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {user.status === 'active' ? 'Deactivate' : 'Activate'} User
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Send Email
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const AddEditUserModal = ({ user, show, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'student',
      status: user?.status || 'active',
      location: user?.location || '',
      university: user?.university || '',
      program: user?.program || ''
    })

    if (!show) return null

    const handleSave = () => {
      if (user) {
        setUsers(users.map(u => u.id === user.id ? { ...u, ...formData } : u))
      } else {
        const newUser = {
          id: Date.now(),
          ...formData,
          registrationDate: new Date().toISOString().split('T')[0],
          lastLogin: null,
          applicationStatus: 'not-started',
          consultations: 0,
          documents: 0
        }
        setUsers([...users, newUser])
      }
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {user ? 'Update' : 'Create'}
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
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">Manage students, counselors, and admin users</p>
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
              onClick={() => setShowUserModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: users.length, color: 'blue', icon: FiUsers },
            { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'green', icon: FiUserCheck },
            { label: 'Students', value: users.filter(u => u.role === 'student').length, color: 'purple', icon: FiUser },
            { label: 'Counselors', value: users.filter(u => u.role === 'counselor').length, color: 'orange', icon: FiUsers }
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
                  placeholder="Search users..."
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
                <option value="pending">Pending</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="counselor">Counselors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role)
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RoleIcon className="w-4 h-4 mr-2 text-gray-400" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>{user.consultations} consultations</span>
                          <span>{user.documents} docs</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingUser(user)
                              setShowUserModal(true)
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new user.</p>
          </div>
        )}
      </div>

      <UserModal
        user={selectedUser}
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedUser(null)
        }}
      />

      <AddEditUserModal
        user={editingUser}
        show={showUserModal}
        onClose={() => {
          setShowUserModal(false)
          setEditingUser(null)
        }}
      />
    </AdminLayout>
  )
}

export default Users
