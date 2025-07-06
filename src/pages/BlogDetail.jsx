import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiTag, FiArrowLeft, FiShare2, FiHeart, FiBookmark } from 'react-icons/fi'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import GoogleAds from '../components/GoogleAds'

const BlogDetail = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetchBlogPost()
  }, [slug])

  const fetchBlogPost = async () => {
    try {
      setLoading(true)
      
      // Try with published boolean first
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      // If that fails, try without the published filter
      if (error) {
        console.log('Trying without published filter:', error.message)
        const fallback = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single()
        
        data = fallback.data
        error = fallback.error
      }

      if (error) {
        throw new Error(error.message)
      }

      setPost(data)
      setLikeCount(data.like_count || 0)
      if (data.category && data.id) {
        fetchRelatedPosts(data.category, data.id)
      }
    } catch (err) {
      console.error('Blog post fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (category, postId) => {
    try {
      // Try with published filter first
      let { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, created_at, category')
        .eq('category', category)
        .eq('published', true)
        .neq('id', postId)
        .limit(3)
        .order('created_at', { ascending: false })

      // If that fails, try without published filter
      if (error) {
        console.log('Trying related posts without published filter:', error.message)
        const fallback = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, created_at, category')
          .eq('category', category)
          .neq('id', postId)
          .limit(3)
          .order('created_at', { ascending: false })
        
        data = fallback.data
        error = fallback.error
      }

      if (!error && data) {
        setRelatedPosts(data)
      }
    } catch (err) {
      console.error('Related posts fetch error:', err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLike = async () => {
    try {
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ like_count: newLikeCount })
        .eq('id', post.id)

      if (!error) {
        setIsLiked(!isLiked)
        setLikeCount(newLikeCount)
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // You can add API call here to save bookmark
  }

  const shareUrl = window.location.href
  const shareTitle = post?.title || 'Check out this blog post'

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <Link
              to="/blog"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Article not found</p>
            <Link
              to="/blog"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Featured Image */}
              {post.featured_image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Category Badge */}
                {post.category && (
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                    <FiTag className="inline mr-1 h-3 w-3" />
                    {post.category}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                        isLiked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likeCount}</span>
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-full transition-colors ${
                        isBookmarked 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FiBookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiShare2 className="mr-2 h-5 w-5" />
                    Share this article
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FaFacebook className="mr-2 h-4 w-4" />
                      Facebook
                    </a>
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors"
                    >
                      <FaTwitter className="mr-2 h-4 w-4" />
                      Twitter
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
                    >
                      <FaLinkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <FaWhatsapp className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Google Ads Section */}
            <GoogleAds 
              adSize="medium-rectangle"
              className="mb-8"
              label="Advertisement"
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors mb-2">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(relatedPost.published_at || relatedPost.created_at)}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {relatedPost.excerpt ? relatedPost.excerpt.substring(0, 100) + '...' : 'No excerpt available'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Services Ad */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-200">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Study Abroad Services</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get personalized guidance from our expert counselors. From university selection to visa processing - we've got you covered!
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1-on-1 Expert Consultation
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete Application Support
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Visa Processing Assistance
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/consultation"
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Book Free Consultation
                  </Link>
                  <Link
                    to="/services"
                    className="block w-full bg-white text-blue-600 py-2 px-4 rounded-md font-medium hover:bg-blue-50 transition-colors border border-blue-200"
                  >
                    View All Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
