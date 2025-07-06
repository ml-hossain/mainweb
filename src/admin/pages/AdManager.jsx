import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiBarChart2, FiCopy, FiExternalLink } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const AdManager = ({ onLogout, user }) => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPlacement, setFilterPlacement] = useState('all')

  // Load ads from database
  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('content_placements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAds(data || [])
    } catch (error) {
      console.error('Error fetching content placements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return

    try {
      const { error } = await supabase
        .from('content_placements')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setAds(ads.filter(ad => ad.id !== id))
    } catch (error) {
      console.error('Error deleting content placement:', error)
      alert('Error deleting ad')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    try {
      const { error } = await supabase
        .from('content_placements')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setAds(ads.map(ad => 
        ad.id === id ? { ...ad, status: newStatus } : ad
      ))
    } catch (error) {
      console.error('Error updating content placement status:', error)
      alert('Error updating ad status')
    }
  }

  const handleDuplicateAd = async (ad) => {
    try {
      const { id, created_at, updated_at, ...adData } = ad
      const newAd = {
        ...adData,
        name: `${ad.name} (Copy)`,
        status: 'inactive'
      }

      const { data, error } = await supabase
        .from('content_placements')
        .insert([newAd])
        .select()

      if (error) throw error
      
      setAds([data[0], ...ads])
    } catch (error) {
      console.error('Error duplicating content placement:', error)
      alert('Error duplicating ad')
    }
  }

  // Filter ads based on search and filters
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.placement.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus
    const matchesPlacement = filterPlacement === 'all' || ad.placement === filterPlacement
    
    return matchesSearch && matchesStatus && matchesPlacement
  })

  // Get unique placements for filter dropdown
  const uniquePlacements = [...new Set(ads.map(ad => ad.placement))]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'banner':
      case 'leaderboard':
        return '📱'
      case 'square':
      case 'medium-rectangle':
        return '⬜'
      case 'sidebar':
      case 'skyscraper':
        return '📏'
      default:
        return '📊'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ad Manager</h1>
            <p className="text-gray-600 mt-1">Manage advertisement placements and content</p>
          </div>
          <button
            onClick={() => {
              setSelectedAd(null)
              setShowEditor(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Create Ad
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ads</p>
                <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
              </div>
              <div className="text-blue-500">📊</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {ads.filter(ad => ad.status === 'active').length}
                </p>
              </div>
              <div className="text-green-500">✅</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {ads.reduce((sum, ad) => sum + (ad.view_count || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="text-purple-500">👁️</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-orange-600">
                  {ads.reduce((sum, ad) => sum + (ad.click_count || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="text-orange-500">🖱️</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search ads by name or placement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
              <select
                value={filterPlacement}
                onChange={(e) => setFilterPlacement(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Placements</option>
                {uniquePlacements.map(placement => (
                  <option key={placement} value={placement}>{placement}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Ad</th>
                <th className="text-left p-4 font-medium text-gray-700">Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Placement</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Performance</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAds.map(ad => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(ad.type)}</div>
                      <div>
                        <div className="font-medium text-gray-900">{ad.name}</div>
                        <div className="text-sm text-gray-500">{ad.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {ad.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900">{ad.placement}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{(ad.view_count || 0).toLocaleString()} views</div>
                      <div className="text-gray-500">{(ad.click_count || 0).toLocaleString()} clicks</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(ad.id, ad.status)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={ad.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {ad.status === 'active' ? (
                          <FiEyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <FiEye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAd(ad)
                          setShowEditor(true)
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDuplicateAd(ad)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Duplicate"
                      >
                        <FiCopy className="w-4 h-4 text-gray-500" />
                      </button>
                      {ad.link_url && (
                        <a
                          href={ad.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Visit Link"
                        >
                          <FiExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ads found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterPlacement !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first ad to get started'}
            </p>
            <button
              onClick={() => {
                setSelectedAd(null)
                setShowEditor(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Ad
            </button>
          </div>
        )}
      </div>

      {/* Ad Editor Modal */}
      {showEditor && (
        <AdEditor 
          ad={selectedAd}
          onClose={() => {
            setShowEditor(false)
            setSelectedAd(null)
          }}
          onSave={() => {
            setShowEditor(false)
            setSelectedAd(null)
            fetchAds()
          }}
        />
      )}
      </div>
    </AdminLayout>
  )
}

// Ad Editor Component
const AdEditor = ({ ad, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'medium-rectangle',
    placement: '',
    status: 'active',
    position: 'center',
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    ad_client: '',
    ad_slot: '',
    custom_html: '',
    show_label: true,
    label_text: 'Advertisement',
    dismissible: false,
    background_color: '#ffffff',
    border_color: '#e5e7eb',
    target_pages: [],
    start_date: '',
    end_date: '',
    max_impressions: '',
    custom_css: '',
    ...(ad ? {
      ...ad,
      background_color: ad.background_color || '#ffffff',
      border_color: ad.border_color || '#e5e7eb',
      target_pages: ad.target_pages || [],
      start_date: ad.start_date ? new Date(ad.start_date).toISOString().slice(0, 16) : '',
      end_date: ad.end_date ? new Date(ad.end_date).toISOString().slice(0, 16) : '',
      max_impressions: ad.max_impressions || '',
      custom_css: ad.custom_css || ''
    } : {})
  })

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const dataToSave = {
        ...formData,
        target_pages: formData.target_pages.filter(page => page.trim()),
        max_impressions: formData.max_impressions ? parseInt(formData.max_impressions) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      }

      if (ad) {
        // Update existing ad
        const { error } = await supabase
          .from('content_placements')
          .update(dataToSave)
          .eq('id', ad.id)

        if (error) throw error
      } else {
        // Create new ad
        const { error } = await supabase
          .from('content_placements')
          .insert([dataToSave])

        if (error) throw error
      }

      onSave()
    } catch (error) {
      console.error('Error saving ad:', error)
      alert('Error saving ad: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const adTypes = [
    { value: 'banner', label: 'Banner (728x90)' },
    { value: 'large-banner', label: 'Large Banner (970x90)' },
    { value: 'medium-rectangle', label: 'Medium Rectangle (300x250)' },
    { value: 'large-rectangle', label: 'Large Rectangle (336x280)' },
    { value: 'leaderboard', label: 'Leaderboard (728x90)' },
    { value: 'skyscraper', label: 'Skyscraper (160x600)' },
    { value: 'wide-skyscraper', label: 'Wide Skyscraper (160x600)' },
    { value: 'mobile-banner', label: 'Mobile Banner (320x50)' },
    { value: 'square', label: 'Square (250x250)' }
  ]

  const placements = [
    { value: 'blog-sidebar', label: 'Blog Sidebar' },
    { value: 'blog-detail', label: 'Blog Detail' },
    { value: 'blog-detail-inline', label: 'Blog Detail Inline' },
    { value: 'home-banner', label: 'Home Banner' },
    { value: 'home-sidebar', label: 'Home Sidebar' },
    { value: 'footer', label: 'Footer' },
    { value: 'header', label: 'Header' },
    { value: 'mobile-bottom', label: 'Mobile Bottom' },
    { value: 'popup', label: 'Popup' },
    { value: 'custom', label: 'Custom' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {ad ? 'Edit Ad' : 'Create New Ad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiTrash2 className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'basic', label: 'Basic Info' },
                { id: 'content', label: 'Content' },
                { id: 'targeting', label: 'Targeting' },
                { id: 'advanced', label: 'Advanced' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ad name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {adTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Placement *
                    </label>
                    <select
                      value={formData.placement}
                      onChange={(e) => handleInputChange('placement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select placement</option>
                      {placements.map(placement => (
                        <option key={placement.value} value={placement.value}>
                          {placement.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ad title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ad description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={formData.link_url}
                      onChange={(e) => handleInputChange('link_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google AdSense Integration
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Client ID</label>
                      <input
                        type="text"
                        value={formData.ad_client}
                        onChange={(e) => handleInputChange('ad_client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ad Slot</label>
                      <input
                        type="text"
                        value={formData.ad_slot}
                        onChange={(e) => handleInputChange('ad_slot', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="xxxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom HTML/JavaScript
                  </label>
                  <textarea
                    value={formData.custom_html}
                    onChange={(e) => handleInputChange('custom_html', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter custom HTML or JavaScript code"
                  />
                </div>
              </div>
            )}

            {/* Targeting Tab */}
            {activeTab === 'targeting' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Pages
                  </label>
                  <div className="space-y-2">
                    {formData.target_pages.map((page, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={page}
                          onChange={(e) => handleArrayChange('target_pages', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter page path (e.g., /blog, /home, *)"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('target_pages', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('target_pages')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Page
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use * to target all pages, or specify exact paths like /blog, /home
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Impressions
                  </label>
                  <input
                    type="number"
                    value={formData.max_impressions}
                    onChange={(e) => handleInputChange('max_impressions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Show Label
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.show_label}
                        onChange={(e) => handleInputChange('show_label', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Display ad label</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label Text
                    </label>
                    <input
                      type="text"
                      value={formData.label_text}
                      onChange={(e) => handleInputChange('label_text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Advertisement"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dismissible
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.dismissible}
                      onChange={(e) => handleInputChange('dismissible', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow users to close this ad</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => handleInputChange('background_color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <input
                      type="color"
                      value={formData.border_color}
                      onChange={(e) => handleInputChange('border_color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom CSS
                  </label>
                  <textarea
                    value={formData.custom_css}
                    onChange={(e) => handleInputChange('custom_css', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter custom CSS styles"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : (ad ? 'Update Ad' : 'Create Ad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdManager
