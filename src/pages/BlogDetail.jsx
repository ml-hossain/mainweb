import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiTag, FiArrowLeft, FiShare2, FiHeart, FiBookmark } from 'react-icons/fi'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { supabase } from '../lib/supabase'

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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        throw new Error(error.message)
      }

      setPost(data)
      setLikeCount(data.like_count || 0)
      fetchRelatedPosts(data.category, data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (category, postId) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, published_at, category')
        .eq('category', category)
        .eq('status', 'published')
        .neq('id', postId)
        .limit(3)
        .order('published_at', { ascending: false })

      if (!error && data) {
        setRelatedPosts(data)
      }
    } catch (err) {
      console.error('Error fetching related posts:', err)
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
                      <span>{formatDate(post.published_at)}</span>
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
            {/* Ad Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 mb-8 border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Guidance?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get personalized advice for your study abroad journey. Our expert consultants are here to help!
              </p>
              <Link
                to="/consultation"
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-3 px-4 rounded-md font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
              >
                Book Free Consultation
              </Link>
            </div>

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
                        {formatDate(relatedPost.published_at)}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {relatedPost.excerpt ? relatedPost.excerpt.substring(0, 100) + '...' : 'No excerpt available'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Subscribe to our newsletter for the latest study abroad tips and updates.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
