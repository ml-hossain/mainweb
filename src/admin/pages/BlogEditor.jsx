import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import QuillEditor from '../../components/QuillEditor';
import ErrorBoundary from '../../components/ErrorBoundary';
import CompactFileUpload from '../../components/CompactFileUpload';
import AdminLayout from '../components/AdminLayout';
import AdvancedSEOTool from '../../components/AdvancedSEOTool';
import { FiLoader, FiSave, FiArrowLeft, FiGlobe, FiMapPin, FiStar, FiDollarSign, FiClock, FiBookOpen, FiX, FiPlus, FiUpload, FiTag, FiUser, FiCalendar, FiFileText, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import slugify from 'slugify';

const BlogEditor = ({ onLogout, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // State for tag inputs
  const [tagsInput, setTagsInput] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');

  const generateSlug = (title) => {
    return slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'\"!:@]/g
    });
  };

  const fetchBlogPost = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Failed to fetch blog post data.');
      }
      setBlogPost(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    } else {
      setBlogPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author: user?.email || '',
        category: '',
        tags: [],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        featured: false,
        published: false,
        published_at: null,
        reading_time: 0,
        view_count: 0
      });
      setLoading(false);
    }
  }, [id, fetchBlogPost, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setBlogPost(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Auto-generate slug when title changes
      if (name === 'title') {
        updated.slug = generateSlug(value);
        // Auto-generate meta title if empty
        if (!prev.meta_title) {
          updated.meta_title = value;
        }
      }
      
      // Auto-generate meta description from excerpt
      if (name === 'excerpt' && !prev.meta_description) {
        updated.meta_description = value.substring(0, 160);
      }
      
      return updated;
    });
  };

  // Enhanced tag input handler
  const handleTagInput = (field, inputValue, setInputValue) => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      const currentArray = blogPost?.[field] || [];
      if (!currentArray.includes(trimmedValue)) {
        setBlogPost(prev => ({
          ...prev,
          [field]: [...currentArray, trimmedValue]
        }));
      }
      setInputValue('');
    }
  };

  const removeTag = (field, index) => {
    const currentArray = blogPost?.[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setBlogPost(prev => ({ ...prev, [field]: newArray }));
  };

  const handleKeyPress = (e, field, inputValue, setInputValue) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      handleTagInput(field, inputValue, setInputValue);
    }
  };

  const handleContentChange = (value) => {
    setBlogPost(prev => {
      const updated = { ...prev, content: value };
      
      // Calculate reading time (average 200 words per minute)
      const wordCount = value.replace(/<[^>]*>/g, '').split(/\s+/).length;
      updated.reading_time = Math.ceil(wordCount / 200);
      
      return updated;
    });
  };

  const handleFileContentParsed = (htmlContent) => {
    setBlogPost(prev => ({ ...prev, content: htmlContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blogPost.title) {
      setError('Blog post title is required.');
      return;
    }

    setSaving(true);
    setError('');

    const slug = generateSlug(blogPost.title);

    // Prepare the data
    const blogPostData = {
      title: blogPost.title,
      slug: slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featured_image: blogPost.featured_image,
      author: blogPost.author,
      category: blogPost.category,
      tags: blogPost.tags || [],
      meta_title: blogPost.meta_title || blogPost.title,
      meta_description: blogPost.meta_description || blogPost.excerpt?.substring(0, 160),
      meta_keywords: blogPost.meta_keywords,
      featured: blogPost.featured || false,
      published: blogPost.published || false,
      published_at: blogPost.published ? (blogPost.published_at || new Date().toISOString()) : null,
      reading_time: blogPost.reading_time || 0,
      view_count: blogPost.view_count || 0
    };

    try {
      let response;
      if (!id) {
        // Create new blog post
        const { data: insertedData, error: insertError } = await supabase
          .from('blog_posts')
          .insert([blogPostData])
          .select()
          .single();
        if (insertError) throw insertError;
        response = { data: insertedData, error: insertError };
      } else {
        // Update existing blog post
        const { data: updatedData, error: updateError } = await supabase
          .from('blog_posts')
          .update(blogPostData)
          .eq('id', id)
          .select()
          .single();
        if (updateError) throw updateError;
        response = { data: updatedData, error: updateError };
      }
      
      const { error } = response;

      if (error) {
        throw error;
      }
      
      setSaving(false);
      navigate('/admin/blog');

    } catch (err) {
      setError('Failed to save blog post. Please try again.');
      console.error('Save error:', err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-purple-600 text-4xl" />
        </div>
      </AdminLayout>
    );
  }

  if (error && !blogPost) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="text-red-500">Error: {error}</div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="flex flex-col xl:flex-row gap-6 min-h-full">
        {/* Main content - Reduced width to accommodate wider sidebar */}
        <div className="flex-1 min-w-0 xl:max-w-5xl">
          <div className="max-w-none mx-auto">
            {/* Redesigned Header Section - More Compact */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Side - Back Button and Title */}
                <div className="flex flex-col">
                  <button
                    onClick={() => navigate('/admin/blog')}
                    className="flex items-center text-purple-100 hover:text-white text-sm font-medium mb-3 transition-colors duration-200 self-start group"
                  >
                    <FiArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog Management
                  </button>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                    {!id ? 'Create New Blog Post' : 'Edit Blog Post'}
                  </h1>
                  <p className="text-purple-100 text-base font-medium">
                    {!id ? 'Create engaging content with SEO optimization' : 'Update your blog post content and settings'}
                  </p>
                </div>
                
                {/* Right Side - Status Badge */}
                <div className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 self-start lg:self-center">
                  <FiBookOpen className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Content Creator</span>
                </div>
              </div>
            </div>
            
            {/* Main Content - Closer to sidebar with equal weight sections */}
            <div className="max-w-none mx-auto">
              {/* Form Container */}
              <div>
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <form onSubmit={handleSubmit}>
                      {/* Two-Column Layout for Equal Weight Sections */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        
                        {/* Basic Information Section - Left Column */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                              <FiFileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                              <p className="text-gray-600">Essential blog post details and metadata</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-1">
                              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Blog Post Title *</label>
                              <div className="relative">
                                <FiFileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                  type="text" 
                                  name="title" 
                                  id="title" 
                                  value={blogPost?.title || ''} 
                                  onChange={handleInputChange} 
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                  placeholder="Enter your blog post title"
                                  required 
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <label htmlFor="slug" className="block text-sm font-semibold text-gray-700">URL Slug</label>
                              <div className="relative">
                                <FiGlobe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                  type="text" 
                                  name="slug" 
                                  id="slug" 
                                  value={blogPost?.slug || ''} 
                                  onChange={handleInputChange} 
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                  placeholder="auto-generated-from-title"
                                />
                              </div>
                              <p className="text-xs text-gray-500">Auto-generated from title, but you can customize it</p>
                            </div>
                            
                            <div className="space-y-1">
                              <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700">Excerpt/Summary</label>
                              <textarea 
                                name="excerpt" 
                                id="excerpt" 
                                value={blogPost?.excerpt || ''} 
                                onChange={handleInputChange} 
                                rows="3" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                                placeholder="Brief summary of your blog post"
                              ></textarea>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <label htmlFor="author" className="block text-sm font-semibold text-gray-700">Author</label>
                                <div className="relative">
                                  <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <input 
                                    type="text" 
                                    name="author" 
                                    id="author" 
                                    value={blogPost?.author || ''} 
                                    onChange={handleInputChange} 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                    placeholder="Author name"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
                                <div className="relative">
                                  <FiTag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <input 
                                    type="text" 
                                    name="category" 
                                    id="category" 
                                    value={blogPost?.category || ''} 
                                    onChange={handleInputChange} 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                    placeholder="e.g., Study Tips, University Reviews"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="featured_image" className="block text-sm font-semibold text-gray-700">Featured Image URL</label>
                              <div className="relative">
                                <FiImage className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                  type="url" 
                                  name="featured_image" 
                                  id="featured_image" 
                                  value={blogPost?.featured_image || ''} 
                                  onChange={handleInputChange} 
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                  placeholder="https://example.com/featured-image.jpg"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Publishing Settings Section - Right Column */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-indigo-100">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                              <FiStar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">Publishing Settings</h2>
                              <p className="text-gray-600">Control visibility and organization</p>
                            </div>
                          </div>
                        
                          <div className="space-y-6">
                            {/* Publishing Status */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
                              <div className="flex items-center">
                                <FiEye className="w-5 h-5 text-gray-600 mr-3" />
                                <div>
                                  <h3 className="font-semibold text-gray-900">Published Status</h3>
                                  <p className="text-sm text-gray-600">Make this post visible to readers</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  name="published"
                                  checked={blogPost?.published || false}
                                  onChange={handleInputChange}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>

                            {/* Featured Status */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
                              <div className="flex items-center">
                                <FiStar className="w-5 h-5 text-gray-600 mr-3" />
                                <div>
                                  <h3 className="font-semibold text-gray-900">Featured Post</h3>
                                  <p className="text-sm text-gray-600">Highlight this post on homepage</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  name="featured"
                                  checked={blogPost?.featured || false}
                                  onChange={handleInputChange}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                              </label>
                            </div>

                            {/* Tags Section */}
                            <div className="space-y-1">
                              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700">Tags</label>
                              
                              {/* Display current tags */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {(blogPost?.tags || []).map((tag, index) => (
                                  <div key={index} className="flex items-center bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full border border-purple-200">
                                    <span>{tag}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeTag('tags', index)}
                                      className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Input for new tags */}
                              <div className="flex">
                                <input
                                  type="text"
                                  value={tagsInput}
                                  onChange={(e) => setTagsInput(e.target.value)}
                                  onKeyPress={(e) => handleKeyPress(e, 'tags', tagsInput, setTagsInput)}
                                  placeholder="Type a tag and press Enter, Space, or Comma to add"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleTagInput('tags', tagsInput, setTagsInput)}
                                  className="px-4 py-3 bg-purple-600 text-white rounded-r-2xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                >
                                  <FiPlus className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Type and press Enter, Space, or Comma to add tags</p>
                            </div>

                            {/* SEO Meta Fields */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">SEO Meta Data</h3>
                              
                              <div className="space-y-1">
                                <label htmlFor="meta_title" className="block text-sm font-semibold text-gray-700">Meta Title</label>
                                <input 
                                  type="text" 
                                  name="meta_title" 
                                  id="meta_title" 
                                  value={blogPost?.meta_title || ''} 
                                  onChange={handleInputChange} 
                                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                  placeholder="SEO title for search engines"
                                  maxLength="60"
                                />
                                <p className="text-xs text-gray-500">{(blogPost?.meta_title || '').length}/60 characters</p>
                              </div>
                              
                              <div className="space-y-1">
                                <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700">Meta Description</label>
                                <textarea 
                                  name="meta_description" 
                                  id="meta_description" 
                                  value={blogPost?.meta_description || ''} 
                                  onChange={handleInputChange} 
                                  rows="2" 
                                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                                  placeholder="Brief description for search results"
                                  maxLength="160"
                                ></textarea>
                                <p className="text-xs text-gray-500">{(blogPost?.meta_description || '').length}/160 characters</p>
                              </div>
                              
                              <div className="space-y-1">
                                <label htmlFor="meta_keywords" className="block text-sm font-semibold text-gray-700">Meta Keywords</label>
                                <input 
                                  type="text" 
                                  name="meta_keywords" 
                                  id="meta_keywords" 
                                  value={blogPost?.meta_keywords || ''} 
                                  onChange={handleInputChange} 
                                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                  placeholder="comma, separated, keywords"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      </div> {/* Close the two-column grid */}

                      {/* Content Editor Section */}
                      <div className="mb-12">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                            <FiBookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Blog Content</h2>
                            <p className="text-gray-600">Write your blog post content or upload from file</p>
                          </div>
                        </div>
                        
                        {/* Content Editor */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                          <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FiBookOpen className="w-5 h-5 text-gray-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Content Editor</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <CompactFileUpload 
                                  onContentParsed={handleFileContentParsed} 
                                  currentContent={blogPost?.content || ''}
                                />
                                {blogPost?.reading_time > 0 && (
                                  <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                    <FiClock className="w-4 h-4 mr-1" />
                                    {blogPost.reading_time} min read
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Write content using the rich text editor or import from JSON/CSV file</p>
                          </div>
                          <div className="max-h-[60vh] overflow-hidden">
                            <ErrorBoundary>
                              <QuillEditor 
                                value={blogPost?.content || ''} 
                                onChange={handleContentChange} 
                                className="rounded-b-2xl h-full"
                                style={{ maxHeight: '60vh' }}
                              />
                            </ErrorBoundary>
                          </div>
                        </div>
                      </div>

                      {/* Error Display */}
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                          <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          disabled={saving} 
                          className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {saving ? <FiLoader className="animate-spin mr-2 h-5 w-5" /> : <FiSave className="mr-2 h-5 w-5" />}
                          <span className="text-lg">{saving ? 'Saving...' : 'Save Blog Post'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SEO Tool - Wider sidebar with more weight */}
        <div className="w-full xl:w-[30rem] 2xl:w-[32rem] xl:min-w-0">
          <div className="sticky top-6">
            <AdvancedSEOTool
              context="blog"
              fields={{ 
                title: true, 
                metaDescription: true, 
                tags: true, 
                mainContent: true 
              }}
              generateFor={['metaDescription', 'mainContent', 'tags']}
              onContentGenerated={(content) => {
                console.log('Generated blog content:', content);
                // Apply generated content to the form
                if (content.title) {
                  handleInputChange({target: {name: 'title', value: content.title}});
                }
                if (content.shortDescription) {
                  handleInputChange({target: {name: 'excerpt', value: content.shortDescription}});
                }
                if (content.metaDescription) {
                  handleInputChange({target: {name: 'meta_description', value: content.metaDescription}});
                }
                if (content.content || content.longDescription) {
                  handleContentChange(content.content || content.longDescription);
                }
              }}
              onTitleUpdate={(title) => handleInputChange({target: {name: 'title', value: title}})}
              onDescriptionUpdate={(desc) => handleInputChange({target: {name: 'excerpt', value: desc}})}
              onContentUpdate={handleContentChange}
              initialData={{
                title: blogPost?.title || '',
                shortDescription: blogPost?.excerpt || '',
                content: blogPost?.content || ''
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;
