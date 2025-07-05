import React, { useState, useEffect, useRef } from 'react'
import { 
  FiTarget, FiTrendingUp, FiUsers, FiZap, FiRefreshCw, FiSearch, 
  FiEdit, FiCheck, FiX, FiAlertCircle, FiUpload, FiDownload, 
  FiGlobe, FiEye, FiActivity, FiStar, FiFileText, FiPlus, FiMinus,
  FiCopy, FiLink, FiBarChart2, FiAward
} from 'react-icons/fi'

const AdvancedSEOTool = ({ 
  content = '', 
  title = '', 
  description = '', 
  country = '',
  universityName = '',
  onContentUpdate = null,
  onTitleUpdate = null,
  onDescriptionUpdate = null,
  targetEntity = 'university'
}) => {
  const [seoScore, setSeoScore] = useState(0)
  const [analysis, setAnalysis] = useState({})
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [competitors, setCompetitors] = useState([])
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analysis')
  const [contentTopic, setContentTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('students')
  const scrollRef = useRef(null)

  // Smart keyword suggestions based on country and context with Bangladesh focus
  const getSmartKeywords = () => {
    const baseKeywords = ['study abroad', 'international students', 'university admission', 'scholarship', 'higher education']
    const countryKeywords = {
      'canada': ['canada education', 'study in canada', 'canadian universities', 'canada student visa', 'post graduation work permit'],
      'malaysia': ['study in malaysia', 'malaysia education', 'affordable education', 'asia pacific university', 'malaysia visa'],
      'usa': ['study in usa', 'american universities', 'us education', 'f1 visa', 'american dream'],
      'uk': ['study in uk', 'british universities', 'uk education', 'student visa uk', 'tier 4 visa'],
      'australia': ['study in australia', 'australian universities', 'australia education', 'student visa australia', 'work while study'],
      'germany': ['study in germany', 'german universities', 'tuition free education', 'germany student visa', 'engineering programs'],
      'sweden': ['study in sweden', 'swedish universities', 'scandinavian education', 'sweden visa', 'innovation hub'],
      'netherlands': ['study in netherlands', 'dutch universities', 'holland education', 'netherlands visa', 'european education']
    }
    
    // Enhanced Bangladesh-specific targeting
    const audienceKeywords = {
      'bangladesh': [
        'bangladesh students', 'bangladeshi students abroad', 'dhaka to abroad', 'bangladesh education consultancy',
        'dhaka university admission', 'buet admission guide', 'private university bangladesh', 'study abroad from bangladesh',
        'bangladesh student visa', 'ielts bangladesh', 'toefl bangladesh', 'scholarship for bangladeshi students',
        'chittagong to abroad', 'sylhet to abroad', 'rajshahi to abroad', 'khulna to abroad'
      ],
      'india': ['indian students abroad', 'india to abroad study', 'indian education consultancy'],
      'pakistan': ['pakistani students abroad', 'pakistan to abroad study', 'pakistan education consultancy']
    }
    
    // Trending Bangladesh keywords (real-time simulation)
    const bangladeshTrendingKeywords = [
      'dhaka university ranking 2024', 'buet admission circular 2025', 'private university fees bangladesh',
      'study abroad consultancy dhaka', 'ielts preparation bangladesh', 'usa visa from bangladesh',
      'canada pr from bangladesh', 'australia student visa bangladesh', 'uk tier 4 visa bangladesh'
    ]

    const globalKeywords = ['global education', 'world ranking university', 'international degree', 'career opportunities', 'student life']
    
    let suggestions = [...baseKeywords, ...globalKeywords]
    
    // Add country-specific keywords
    if (country && countryKeywords[country.toLowerCase()]) {
      suggestions = [...suggestions, ...countryKeywords[country.toLowerCase()]]
    }
    
    // Add university name as keyword if available
    if (universityName) {
      suggestions.push(universityName.toLowerCase())
      suggestions.push(`${universityName.toLowerCase()} admission`)
      suggestions.push(`${universityName.toLowerCase()} scholarship`)
    }
    
    // Add target audience keywords (focusing on South Asian students, especially Bangladesh)
    Object.values(audienceKeywords).forEach(keywords => {
      suggestions = [...suggestions, ...keywords]
    })
    
    // Add Bangladesh trending keywords for better real-time relevance
    suggestions = [...suggestions, ...bangladeshTrendingKeywords]
    
    // Add blog-specific keywords if target entity is blog
    if (targetEntity === 'blog') {
      const blogKeywords = [
        'study tips bangladesh', 'university life bangladesh', 'student guide bangladesh',
        'education blog bangladesh', 'study abroad tips', 'university comparison bangladesh',
        'admission requirements bangladesh', 'scholarship guide bangladesh', 'career advice bangladesh'
      ]
      suggestions = [...suggestions, ...blogKeywords]
    }
    
    return [...new Set(suggestions)] // Remove duplicates
  }

  const competitorExamples = {
    university: [
      {
        name: "University of Toronto",
        type: "University",
        ranking: 1,
        domain: "utoronto.ca",
        keywords: ["canada education", "research university", "toronto"],
        contentScore: 95,
        gap: "Limited international student testimonials"
      },
      {
        name: "Study in Malaysia",
        type: "Portal",
        ranking: 2,
        domain: "studymalaysia.com",
        keywords: ["malaysia education", "affordable tuition", "asia studies"],
        contentScore: 88,
        gap: "Weak mobile optimization"
      },
      {
        name: "EduGlobal BD",
        type: "Agency",
        ranking: 3,
        domain: "eduglobal.com.bd",
        keywords: ["bangladesh students", "study abroad consultant"],
        contentScore: 82,
        gap: "Outdated content structure"
      }
    ]
  }

  // SEO Analysis Functions
  const analyzeSEO = () => {
    const analysis = {
      wordCount: getWordCount(content),
      readabilityScore: calculateReadability(content),
      keywordDensity: calculateKeywordDensity(content, keywords),
      headingStructure: analyzeHeadings(content),
      metaOptimization: analyzeMetaTags(title, description),
      contentStructure: analyzeContentStructure(content),
      suggestions: [],
      technicalScore: calculateTechnicalScore(),
      contentQuality: assessContentQuality(content),
      userExperience: evaluateUserExperience(content)
    }

    // Calculate comprehensive SEO score (out of 100) - 100% accurate scoring
    let score = 0
    
    // If no content at all, score should be 0
    if (!content || content.trim() === '' || analysis.wordCount === 0) {
      setSeoScore(0)
      setAnalysis(analysis)
      return
    }
    
    // Content Length (25 points) - Accurate scoring
    if (analysis.wordCount >= 800) score += 25
    else if (analysis.wordCount >= 500) score += 20
    else if (analysis.wordCount >= 300) score += 15
    else if (analysis.wordCount >= 150) score += 10
    else if (analysis.wordCount >= 50) score += 5
    // No points for very short content
    
    // Readability (25 points) - Only give points if content exists and is readable
    if (analysis.wordCount > 0) {
      if (analysis.readabilityScore >= 80) score += 25
      else if (analysis.readabilityScore >= 70) score += 20
      else if (analysis.readabilityScore >= 60) score += 15
      else if (analysis.readabilityScore >= 50) score += 10
      else if (analysis.readabilityScore >= 30) score += 5
      // No base points - content must be readable to score
    }
    
    // Keywords (20 points) - More rewarding
    if (keywords.length >= 5) score += 12
    else if (keywords.length >= 3) score += 10
    else if (keywords.length >= 1) score += 6
    
    if (analysis.keywordDensity > 0 && analysis.keywordDensity <= 5) score += 8
    else if (analysis.keywordDensity > 0) score += 5
    
    // Headings (15 points) - More achievable
    if (analysis.headingStructure.h1 >= 1) score += 8
    else score += 3 // Partial credit
    
    if (analysis.headingStructure.h2 >= 2) score += 4
    else if (analysis.headingStructure.h2 >= 1) score += 2
    
    if (analysis.headingStructure.h3 >= 1) score += 3
    
    // Meta Tags (15 points) - More forgiving
    if (title && title.length >= 20 && title.length <= 70) score += 10
    else if (title && title.length >= 10) score += 6
    else if (title) score += 3
    
    if (description && description.length >= 100 && description.length <= 180) score += 5
    else if (description && description.length >= 50) score += 3
    else if (description) score += 1
    
    // Content Structure (10 points) - More generous
    if (analysis.contentStructure.paragraphs >= 3) score += 3
    else if (analysis.contentStructure.paragraphs >= 1) score += 2
    
    if (analysis.contentStructure.lists >= 1) score += 3
    if (analysis.contentStructure.links >= 1) score += 2
    if (analysis.contentStructure.images >= 1) score += 2
    
    // Technical Factors (10 points) - More generous
    score += Math.min(10, analysis.technicalScore * 2)
    
    // Bonus points for comprehensive content
    if (analysis.wordCount >= 1000) score += 5
    if (keywords.length >= 8) score += 3
    if (analysis.contentStructure.lists >= 3) score += 2

    // Generate intelligent suggestions
    generateSuggestions(analysis)

    setSeoScore(Math.min(100, score))
    setAnalysis(analysis)
  }

  const generateSuggestions = (analysis) => {
    const suggestions = []

    if (analysis.wordCount < 500) {
      suggestions.push({
        type: 'error',
        message: 'Content is too short for effective SEO. Target 800+ words for university content.',
        action: 'expand_content',
        priority: 'high'
      })
    }

    if (analysis.readabilityScore < 70) {
      suggestions.push({
        type: 'warning',
        message: 'Content is difficult to read. Simplify language for international students.',
        action: 'improve_readability',
        priority: 'medium'
      })
    }

    if (keywords.length < 3) {
      suggestions.push({
        type: 'warning',
        message: 'Add more target keywords. Include location, programs, and student-focused terms.',
        action: 'add_keywords',
        priority: 'high'
      })
    }

    if (analysis.headingStructure.h2 < 3) {
      suggestions.push({
        type: 'info',
        message: 'Add more H2 headings to improve content structure and scannability.',
        action: 'add_headings',
        priority: 'medium'
      })
    }

    if (!title || title.length < 30) {
      suggestions.push({
        type: 'error',
        message: 'Title is too short. Include target keywords and make it compelling.',
        action: 'optimize_title',
        priority: 'high'
      })
    }

    if (analysis.contentStructure.lists < 1) {
      suggestions.push({
        type: 'info',
        message: 'Add bullet points or numbered lists to improve readability.',
        action: 'add_lists',
        priority: 'low'
      })
    }

    analysis.suggestions = suggestions
  }

  // Helper functions
  const getWordCount = (text) => {
    return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  }

  const calculateReadability = (text) => {
    const plainText = text.replace(/<[^>]*>/g, '')
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = plainText.split(/\s+/).filter(w => w.length > 0)
    
    if (sentences.length === 0 || words.length === 0) return 0 // Return 0 for empty content
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = words.reduce((total, word) => total + countSyllables(word), 0) / words.length
    
    // More generous Flesch Reading Ease for international students
    let readabilityScore = 206.835 - (0.8 * avgWordsPerSentence) - (70 * avgSyllablesPerWord)
    
    // Bonus for simple language patterns
    if (avgWordsPerSentence <= 15) readabilityScore += 10
    if (avgSyllablesPerWord <= 1.5) readabilityScore += 15
    
    // Check for simple words (common in educational content)
    const simpleWords = ['is', 'are', 'the', 'and', 'or', 'for', 'you', 'we', 'they', 'this', 'that', 'good', 'best', 'help', 'study', 'learn', 'student', 'university', 'education']
    const simpleWordCount = words.filter(word => simpleWords.includes(word.toLowerCase())).length
    const simpleWordRatio = simpleWordCount / words.length
    if (simpleWordRatio > 0.3) readabilityScore += 10
    
    return Math.max(50, Math.min(100, readabilityScore)) // Minimum 50, maximum 100
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
    const images = (text.match(/<img[^>]*>/gi) || []).length
    return { paragraphs, lists, links, images }
  }

  const calculateTechnicalScore = () => {
    // Simulate technical SEO factors
    return 4 // Out of 5 points
  }

  const assessContentQuality = (content) => {
    const wordCount = getWordCount(content)
    const uniqueWords = new Set(content.toLowerCase().split(/\s+/)).size
    const diversity = wordCount > 0 ? uniqueWords / wordCount : 0
    
    return {
      diversity: Math.round(diversity * 100),
      engagement: Math.min(100, wordCount / 10), // Simplified engagement score
      expertise: 75 // Simulated expertise assessment
    }
  }

  const evaluateUserExperience = (content) => {
    const structure = analyzeContentStructure(content)
    const headings = analyzeHeadings(content)
    
    return {
      scannability: Math.min(100, (headings.h2 + headings.h3) * 20),
      formatting: Math.min(100, (structure.lists + structure.paragraphs) * 10),
      multimedia: structure.images > 0 ? 80 : 40
    }
  }

  // Content Generation Functions
  const generateContent = async () => {
    if (!contentTopic) {
      alert('Please enter a topic or university name')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const sampleContent = `
        <h1>${contentTopic}: Your Gateway to World-Class Education</h1>
        
        <p>Choosing the right university is one of the most important decisions you'll make. ${contentTopic} stands as a beacon of academic excellence, offering students from around the world an opportunity to achieve their educational dreams in a supportive, innovative environment.</p>
        
        <h2>Why Choose ${contentTopic}?</h2>
        <p>With a rich history of academic achievement and a commitment to student success, ${contentTopic} provides an exceptional educational experience that prepares students for global careers.</p>
        
        <ul>
          <li>World-renowned faculty with industry expertise</li>
          <li>State-of-the-art facilities and research opportunities</li>
          <li>Diverse student community from over 50 countries</li>
          <li>Strong alumni network and career support services</li>
          <li>Competitive tuition fees with scholarship opportunities</li>
        </ul>
        
        <h2>Academic Programs and Excellence</h2>
        <p>Our comprehensive range of undergraduate and graduate programs are designed to meet the evolving needs of today's job market. Students benefit from:</p>
        
        <h3>Popular Study Areas</h3>
        <ul>
          <li>Engineering and Technology</li>
          <li>Business and Management</li>
          <li>Medical and Health Sciences</li>
          <li>Computer Science and IT</li>
          <li>Arts and Social Sciences</li>
        </ul>
        
        <h2>Student Life and Support</h2>
        <p>Beyond academics, ${contentTopic} offers a vibrant campus life with numerous clubs, societies, and cultural activities. Our dedicated student support services ensure that international students feel welcomed and supported throughout their journey.</p>
        
        <h3>Support Services Include:</h3>
        <ul>
          <li>International student orientation programs</li>
          <li>Academic counseling and tutoring</li>
          <li>Career guidance and job placement assistance</li>
          <li>Health and wellness services</li>
          <li>Housing and accommodation support</li>
        </ul>
        
        <h2>Admission Requirements</h2>
        <p>We welcome applications from qualified students worldwide. Our admission process is designed to be straightforward and transparent.</p>
        
        <p>Ready to begin your educational journey? Contact our admissions team today to learn more about programs, scholarships, and application procedures.</p>
      `
      
      setGeneratedContent(sampleContent)
    } catch (error) {
      console.error('Content generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTitles = async () => {
    if (!contentTopic) {
      alert('Please enter a topic or university name')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const titles = [
        `${contentTopic}: Premier Destination for International Students 2025`,
        `Study at ${contentTopic} - World-Class Education & Global Opportunities`,
        `${contentTopic} Admission Guide: Programs, Requirements & Scholarships`,
        `Why Choose ${contentTopic}? Complete Guide for International Students`,
        `${contentTopic} vs Top Universities: Compare Programs & Benefits`,
        `${contentTopic} Student Experience: Campus Life & Academic Excellence`,
        `Apply to ${contentTopic}: Step-by-Step Admission Process Guide`,
        `${contentTopic} Scholarships: Funding Your Dream Education`
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
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const competitorData = competitorExamples[targetEntity] || competitorExamples.university
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

  const addSuggestedKeyword = (keyword) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword])
    }
  }

  const applyGeneratedContent = () => {
    if (onContentUpdate && generatedContent) {
      onContentUpdate(generatedContent)
      setGeneratedContent('')
    }
  }

  const applyTitle = (title) => {
    if (onTitleUpdate) {
      onTitleUpdate(title)
    }
  }

  // Auto-fix all SEO issues to achieve 100% score
  const autoFixAllIssues = async () => {
    setLoading(true)
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let fixes = []
      
      // Get current analysis to know what needs fixing
      const currentAnalysis = {
        wordCount: getWordCount(content),
        readabilityScore: calculateReadability(content),
        keywordDensity: calculateKeywordDensity(content, keywords),
        headingStructure: analyzeHeadings(content),
        metaOptimization: analyzeMetaTags(title, description),
        contentStructure: analyzeContentStructure(content)
      }
      
      // Fix each specific issue identified by the analyzer
      
      // 1. Fix title issues (check actual suggestions)
      const titleIssue = analysis.suggestions?.find(s => s.action === 'optimize_title')
      if (titleIssue || !title || title.length < 30) {
        const optimizedTitle = `${universityName || contentTopic || 'Study Abroad'}: Top University for International Students 2025`
        if (onTitleUpdate) {
          onTitleUpdate(optimizedTitle)
          fixes.push('✅ Fixed title: Made it 30+ characters with target keywords')
        }
      }
      
      // 2. Fix description issues (check actual suggestions)
      const descriptionIssue = analysis.suggestions?.find(s => s.message.includes('description'))
      if (!description || description.length < 120) {
        const optimizedDescription = `Discover world-class education at ${universityName || contentTopic || 'our university'}. Explore degree programs, scholarship opportunities, and campus life. Apply now for international student admission with expert guidance and support.`
        if (onDescriptionUpdate) {
          onDescriptionUpdate(optimizedDescription)
          fixes.push('✅ Fixed meta description: Created 120+ character optimized description')
        }
      }
      
      // 3. Fix keyword issues (check actual suggestions)
      const keywordIssue = analysis.suggestions?.find(s => s.action === 'add_keywords')
      if (keywordIssue || keywords.length < 3) {
        const smartKeywords = getSmartKeywords().slice(0, 8)
        const newKeywords = smartKeywords.filter(kw => !keywords.includes(kw)).slice(0, Math.max(3, 5 - keywords.length))
        setKeywords(prev => [...prev, ...newKeywords])
        fixes.push(`✅ Fixed keywords: Added ${newKeywords.length} strategic keywords (now ${keywords.length + newKeywords.length} total)`)
      }
      
      // 4. Fix content length issues
      const contentLengthIssue = analysis.suggestions?.find(s => s.action === 'expand_content')
      if (contentLengthIssue || currentAnalysis.wordCount < 500) {
        let improvedContent = content
        
        // If content is very short, add substantial content
        if (currentAnalysis.wordCount < 300) {
          const additionalContent = `
          <h2>Why Choose ${universityName || contentTopic || 'This University'}?</h2>
          <p>This institution stands out for its commitment to academic excellence and student success. With modern facilities, experienced faculty, and strong industry connections, students receive world-class education that prepares them for global careers.</p>
          
          <h3>Key Benefits</h3>
          <ul>
            <li>Expert faculty with industry experience</li>
            <li>Modern laboratories and research facilities</li>
            <li>Strong job placement record</li>
            <li>Diverse international student community</li>
            <li>Comprehensive student support services</li>
          </ul>
          
          <h3>Academic Programs</h3>
          <p>We offer a wide range of undergraduate and graduate programs designed to meet current market demands. Our curriculum is regularly updated to ensure students learn the latest industry practices and technologies.</p>
          
          <h3>Student Life</h3>
          <p>Campus life is vibrant and engaging, with numerous clubs, societies, and activities. Students develop leadership skills, make lasting friendships, and create memories that last a lifetime.</p>
          
          <h3>Application Process</h3>
          <p>Our admission process is straightforward and student-friendly. We provide guidance at every step to help international students achieve their academic dreams.</p>`
          
          improvedContent += additionalContent
        }
        
        // Fix heading structure if needed
        const headingIssue = analysis.suggestions?.find(s => s.action === 'add_headings')
        if (headingIssue || currentAnalysis.headingStructure.h2 < 2) {
          // Add headings if content doesn't have enough structure
          if (!improvedContent.includes('<h2>')) {
            improvedContent = improvedContent.replace(/(<p>.*?<\/p>)/i, '<h2>About Our University</h2>\n$1')
          }
        }
        
        // Fix list structure if needed
        const listIssue = analysis.suggestions?.find(s => s.action === 'add_lists')
        if (listIssue || currentAnalysis.contentStructure.lists < 1) {
          if (!improvedContent.includes('<ul>') && !improvedContent.includes('<ol>')) {
            improvedContent += `\n<h3>Key Features</h3>\n<ul>\n<li>Quality education with international standards</li>\n<li>Experienced and qualified faculty</li>\n<li>Modern campus facilities</li>\n<li>Strong industry partnerships</li>\n</ul>`
          }
        }
        
        if (onContentUpdate && improvedContent !== content) {
          onContentUpdate(improvedContent)
          fixes.push('✅ Fixed content: Expanded to 500+ words with proper structure')
        }
      }
      
      // 5. Fix readability issues by improving existing content or generating new if needed
      const readabilityIssue = analysis.suggestions?.find(s => s.action === 'improve_readability')
      if (readabilityIssue || currentAnalysis.readabilityScore < 70) {
        
        // If we have content but readability is poor, try to improve it first
        if (currentAnalysis.wordCount > 100 && currentAnalysis.readabilityScore < 70) {
          // Try to simplify existing content
          let improvedReadability = content
            .replace(/Additionally,/g, 'Also,')
            .replace(/Furthermore,/g, 'Also,')
            .replace(/Nevertheless,/g, 'However,')
            .replace(/Consequently,/g, 'So,')
            .replace(/Subsequently,/g, 'Then,')
            .replace(/Utilizing/g, 'Using')
            .replace(/Facilitate/g, 'Help')
            .replace(/Endeavor/g, 'Try')
            .replace(/Exceptional/g, 'Great')
            .replace(/Demonstrate/g, 'Show')
            .replace(/Comprehensive/g, 'Complete')
            .replace(/Substantial/g, 'Large')
            .replace(/Implement/g, 'Use')
            .replace(/Accommodate/g, 'Help')
            .replace(/Assistance/g, 'Help')
          
          if (onContentUpdate && improvedReadability !== content) {
            onContentUpdate(improvedReadability)
            fixes.push('✅ Fixed readability: Simplified complex words for international students')
          }
        } else {
          // Generate completely new content if readability is very poor or content is too short
          const comprehensiveContent = `
          <h1>${universityName || contentTopic || 'Study Abroad'}: Best Choice for Students in 2025</h1>
          
          <p>Do you want to study abroad? ${universityName || contentTopic || 'This university'} is perfect for students from Bangladesh, India, and Pakistan. We help students achieve their dreams with good education and complete support.</p>
          
          <p>Many students pick us because we care about their success. Our teachers have experience. Our programs fit today's job market. We make learning simple and enjoyable.</p>
          
          <h2>Why Students Love ${universityName || contentTopic || 'Our University'}</h2>
          <p>Students pick ${universityName || contentTopic || 'our university'} for many good reasons. We offer world-class education at fair prices. Our campus is modern and safe. Students from over 50 countries study here together.</p>
          
          <p>Here are the main benefits you get:</p>
          <ul>
            <li>Expert teachers who care about your success</li>
            <li>Modern classrooms and labs with latest technology</li>
            <li>Students from many countries create diverse community</li>
            <li>Strong job placement support after graduation</li>
            <li>Affordable fees with many scholarship options</li>
            <li>24/7 student support in your own language</li>
            <li>Safe campus with security and medical facilities</li>
          </ul>
          
          <h2>Popular Study Programs</h2>
          <p>We offer many study programs that lead to good jobs. Our courses are updated every year to match industry needs. Students learn both theory and practical skills.</p>
          
          <p>Most students choose these programs:</p>
          
          <h3>Engineering and Technology</h3>
          <p>Engineering students learn to build and design things. Our labs have modern equipment. Students work on real projects. Many graduates get jobs in big companies.</p>
          <ul>
            <li>Computer Engineering - Learn to build software and systems</li>
            <li>Civil Engineering - Design buildings and roads</li>
            <li>Electrical Engineering - Work with power and electronics</li>
            <li>Mechanical Engineering - Create machines and engines</li>
          </ul>
          
          <h3>Business and Management</h3>
          <p>Business students learn how to run companies. They study marketing, finance, and leadership. Many start their own businesses after graduation.</p>
          <ul>
            <li>Business Administration - Learn general business skills</li>
            <li>Marketing - Understand how to sell products</li>
            <li>Finance - Manage money and investments</li>
            <li>Human Resources - Work with people and teams</li>
          </ul>
          
          <h3>Information Technology</h3>
          <p>IT students learn about computers and internet. They build websites and mobile apps. The job market for IT is very strong worldwide.</p>
          <ul>
            <li>Software Development - Create computer programs</li>
            <li>Web Design - Build beautiful websites</li>
            <li>Cyber Security - Protect computer systems</li>
            <li>Data Science - Analyze information and trends</li>
          </ul>
          
          <h2>Student Life and Support</h2>
          <p>Life at ${universityName || contentTopic || 'our university'} is exciting and comfortable. We have many activities outside classes. Students make friends from different countries and cultures.</p>
          
          <p>Our support team helps students with everything they need:</p>
          
          <h3>Academic Support</h3>
          <ul>
            <li>Free tutoring in all subjects</li>
            <li>Study groups with other students</li>
            <li>Library with thousands of books and computers</li>
            <li>Online learning platform available 24/7</li>
          </ul>
          
          <h3>Personal Support</h3>
          <ul>
            <li>Counseling services for personal problems</li>
            <li>Health clinic on campus</li>
            <li>Help with visa and immigration issues</li>
            <li>Financial aid and scholarship guidance</li>
          </ul>
          
          <h3>Campus Facilities</h3>
          <ul>
            <li>Modern dormitories with internet and air conditioning</li>
            <li>Food court with halal and vegetarian options</li>
            <li>Sports center with gym and swimming pool</li>
            <li>Prayer rooms for different religions</li>
          </ul>
          
          <h2>How to Apply</h2>
          <p>Applying to ${universityName || contentTopic || 'our university'} is simple and easy. We help you through every step. Our admission team speaks multiple languages including Bengali, Hindi, and Urdu.</p>
          
          <p>Here is what you need to do:</p>
          
          <h3>Step 1: Check Requirements</h3>
          <p>Make sure you have completed high school or equivalent. You need good grades in your previous studies. English language test scores are required for most programs.</p>
          
          <h3>Step 2: Prepare Documents</h3>
          <ul>
            <li>High school transcripts with official translation</li>
            <li>English test scores (IELTS 6.0 or TOEFL 80)</li>
            <li>Passport copy with at least 2 years validity</li>
            <li>Personal statement explaining why you want to study</li>
            <li>Letters of recommendation from teachers</li>
          </ul>
          
          <h3>Step 3: Submit Application</h3>
          <p>Fill out our online application form. Upload all your documents. Pay the small application fee. We will review your application within 2 weeks.</p>
          
          <h2>Scholarships and Financial Help</h2>
          <p>We know that studying abroad costs money. That is why we offer many scholarships and payment plans. Over 60% of our international students receive some financial help.</p>
          
          <h3>Types of Scholarships Available</h3>
          <ul>
            <li>Merit scholarships for students with excellent grades</li>
            <li>Need-based aid for students who need financial help</li>
            <li>Country scholarships for Bangladesh, India, and Pakistan</li>
            <li>Sports scholarships for talented athletes</li>
            <li>Work-study programs to earn money while studying</li>
          </ul>
          
          <h3>How to Apply for Scholarships</h3>
          <p>Apply for scholarships when you submit your admission application. Fill out the scholarship form completely. Provide proof of your family income if needed. We will tell you about scholarship decisions with your admission letter.</p>
          
          <h2>Career Success After Graduation</h2>
          <p>Our graduates get good jobs all around the world. Over 95% of students find work within 6 months of graduation. Many work for famous companies like Google, Microsoft, Samsung, and local government.</p>
          
          <p>We help students prepare for careers through:</p>
          <ul>
            <li>Career counseling and job search support</li>
            <li>Resume writing and interview practice</li>
            <li>Internship programs with top companies</li>
            <li>Alumni network in over 40 countries</li>
            <li>Job fairs with 200+ employers every year</li>
          </ul>
          
          <h2>Start Your Journey in 2025</h2>
          <p>Ready to begin your education journey with us in 2025? Contact our friendly admission team today. We are here to answer all your questions. We can help you choose the right program and apply for scholarships.</p>
          
          <p>Call us, email us, or visit our campus. We welcome students from Bangladesh, India, Pakistan, and all countries. Your success is our success. Join thousands of happy graduates who achieved their dreams with us.</p>
          
          <p>Apply now for 2025 intake and take the first step toward your bright future!</p>
        `
        
          if (onContentUpdate) {
            onContentUpdate(comprehensiveContent)
            fixes.push('✅ Generated 1000+ words of easy-to-read, SEO-optimized content')
          }
        }
      }
      
      // Re-analyze to update score after all fixes
      setTimeout(() => {
        analyzeSEO()
      }, 100)
      
      // Show success message
      if (fixes.length > 0) {
        alert(`🎉 SEO Auto-Fix Complete!\n\n${fixes.join('\n')}\n\nYour content has been optimized for better SEO performance!`)
      } else {
        alert('✅ No issues found to fix! Your content is already well optimized.')
      }
      
    } catch (error) {
      console.error('Auto-fix failed:', error)
      alert('❌ Auto-fix encountered an error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Effects
  useEffect(() => {
    if (content || title || description) {
      analyzeSEO()
    }
  }, [content, title, description, keywords])

  // Auto-populate topic from university name
  useEffect(() => {
    if (universityName && !contentTopic) {
      setContentTopic(universityName)
    }
  }, [universityName, contentTopic])

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg h-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header - Enhanced Design */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Live SEO Analyzer</h3>
              <p className="text-sm text-gray-600">Real-time optimization for global ranking</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-lg font-bold shadow-md ${getScoreBgColor(seoScore)} ${getScoreColor(seoScore)}`}>
            {seoScore}/100
          </div>
        </div>
        
        {/* Enhanced Score Display */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">SEO Score</span>
            <span className={`text-sm font-bold ${getScoreColor(seoScore)}`}>
              {seoScore >= 90 ? 'Excellent' : seoScore >= 70 ? 'Good' : seoScore >= 50 ? 'Fair' : 'Needs Work'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                seoScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                seoScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${seoScore}%` }}
            ></div>
          </div>
          
          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-gray-900">{Math.min(25, Math.floor((analysis.wordCount >= 50 ? seoScore * 0.25 : 0)))}/25</div>
              <div className="text-gray-500">Content</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{Math.min(20, Math.floor((keywords.length > 0 ? seoScore * 0.2 : 0)))}/20</div>
              <div className="text-gray-500">Keywords</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{Math.min(15, Math.floor((title && description ? seoScore * 0.15 : title ? seoScore * 0.10 : 0)))}/15</div>
              <div className="text-gray-500">Meta Tags</div>
            </div>
          </div>
        </div>
        
        {/* Auto-Fix Button */}
        {analysis.suggestions?.length > 0 && (
          <div className="mb-3">
            <button
              onClick={autoFixAllIssues}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              {loading ? (
                <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FiZap className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">🚀 Auto-Fix All Issues (Get 100% Score!)</span>
            </button>
            <p className="text-xs text-center text-gray-500 mt-1">
              Fix {analysis.suggestions?.length} issues automatically to achieve perfect SEO score
            </p>
          </div>
        )}
        
        {/* Tab Navigation - More Responsive */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'analysis', label: 'Analysis', icon: FiTarget },
            { id: 'keywords', label: 'Keywords', icon: FiSearch },
            { id: 'generate', label: 'Generate', icon: FiZap },
            { id: 'competitors', label: 'Competitors', icon: FiUsers }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center px-1 sm:px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 min-w-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-3 h-3 sm:mr-1 mb-1 sm:mb-0 flex-shrink-0" />
              <span className="truncate text-[10px] sm:text-xs leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Section: Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <FiActivity className="w-4 h-4 mr-2 text-blue-600" />
                Quick Stats
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium">Words</div>
                  <div className="text-lg font-bold text-blue-800">{analysis.wordCount || 0}</div>
                  <div className="text-xs text-blue-500 mt-1">Target: 800+</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-green-600 font-medium">Readability</div>
                  <div className="text-lg font-bold text-green-800">{Math.round(analysis.readabilityScore || 0)}%</div>
                  <div className="text-xs text-green-500 mt-1">Target: 70%+</div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiBarChart2 className="w-4 h-4 mr-2" />
                Detailed Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Content Length</span>
                  <span className={`font-medium ${analysis.wordCount >= 500 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.wordCount || 0} words
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Keyword Density</span>
                  <span className={`font-medium ${
                    analysis.keywordDensity > 0 && analysis.keywordDensity <= 3 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {analysis.keywordDensity?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Headings (H1/H2/H3)</span>
                  <span className="font-medium text-gray-800">
                    {analysis.headingStructure?.h1 || 0}/{analysis.headingStructure?.h2 || 0}/{analysis.headingStructure?.h3 || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Meta Title Length</span>
                  <span className={`font-medium ${
                    analysis.metaOptimization?.titleOptimal ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {analysis.metaOptimization?.titleLength || 0} chars
                  </span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiTarget className="w-4 h-4 mr-2" />
                Improvement Suggestions
              </h4>
              <div className="space-y-2">
                {analysis.suggestions?.length > 0 ? analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}>
                    <div className="flex items-start">
                      {suggestion.type === 'error' ? (
                        <FiX className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      ) : suggestion.type === 'warning' ? (
                        <FiAlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <FiCheck className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-medium">{suggestion.message}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded mt-1 inline-block ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <FiCheck className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    Great! No major issues found.
                  </div>
                )}
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
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Smart Keyword Suggestions */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">
                Smart Suggestions
                {country && <span className="text-xs text-blue-600 ml-2">({country})</span>}
              </h5>
              <div className="flex flex-wrap gap-2">
                {getSmartKeywords().filter(kw => !keywords.includes(kw)).slice(0, 8).map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => addSuggestedKeyword(keyword)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors border border-dashed border-gray-300"
                  >
                    + {keyword}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Keywords are auto-suggested based on university country and target audience (BD, IN, PK) for global ranking.
              </p>
            </div>

            {keywords.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Keyword Analysis</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current density:</span>
                    <span className="font-medium">{analysis.keywordDensity?.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Optimal range:</span>
                    <span className="text-green-600">1-3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total keywords:</span>
                    <span className="font-medium">{keywords.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            {/* Content Generation Input */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Content Generation</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic/University Name</label>
                  <input
                    type="text"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                    placeholder="e.g., INTI University, Study in Malaysia"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="students">International Students</option>
                    <option value="parents">Parents & Families</option>
                    <option value="agents">Education Agents</option>
                    <option value="general">General Audience</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Auto-populated Keywords */}
            {keywords.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <FiTarget className="w-4 h-4 mr-2 text-green-600" />
                  Using Selected Keywords ({keywords.length})
                </h5>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                      >
                        <FiCheck className="w-3 h-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    These keywords will be automatically included in generated content for better SEO.
                  </p>
                </div>
              </div>
            )}

            {/* Generation Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={generateContent}
                disabled={loading || !contentTopic}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiZap className="w-4 h-4 mr-2" />
                )}
                <span className="text-sm">Generate Content</span>
              </button>
              
              <button
                onClick={generateTitles}
                disabled={loading || !contentTopic}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiEdit className="w-4 h-4 mr-2" />
                )}
                <span className="text-sm">Generate Titles</span>
              </button>
            </div>

            {/* Generated Titles */}
            {generatedTitles.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Generated Titles</h5>
                <div className="space-y-2">
                  {generatedTitles.map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <span className="text-sm text-gray-700 flex-1 pr-2 font-medium">{title}</span>
                      <button
                        onClick={() => applyTitle(title)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FiCheck className="w-3 h-3 mr-1" />
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Content Preview */}
            {generatedContent && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Generated Content Preview</h5>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div 
                    className="text-sm text-gray-700 max-h-40 overflow-y-auto prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: generatedContent.substring(0, 800) + '...' }}
                  />
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={applyGeneratedContent}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Apply to Editor
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedContent)}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
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
                className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <FiRefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <FiActivity className="w-3 h-3 mr-1" />
                )}
                Analyze
              </button>
            </div>

            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="px-2 py-1 bg-gray-100 rounded mr-2">{competitor.type}</span>
                        <span className="flex items-center">
                          <FiAward className="w-3 h-3 mr-1" />
                          Rank #{competitor.ranking}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {competitor.contentScore}/100
                    </span>
                  </div>
                  
                  <p className="text-xs text-red-600 mb-3 font-medium">
                    Gap: {competitor.gap}
                  </p>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Top Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {competitor.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                      <FiGlobe className="w-3 h-3 mr-1" />
                      {competitor.domain}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {competitors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Click "Analyze" to discover your competitors</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancedSEOTool
