import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiStar, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Universities = ({ onLogout }) => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    logo_url: '',
    description: '',
    ranking: '',
    website_url: '',
    tuition_fee_range: '',
    programs: '',
    requirements: '',
    is_featured: false,
    is_active: true
  })

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUniversities(data || [])
    } catch (error) {
      console.error('Error fetching universities:', error)
      alert('Error loading universities')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (
        !formData.name ||
        !formData.location ||
        !formData.logo_url ||
        !formData.description ||
        !formData.website_url ||
        !formData.tuition_fee_range ||
        !formData.programs ||
        !formData.requirements
      ) {
        alert('All fields are required')
        return
      }

      const programsArray = formData.programs
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0)

      const universityData = {
        name: formData.name,
        location: formData.location,
        logo_url: formData.logo_url,
        description: formData.description,
        website_url: formData.website_url,
        featured: formData.is_featured,
        is_active: formData.is_active,
        content: {
          ranking: formData.ranking ? parseInt(formData.ranking) : null,
          tuition_fee_range: formData.tuition_fee_range,
          programs: programsArray,
          requirements: formData.requirements,
        },
      }

      if (editingUniversity) {
        const { error } = await supabase
          .from('universities')
          .update(universityData)
          .eq('id', editingUniversity.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('universities')
          .insert([universityData])

        if (error) throw error
      }

      setShowModal(false)
      setEditingUniversity(null)
      resetForm()
      fetchUniversities()
      alert(editingUniversity ? 'University updated successfully!' : 'University added successfully!')
    } catch (error) {
      console.error('Error saving university:', error)
      alert('Error saving university')
    }
  }

  const handleEdit = (university) => {
    setEditingUniversity(university)
    setFormData({
      name: university.name || '',
      location: university.location || '',
      logo_url: university.logo_url || '',
      description: university.description || '',
      ranking: university.content?.ranking?.toString() || '',
      website_url: university.website_url || '',
      tuition_fee_range: university.content?.tuition_fee_range || '',
      programs: university.content?.programs?.join(', ') || '',
      requirements: university.content?.requirements || '',
      is_featured: university.featured || false,
      is_active: university.is_active || true,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this university?')) return

    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchUniversities()
      alert('University deleted successfully!')
    } catch (error) {
      console.error('Error deleting university:', error)
      alert('Error deleting university')
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('universities')
        .update({ featured: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchUniversities()
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Error updating featured status')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('universities')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchUniversities()
    } catch (error) {
      console.error('Error updating active status:', error)
      alert('Error updating active status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      logo_url: '',
      description: '',
      ranking: '',
      website_url: '',
      tuition_fee_range: '',
      programs: '',
      requirements: '',
      is_featured: false,
      is_active: true
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
            <p className="text-gray-600">Manage partner universities and institutions</p>
          </div>
          <button
            onClick={() => {
              setEditingUniversity(null)
              resetForm()
              setShowModal(true)
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add University
          </button>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <div key={university.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              {university.logo_url && (
                <div className="h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <img
                    src={university.logo_url}
                    alt={university.name}
                    className="max-h-20 max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{university.name}</h3>
                  <div className="flex items-center space-x-1">
                    {university.content?.ranking && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        #{university.content.ranking}
                      </span>
                    )}
                    {university.featured && (
                      <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">{university.location}</p>

                {university.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {university.description}
                  </p>
                )}

                {university.content?.programs && university.content?.programs.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {university.content.programs.slice(0, 3).map((program, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {program}
                        </span>
                      ))}
                      {university.content.programs.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{university.content.programs.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {university.tuition_fee_range && (
                  <p className="text-sm font-medium text-green-600 mb-3">
                    {university.tuition_fee_range}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFeatured(university.id, university.featured)}
                      className={`p-1 rounded ${university.featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      title="Toggle Featured"
                    >
                      <FiStar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(university.id, university.is_active)}
                      className={`p-1 rounded ${university.is_active ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                      title="Toggle Active"
                    >
                      {university.is_active ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(university)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(university.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {universities.length === 0 && (
          <div className="text-center py-12">
            <FiGlobe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No universities yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first partner university.</p>
            <button
              onClick={() => {
                setEditingUniversity(null)
                resetForm()
                setShowModal(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add University
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingUniversity ? 'Edit University' : 'Add New University'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ranking
                      </label>
                      <input
                        type="number"
                        name="ranking"
                        value={formData.ranking}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuition Fee Range
                      </label>
                      <input
                        type="text"
                        name="tuition_fee_range"
                        value={formData.tuition_fee_range}
                        onChange={handleInputChange}
                        placeholder="e.g., $20,000 - $30,000/year"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programs Offered (comma separated)
                    </label>
                    <input
                      type="text"
                      name="programs"
                      value={formData.programs}
                      onChange={handleInputChange}
                      placeholder="e.g., Engineering, Business, Medicine, Computer Science"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admission Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="e.g., IELTS 6.5+, Strong academic record"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingUniversity(null)
                        resetForm()
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingUniversity ? 'Update' : 'Add'} University
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Universities
