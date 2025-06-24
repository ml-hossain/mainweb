import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiStar
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Universities = ({ onLogout }) => {
  const [universities, setUniversities] = useState([
    {
      id: 1,
      university: "University of Malaya",
      location: "Kuala Lumpur",
      ranking: "QS Ranking",
      rankingNumber: 1,
      program: "Medicine",
      budget: "RM 45,000",
      budgetNumber: 45000,
      duration: "5 years",
      additionalPrograms: ["Engineering", "Business", "Law"],
      allPrograms: ["Engineering", "Business", "Law", "Computer Science", "Economics", "Pharmacy"],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      slug: "university-of-malaya",
      featured: true,
      status: "active"
    },
    {
      id: 2,
      university: "Universiti Sains Malaysia",
      location: "Penang",
      ranking: "QS Top 25",
      rankingNumber: 25,
      program: "Engineering",
      budget: "RM 35,000",
      budgetNumber: 35000,
      duration: "4 years",
      additionalPrograms: ["Science", "Pharmacy", "Arts"],
      allPrograms: ["Science", "Pharmacy", "Arts", "Mathematics", "Physics", "Chemistry", "Biology"],
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      slug: "universiti-sains-malaysia",
      featured: false,
      status: "active"
    },
    // Add more universities...
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState(null)

  const [newUniversity, setNewUniversity] = useState({
    university: '',
    location: '',
    ranking: '',
    rankingNumber: '',
    program: '',
    budget: '',
    budgetNumber: '',
    duration: '',
    additionalPrograms: [],
    allPrograms: [],
    image: '',
    slug: '',
    featured: false,
    status: 'active'
  })

  const locations = ['all', 'Kuala Lumpur', 'Penang', 'Selangor', 'Johor', 'Sabah', 'Sarawak']
  const statuses = ['all', 'active', 'inactive', 'pending']

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.program.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || uni.location === selectedLocation
    const matchesStatus = selectedStatus === 'all' || uni.status === selectedStatus
    
    return matchesSearch && matchesLocation && matchesStatus
  })

  const handleAddUniversity = () => {
    const id = Math.max(...universities.map(u => u.id)) + 1
    const slug = newUniversity.university.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    setUniversities([...universities, { 
      ...newUniversity, 
      id,
      slug,
      budgetNumber: parseInt(newUniversity.budget.replace(/[^\d]/g, ''))
    }])
    setNewUniversity({
      university: '',
      location: '',
      ranking: '',
      rankingNumber: '',
      program: '',
      budget: '',
      budgetNumber: '',
      duration: '',
      additionalPrograms: [],
      allPrograms: [],
      image: '',
      slug: '',
      featured: false,
      status: 'active'
    })
    setShowAddModal(false)
  }

  const handleEditUniversity = (university) => {
    setEditingUniversity(university)
    setNewUniversity(university)
    setShowAddModal(true)
  }

  const handleUpdateUniversity = () => {
    setUniversities(universities.map(uni => 
      uni.id === editingUniversity.id ? newUniversity : uni
    ))
    setEditingUniversity(null)
    setShowAddModal(false)
    setNewUniversity({
      university: '',
      location: '',
      ranking: '',
      rankingNumber: '',
      program: '',
      budget: '',
      budgetNumber: '',
      duration: '',
      additionalPrograms: [],
      allPrograms: [],
      image: '',
      slug: '',
      featured: false,
      status: 'active'
    })
  }

  const handleDeleteUniversity = (id) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      setUniversities(universities.filter(uni => uni.id !== id))
    }
  }

  const toggleFeatured = (id) => {
    setUniversities(universities.map(uni => 
      uni.id === id ? { ...uni, featured: !uni.featured } : uni
    ))
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
            <p className="text-gray-600">Manage university partnerships and listings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add University</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Found: {filteredUniversities.length}</span>
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((university) => (
            <div key={university.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={university.image}
                  alt={university.university}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {university.ranking}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleFeatured(university.id)}
                    className={`p-2 rounded-full ${university.featured ? 'bg-yellow-400 text-white' : 'bg-white text-gray-400'}`}
                  >
                    <FiStar className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    university.status === 'active' ? 'bg-green-100 text-green-800' :
                    university.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {university.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{university.university}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {university.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    {university.budget}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="w-4 h-4 mr-2" />
                    {university.duration}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Primary Program:</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {university.program}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Other Programs:</p>
                  <div className="flex flex-wrap gap-1">
                    {university.additionalPrograms.slice(0, 2).map((program, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {program}
                      </span>
                    ))}
                    {university.additionalPrograms.length > 2 && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        +{university.additionalPrograms.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleEditUniversity(university)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteUniversity(university.id)}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingUniversity ? 'Edit University' : 'Add New University'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                  <input
                    type="text"
                    value={newUniversity.university}
                    onChange={(e) => setNewUniversity({...newUniversity, university: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newUniversity.location}
                    onChange={(e) => setNewUniversity({...newUniversity, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                  <input
                    type="text"
                    value={newUniversity.ranking}
                    onChange={(e) => setNewUniversity({...newUniversity, ranking: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ranking Number</label>
                  <input
                    type="number"
                    value={newUniversity.rankingNumber}
                    onChange={(e) => setNewUniversity({...newUniversity, rankingNumber: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Program</label>
                  <input
                    type="text"
                    value={newUniversity.program}
                    onChange={(e) => setNewUniversity({...newUniversity, program: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input
                    type="text"
                    value={newUniversity.budget}
                    onChange={(e) => setNewUniversity({...newUniversity, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newUniversity.duration}
                    onChange={(e) => setNewUniversity({...newUniversity, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newUniversity.image}
                    onChange={(e) => setNewUniversity({...newUniversity, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Programs (comma separated)</label>
                  <input
                    type="text"
                    value={newUniversity.additionalPrograms.join(', ')}
                    onChange={(e) => setNewUniversity({
                      ...newUniversity, 
                      additionalPrograms: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUniversity.featured}
                      onChange={(e) => setNewUniversity({...newUniversity, featured: e.target.checked})}
                      className="mr-2"
                    />
                    Featured
                  </label>
                  
                  <select
                    value={newUniversity.status}
                    onChange={(e) => setNewUniversity({...newUniversity, status: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingUniversity(null)
                    setNewUniversity({
                      university: '',
                      location: '',
                      ranking: '',
                      rankingNumber: '',
                      program: '',
                      budget: '',
                      budgetNumber: '',
                      duration: '',
                      additionalPrograms: [],
                      allPrograms: [],
                      image: '',
                      slug: '',
                      featured: false,
                      status: 'active'
                    })
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingUniversity ? handleUpdateUniversity : handleAddUniversity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingUniversity ? 'Update' : 'Add'} University
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Universities
