import React, { useState, useEffect, useMemo } from 'react'
import { 
  FiTarget, FiCheck, FiAlertCircle, FiFileText,
  FiThumbsUp, FiInfo
} from 'react-icons/fi'

const RealTimeSEOTool = ({ 
  currentData = {}, 
  onApplyChanges, 
  contentType = 'blog' 
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [pageAnalysis, setPageAnalysis] = useState({})
  const [contentStructure, setContentStructure] = useState({})

  // Content analysis functions (moved up to fix hoisting issue)
  const extractHeadings = (content) => {
    const headingRegex = /<h([1-6])[^>]*>([^<]*)<\/h[1-6]>/gi
    const headings = []
    let match
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].trim(),
        tag: `h${match[1]}`
      })
    }
    
    return headings
  }

  const extractImages = (content) => {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi
    const images = []
    let match
    
    while ((match = imgRegex.exec(content)) !== null) {
      images.push({
        src: match[1],
        alt: match[2] || '',
        hasAlt: !!match[2]
      })
    }
    
    return images
  }

  const extractLinks = (content) => {
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi
    const links = []
    let match
    
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1]
      const text = match[2].trim()
      links.push({
        href,
        text,
        isExternal: href.startsWith('http') && !href.includes(window.location.hostname),
        hasText: text.length > 0
      })
    }
    
    return links
  }

  const extractLists = (content) => {
    const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi
    const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi
    const lists = []
    
    let match
    while ((match = ulRegex.exec(content)) !== null) {
      const items = match[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []
      lists.push({
        type: 'unordered',
        items: items.map(item => item.replace(/<\/?(?:li)[^>]*>/gi, '').trim()),
        count: items.length
      })
    }
    
    while ((match = olRegex.exec(content)) !== null) {
      const items = match[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []
      lists.push({
        type: 'ordered',
        items: items.map(item => item.replace(/<\/?(?:li)[^>]*>/gi, '').trim()),
        count: items.length
      })
    }
    
    return lists
  }

  const getWordCount = (content) => {
    const cleanText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    return cleanText ? cleanText.split(' ').length : 0
  }

  const calculateReadability = (content) => {
    const cleanText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    if (!cleanText) return 0
    
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = cleanText.split(/\s+/)
    const avgWordsPerSentence = words.length / sentences.length
    
    // Simple readability score (lower is better)
    let score = 100
    if (avgWordsPerSentence > 20) score -= 20
    if (avgWordsPerSentence > 25) score -= 20
    if (avgWordsPerSentence > 30) score -= 20
    
    return Math.max(score, 0)
  }

  const calculateKeywordDensity = (content, keywords) => {
    if (!keywords.length || !content) return []
    
    const cleanText = content.replace(/<[^>]*>/g, '').toLowerCase()
    const totalWords = cleanText.split(/\s+/).length
    
    return keywords.map(keyword => {
      const keywordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi')
      const matches = cleanText.match(keywordRegex) || []
      const density = totalWords > 0 ? ((matches.length / totalWords) * 100).toFixed(2) : 0
      
      return {
        keyword,
        count: matches.length,
        density: parseFloat(density),
        optimal: density >= 0.5 && density <= 2.5
      }
    })
  }

  // Individual analysis functions (moved up to fix hoisting issue)
  const analyzeTitleSEO = (title, keywords) => {
    const analysis = { score: 0, suggestions: [], strengths: [] }
    
    if (!title || title.trim().length === 0) {
      analysis.suggestions.push({ type: 'error', message: 'Add a title', priority: 'high' })
      return analysis
    }
    
    const titleLength = title.length
    
    // Length check (10 points)
    if (titleLength >= 30 && titleLength <= 60) {
      analysis.score += 10
      analysis.strengths.push({ type: 'success', message: 'Title length is optimal (30-60 chars)' })
    } else if (titleLength < 30) {
      analysis.suggestions.push({ type: 'warning', message: `Title too short (${titleLength} chars). Aim for 30-60 characters.`, priority: 'medium' })
    } else {
      analysis.suggestions.push({ type: 'warning', message: `Title too long (${titleLength} chars). Keep it under 60 characters.`, priority: 'medium' })
    }
    
    // Keyword presence (15 points)
    if (keywords.length > 0) {
      const hasKeyword = keywords.some(keyword => 
        title.toLowerCase().includes(keyword.toLowerCase())
      )
      if (hasKeyword) {
        analysis.score += 15
        analysis.strengths.push({ type: 'success', message: 'Title contains target keywords' })
      } else {
        analysis.suggestions.push({ type: 'error', message: 'Include primary keyword in title', priority: 'high' })
      }
    }
    
    return analysis
  }

  const analyzeDescriptionSEO = (description, keywords) => {
    const analysis = { score: 0, suggestions: [], strengths: [] }
    
    if (!description || description.trim().length === 0) {
      analysis.suggestions.push({ type: 'error', message: 'Add a meta description', priority: 'high' })
      return analysis
    }
    
    const descLength = description.length
    
    // Length check (10 points)
    if (descLength >= 120 && descLength <= 160) {
      analysis.score += 10
      analysis.strengths.push({ type: 'success', message: 'Description length is perfect (120-160 chars)' })
    } else if (descLength < 120) {
      analysis.suggestions.push({ type: 'warning', message: `Description too short (${descLength} chars). Aim for 120-160 characters.`, priority: 'medium' })
    } else {
      analysis.suggestions.push({ type: 'warning', message: `Description too long (${descLength} chars). Keep it under 160 characters.`, priority: 'medium' })
    }
    
    // Keyword presence (15 points)
    if (keywords.length > 0) {
      const hasKeyword = keywords.some(keyword => 
        description.toLowerCase().includes(keyword.toLowerCase())
      )
      if (hasKeyword) {
        analysis.score += 15
        analysis.strengths.push({ type: 'success', message: 'Description contains target keywords' })
      } else {
        analysis.suggestions.push({ type: 'error', message: 'Include keywords in description', priority: 'high' })
      }
    }
    
    return analysis
  }

  const analyzeContentSEO = (content, keywords) => {
    const analysis = { score: 0, suggestions: [], strengths: [] }
    
    if (!content || content.trim().length === 0) {
      analysis.suggestions.push({ type: 'error', message: 'Add main content', priority: 'high' })
      return analysis
    }
    
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    
    // Word count check (15 points)
    if (wordCount >= 300) {
      analysis.score += 15
      analysis.strengths.push({ type: 'success', message: `Good content length (${wordCount} words)` })
    } else {
      analysis.suggestions.push({ type: 'warning', message: `Content too short (${wordCount} words). Aim for 300+ words.`, priority: 'medium' })
    }
    
    // Keyword presence (15 points)
    if (keywords.length > 0) {
      const hasKeyword = keywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      )
      if (hasKeyword) {
        analysis.score += 15
        analysis.strengths.push({ type: 'success', message: 'Content contains target keywords' })
      } else {
        analysis.suggestions.push({ type: 'error', message: 'Include keywords in content', priority: 'high' })
      }
    }
    
    return analysis
  }

  const analyzeTechnicalSEO = (data, contentType) => {
    const analysis = { score: 0, suggestions: [], strengths: [] }
    
    // Meta title (5 points)
    if (data.meta_title) {
      analysis.score += 5
      analysis.strengths.push({ type: 'success', message: 'Meta title is set' })
    } else {
      analysis.suggestions.push({ type: 'warning', message: 'Add meta title', priority: 'medium' })
    }
    
    // Meta description (5 points)
    if (data.meta_description) {
      analysis.score += 5
      analysis.strengths.push({ type: 'success', message: 'Meta description is set' })
    } else {
      analysis.suggestions.push({ type: 'warning', message: 'Add meta description', priority: 'medium' })
    }
    
    // URL slug (5 points)
    if (data.slug && data.slug.length > 0) {
      analysis.score += 5
      analysis.strengths.push({ type: 'success', message: 'URL slug is set' })
    } else {
      analysis.suggestions.push({ type: 'warning', message: 'Add SEO-friendly URL slug', priority: 'medium' })
    }
    
    // Content-specific checks (5 points)
    if (contentType === 'university') {
      if (data.location) {
        analysis.score += 5
        analysis.strengths.push({ type: 'success', message: 'Location information added' })
      } else {
        analysis.suggestions.push({ type: 'warning', message: 'Add location information', priority: 'low' })
      }
    } else {
      if (data.category) {
        analysis.score += 5
        analysis.strengths.push({ type: 'success', message: 'Category is set' })
      } else {
        analysis.suggestions.push({ type: 'warning', message: 'Add category', priority: 'low' })
      }
    }
    
    return analysis
  }

  // Comprehensive content analysis
  const analyzePageContent = useMemo(() => {
    const content = currentData.content || currentData.page_content || ''
    const structure = {
      headings: extractHeadings(content),
      images: extractImages(content),
      links: extractLinks(content),
      lists: extractLists(content),
      wordCount: getWordCount(content),
      readability: calculateReadability(content),
      keywordDensity: calculateKeywordDensity(content, selectedKeywords)
    }
    setContentStructure(structure)
    return structure
  }, [currentData, selectedKeywords])

  // Real-time SEO analysis
  const seoAnalysis = useMemo(() => {
    const analysis = {
      score: 0,
      breakdown: {},
      suggestions: [],
      strengths: [],
      pageInsights: analyzePageContent
    }
    
    // Title Analysis (25 points)
    const titleAnalysis = analyzeTitleSEO(currentData.title, selectedKeywords)
    analysis.score += titleAnalysis.score
    analysis.breakdown.title = titleAnalysis
    analysis.suggestions.push(...titleAnalysis.suggestions)
    analysis.strengths.push(...titleAnalysis.strengths)
    
    // Description Analysis (25 points)
    const descAnalysis = analyzeDescriptionSEO(currentData.description || currentData.excerpt, selectedKeywords)
    analysis.score += descAnalysis.score
    analysis.breakdown.description = descAnalysis
    analysis.suggestions.push(...descAnalysis.suggestions)
    analysis.strengths.push(...descAnalysis.strengths)
    
    // Content Analysis (30 points)
    const contentAnalysis = analyzeContentSEO(currentData.content || currentData.page_content, selectedKeywords)
    analysis.score += contentAnalysis.score
    analysis.breakdown.content = contentAnalysis
    analysis.suggestions.push(...contentAnalysis.suggestions)
    analysis.strengths.push(...contentAnalysis.strengths)
    
    // Technical SEO (20 points)
    const technicalAnalysis = analyzeTechnicalSEO(currentData, contentType)
    analysis.score += technicalAnalysis.score
    analysis.breakdown.technical = technicalAnalysis
    analysis.suggestions.push(...technicalAnalysis.suggestions)
    analysis.strengths.push(...technicalAnalysis.strengths)
    
    analysis.score = Math.min(analysis.score, 100)
    return analysis
  }, [currentData, selectedKeywords, contentType])

  // Auto-extract keywords from content
  const extractKeywordsFromContent = () => {
    const text = [
      currentData.title || '',
      currentData.description || currentData.excerpt || '',
      currentData.name || '',
      ...(currentData.tags || []),
      ...(currentData.programs || [])
    ].join(' ').toLowerCase()
    
    const educationKeywords = [
      'university', 'college', 'education', 'study', 'admission', 'degree',
      'bachelor', 'master', 'scholarship', 'visa', 'abroad', 'international',
      'course', 'program', 'student', 'academic', 'research', 'ielts', 'toefl'
    ]
    
    return educationKeywords.filter(keyword => text.includes(keyword))
  }


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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-6">
      {/* Header with live score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FiTarget className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Real-Time SEO</h3>
              <p className="text-blue-100 text-xs">Live optimization analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold text-white`}>
              {seoAnalysis.score}/100
            </div>
            <div className="text-xs text-blue-100">
              {seoAnalysis.score >= 80 ? 'Excellent' : 
               seoAnalysis.score >= 60 ? 'Good' : 
               seoAnalysis.score >= 40 ? 'Fair' : 'Poor'}
            </div>
          </div>
        </div>
        
        {/* Live progress bar */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(seoAnalysis.score)} transition-all duration-500`}
            style={{ width: `${seoAnalysis.score}%` }}
          />
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Live Score Breakdown */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(seoAnalysis.breakdown).map(([key, analysis]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 capitalize">
                  {key}
                </span>
                <span className={`text-sm font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.score)} transition-all duration-300`}
                  style={{ width: `${(analysis.score / 25) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live Suggestions */}
        {seoAnalysis.suggestions.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <FiAlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-800">
                {seoAnalysis.suggestions.length} Issues
              </span>
            </div>
            <ul className="space-y-1">
              {seoAnalysis.suggestions.slice(0, 4).map((suggestion, index) => (
                <li key={index} className="text-xs text-red-700 flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    suggestion.priority === 'high' ? 'bg-red-500' :
                    suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <span>{suggestion.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths */}
        {seoAnalysis.strengths.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <FiThumbsUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                {seoAnalysis.strengths.length} Strengths
              </span>
            </div>
            <ul className="space-y-1">
              {seoAnalysis.strengths.slice(0, 3).map((strength, index) => (
                <li key={index} className="text-xs text-green-700 flex items-start space-x-2">
                  <FiCheck className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{strength.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Content Insights - Shows comprehensive page reading */}
        {contentStructure.wordCount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <FiFileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Content Analysis</span>
            </div>
            <div className="space-y-1 text-xs text-purple-700">
              <div className="flex justify-between">
                <span>Words:</span>
                <span className="font-medium">{contentStructure.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Headings:</span>
                <span className="font-medium">{contentStructure.headings?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Images:</span>
                <span className="font-medium">{contentStructure.images?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Links:</span>
                <span className="font-medium">{contentStructure.links?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Lists:</span>
                <span className="font-medium">{contentStructure.lists?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Readability:</span>
                <span className={`font-medium ${
                  contentStructure.readability >= 80 ? 'text-green-600' :
                  contentStructure.readability >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {contentStructure.readability}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <FiInfo className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">Live Tips</span>
          </div>
          <ul className="space-y-1 text-xs text-yellow-700">
            <li>• Score updates as you type</li>
            <li>• Keep titles 30-60 characters</li>
            <li>• Include keywords naturally</li>
            <li>• Write 120-160 char descriptions</li>
            <li>• Aim for 300+ words content</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RealTimeSEOTool
