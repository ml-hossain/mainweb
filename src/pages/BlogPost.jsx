import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiArrowLeft, FiClock, FiTag, FiEye, FiShare2, FiBookmark } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogPost()
    incrementViewCount()
  }, [slug])

  const fetchBlogPost = async () => {
    try {
      setLoading(true)
      
      // Fetch the blog post by slug
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          setError('Blog post not found')
        } else {
          throw new Error(error.message)
        }
        return
      }
      
      setPost(data)
      
      // Fetch related posts from the same category
      if (data.category) {
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, published_at, author, category')
          .eq('published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3)
        
        setRelatedPosts(related || [])
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async () => {
    try {
      // Increment view count (this will fail gracefully if view_count column doesn't exist)
      await supabase
        .from('blog_posts')
        .update({ view_count: supabase.raw('view_count + 1') })
        .eq('slug', slug)
    } catch (err) {
      // Silently fail if view_count column doesn't exist
      console.log('View count update skipped (column may not exist)')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-700 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">!</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Post Not Found</h2>
          <p className="text-gray-300 mb-8">{error}</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
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

          <div className="p-8 md:p-12">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  <FiTag className="w-3 h-3 mr-1" />
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
              <div className="flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                <span>{post.author || 'MA Education Team'}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              {post.reading_time && (
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
              {post.view_count && (
                <div className="flex items-center">
                  <FiEye className="w-4 h-4 mr-2" />
                  <span>{post.view_count} views</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={sharePost}
                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
              >
                <FiShare2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20">
                <FiBookmark className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/20">
                <h3 className="text-white font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <div className="mb-3">
                    <span className="text-xs font-medium text-emerald-400">
                      {relatedPost.category}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-3 group-hover:text-emerald-300 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {formatDate(relatedPost.published_at)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 mb-6">
            Get personalized guidance from our education experts and take the first step towards your dream education abroad.
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
