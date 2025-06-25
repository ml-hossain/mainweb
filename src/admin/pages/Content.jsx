import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiSettings, FiFileText, FiEye, FiEyeOff } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Content = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('content')
  const [contentSections, setContentSections] = useState([])
  const [siteSettings, setSiteSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [modalType, setModalType] = useState('content') // 'content' or 'setting'

  const [contentForm, setContentForm] = useState({
    page_name: '',
    section_name: '',
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    button_text: '',
    button_link: '',
    display_order: 0,
    is_active: true
  })

  const [settingForm, setSettingForm] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'text',
    description: '',
    is_active: true
  })

  const pages = ['home', 'about', 'services', 'contact', 'success-stories']
  const settingTypes = ['text', 'number', 'boolean', 'json']

  useEffect(() => {
    if (activeTab === 'content') {
      fetchContentSections()
    } else {
      fetchSiteSettings()
    }
  }, [activeTab])

  const fetchContentSections = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('page_name', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) throw error
      setContentSections(data || [])
    } catch (error) {
      console.error('Error fetching content sections:', error)
      alert('Error loading content sections')
    } finally {
      setLoading(false)
    }
  }

  const fetchSiteSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key', { ascending: true })

      if (error) throw error
      setSiteSettings(data || [])
    } catch (error) {
      console.error('Error fetching site settings:', error)
      alert('Error loading site settings')
    } finally {
      setLoading(false)
    }
  }

  const handleContentSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('content_sections')
          .update(contentForm)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('content_sections')
          .insert([contentForm])

        if (error) throw error
      }

      setShowModal(false)
      setEditingItem(null)
      resetContentForm()
      fetchContentSections()
      alert(editingItem ? 'Content updated successfully!' : 'Content added successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content')
    }
  }

  const handleSettingSubmit = async (e) => {
    e.preventDefault()
    try {
      // Parse setting value based on type
      let parsedValue = settingForm.setting_value
      if (settingForm.setting_type === 'number') {
        parsedValue = parseFloat(settingForm.setting_value)
      } else if (settingForm.setting_type === 'boolean') {
        parsedValue = settingForm.setting_value === 'true'
      } else if (settingForm.setting_type === 'json') {
        try {
          parsedValue = JSON.parse(settingForm.setting_value)
        } catch {
          alert('Invalid JSON format')
          return
        }
      }

      const settingData = {
        ...settingForm,
        setting_value: JSON.stringify(parsedValue)
      }

      if (editingItem) {
        const { error } = await supabase
          .from('site_settings')
          .update(settingData)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([settingData])

        if (error) throw error
      }

      setShowModal(false)
      setEditingItem(null)
      resetSettingForm()
      fetchSiteSettings()
      alert(editingItem ? 'Setting updated successfully!' : 'Setting added successfully!')
    } catch (error) {
      console.error('Error saving setting:', error)
      alert('Error saving setting')
    }
  }

  const handleEditContent = (content) => {
    setEditingItem(content)
    setContentForm({
      page_name: content.page_name || '',
      section_name: content.section_name || '',
      title: content.title || '',
      subtitle: content.subtitle || '',
      content: content.content || '',
      image_url: content.image_url || '',
      button_text: content.button_text || '',
      button_link: content.button_link || '',
      display_order: content.display_order || 0,
      is_active: content.is_active || true
    })
    setModalType('content')
    setShowModal(true)
  }

  const handleEditSetting = (setting) => {
    setEditingItem(setting)
    let displayValue = setting.setting_value
    try {
      const parsed = JSON.parse(setting.setting_value)
      if (setting.setting_type === 'json') {
        displayValue = JSON.stringify(parsed, null, 2)
      } else {
        displayValue = parsed.toString()
      }
    } catch {
      displayValue = setting.setting_value
    }

    setSettingForm({
      setting_key: setting.setting_key || '',
      setting_value: displayValue,
      setting_type: setting.setting_type || 'text',
      description: setting.description || '',
      is_active: setting.is_active || true
    })
    setModalType('setting')
    setShowModal(true)
  }

  const handleDeleteContent = async (id) => {
    if (!confirm('Are you sure you want to delete this content section?')) return

    try {
      const { error } = await supabase
        .from('content_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchContentSections()
      alert('Content deleted successfully!')
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Error deleting content')
    }
  }

  const handleDeleteSetting = async (id) => {
    if (!confirm('Are you sure you want to delete this setting?')) return

    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSiteSettings()
      alert('Setting deleted successfully!')
    } catch (error) {
      console.error('Error deleting setting:', error)
      alert('Error deleting setting')
    }
  }

  const toggleContentActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchContentSections()
    } catch (error) {
      console.error('Error updating active status:', error)
      alert('Error updating active status')
    }
  }

  const toggleSettingActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchSiteSettings()
    } catch (error) {
      console.error('Error updating active status:', error)
      alert('Error updating active status')
    }
  }

  const resetContentForm = () => {
    setContentForm({
      page_name: '',
      section_name: '',
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      button_text: '',
      button_link: '',
      display_order: 0,
      is_active: true
    })
  }

  const resetSettingForm = () => {
    setSettingForm({
      setting_key: '',
      setting_value: '',
      setting_type: 'text',
      description: '',
      is_active: true
    })
  }

  const handleContentInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setContentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSettingInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettingForm(prev => ({
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
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Manage website content and settings</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null)
              if (activeTab === 'content') {
                resetContentForm()
                setModalType('content')
              } else {
                resetSettingForm()
                setModalType('setting')
              }
              setShowModal(true)
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add {activeTab === 'content' ? 'Content' : 'Setting'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiFileText className="w-4 h-4 inline mr-2" />
              Content Sections
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiSettings className="w-4 h-4 inline mr-2" />
              Site Settings
            </button>
          </nav>
        </div>

        {/* Content Sections Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {pages.map((page) => {
              const pageSections = contentSections.filter(section => section.page_name === page)
              if (pageSections.length === 0) return null

              return (
                <div key={page} className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{page} Page</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {pageSections.map((section) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{section.section_name}</h4>
                              <span className={`text-xs px-2 py-1 rounded ${section.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {section.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            {section.title && (
                              <p className="text-sm font-medium text-gray-700 mb-1">{section.title}</p>
                            )}
                            {section.subtitle && (
                              <p className="text-sm text-gray-600 mb-2">{section.subtitle}</p>
                            )}
                            {section.content && (
                              <p className="text-sm text-gray-500 line-clamp-2">{section.content}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => toggleContentActive(section.id, section.is_active)}
                              className={`p-1 rounded ${section.is_active ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                              title="Toggle Active"
                            >
                              {section.is_active ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleEditContent(section)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteContent(section.id)}
                              className="p-1 text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {contentSections.length === 0 && (
              <div className="text-center py-12">
                <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first content section.</p>
              </div>
            )}
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                {siteSettings.map((setting) => (
                  <div key={setting.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{setting.setting_key}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {setting.setting_type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${setting.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {setting.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {setting.description && (
                          <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                        )}
                        <div className="text-sm text-gray-500 font-mono bg-gray-50 p-2 rounded">
                          {setting.setting_value}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleSettingActive(setting.id, setting.is_active)}
                          className={`p-1 rounded ${setting.is_active ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                          title="Toggle Active"
                        >
                          {setting.is_active ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEditSetting(setting)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSetting(setting.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {siteSettings.length === 0 && (
                  <div className="text-center py-12">
                    <FiSettings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No settings yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first site setting.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingItem ? 'Edit' : 'Add'} {modalType === 'content' ? 'Content Section' : 'Site Setting'}
                </h2>

                {/* Content Form */}
                {modalType === 'content' && (
                  <form onSubmit={handleContentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Page *
                        </label>
                        <select
                          name="page_name"
                          value={contentForm.page_name}
                          onChange={handleContentInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Page</option>
                          {pages.map(page => (
                            <option key={page} value={page}>{page}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Name *
                        </label>
                        <input
                          type="text"
                          name="section_name"
                          value={contentForm.section_name}
                          onChange={handleContentInputChange}
                          required
                          placeholder="e.g., hero, features, testimonials"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={contentForm.title}
                        onChange={handleContentInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={contentForm.subtitle}
                        onChange={handleContentInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        name="content"
                        value={contentForm.content}
                        onChange={handleContentInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="image_url"
                          value={contentForm.image_url}
                          onChange={handleContentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          name="display_order"
                          value={contentForm.display_order}
                          onChange={handleContentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          name="button_text"
                          value={contentForm.button_text}
                          onChange={handleContentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Button Link
                        </label>
                        <input
                          type="text"
                          name="button_link"
                          value={contentForm.button_link}
                          onChange={handleContentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={contentForm.is_active}
                          onChange={handleContentInputChange}
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
                          setEditingItem(null)
                          resetContentForm()
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingItem ? 'Update' : 'Add'} Content
                      </button>
                    </div>
                  </form>
                )}

                {/* Setting Form */}
                {modalType === 'setting' && (
                  <form onSubmit={handleSettingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Setting Key *
                        </label>
                        <input
                          type="text"
                          name="setting_key"
                          value={settingForm.setting_key}
                          onChange={handleSettingInputChange}
                          required
                          placeholder="e.g., site_title, contact_email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <select
                          name="setting_type"
                          value={settingForm.setting_type}
                          onChange={handleSettingInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {settingTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Setting Value *
                      </label>
                      {settingForm.setting_type === 'json' ? (
                        <textarea
                          name="setting_value"
                          value={settingForm.setting_value}
                          onChange={handleSettingInputChange}
                          required
                          rows="4"
                          placeholder='{"key": "value"}'
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      ) : settingForm.setting_type === 'boolean' ? (
                        <select
                          name="setting_value"
                          value={settingForm.setting_value}
                          onChange={handleSettingInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <input
                          type={settingForm.setting_type === 'number' ? 'number' : 'text'}
                          name="setting_value"
                          value={settingForm.setting_value}
                          onChange={handleSettingInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={settingForm.description}
                        onChange={handleSettingInputChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={settingForm.is_active}
                          onChange={handleSettingInputChange}
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
                          setEditingItem(null)
                          resetSettingForm()
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingItem ? 'Update' : 'Add'} Setting
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Content
