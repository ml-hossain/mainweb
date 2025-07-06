import React, { useState, useEffect } from 'react'
import { FiTarget, FiEdit, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiGlobe, FiEye, FiSettings, FiTrendingUp, FiBarChart2, FiSave, FiX, FiCheck, FiAlertTriangle, FiExternalLink, FiCopy, FiImage, FiZap } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import AdvancedSEOTool from '../../components/AdvancedSEOTool'

const SeoManager = ({ onLogout, user }) => {
  const [seoSettings, setSeoSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvancedSEO, setShowAdvancedSEO] = useState(false)
  const [seoToolContext, setSeoToolContext] = useState('blog')

  useEffect(() => {
    fetchSeoSettings()
  }, [])

  const fetchSeoSettings = async () => {
    try {
      setLoading(true)
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const dataPromise = supabase
        .from('page_seo_settings')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise])
      
      if (error) throw error
      setSeoSettings(data || [])
      console.log('SEO settings loaded successfully:', data?.length)
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
      setSeoSettings([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const dataPromise = supabase
        .from('page_seo_settings')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise])
      
      if (error) throw error
      setSeoSettings(data || [])
      console.log('SEO data refreshed successfully:', data?.length)
    } catch (error) {
      console.error('Error refreshing SEO data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true)
      
      if (editingItem) {
        // Update existing
        const { error } = await supabase
          .from('page_seo_settings')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id)
        
        if (error) throw error
        
        setSeoSettings(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        ))
      } else {
        // Create new
        const { data, error } = await supabase
          .from('page_seo_settings')
          .insert([formData])
          .select()
        
        if (error) throw error
        
        setSeoSettings(prev => [data[0], ...prev])
      }
      
      setShowModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving SEO settings:', error)
      alert('Error saving SEO settings. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('page_seo_settings')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setSeoSettings(prev => prev.filter(item => item.id !== id))
      setShowDeleteModal(false)
      setItemToDelete(null)
    } catch (error) {
      console.error('Error deleting SEO settings:', error)
      alert('Error deleting SEO settings. Please try again.')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('page_seo_settings')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      setSeoSettings(prev => prev.map(item => 
        item.id === id ? { ...item, is_active: !currentStatus } : item
      ))
    } catch (error) {
      console.error('Error updating active status:', error)
      alert('Error updating status. Please try again.')
    }
  }

  const filteredSettings = seoSettings.filter(item =>
    item.page_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.page_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.meta_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const SeoModal = ({ show, item, onClose, onSave, isSubmitting }) => {
    const [formData, setFormData] = useState({
      page_slug: '',
      page_title: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image_url: '',
      og_type: 'website',
      twitter_card: 'summary_large_image',
      twitter_title: '',
      twitter_description: '',
      twitter_image_url: '',
      canonical_url: '',
      robots_meta: 'index, follow',
      schema_markup: {},
      is_active: true
    })

    useEffect(() => {
      if (item) {
        setFormData(item)
      } else {
        setFormData({
          page_slug: '',
          page_title: '',
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          og_title: '',
          og_description: '',
          og_image_url: '',
          og_type: 'website',
          twitter_card: 'summary_large_image',
          twitter_title: '',
          twitter_description: '',
          twitter_image_url: '',
          canonical_url: '',
          robots_meta: 'index, follow',
          schema_markup: {},
          is_active: true
        })
      }
    }, [item])

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.page_slug.trim() || !formData.page_title.trim()) {
        alert('Page slug and title are required')
        return
      }
      onSave(formData)
    }

    if (!show) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FiTarget className="w-6 h-6 mr-3 text-orange-500" />
                  {item ? 'Edit SEO Settings' : 'Add New SEO Page'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiSettings className="w-5 h-5 mr-2 text-gray-600" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Slug (URL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.page_slug}
                      onChange={(e) => setFormData(prev => ({...prev, page_slug: e.target.value}))}
                      placeholder="e.g., home, universities, consultation"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.page_title}
                      onChange={(e) => setFormData(prev => ({...prev, page_title: e.target.value}))}
                      placeholder="Page display title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Meta Tags */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiGlobe className="w-5 h-5 mr-2 text-blue-600" />
                  Meta Tags
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({...prev, meta_title: e.target.value}))}
                      placeholder="SEO optimized title (50-60 characters)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength="60"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({...prev, meta_description: e.target.value}))}
                      placeholder="SEO description (150-160 characters)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength="160"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData(prev => ({...prev, meta_keywords: e.target.value}))}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiImage className="w-5 h-5 mr-2 text-green-600" />
                  Open Graph (Facebook)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={formData.og_title}
                      onChange={(e) => setFormData(prev => ({...prev, og_title: e.target.value}))}
                      placeholder="Facebook share title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Type
                    </label>
                    <select
                      value={formData.og_type}
                      onChange={(e) => setFormData(prev => ({...prev, og_type: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="blog">Blog</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Description
                    </label>
                    <textarea
                      value={formData.og_description}
                      onChange={(e) => setFormData(prev => ({...prev, og_description: e.target.value}))}
                      placeholder="Facebook share description"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.og_image_url}
                      onChange={(e) => setFormData(prev => ({...prev, og_image_url: e.target.value}))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Twitter Cards */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Twitter Cards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Card Type
                    </label>
                    <select
                      value={formData.twitter_card}
                      onChange={(e) => setFormData(prev => ({...prev, twitter_card: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      value={formData.twitter_title}
                      onChange={(e) => setFormData(prev => ({...prev, twitter_title: e.target.value}))}
                      placeholder="Twitter share title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Description
                    </label>
                    <textarea
                      value={formData.twitter_description}
                      onChange={(e) => setFormData(prev => ({...prev, twitter_description: e.target.value}))}
                      placeholder="Twitter share description"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.twitter_image_url}
                      onChange={(e) => setFormData(prev => ({...prev, twitter_image_url: e.target.value}))}
                      placeholder="https://example.com/twitter-image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiBarChart2 className="w-5 h-5 mr-2 text-yellow-600" />
                  Advanced Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData(prev => ({...prev, canonical_url: e.target.value}))}
                      placeholder="https://maeducation.com/page"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Robots Meta
                    </label>
                    <select
                      value={formData.robots_meta}
                      onChange={(e) => setFormData(prev => ({...prev, robots_meta: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, follow">No Index, Follow</option>
                      <option value="index, nofollow">Index, No Follow</option>
                      <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4 mr-2" />
                      {item ? 'Update' : 'Create'} SEO Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-900 via-red-800 to-pink-900 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-orange-300 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-red-300 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              {/* Left Content */}
              <div className="flex-1 mb-8 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <FiTarget className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      SEO Manager
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-orange-200 text-sm font-medium">Search Engine Optimization</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-orange-100 text-base md:text-lg font-medium mb-6 max-w-2xl">
                  Manage SEO settings for all pages to improve search engine visibility and social media sharing
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiTarget className="w-4 h-4 mr-2 text-orange-300" />
                    <span className="text-white font-semibold">{seoSettings.length}</span>
                    <span className="text-orange-200 ml-1">Total Pages</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{seoSettings.filter(s => s.is_active).length}</span>
                    <span className="text-orange-200 ml-1">Active</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{seoSettings.filter(s => !s.is_active).length}</span>
                    <span className="text-orange-200 ml-1">Inactive</span>
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
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiRefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{refreshing ? 'Refreshing...' : 'Refresh Data'}</div>
                    <div className="text-orange-200 text-xs">Update list</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setEditingItem(null)
                    setShowModal(true)
                  }}
                  className="group flex items-center justify-center px-6 py-3 bg-gradient-to-br from-white to-orange-50 text-orange-900 rounded-xl hover:from-orange-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiPlus className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Add SEO Page</div>
                    <div className="text-orange-600 text-xs">Create new</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Refresh Indicator */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-300 ${refreshing ? 'opacity-50 animate-pulse' : ''}`}>
          {[
            { 
              label: 'Total Pages', 
              value: seoSettings.length, 
              gradient: 'from-orange-600 to-red-500',
              bgGradient: 'from-orange-50/80 to-red-50/80',
              icon: FiTarget,
              shadowColor: 'shadow-orange-200/50'
            },
            { 
              label: 'Active Pages', 
              value: seoSettings.filter(s => s.is_active).length, 
              gradient: 'from-green-500 to-emerald-500',
              bgGradient: 'from-green-50/80 to-emerald-50/80',
              icon: FiEye,
              shadowColor: 'shadow-green-200/50'
            },
            { 
              label: 'With Meta Desc', 
              value: seoSettings.filter(s => s.meta_description).length, 
              gradient: 'from-blue-500 to-purple-500',
              bgGradient: 'from-blue-50/80 to-purple-50/80',
              icon: FiGlobe,
              shadowColor: 'shadow-blue-200/50'
            },
            { 
              label: 'With Schema', 
              value: seoSettings.filter(s => s.schema_markup && Object.keys(s.schema_markup).length > 0).length, 
              gradient: 'from-purple-600 to-pink-500',
              bgGradient: 'from-purple-50/80 to-pink-50/80',
              icon: FiBarChart2,
              shadowColor: 'shadow-purple-200/50'
            }
          ].map((stat, index) => (
            <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md border border-white/30 rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 ${stat.shadowColor} group`}>
              {/* Refresh indicator overlay */}
              {refreshing && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
                  <FiRefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
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

        {/* Advanced SEO Tool Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Advanced SEO Tool</h3>
                  <p className="text-sm text-gray-600">AI-powered content generation, keyword research, and competitor analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={seoToolContext}
                  onChange={(e) => setSeoToolContext(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="blog">Blog Content</option>
                  <option value="university">University Pages</option>
                </select>
                <button
                  onClick={() => setShowAdvancedSEO(!showAdvancedSEO)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    showAdvancedSEO 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  <FiZap className="w-4 h-4" />
                  <span>{showAdvancedSEO ? 'Hide' : 'Show'} Advanced Tool</span>
                </button>
              </div>
            </div>
          </div>
          
          {showAdvancedSEO && (
            <div className="p-6">
              <AdvancedSEOTool
                context={seoToolContext}
                fields={seoToolContext === 'blog' ? 
                  { title: true, metaDescription: true, tags: true, mainContent: true } :
                  { title: true, shortDescription: true, mainContent: true }
                }
                generateFor={seoToolContext === 'blog' ? 
                  ['metaDescription', 'mainContent', 'tags'] :
                  ['shortDescription', 'mainContent']
                }
                onContentGenerated={(content) => {
                  console.log('Generated content:', content);
                  // You can integrate this with your form or save to database
                }}
                initialData={{}}
              />
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search SEO Pages</label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by page slug, title, or meta title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredSettings.length}</span> of <span className="font-semibold text-gray-900">{seoSettings.length}</span> SEO pages
            </p>
          </div>
        </div>

        {/* SEO Settings Table */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${refreshing ? 'opacity-60' : ''}`}>
          {/* Refresh overlay for table */}
          {refreshing && (
            <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <FiRefreshCw className="w-5 h-5 text-orange-600 animate-spin" />
                  <span className="text-orange-700 font-medium">Refreshing SEO data...</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Meta Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Social Media
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredSettings.map((item) => (
                  <tr key={item.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <FiTarget className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{item.page_title}</div>
                          <div className="text-sm text-gray-500">/{item.page_slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 truncate max-w-xs" title={item.meta_title}>
                          {item.meta_title || 'No meta title'}
                        </div>
                        <div className="text-gray-500 text-xs truncate max-w-xs" title={item.meta_description}>
                          {item.meta_description || 'No meta description'}
                        </div>
                        {item.meta_keywords && (
                          <div className="text-xs text-blue-600 mt-1">
                            {item.meta_keywords.split(',').slice(0, 3).join(', ')}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {item.og_title && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            OG
                          </span>
                        )}
                        {item.twitter_title && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            TW
                          </span>
                        )}
                        {item.schema_markup && Object.keys(item.schema_markup).length > 0 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Schema
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(item.id, item.is_active)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          item.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        {item.canonical_url && (
                          <a
                            href={item.canonical_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View Page"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditingItem(item)
                            setShowModal(true)
                          }}
                          className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-all duration-200"
                          title="Edit SEO Settings"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item)
                            setShowDeleteModal(true)
                          }}
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

        {filteredSettings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SEO pages found</h3>
            <p className="text-gray-600 mb-4">Create your first SEO page configuration to get started.</p>
            <button
              onClick={() => {
                setEditingItem(null)
                setShowModal(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add SEO Page
            </button>
          </div>
        )}
      </div>

      <SeoModal
        show={showModal}
        item={editingItem}
        onClose={() => {
          setShowModal(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        isSubmitting={isSubmitting}
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
              Are you sure you want to delete SEO settings for <strong>{itemToDelete.page_title}</strong>? This action cannot be undone.
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
                onClick={() => handleDelete(itemToDelete.id)}
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

export default SeoManager
