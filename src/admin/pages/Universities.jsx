import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiStar, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Universities = ({ onLogout }) => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return

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
          <Link
            to="/admin/universities/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add University
          </Link>
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
                      e.target.parentElement.innerHTML = '<span class="text-gray-500 text-sm">Image not available</span>'
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800 flex-1 break-words">{university.name}</h3>
                  <div className="flex items-center ml-2">
                    <button
                      onClick={() => toggleFeatured(university.id, university.featured)}
                      className={`p-1 rounded-full ${university.featured ? 'text-yellow-500' : 'text-gray-400'}`}
                      title={university.featured ? 'Featured' : 'Not Featured'}
                    >
                      <FiStar className={`w-4 h-4 ${university.featured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleActive(university.id, university.is_active)}
                      className={`p-1 rounded-full ${university.is_active ? 'text-green-500' : 'text-red-500'}`}
                      title={university.is_active ? 'Active' : 'Inactive'}
                    >
                      {university.is_active ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1">{university.location}</p>
                <div className="flex justify-end items-center mt-4 space-x-2">
                  <a
                    href={university.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors"
                    title="Visit Website"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    to={`/admin/universities/edit/${university.id}`}
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors"
                    title="Edit University"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(university.id)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors"
                    title="Delete University"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
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
            <Link
              to="/admin/universities/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add University
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Universities
