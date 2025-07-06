import React, { useState } from 'react'
import RealTimeSEOTool from '../components/RealTimeSEOTool'
import { FiEdit, FiTarget, FiType, FiFileText } from 'react-icons/fi'

const SEODemo = () => {
  const [demoData, setDemoData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    slug: ''
  })

  const [contentType, setContentType] = useState('blog')

  const handleInputChange = (field, value) => {
    setDemoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSEOChanges = (seoData) => {
    setDemoData(prev => ({
      ...prev,
      ...seoData
    }))
  }

  const addTag = () => {
    const newTag = document.getElementById('new-tag').value.trim()
    if (newTag && !demoData.tags.includes(newTag)) {
      setDemoData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      document.getElementById('new-tag').value = ''
    }
  }

  const removeTag = (tagIndex) => {
    setDemoData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== tagIndex)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Real-Time SEO Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Watch your SEO score update live as you type
            </p>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <FiTarget className="w-5 h-5 mr-2" />
                <span className="font-semibold">Live Analysis</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <span className="font-semibold">Bangladesh Market</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Demo Form */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">SEO Demo Form</h2>
                  <p className="text-gray-600">Type in the fields below and watch your SEO score update in real-time</p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Content Type:</label>
                  <select 
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="university">University Page</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiType className="inline w-4 h-4 mr-1" />
                    Title
                  </label>
                  <input
                    type="text"
                    value={demoData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your title here (30-60 characters optimal)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {demoData.title.length}/60 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiEdit className="inline w-4 h-4 mr-1" />
                    Description/Excerpt
                  </label>
                  <textarea
                    value={demoData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter your description here (120-160 characters optimal)"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {demoData.description.length}/160 characters
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={demoData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Study Abroad, University Reviews"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {demoData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      id="new-tag"
                      type="text"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiFileText className="inline w-4 h-4 mr-1" />
                    Content
                  </label>
                  <textarea
                    value={demoData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your content here (300+ words recommended)"
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Word count: {demoData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
                  </p>
                </div>

                {/* Meta fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={demoData.meta_title}
                      onChange={(e) => handleInputChange('meta_title', e.target.value)}
                      placeholder="SEO title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
                    <input
                      type="text"
                      value={demoData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="url-slug"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    value={demoData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO description"
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">How to Use This Demo</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">1.</span>
                  Start typing in any field above and watch the SEO score update instantly
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">2.</span>
                  Add keywords using the keyword tool on the right
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">3.</span>
                  Follow the suggestions to improve your SEO score
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">4.</span>
                  Follow the live suggestions to optimize your content
                </li>
              </ul>
            </div>
          </div>

          {/* Real-Time SEO Tool */}
          <div className="w-full xl:w-96">
            <RealTimeSEOTool 
              currentData={demoData}
              onApplyChanges={handleSEOChanges}
              contentType={contentType}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use Our Real-Time SEO Analyzer?</h2>
            <p className="text-xl text-gray-600">Get instant feedback and optimize content for Bangladesh market</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Analysis</h3>
              <p className="text-gray-600">See your SEO score update in real-time as you type and make changes</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">BD</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bangladesh Focus</h3>
              <p className="text-gray-600">Optimized for Bangladesh market with local keyword suggestions</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiEdit className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
              <p className="text-gray-600">Real-time optimization suggestions and content improvement tips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SEODemo
