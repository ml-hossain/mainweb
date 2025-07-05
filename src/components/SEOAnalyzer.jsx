import React, { useState, useEffect, useRef } from 'react'
import { FiSearch, FiTarget, FiTrendingUp, FiUsers, FiGlobe, FiEdit, FiRefreshCw, FiCheck, FiX, FiAlertCircle, FiZap, FiEye, FiCopy, FiDownload, FiUpload, FiPlus, FiMinus, FiFileText, FiLink, FiActivity, FiStar } from 'react-icons/fi'

const SEOAnalyzer = ({ content = '', title = '', description = '', onContentUpdate }) => {
  const [seoScore, setSeoScore] = useState(0)
  const [analysis, setAnalysis] = useState({})
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [competitors, setCompetitors] = useState([])
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analysis')
  const scrollRef = useRef(null)

  // SEO Analysis Functions
  const analyzeSEO = () => {
    const analysis = {
      wordCount: getWordCount(content),
      readabilityScore: calculateReadability(content),
      keywordDensity: calculateKeywordDensity(content, keywords),
      headingStructure: analyzeHeadings(content),
      metaOptimization: analyzeMetaTags(title, description),
      contentStructure: analyzeContentStructure(content),
      suggestions: []
    }

    // Calculate overall SEO score
    let score = 0
    
    // Word count (10 points)
    if (analysis.wordCount >= 300) score += 10
    else if (analysis.wordCount >= 150) score += 5
    
    // Readability (20 points)
    if (analysis.readabilityScore >= 80) score += 20
    else if (analysis.readabilityScore >= 60) score += 15
    else if (analysis.readabilityScore >= 40) score += 10
    
    // Keywords (20 points)
    if (keywords.length >= 3) score += 10
    if (analysis.keywordDensity > 0 && analysis.keywordDensity <= 3) score += 10
    
    // Headings (15 points)
    if (analysis.headingStructure.h1 > 0) score += 5
    if (analysis.headingStructure.h2 >= 2) score += 5
    if (analysis.headingStructure.h3 >= 1) score += 5
    
    // Meta tags (25 points)
    if (title && title.length >= 30 && title.length <= 60) score += 15
    if (description && description.length >= 120 && description.length <= 160) score += 10
    
    // Content structure (10 points)
    if (analysis.contentStructure.paragraphs >= 3) score += 5
    if (analysis.contentStructure.lists > 0) score += 3
    if (analysis.contentStructure.links > 0) score += 2

    // Generate suggestions
    if (analysis.wordCount < 300) {
      analysis.suggestions.push({
        type: 'warning',
        message: 'Content is too short. Aim for at least 300 words for better SEO.',
        action: 'expand_content'
      })
    }
    
    if (analysis.readabilityScore < 60) {
      analysis.suggestions.push({
        type: 'error',
        message: 'Content is difficult to read. Use shorter sentences and simpler words.',
        action: 'improve_readability'
      })
    }
    
    if (keywords.length === 0) {
      analysis.suggestions.push({
        type: 'warning',
        message: 'No target keywords set. Add relevant keywords for better optimization.',
        action: 'add_keywords'
      })
    }
    
    if (analysis.headingStructure.h1 === 0) {
      analysis.suggestions.push({
        type: 'error',
        message: 'Missing H1 tag. Add a main heading to your content.',
        action: 'add_h1'
      })
    }

    setSeoScore(score)
    setAnalysis(analysis)
  }

  // Helper functions for SEO analysis
  const getWordCount = (text) => {
    return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  }

  const calculateReadability = (text) => {
    const plainText = text.replace(/<[^>]*>/g, '')
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = plainText.split(/\s+/).filter(w => w.length > 0)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = words.reduce((total, word) => total + countSyllables(word), 0) / words.length
    
    // Simplified Flesch Reading Ease formula
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, readabilityScore))
  }

  const countSyllables = (word) => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '')
    const matches = word.match(/[aeiouy]{1,2}/g)
    return matches ? matches.length : 1
  }

  const calculateKeywordDensity = (text, keywords) => {
    if (keywords.length === 0) return 0
    const plainText = text.replace(/<[^>]*>/g, '').toLowerCase()
    const words = plainText.split(/\s+/)
    const keywordMatches = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi')
      return count + (plainText.match(regex) || []).length
    }, 0)
    return words.length > 0 ? (keywordMatches / words.length) * 100 : 0
  }

  const analyzeHeadings = (text) => {
    const h1Count = (text.match(/<h1[^>]*>/gi) || []).length
    const h2Count = (text.match(/<h2[^>]*>/gi) || []).length
    const h3Count = (text.match(/<h3[^>]*>/gi) || []).length
    return { h1: h1Count, h2: h2Count, h3: h3Count }
  }

  const analyzeMetaTags = (title, description) => {
    return {
      titleLength: title ? title.length : 0,
      descriptionLength: description ? description.length : 0,
      titleOptimal: title && title.length >= 30 && title.length <= 60,
      descriptionOptimal: description && description.length >= 120 && description.length <= 160
    }
  }

  const analyzeContentStructure = (text) => {
    const paragraphs = (text.match(/<p[^>]*>/gi) || []).length
    const lists = (text.match(/<[uo]l[^>]*>/gi) || []).length
    const links = (text.match(/<a[^>]*>/gi) || []).length
    return { paragraphs, lists, links }
  }

  // Content Generation Functions
  const generateContent = async (topic, targetKeywords) => {
    setLoading(true)
    try {
      // Simulate API call to content generation service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedText = `
        <h1>${topic} - Complete Guide</h1>
        
        <p>When considering ${topic}, students and families need comprehensive information to make informed decisions. This guide provides essential details about opportunities, requirements, and benefits.</p>
        
        <h2>Why Choose ${topic}?</h2>
        <p>There are numerous advantages to choosing ${topic} for your educational journey. The reputation, quality of education, and future opportunities make it an excellent choice for ambitious students.</p>
        
        <ul>
          <li>World-class education standards</li>
          <li>Internationally recognized degrees</li>
          <li>Diverse learning environment</li>
          <li>Strong career prospects</li>
        </ul>
        
        <h2>Application Requirements</h2>
        <p>Understanding the application process is crucial for success. Each institution has specific requirements that must be met to ensure a smooth application process.</p>
        
        <h3>Academic Requirements</h3>
        <p>Students must demonstrate strong academic performance through their previous educational achievements. This includes transcripts, test scores, and academic references.</p>
        
        <h3>Language Proficiency</h3>
        <p>International students need to prove their English language skills through standardized tests. This ensures they can succeed in an English-speaking academic environment.</p>
        
        <h2>Financial Planning</h2>
        <p>Proper financial planning is essential for a successful educational experience. Understanding costs and available funding options helps families prepare effectively.</p>
        
        <p>The investment in quality education pays dividends throughout your career. Many graduates find excellent opportunities and achieve their professional goals.</p>
      `
      
      setGeneratedContent(generatedText)
    } catch (error) {
      console.error('Content generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTitles = async (topic, keywords) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const titles = [
        `${topic}: Complete Guide for International Students 2024`,
        `Why Choose ${topic}? Top Benefits and Opportunities`,
        `${topic} Application Guide: Requirements and Process`,
        `Study at ${topic}: Everything You Need to Know`,
        `${topic} vs Competitors: Which is Best for You?`,
        `${topic} Admission Requirements and Success Tips`
      ]
      
      setGeneratedTitles(titles)
    } catch (error) {
      console.error('Title generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Competitor Analysis
  const analyzeCompetitors = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const competitorData = [
        {
          name: "EduConsult BD",
          type: "Agency",
          ranking: 1,
          domain: "educonsultbd.com",
          keywords: ["study abroad", "university admission", "student visa"],
          contentScore: 85,
          gap: "Missing video content"
        },
        {
          name: "INTI International University",
          type: "University",
          ranking: 2,
          domain: "inti.edu.my",
          keywords: ["engineering", "business", "IT programs"],
          contentScore: 92,
          gap: "Limited scholarship information"
        },
        {
          name: "Global Education Partners",
          type: "Agency",
          ranking: 3,
          domain: "globaledu.com.bd",
          keywords: ["malaysia education", "affordable tuition"],
          contentScore: 78,
          gap: "Weak social proof"
        },
        {
          name: "Study Malaysia Hub",
          type: "Portal",
          ranking: 4,
          domain: "studymalaysia.gov.my",
          keywords: ["official information", "government portal"],
          contentScore: 88,
          gap: "Complex navigation"
        }
      ]
      
      setCompetitors(competitorData)
    } catch (error) {
      console.error('Competitor analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Event handlers
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const applyGeneratedContent = () => {
    if (onContentUpdate && generatedContent) {
      onContentUpdate(generatedContent)
      setGeneratedContent('')
    }
  }

  const applyTitle = (title) => {
    // This would integrate with the parent component to update the title field
    console.log('Applying title:', title)
  }

  // Effects
  useEffect(() => {
    if (content || title || description) {
      analyzeSEO()
    }
  }, [content, title, description, keywords])

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            SEO Analyzer
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(seoScore)} ${getScoreColor(seoScore)}`}>
            {seoScore}/100
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'analysis', label: 'Analysis', icon: FiTarget },
            { id: 'keywords', label: 'Keywords', icon: FiSearch },
            { id: 'generate', label: 'Generate', icon: FiZap },
            { id: 'competitors', label: 'Competitors', icon: FiUsers }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-3 h-3 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {/* SEO Score Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">SEO Score Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Content Length</span>
                  <span className={analysis.wordCount >= 300 ? 'text-green-600' : 'text-red-600'}>
                    {analysis.wordCount} words
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Readability</span>
                  <span className={analysis.readabilityScore >= 60 ? 'text-green-600' : 'text-red-600'}>
                    {Math.round(analysis.readabilityScore)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Keyword Usage</span>
                  <span className={keywords.length > 0 ? 'text-green-600' : 'text-red-600'}>
                    {keywords.length} keywords
                  </span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Improvement Suggestions</h4>
              <div className="space-y-2">
                {analysis.suggestions?.map((suggestion, index) => (
                  <div key={index} className={`flex items-start p-3 rounded-lg ${
                    suggestion.type === 'error' ? 'bg-red-50 border border-red-200' :
                    suggestion.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    {suggestion.type === 'error' ? (
                      <FiX className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    ) : suggestion.type === 'warning' ? (
                      <FiAlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <FiCheck className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <p className="text-sm text-gray-700">{suggestion.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Target Keywords</h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="Add keyword..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={addKeyword}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {keywords.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Keyword Density</h5>
                <p className="text-sm text-gray-600">
                  Current density: {analysis.keywordDensity?.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Optimal range: 1-3%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Content Generation</h4>
              <button
                onClick={() => generateContent("INTI University", keywords)}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiZap className="w-4 h-4 mr-2" />
                )}
                Generate SEO Content
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Title Generator</h4>
              <button
                onClick={() => generateTitles("INTI University", keywords)}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiEdit className="w-4 h-4 mr-2" />
                )}
                Generate Titles
              </button>
            </div>

            {generatedTitles.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Generated Titles</h5>
                <div className="space-y-2">
                  {generatedTitles.map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex-1 pr-2">{title}</span>
                      <button
                        onClick={() => applyTitle(title)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedContent && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Generated Content</h5>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div 
                    className="text-sm text-gray-700 max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedContent.substring(0, 500) + '...' }}
                  />
                  <button
                    onClick={applyGeneratedContent}
                    className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply to Editor
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Competitor Analysis</h4>
              <button
                onClick={analyzeCompetitors}
                disabled={loading}
                className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <FiRefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <FiRefreshCw className="w-3 h-3 mr-1" />
                )}
                Analyze
              </button>
            </div>

            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                      <p className="text-xs text-gray-500">{competitor.type} • Rank #{competitor.ranking}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {competitor.contentScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Gap: {competitor.gap}</p>
                  <div className="flex flex-wrap gap-1">
                    {competitor.keywords.slice(0, 3).map((keyword, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SEOAnalyzer
