import React, { useState, useEffect, useCallback } from 'react'
import { 
  FiTarget, FiTrendingUp, FiZap, FiCheck, FiAlertCircle, FiRefreshCw, 
  FiEdit3, FiEye, FiSearch, FiBookOpen, FiBarChart, FiGlobe, 
  FiImage, FiLink, FiFileText, FiUsers, FiClock, FiAward,
  FiChevronDown, FiChevronUp, FiDownload, FiShare2, FiSettings
} from 'react-icons/fi'
import seoApiHandler from '../utils/seoApiHandler'
import seoScoreCalculator from '../utils/seoScoreCalculator'

const AdvancedSEOAnalyzer = ({ 
  currentData = {}, 
  onApplyChanges, 
  contentType = 'blog',
  url = '',
  isStandalone = false 
}) => {
  const [analysisData, setAnalysisData] = useState(null)
  const [scoreData, setScoreData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']))
  const [generatedContent, setGeneratedContent] = useState(null)
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)
  const [historicalData, setHistoricalData] = useState([])

  // Perform full SEO analysis
  const runAnalysis = useCallback(async () => {
    if (!currentData && !url) return

    setLoading(true)
    try {
      const content = currentData.content || currentData.page_content || ''
      const analysisUrl = url || currentData.url || window.location.href
      
      // Run comprehensive analysis
      const [apiAnalysis, scoreAnalysis, historical] = await Promise.allSettled([
        seoApiHandler.analyzePage(analysisUrl, content, selectedKeywords),
        Promise.resolve(seoScoreCalculator.calculateOverallScore(currentData, selectedKeywords)),
        seoApiHandler.getHistoricalData(analysisUrl)
      ])

      setAnalysisData(apiAnalysis.status === 'fulfilled' ? apiAnalysis.value : null)
      setScoreData(scoreAnalysis.status === 'fulfilled' ? scoreAnalysis.value : null)
      setHistoricalData(historical.status === 'fulfilled' ? historical.value : [])

      // Save analysis to database
      if (apiAnalysis.status === 'fulfilled') {
        await seoApiHandler.saveAnalysis(analysisUrl, apiAnalysis.value)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }, [currentData, selectedKeywords, url])

  // Generate keyword suggestions
  const generateKeywords = async () => {
    // Check if user has entered any keywords manually
    const userEnteredKeywords = getUserEnteredKeywords()
    
    if (userEnteredKeywords.length === 0) {
      // Enhanced error message with specific guidance
      const errorMessage = getKeywordInputGuidance()
      alert(errorMessage)
      return
    }

    // Validate that keywords are meaningful (not just common words)
    const meaningfulKeywords = filterMeaningfulKeywords(userEnteredKeywords)
    
    if (meaningfulKeywords.length === 0) {
      alert('Please enter more specific keywords. Avoid common words like "the", "and", "university", etc. Try specific course names, university names, or detailed topics.')
      return
    }

    setLoading(true)
    try {
      // Use real API to get keyword suggestions for Bangladesh market
      const keywordSuggestions = await fetchKeywordSuggestionsFromAPI(meaningfulKeywords)
      
      setKeywords(keywordSuggestions)
    } catch (error) {
      console.error('Keyword generation error:', error)
      // Fallback to manual keywords if API fails
      setKeywords(meaningfulKeywords)
      alert('API service unavailable. Using your entered keywords for Bangladesh market analysis.')
    } finally {
      setLoading(false)
    }
  }
  
  // Get keywords that user has manually entered
  const getUserEnteredKeywords = () => {
    const enteredKeywords = []
    
    // Get from keyword input field (highest priority)
    if (keywordInput.trim()) {
      const inputKeywords = keywordInput.trim().split(/[,\s]+/).filter(k => k.trim().length > 0)
      enteredKeywords.push(...inputKeywords)
    }
    
    // Get from existing keywords list (manually added keywords)
    enteredKeywords.push(...keywords)
    
    // Extract from title if it contains meaningful keywords
    if (currentData.title && currentData.title.trim().length > 0) {
      const titleKeywords = extractKeywordsFromTitle(currentData.title)
      enteredKeywords.push(...titleKeywords)
    }
    
    // Extract from university name field (for university content)
    if (currentData.university_name || currentData.name) {
      const universityName = currentData.university_name || currentData.name
      if (universityName.trim().length > 0) {
        enteredKeywords.push(universityName)
        // Add variations for Bangladesh market
        enteredKeywords.push(`${universityName} admission Bangladesh`, `${universityName} university`)
      }
    }
    
    // Extract from blog category and tags if available
    if (currentData.category && currentData.category.trim().length > 0) {
      enteredKeywords.push(currentData.category)
    }
    
    if (currentData.tags && Array.isArray(currentData.tags)) {
      enteredKeywords.push(...currentData.tags.filter(tag => tag.trim().length > 0))
    }
    
    // Extract from programs and courses (university content)
    if (currentData.programs && Array.isArray(currentData.programs)) {
      enteredKeywords.push(...currentData.programs.filter(prog => prog.trim().length > 0))
    }
    
    // Remove duplicates, empty strings, and clean up
    return [...new Set(enteredKeywords)]
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0)
  }
  
  // Extract meaningful keywords from title
  const extractKeywordsFromTitle = (title) => {
    // Common stop words to exclude
    const stopWords = [
      'the', 'and', 'for', 'with', 'guide', 'complete', 'ultimate', 'best', 'top',
      'how', 'to', 'in', 'on', 'at', 'by', 'from', 'up', 'about', 'into', 'over',
      'after', 'your', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one',
      'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new',
      'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let',
      'put', 'say', 'she', 'too', 'use', 'are', 'but', 'not', 'or', 'as', 'what',
      'if', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just',
      'like', 'long', 'make', 'many', 'most', 'over', 'such', 'take', 'than',
      'them', 'well', 'were', 'will', 'tips', 'list', 'things', 'ways'
    ]
    
    const meaningfulWords = title
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, ' ') // Remove special characters
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !stopWords.includes(word) &&
        /^[a-z]+$/.test(word) // Only letters
      )
    
    return meaningfulWords.slice(0, 5) // Limit to 5 keywords from title
  }
  
  // Real API call for keyword suggestions (Bangladesh market)
  const fetchKeywordSuggestionsFromAPI = async (baseKeywords) => {
    try {
      // Use Google Keyword Planner API or similar for Bangladesh
      const suggestions = []
      
      for (const keyword of baseKeywords) {
        // Call real keyword API for Bangladesh market
        const apiSuggestions = await callKeywordAPI(keyword)
        suggestions.push(...apiSuggestions)
      }
      
      return suggestions
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
  
  // Call keyword research API for Bangladesh market
  const callKeywordAPI = async (keyword) => {
    try {
      // Example using DataForSEO API for Bangladesh market
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword,
          country: 'BD', // Bangladesh country code
          language: 'en', // English language
          location: 'Dhaka, Bangladesh' // Target location
        })
      })
      
      if (!response.ok) {
        throw new Error('API request failed')
      }
      
      const data = await response.json()
      
      // Process API response to extract keyword suggestions
      return processKeywordAPIResponse(data, keyword)
    } catch (error) {
      console.error('Keyword API call failed:', error)
      
      // Fallback: Generate Bangladesh-specific variations manually
      return generateBangladeshKeywords(keyword)
    }
  }
  
  // Process API response to extract relevant keywords
  const processKeywordAPIResponse = (data, originalKeyword) => {
    const suggestions = []
    
    // Add the original keyword
    suggestions.push(originalKeyword)
    
    // Process different API response formats
    if (data.suggestions) {
      data.suggestions.forEach(suggestion => {
        if (suggestion.keyword && suggestion.search_volume > 100) {
          suggestions.push(suggestion.keyword)
        }
      })
    }
    
    if (data.related_keywords) {
      data.related_keywords.slice(0, 5).forEach(related => {
        suggestions.push(related.keyword || related)
      })
    }
    
    return suggestions.slice(0, 10) // Limit to 10 suggestions per keyword
  }
  
  // Filter out meaningless keywords
  const filterMeaningfulKeywords = (keywords) => {
    const stopWords = [
      'the', 'and', 'for', 'with', 'guide', 'complete', 'ultimate', 'best', 'top',
      'how', 'to', 'in', 'on', 'at', 'by', 'from', 'up', 'about', 'into', 'over',
      'university', 'college', 'education', 'study', 'student', 'course',
      'program', 'degree', 'admission', 'apply', 'application', 'requirements'
    ]
    
    return keywords.filter(keyword => {
      const lowercaseKeyword = keyword.toLowerCase().trim()
      
      // Must be longer than 2 characters
      if (lowercaseKeyword.length <= 2) return false
      
      // Must not be only a stop word
      if (stopWords.includes(lowercaseKeyword)) return false
      
      // Must contain at least one meaningful word
      const words = lowercaseKeyword.split(/\s+/)
      const hasSpecificWord = words.some(word => 
        word.length > 3 && !stopWords.includes(word)
      )
      
      return hasSpecificWord
    })
  }
  
  // Get contextual guidance for keyword input
  const getKeywordInputGuidance = () => {
    const inputSources = []
    
    if (!keywordInput.trim()) {
      inputSources.push('• Enter keywords in the keyword input field above')
    }
    
    if (!currentData.title || currentData.title.trim().length === 0) {
      if (contentType === 'university') {
        inputSources.push('• Enter a university name in the "University Name" field')
      } else {
        inputSources.push('• Enter a descriptive title for your blog post')
      }
    }
    
    if (contentType === 'university' && (!currentData.programs || currentData.programs.length === 0)) {
      inputSources.push('• Add specific programs/courses offered by the university')
    }
    
    if (contentType === 'blog' && (!currentData.category || currentData.category.trim().length === 0)) {
      inputSources.push('• Specify a category for your blog post')
    }
    
    const baseMessage = 'No keywords found for Bangladesh market analysis. Please provide keywords by:';
    
    if (inputSources.length > 0) {
      return `${baseMessage}\n\n${inputSources.join('\n')}\n\nExample keywords for Bangladesh market:\n• "study abroad consultation Bangladesh"\n• "university admission guidance Dhaka"\n• "IELTS preparation Chittagong"`
    }
    
    return `${baseMessage}\n\nPlease enter more specific keywords. Examples:\n• Specific university names\n• Course/program names\n• Location-specific terms\n• Professional services`
  }
  
  // Generate Bangladesh-specific keyword variations as fallback
  const generateBangladeshKeywords = (keyword) => {
    const baseKeyword = keyword.toLowerCase().trim()
    const variations = [
      keyword,
      `${baseKeyword} in Bangladesh`,
      `${baseKeyword} Dhaka`,
      `${baseKeyword} Bangladesh`,
      `best ${baseKeyword} Bangladesh`,
      `${baseKeyword} Chittagong`,
      `${baseKeyword} Sylhet`,
      `${baseKeyword} services Bangladesh`,
      `${baseKeyword} consultant Bangladesh`,
      `top ${baseKeyword} Bangladesh`
    ]
    
    // Add education-specific variations if relevant
    const educationTerms = ['university', 'education', 'study', 'course', 'degree', 'admission', 'scholarship']
    const isEducationRelated = educationTerms.some(term => baseKeyword.includes(term))
    
    if (isEducationRelated) {
      variations.push(
        `${baseKeyword} admission Bangladesh`,
        `${baseKeyword} cost Bangladesh`,
        `${baseKeyword} scholarship Bangladesh`,
        `private ${baseKeyword} Bangladesh`,
        `public ${baseKeyword} Bangladesh`,
        `${baseKeyword} requirements Bangladesh`,
        `${baseKeyword} application Bangladesh`
      )
    }
    
    // Add business/service-specific variations if relevant
    const businessTerms = ['consultant', 'service', 'agency', 'company', 'expert', 'professional']
    const isBusinessRelated = businessTerms.some(term => baseKeyword.includes(term))
    
    if (isBusinessRelated) {
      variations.push(
        `${baseKeyword} Dhaka Bangladesh`,
        `reliable ${baseKeyword} Bangladesh`,
        `experienced ${baseKeyword} Bangladesh`,
        `${baseKeyword} near me Bangladesh`
      )
    }
    
    return variations.filter(v => v.trim().length > 0)
  }
  
  // Extract data from current content
  const extractDataFromContent = () => {
    const content = [
      currentData.title || '',
      currentData.description || currentData.excerpt || currentData.meta_description || '',
      currentData.content || currentData.page_content || ''
    ].join(' ')
    
    return {
      location: extractLocationFromContent(content),
      category: extractCategoryFromContent(content),
      programs: extractProgramsFromContent(content),
      universities: extractUniversityNames(content),
      topics: extractTopicsFromContent(content)
    }
  }
  
  // Generate dynamic keywords based on extracted data
  const generateDynamicKeywords = (extractedData) => {
    const keywords = []
    
    // Location-based keywords
    if (extractedData.location) {
      keywords.push(
        `study in ${extractedData.location}`,
        `${extractedData.location} universities`,
        `education in ${extractedData.location}`,
        `${extractedData.location} student visa`,
        `universities in ${extractedData.location}`,
        `${extractedData.location} colleges`
      )
    }
    
    // Program-based keywords
    if (extractedData.programs && extractedData.programs.length > 0) {
      extractedData.programs.forEach(program => {
        keywords.push(
          `${program} degree`,
          `${program} program`,
          `${program} courses`,
          `study ${program}`,
          `${program} admission`,
          `${program} university`
        )
      })
    }
    
    // University-specific keywords
    if (extractedData.universities && extractedData.universities.length > 0) {
      extractedData.universities.forEach(uni => {
        keywords.push(
          `${uni} admission`,
          `${uni} requirements`,
          `${uni} application`,
          `apply to ${uni}`,
          `${uni} ranking`
        )
      })
    }
    
    // Topic-based keywords
    if (extractedData.topics && extractedData.topics.length > 0) {
      extractedData.topics.forEach(topic => {
        keywords.push(
          `${topic} guide`,
          `${topic} tips`,
          `${topic} advice`,
          `how to ${topic}`,
          `${topic} process`,
          `${topic} requirements`
        )
      })
    }
    
    return keywords
  }
  
  // Helper functions for content extraction
  const extractLocationFromContent = (content) => {
    const countries = [
      'canada', 'usa', 'uk', 'united kingdom', 'australia', 'germany', 'france', 'netherlands',
      'sweden', 'norway', 'denmark', 'switzerland', 'new zealand', 'singapore',
      'japan', 'south korea', 'italy', 'spain', 'ireland', 'belgium', 'austria'
    ]
    
    const foundCountry = countries.find(country => 
      content.toLowerCase().includes(country)
    )
    
    return foundCountry ? foundCountry.charAt(0).toUpperCase() + foundCountry.slice(1) : null
  }
  
  const extractCategoryFromContent = (content) => {
    const categories = [
      'engineering', 'business', 'medicine', 'law', 'arts', 'science',
      'technology', 'education', 'nursing', 'psychology', 'economics'
    ]
    
    const foundCategory = categories.find(category => 
      content.toLowerCase().includes(category)
    )
    
    return foundCategory
  }
  
  const extractProgramsFromContent = (content) => {
    const programs = [
      'engineering', 'computer science', 'business administration', 'mba', 'medicine', 'nursing',
      'law', 'psychology', 'arts', 'science', 'mathematics', 'physics', 'chemistry',
      'biology', 'economics', 'finance', 'marketing', 'management', 'data science',
      'artificial intelligence', 'cybersecurity', 'architecture', 'design', 'masters', 'bachelor'
    ]
    
    return programs.filter(program => content.toLowerCase().includes(program))
  }
  
  const extractUniversityNames = (content) => {
    // Look for university patterns
    const universityPatterns = [
      /([A-Z][a-z]+ )+University/g,
      /University of [A-Z][a-z]+/g,
      /([A-Z][a-z]+ )+College/g
    ]
    
    const universities = []
    universityPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        universities.push(...matches)
      }
    })
    
    return [...new Set(universities)].slice(0, 3)
  }
  
  const extractTopicsFromContent = (content) => {
    const title = currentData.title || ''
    
    // Extract main topics from title and headings
    const topics = []
    
    // Look for topics in title
    const titleWords = title.toLowerCase().split(' ')
      .filter(word => word.length > 3 && !['study', 'guide', 'complete', 'tips'].includes(word))
      .slice(0, 3)
    
    topics.push(...titleWords)
    
    // Look for headings in content
    const headingMatches = content.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi) || []
    headingMatches.forEach(heading => {
      const text = heading.replace(/<[^>]*>/g, '').toLowerCase()
      const words = text.split(' ')
        .filter(word => word.length > 3 && !['study', 'guide', 'complete', 'tips'].includes(word))
        .slice(0, 2)
      topics.push(...words)
    })
    
    return [...new Set(topics)].slice(0, 5)
  }

  // Generate optimized content
  const generateOptimizedContent = async () => {
    if (selectedKeywords.length === 0) {
      alert('Please select keywords first')
      return
    }

    setLoading(true)
    try {
      // Use the existing SEO tool logic but enhanced
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const primaryKeyword = selectedKeywords[0]
      const secondaryKeywords = selectedKeywords.slice(1, 3)
      
      const optimizedContent = {
        title: `${primaryKeyword} - Complete Guide ${new Date().getFullYear()}`,
        description: `Comprehensive ${primaryKeyword} guide with expert insights on ${secondaryKeywords.join(' and ')}. Updated for ${new Date().getFullYear()}.`,
        meta_title: `${primaryKeyword} | Expert Guide & Tips ${new Date().getFullYear()}`,
        meta_description: `Master ${primaryKeyword} with our expert guide. Learn ${secondaryKeywords[0]} techniques and ${secondaryKeywords[1]} strategies.`,
        meta_keywords: selectedKeywords.join(', '),
        slug: primaryKeyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        content: generateEnhancedContent(primaryKeyword, secondaryKeywords, contentType)
      }

      setGeneratedContent(optimizedContent)
    } finally {
      setLoading(false)
    }
  }

  // Enhanced content generation
  const generateEnhancedContent = (primary, secondary, type) => {
    if (type === 'university') {
      return `
        <h1>Complete Guide to ${primary}</h1>
        <p>Looking for comprehensive information about ${primary}? You've come to the right place. Our expert team has compiled everything you need to know about ${secondary[0]} and ${secondary[1]}.</p>
        
        <h2>Why Choose ${primary}?</h2>
        <p>When it comes to ${secondary[0]}, ${primary} stands out for several key reasons:</p>
        <ul>
          <li>Expert guidance in ${secondary[0]}</li>
          <li>Comprehensive ${primary} solutions</li>
          <li>Proven track record in ${secondary[1]}</li>
          <li>24/7 support for ${primary} inquiries</li>
        </ul>
        
        <h2>Our ${primary} Process</h2>
        <p>We follow a systematic approach to ${primary} that ensures success:</p>
        <ol>
          <li><strong>Initial Consultation:</strong> Understanding your ${secondary[0]} needs</li>
          <li><strong>Planning Phase:</strong> Developing your ${primary} strategy</li>
          <li><strong>Implementation:</strong> Executing ${secondary[1]} solutions</li>
          <li><strong>Follow-up:</strong> Ensuring ${primary} success</li>
        </ol>
        
        <h3>Benefits of Our ${primary} Services</h3>
        <p>Our ${primary} services offer numerous advantages for ${secondary[0]} and ${secondary[1]}. Contact us today to learn more about how we can help you succeed.</p>
      `
    } else {
      return `
        <h1>Ultimate Guide to ${primary}: Expert Tips for ${new Date().getFullYear()}</h1>
        <p>Master ${primary} with our comprehensive guide. Whether you're new to ${secondary[0]} or looking to improve your ${secondary[1]} skills, this article covers everything you need to know.</p>
        
        <h2>Getting Started with ${primary}</h2>
        <p>Starting your ${primary} journey can be challenging, but with the right approach to ${secondary[0]}, you'll see results quickly. Here's what you need to know:</p>
        
        <h3>Essential ${primary} Strategies</h3>
        <ul>
          <li>Master the fundamentals of ${secondary[0]}</li>
          <li>Develop advanced ${secondary[1]} techniques</li>
          <li>Stay updated with latest ${primary} trends</li>
          <li>Network with ${primary} professionals</li>
        </ul>
        
        <h2>Advanced ${primary} Techniques</h2>
        <p>Once you've mastered the basics, these advanced ${primary} strategies will help you excel in ${secondary[0]} and ${secondary[1]}.</p>
        
        <h3>Common Mistakes to Avoid</h3>
        <p>Learn from others' experiences and avoid these common ${primary} pitfalls when working with ${secondary[0]} and ${secondary[1]}.</p>
        
        <h2>Conclusion</h2>
        <p>Success in ${primary} requires dedication and the right approach to ${secondary[0]}. Keep practicing, stay informed about ${secondary[1]} developments, and you'll achieve your goals.</p>
      `
    }
  }

  // Apply generated content
  const applyGeneratedContent = () => {
    if (onApplyChanges && generatedContent) {
      onApplyChanges(generatedContent)
      setGeneratedContent(null)
      alert('Optimized content applied successfully!')
    }
  }

  // Toggle section expansion
  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // Add custom keyword
  const addCustomKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords(prev => [...prev, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  // Toggle keyword selection
  const toggleKeywordSelection = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  // Export SEO report
  const exportReport = () => {
    const report = {
      url: url || currentData.url,
      timestamp: new Date().toISOString(),
      score: scoreData?.overall || 0,
      breakdown: scoreData?.breakdown,
      technicalSEO: analysisData?.technicalSEO,
      recommendations: scoreData?.suggestions || [],
      keywords: selectedKeywords
    }
    
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url_download = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url_download
    link.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  // Initialize analysis on mount
  useEffect(() => {
    if (currentData || url) {
      runAnalysis()
    }
  }, [runAnalysis])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTarget },
    { id: 'technical', label: 'Technical', icon: FiSettings },
    { id: 'content', label: 'Content', icon: FiFileText },
    { id: 'competitors', label: 'Competitors', icon: FiUsers },
    { id: 'history', label: 'History', icon: FiClock }
  ]

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 ${isStandalone ? 'w-full' : 'sticky top-6'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FiTarget className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Advanced SEO Analyzer</h3>
              <p className="text-blue-100 text-sm">AI-Powered Content Optimization & Analysis</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center space-x-1"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Overall Score */}
        {scoreData && (
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Overall SEO Score</span>
              <span className="text-2xl font-bold text-white">{scoreData.overall}/100</span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(scoreData.overall)} transition-all duration-1000`}
                style={{ width: `${scoreData.overall}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Object.keys(scoreData.breakdown).filter(k => scoreData.breakdown[k] >= 80).length}</div>
                <div className="text-xs text-blue-100">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{scoreData.suggestions?.length || 0}</div>
                <div className="text-xs text-blue-100">Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{selectedKeywords.length}</div>
                <div className="text-xs text-blue-100">Keywords</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Score Breakdown */}
            {scoreData && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                  <FiBarChart className="w-4 h-4" />
                  <span>Score Breakdown</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(scoreData.breakdown).map(([category, score]) => (
                    score !== null && (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(score)}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Quick Recommendations */}
            {scoreData?.suggestions && showRecommendations && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-yellow-800 flex items-center space-x-2">
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Quick Wins</span>
                  </h4>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <FiChevronUp className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {scoreData.suggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        suggestion.priority === 'high' ? 'bg-red-500' :
                        suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-yellow-800">{suggestion.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Overview */}
            {analysisData?.technicalSEO && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                  <FiGlobe className="w-4 h-4" />
                  <span>Technical Health</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisData.technicalSEO.pageSpeed?.mobile || 'N/A'}
                    </div>
                    <div className="text-xs text-blue-700">Mobile Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisData.technicalSEO.lighthouse?.seo || 'N/A'}
                    </div>
                    <div className="text-xs text-blue-700">SEO Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {activeTab === 'technical' && analysisData?.technicalSEO && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{analysisData.technicalSEO.pageSpeed.mobile}</div>
                  <div className="text-sm text-gray-600">Mobile Speed</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{analysisData.technicalSEO.pageSpeed.desktop}</div>
                  <div className="text-sm text-gray-600">Desktop Speed</div>
                </div>
              </div>
            </div>

            {/* Lighthouse Scores */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Lighthouse Scores</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(analysisData.technicalSEO.lighthouse).map(([metric, score]) => (
                  <div key={metric} className="bg-white p-3 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">{score}</div>
                    <div className="text-sm text-gray-600 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Issues */}
            {analysisData.technicalSEO.technicalIssues?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-semibold text-red-800 mb-3">Technical Issues</h4>
                <div className="space-y-2">
                  {analysisData.technicalSEO.technicalIssues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        issue.priority === 'High' ? 'bg-red-500' :
                        issue.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-red-800">{issue.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && analysisData?.contentAnalysis && (
          <div className="space-y-6">
            {/* Content Metrics */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-3">Content Analysis</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{analysisData.contentAnalysis.wordCount}</div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{analysisData.contentAnalysis.readabilityScore}</div>
                  <div className="text-sm text-gray-600">Readability</div>
                </div>
              </div>
            </div>

            {/* Keyword Density */}
            {analysisData.contentAnalysis.keywordDensity?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="font-semibold text-yellow-800 mb-3">Keyword Density</h4>
                <div className="space-y-2">
                  {analysisData.contentAnalysis.keywordDensity.map((kw, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="text-sm font-medium">{kw.keyword}</span>
                      <span className="text-sm text-gray-600">{kw.density}% ({kw.count} times)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'competitors' && analysisData?.competitorData && (
          <div className="space-y-6">
            {/* Top Competitors */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-semibold text-purple-800 mb-3">Top Competitors</h4>
              <div className="space-y-2">
                {analysisData.competitorData.topCompetitors?.slice(0, 5).map((competitor, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{competitor.domain}</div>
                      <div className="text-sm text-gray-600">Rank #{competitor.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">{competitor.traffic.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">monthly traffic</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Analysis */}
            {analysisData.competitorData.gapAnalysis && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-semibold text-orange-800 mb-3">Opportunity Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-orange-600">{analysisData.competitorData.gapAnalysis.missingKeywords}</div>
                    <div className="text-sm text-gray-600">Missing Keywords</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-orange-600">{analysisData.competitorData.gapAnalysis.opportunityScore}</div>
                    <div className="text-sm text-gray-600">Opportunity Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {historicalData.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Historical Analysis</h4>
                {historicalData.slice(0, 5).map((record, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">
                          {new Date(record.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Score: {record.analysis_data.overall_score || 'N/A'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No historical data available</p>
                <p className="text-sm text-gray-400">Run analysis to start tracking your SEO progress</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FiZap className="w-4 h-4" />
            )}
            <span>{loading ? 'Analyzing...' : 'Full Analysis'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('content')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Content</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSEOAnalyzer
