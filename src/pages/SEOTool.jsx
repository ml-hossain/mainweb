import React, { useState, useEffect } from 'react'
import { 
  FiTarget, FiTrendingUp, FiZap, FiCheck, FiAlertCircle, FiRefreshCw, 
  FiEdit3, FiEye, FiSearch, FiBookOpen, FiBarChart, FiGlobe, 
  FiImage, FiLink, FiFileText, FiUsers, FiClock, FiAward,
  FiChevronDown, FiChevronUp, FiDownload, FiShare2, FiSettings,
  FiCpu, FiMonitor, FiActivity, FiInfo, FiPlay
} from 'react-icons/fi'
import AdvancedSEOAnalyzer from '../components/AdvancedSEOAnalyzer'
import RealTimeSEOTool from '../components/RealTimeSEOTool'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SEOToolPage = () => {
  const [currentUrl, setCurrentUrl] = useState('')
  const [testContent, setTestContent] = useState({
    title: '',
    meta_description: '',
    meta_title: '',
    meta_keywords: '',
    content: '',
    slug: ''
  })
  const [analysisMode, setAnalysisMode] = useState('url') // 'url' or 'content'
  const [showDemo, setShowDemo] = useState(false)

  // Demo content for testing
  const demoContent = {
    title: 'Complete Guide to Study Abroad in Canada 2024',
    meta_description: 'Discover everything you need to know about studying in Canada. Get expert guidance on university selection, visa process, and scholarship opportunities.',
    meta_title: 'Study Abroad Canada | Complete Guide 2024 | MA Education',
    meta_keywords: 'study abroad, canada universities, student visa, education consultant, international education',
    content: `
      <h1>Study Abroad in Canada: Your Complete Guide for 2024</h1>
      <p>Canada has become one of the most popular destinations for international students seeking quality education and excellent career opportunities. This comprehensive guide will help you navigate the process of studying in Canada.</p>
      
      <h2>Why Choose Canada for Higher Education?</h2>
      <p>Canada offers world-class universities, diverse programs, and a welcoming environment for international students. With its strong education system and post-graduation work opportunities, Canada is an ideal choice for your academic journey.</p>
      
      <h3>Top Benefits of Studying in Canada</h3>
      <ul>
        <li>High-quality education system</li>
        <li>Affordable tuition fees compared to other countries</li>
        <li>Post-graduation work permit opportunities</li>
        <li>Multicultural and inclusive society</li>
        <li>Beautiful natural landscapes and safe environment</li>
      </ul>
      
      <h2>University Selection Process</h2>
      <p>Choosing the right university is crucial for your success. Consider factors like program quality, location, tuition fees, and career prospects when making your decision.</p>
      
      <h3>Top Universities in Canada</h3>
      <p>Canada is home to many prestigious institutions including University of Toronto, McGill University, University of British Columbia, and many others that offer excellent programs for international students.</p>
      
      <h2>Student Visa Requirements</h2>
      <p>The student visa process requires careful preparation and documentation. Start your application early and ensure all requirements are met for a smooth visa approval process.</p>
      
      <h3>Required Documents</h3>
      <ul>
        <li>Letter of acceptance from a Canadian institution</li>
        <li>Proof of financial support</li>
        <li>Valid passport</li>
        <li>Medical examination results</li>
        <li>Statement of purpose</li>
      </ul>
      
      <h2>Scholarship Opportunities</h2>
      <p>Many scholarships are available for international students studying in Canada. Research and apply early to increase your chances of receiving financial aid.</p>
      
      <p>Contact our education consultants today to start your journey toward studying in Canada. We provide comprehensive guidance throughout the entire process.</p>
    `,
    slug: 'study-abroad-canada-complete-guide-2024',
    category: 'Study Abroad',
    tags: ['Canada', 'University', 'Student Visa', 'Education']
  }

  // Handle content updates from SEO tools
  const handleContentUpdate = (updates) => {
    setTestContent(prev => ({
      ...prev,
      ...updates
    }))
  }

  // Load demo content
  const loadDemoContent = () => {
    setTestContent(demoContent)
    setAnalysisMode('content')
    setShowDemo(true)
  }

  // Reset content
  const resetContent = () => {
    setTestContent({
      title: '',
      meta_description: '',
      meta_title: '',
      meta_keywords: '',
      content: '',
      slug: ''
    })
    setCurrentUrl('')
    setShowDemo(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiTarget className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Advanced SEO Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional-grade SEO analysis and optimization tools to boost your search rankings and drive organic traffic
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={loadDemoContent}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FiPlay className="w-5 h-5" />
                <span>Try Demo</span>
              </button>
              <button
                onClick={resetContent}
                className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive SEO Analysis Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get detailed insights into your website's SEO performance with our advanced analysis tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FiBarChart,
                title: 'SEO Score Analysis',
                description: 'Comprehensive scoring system with detailed breakdown of all SEO factors'
              },
              {
                icon: FiCpu,
                title: 'Technical SEO',
                description: 'Page speed, mobile responsiveness, and technical performance analysis'
              },
              {
                icon: FiSearch,
                title: 'Keyword Research',
                description: 'AI-powered keyword suggestions and optimization recommendations'
              },
              {
                icon: FiUsers,
                title: 'Competitor Analysis',
                description: 'Compare your performance against top competitors in your niche'
              },
              {
                icon: FiFileText,
                title: 'Content Optimization',
                description: 'Readability, keyword density, and content structure analysis'
              },
              {
                icon: FiTrendingUp,
                title: 'Performance Tracking',
                description: 'Historical data and progress tracking over time'
              },
              {
                icon: FiEdit3,
                title: 'Content Generator',
                description: 'AI-powered content generation with SEO optimization'
              },
              {
                icon: FiDownload,
                title: 'Detailed Reports',
                description: 'Export comprehensive SEO reports for your analysis'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Analysis Mode Selection */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mode Selection */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Analysis Options</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="url-mode"
                      name="analysisMode"
                      value="url"
                      checked={analysisMode === 'url'}
                      onChange={(e) => setAnalysisMode(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="url-mode" className="ml-3 text-sm font-medium text-gray-700">
                      Analyze Website URL
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="content-mode"
                      name="analysisMode"
                      value="content"
                      checked={analysisMode === 'content'}
                      onChange={(e) => setAnalysisMode(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="content-mode" className="ml-3 text-sm font-medium text-gray-700">
                      Analyze Custom Content
                    </label>
                  </div>
                </div>

                {analysisMode === 'url' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Enter any website URL to perform comprehensive SEO analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={testContent.title}
                        onChange={(e) => setTestContent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter page title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={testContent.meta_description}
                        onChange={(e) => setTestContent(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Enter meta description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={testContent.content}
                        onChange={(e) => setTestContent(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter your content here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <button
                      onClick={loadDemoContent}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <FiPlay className="w-4 h-4" />
                      <span>Load Demo Content</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Analysis Tools */}
            <div className="lg:w-2/3 space-y-8">
              {/* Advanced SEO Analyzer */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced SEO Analysis</h3>
                <AdvancedSEOAnalyzer
                  currentData={analysisMode === 'content' ? testContent : {}}
                  url={analysisMode === 'url' ? currentUrl : ''}
                  onApplyChanges={handleContentUpdate}
                  contentType="blog"
                  isStandalone={true}
                />
              </div>

              {/* Quick SEO Tool */}
              {analysisMode === 'content' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick SEO Optimizer</h3>
                  <RealTimeSEOTool
                    currentData={testContent}
                    onApplyChanges={handleContentUpdate}
                    contentType="blog"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      {showDemo && analysisMode === 'content' && (
        <div className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Content Preview</h3>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <div className="p-3 bg-white rounded-lg border">
                    {testContent.title || 'No title set'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <div className="p-3 bg-white rounded-lg border">
                    {testContent.meta_description || 'No meta description set'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <div className="p-3 bg-white rounded-lg border">
                    /{testContent.slug || 'no-slug-set'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Length</label>
                  <div className="p-3 bg-white rounded-lg border">
                    {testContent.content ? `${testContent.content.replace(/<[^>]*>/g, '').split(/\s+/).length} words` : '0 words'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tips Section */}
      <div className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              SEO Best Practices
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Follow these essential SEO tips to improve your search rankings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Optimize Title Tags',
                description: 'Keep titles 30-60 characters and include primary keywords at the beginning'
              },
              {
                title: 'Write Meta Descriptions',
                description: 'Create compelling 120-160 character descriptions that encourage clicks'
              },
              {
                title: 'Use Header Structure',
                description: 'Organize content with proper H1, H2, H3 hierarchy for better readability'
              },
              {
                title: 'Optimize Images',
                description: 'Add descriptive alt text and use optimized file names for all images'
              },
              {
                title: 'Improve Page Speed',
                description: 'Optimize loading times for better user experience and search rankings'
              },
              {
                title: 'Mobile Optimization',
                description: 'Ensure your site works perfectly on all mobile devices and screen sizes'
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3">{tip.title}</h3>
                <p className="text-gray-300 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SEOToolPage
