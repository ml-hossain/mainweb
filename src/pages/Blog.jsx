import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiArrowRight, FiSearch, FiTag, FiTrendingUp, FiClock, FiEye, FiBookmark } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { gsap } from 'gsap'
import GoogleAds from '../components/GoogleAds'

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const heroRef = useRef(null)
  const cardsRef = useRef(null)
  const sidebarRef = useRef(null)

  useEffect(() => {
    fetchBlogPosts()
    fetchFeaturedPosts()
  }, [])

  // Animation effect
  useEffect(() => {
    if (!loading && blogPosts.length > 0) {
      const tl = gsap.timeline()
      
      tl.fromTo(heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(cardsRef.current?.children || [],
        { opacity: 0, y: 50, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)" 
        },
        "-=0.4"
      )
      .fromTo(sidebarRef.current?.children || [],
        { opacity: 0, x: 30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power3.out" 
        },
        "-=0.3"
      )
    }
  }, [loading, blogPosts])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      
      // Try with published filter first
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      // If published column doesn't work, get all posts
      if (error) {
        console.log('Published column issue, getting all posts:', error.message)
        const fallback = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
        
        data = fallback.data
        error = fallback.error
      }
      
      if (error) {
        throw new Error(error.message)
      }
      
      setBlogPosts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      // First try to get featured posts, if that fails, get latest posts
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)
      
      // If featured column doesn't exist, fallback to just getting latest published posts
      if (error && (error.message.includes('featured') || error.message.includes('does not exist'))) {
        console.log('Featured column not found, falling back to latest posts')
        const fallback = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3)
        
        data = fallback.data
        error = fallback.error
      }

      // If published column also doesn't work, just get all posts
      if (error) {
        console.log('Published column issue, getting all posts')
        const fallback = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)
        
        data = fallback.data
        error = fallback.error
      }
      
      if (error) {
        throw new Error(error.message)
      }
      
      setFeaturedPosts(data || [])
    } catch (err) {
      console.error('Error fetching featured posts:', err)
      // Don't crash the app, just show no featured posts
      setFeaturedPosts([])
    }
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(blogPosts.map(post => post.category))]

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Recently'
    }
  }

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ')
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'
    }
    return text
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500/30 border-t-emerald-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 bg-emerald-500/10 animate-pulse mx-auto"></div>
            </div>
            <p className="mt-6 text-lg text-gray-300 font-medium">Loading amazing content...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-300 mb-8">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-blue-900/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-emerald-300 rounded-full text-sm font-medium mb-8 border border-white/20">
            <FiTrendingUp className="w-4 h-4 mr-2" />
            Latest Insights & Success Stories
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Study Abroad 
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Discover insights, tips, and inspiring stories from students who've successfully 
            navigated their journey to international education.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{blogPosts.length}+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400">{categories.length}+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">50k+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Readers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Search and Filter */}
            <div className="mb-12 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                  <FiSearch className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search articles, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 text-white placeholder-gray-400 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                <div className="relative group">
                  <FiTag className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-48 pl-12 pr-8 py-3.5 text-white bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-800 text-white">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={`category-${index}-${category}`} value={category} className="bg-gray-800 text-white">{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid - 3 columns on large screens */}
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] border border-white/20 hover:border-white/40 flex flex-col h-full">
                  {/* Featured Image */}
                  <div className="aspect-video overflow-hidden relative flex-shrink-0">
                    <img
                      src={post.featured_image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Category Badge and Reading Time */}
                    <div className="flex items-center justify-between mb-3 flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                        <FiTag className="w-3 h-3 mr-1" />
                        {post.category || 'Study Abroad'}
                      </span>
                      <div className="flex items-center text-xs text-gray-400">
                        <FiClock className="w-3 h-3 mr-1" />
                        {post.reading_time || 5} min read
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-lg font-bold text-white mb-3 hover:text-emerald-300 transition-colors leading-tight group-hover:text-emerald-300 flex-shrink-0 min-h-[4.5rem] overflow-visible">
                      <Link to={`/blog/${post.slug}`} className="block line-clamp-3">
                        {post.title}
                      </Link>
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-gray-300 mb-4 leading-relaxed line-clamp-2 flex-grow text-sm min-h-[3rem]">
                      {truncateText(post.excerpt, 20)}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4 flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <FiUser className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-20">{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiEye className="w-3 h-3" />
                        <FiBookmark className="w-3 h-3 hover:text-emerald-400 cursor-pointer transition-colors" />
                      </div>
                    </div>
                    
                    {/* Read More Button */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group/btn text-sm flex-shrink-0 mt-auto"
                    >
                      Read Full Article
                      <FiArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Articles Found</h3>
                <p className="text-gray-400 text-lg mb-8">Try adjusting your search terms or browse all categories.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div ref={sidebarRef} className="xl:col-span-1 space-y-8">
            {/* CTA Section */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Free Consultation</h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Get personalized guidance from our education experts. Start your journey today!
                </p>
                <Link
                  to="/consultation"
                  className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Book Now - Free
                </Link>
              </div>
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <FiTrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-bold text-white">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {featuredPosts.map((post, index) => (
                    <div key={post.id} className="group">
                      <Link to={`/blog/${post.slug}`} className="flex space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                        {post.featured_image && (
                          <div className="relative">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors leading-tight mb-2">
                            {truncateText(post.title, 10)}
                          </h4>
                          <div className="flex items-center text-xs text-gray-400">
                            <FiCalendar className="w-3 h-3 mr-1" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <FiTag className="w-5 h-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-bold text-white">Explore Topics</h3>
                </div>
                <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={`category-btn-${index}-${category}`}
                    onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-300 border border-emerald-500/50'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          selectedCategory === category ? 'bg-emerald-400' : 'bg-gray-600 group-hover:bg-gray-400'
                        }`}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Google Ads - Skyscraper */}
            <GoogleAds 
              adSize="wide-skyscraper"
              label="Sponsored"
              className="sticky top-8"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
