import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiStar, FiEye, FiEyeOff, FiExternalLink, FiMapPin, FiUsers, FiSearch, FiFilter, FiRefreshCw, FiDownload, FiBookOpen, FiTrendingUp, FiCalendar, FiUser, FiTag, FiFileText, FiImage } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const BlogManager = ({ onLogout, user }) => {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selected, setSelected] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const dataPromise = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise])
      
      if (error) throw error
      setBlogPosts(data || [])
      console.log('Blog posts loaded successfully:', data?.length)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      // Show error but don't alert, just log
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const dataPromise = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise])
      
      if (error) throw error
      setBlogPosts(data || [])
      console.log('Data refreshed successfully:', data?.length)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update state locally without page refresh
      setBlogPosts(prev => prev.filter(post => post.id !== id))
      setSelected(prev => prev.filter(selectedId => selectedId !== id))
      
      alert('Blog post deleted successfully!')
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Error deleting blog post')
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ featured: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      // Update state locally without page refresh
      setBlogPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, featured: !currentStatus }
          : post
      ))
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Error updating featured status')
    }
  }

  const togglePublished = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      // Update state locally without page refresh
      setBlogPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, published: !currentStatus }
          : post
      ))
    } catch (error) {
      console.error('Error updating published status:', error)
      alert('Error updating published status')
    }
  }

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([])
      setSelectAll(false)
    } else {
      setSelected(blogPosts.map((p) => p.id))
      setSelectAll(true)
    }
  }

  const handleBulkDelete = async () => {
    if (selected.length === 0) return
    if (!window.confirm('Are you sure you want to delete the selected blog posts?')) return
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', selected)
      if (error) throw error
      
      // Update state locally without page refresh
      setBlogPosts(prev => prev.filter(post => !selected.includes(post.id)))
      setSelected([])
      setSelectAll(false)
      
      alert('Selected blog posts deleted successfully!')
    } catch (error) {
      console.error('Error deleting blog posts:', error)
      alert('Error deleting blog posts')
    }
  }

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  // Get unique categories for filter
  const categories = [...new Set(blogPosts.map(post => post.category).filter(Boolean))]

  // Filter blog posts based on search and status
  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published) ||
      (statusFilter === 'featured' && post.featured)

    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
        {/* Modern Header - Similar to University Management */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-purple-300 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-pink-300 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              {/* Left Content */}
              <div className="flex-1 mb-8 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <FiBookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      Blog Management
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-200 text-sm font-medium">Content Publishing Hub</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-purple-100 text-base md:text-lg font-medium mb-6 max-w-2xl">
                  Create, manage, and publish engaging blog content with advanced SEO optimization
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiBookOpen className="w-4 h-4 mr-2 text-purple-300" />
                    <span className="text-white font-semibold">{blogPosts.length}</span>
                    <span className="text-purple-200 ml-1">Total Posts</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{blogPosts.filter(p => p.published).length}</span>
                    <span className="text-purple-200 ml-1">Published</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiStar className="w-3 h-3 mr-2 text-yellow-400" />
                    <span className="text-white font-semibold">{blogPosts.filter(p => p.featured).length}</span>
                    <span className="text-purple-200 ml-1">Featured</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{blogPosts.filter(p => !p.published).length}</span>
                    <span className="text-purple-200 ml-1">Drafts</span>
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
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiRefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{refreshing ? 'Refreshing...' : 'Refresh Data'}</div>
                    <div className="text-purple-200 text-xs">Update list</div>
                  </div>
                </button>
                
                <Link
                  to="/admin/blog/new"
                  className="group flex items-center justify-center px-6 py-3 bg-gradient-to-br from-white to-purple-50 text-purple-900 rounded-xl hover:from-purple-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiPlus className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">New Blog Post</div>
                    <div className="text-purple-600 text-xs">Create article</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards with Refresh Indicator */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-300 ${refreshing ? 'opacity-50 animate-pulse' : ''}`}>
          {[
            { 
              label: 'Total Blog Posts', 
              value: blogPosts.length, 
              gradient: 'from-purple-600 to-indigo-500',
              bgGradient: 'from-purple-50/80 to-indigo-50/80',
              icon: FiBookOpen,
              shadowColor: 'shadow-purple-200/50'
            },
            { 
              label: 'Published Posts', 
              value: blogPosts.filter(p => p.published).length, 
              gradient: 'from-green-500 to-emerald-500',
              bgGradient: 'from-green-50/80 to-emerald-50/80',
              icon: FiEye,
              shadowColor: 'shadow-green-200/50'
            },
            { 
              label: 'Featured Posts', 
              value: blogPosts.filter(p => p.featured).length, 
              gradient: 'from-yellow-500 to-orange-500',
              bgGradient: 'from-yellow-50/80 to-orange-50/80',
              icon: FiStar,
              shadowColor: 'shadow-yellow-200/50'
            },
            { 
              label: 'Categories', 
              value: categories.length, 
              gradient: 'from-blue-500 to-purple-500',
              bgGradient: 'from-blue-50/80 to-purple-50/80',
              icon: FiTag,
              shadowColor: 'shadow-blue-200/50'
            }
          ].map((stat, index) => (
            <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md border border-white/30 rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 ${stat.shadowColor} group`}>
              {/* Refresh indicator overlay */}
              {refreshing && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
                  <FiRefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
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

        {/* Enhanced Filters Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Blog Posts</label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, author, category, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="all">All Posts</option>
                  <option value="published">🟢 Published Only</option>
                  <option value="draft">🔴 Drafts Only</option>
                  <option value="featured">⭐ Featured Only</option>
                </select>
              </div>
            </div>
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <div className="relative">
                <FiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="lg:w-auto flex items-end">
              <button
                onClick={handleBulkDelete}
                disabled={selected.length === 0}
                className={`flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                <span>Delete ({selected.length})</span>
              </button>
            </div>
          </div>
          
          {/* Results count and Select All */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredBlogPosts.length}</span> of <span className="font-semibold text-gray-900">{blogPosts.length}</span> blog posts
            </p>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-2 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                id="selectAllCheckbox"
              />
              <label htmlFor="selectAllCheckbox" className="text-sm font-medium text-gray-700">Select All Visible</label>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid - Using Filtered Data with Refresh Indicator */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${refreshing ? 'opacity-60' : ''}`}>
          {/* Refresh overlay for cards */}
          {refreshing && (
            <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <FiRefreshCw className="w-5 h-5 text-purple-600 animate-spin" />
                  <span className="text-purple-700 font-medium">Refreshing blog posts...</span>
                </div>
              </div>
            </div>
          )}
          {filteredBlogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative h-full flex flex-col">
                <input
                  type="checkbox"
                  checked={selected.includes(post.id)}
                  onChange={() => handleSelect(post.id)}
                  className="absolute top-3 left-3 z-10 w-5 h-5"
                  style={{ accentColor: '#8b5cf6' }}
                />
                
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 text-sm"><div class="text-center"><FiImage class="w-12 h-12 text-gray-300 mx-auto mb-2" /><p>No image</p></div></div>'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      <div className="text-center">
                        <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {post.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                        <FiStar className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${post.published ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Category */}
                  {post.category && (
                    <div className="flex items-center text-sm text-purple-600 mb-2">
                      <FiTag className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="font-medium">{post.category}</span>
                    </div>
                  )}

                  {/* Post Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Author and Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FiUser className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="mr-4">{post.author || 'Unknown'}</span>
                    <FiCalendar className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Flexible Spacer */}
                  <div className="flex-grow"></div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFeatured(post.id, post.featured)}
                        className={`p-2 rounded-full transition-colors ${post.featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                        title={post.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <FiStar className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => togglePublished(post.id, post.published)}
                        className={`p-2 rounded-full transition-colors ${post.published ? 'text-green-500 bg-green-50' : 'text-orange-500 bg-orange-50'}`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="text-gray-500 hover:text-purple-600 p-2 rounded-full transition-colors bg-gray-50 hover:bg-purple-50"
                        title="Edit Blog Post"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors bg-gray-50 hover:bg-red-50"
                        title="Delete Blog Post"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* Empty States */}
        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <FiBookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-4">Start by creating your first blog post.</p>
            <Link
              to="/admin/blog/new"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create Blog Post
            </Link>
          </div>
        )}
        
        {blogPosts.length > 0 && filteredBlogPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default BlogManager
