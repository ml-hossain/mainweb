// API endpoint for keyword research - Bangladesh market
// This is a mock implementation. Replace with real API integration.

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { keyword, country, language, location } = req.body

    // Enhanced keyword validation
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ 
        error: 'Keyword is required',
        message: 'Please provide a valid keyword string for Bangladesh market analysis'
      })
    }

    const trimmedKeyword = keyword.trim()
    
    // Check if keyword is meaningful
    if (trimmedKeyword.length < 2) {
      return res.status(400).json({ 
        error: 'Keyword too short',
        message: 'Please provide a keyword with at least 2 characters for Bangladesh market analysis'
      })
    }

    // Check for common stop words only
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    if (stopWords.includes(trimmedKeyword.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid keyword',
        message: 'Please provide more specific keywords. Examples: "study abroad consultation", "university admission", "IELTS preparation"'
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Enhanced response for Bangladesh market
    const mockResponse = {
      status: 'success',
      market: 'Bangladesh',
      target_locations: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'],
      suggestions: generateBangladeshKeywords(trimmedKeyword),
      related_keywords: generateRelatedKeywords(trimmedKeyword),
      search_volumes: generateSearchVolumes(trimmedKeyword),
      competition_data: generateCompetitionData(trimmedKeyword),
      market_insights: generateMarketInsights(trimmedKeyword),
      optimization_tips: generateOptimizationTips(trimmedKeyword)
    }

    res.status(200).json(mockResponse)
  } catch (error) {
    console.error('Keyword API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Generate Bangladesh-specific keyword variations
function generateBangladeshKeywords(keyword) {
  const baseKeyword = keyword.toLowerCase()
  
  const suggestions = [
    {
      keyword: baseKeyword,
      search_volume: Math.floor(Math.random() * 5000) + 1000,
      difficulty: Math.floor(Math.random() * 100),
      cpc: (Math.random() * 2 + 0.5).toFixed(2)
    },
    {
      keyword: `${baseKeyword} in Bangladesh`,
      search_volume: Math.floor(Math.random() * 2000) + 500,
      difficulty: Math.floor(Math.random() * 80),
      cpc: (Math.random() * 1.5 + 0.3).toFixed(2)
    },
    {
      keyword: `${baseKeyword} Dhaka`,
      search_volume: Math.floor(Math.random() * 1500) + 300,
      difficulty: Math.floor(Math.random() * 70),
      cpc: (Math.random() * 1.2 + 0.4).toFixed(2)
    },
    {
      keyword: `${baseKeyword} Bangladesh`,
      search_volume: Math.floor(Math.random() * 3000) + 800,
      difficulty: Math.floor(Math.random() * 85),
      cpc: (Math.random() * 1.8 + 0.6).toFixed(2)
    },
    {
      keyword: `best ${baseKeyword} Bangladesh`,
      search_volume: Math.floor(Math.random() * 1000) + 200,
      difficulty: Math.floor(Math.random() * 90),
      cpc: (Math.random() * 2.2 + 0.8).toFixed(2)
    },
    {
      keyword: `${baseKeyword} Chittagong`,
      search_volume: Math.floor(Math.random() * 800) + 150,
      difficulty: Math.floor(Math.random() * 60),
      cpc: (Math.random() * 1.0 + 0.3).toFixed(2)
    },
    {
      keyword: `${baseKeyword} Sylhet`,
      search_volume: Math.floor(Math.random() * 600) + 100,
      difficulty: Math.floor(Math.random() * 55),
      cpc: (Math.random() * 0.8 + 0.2).toFixed(2)
    },
    {
      keyword: `${baseKeyword} services Bangladesh`,
      search_volume: Math.floor(Math.random() * 1200) + 250,
      difficulty: Math.floor(Math.random() * 75),
      cpc: (Math.random() * 1.6 + 0.5).toFixed(2)
    },
    {
      keyword: `${baseKeyword} consultant Bangladesh`,
      search_volume: Math.floor(Math.random() * 900) + 180,
      difficulty: Math.floor(Math.random() * 80),
      cpc: (Math.random() * 2.0 + 0.7).toFixed(2)
    },
    {
      keyword: `top ${baseKeyword} Bangladesh`,
      search_volume: Math.floor(Math.random() * 700) + 120,
      difficulty: Math.floor(Math.random() * 85),
      cpc: (Math.random() * 1.7 + 0.6).toFixed(2)
    }
  ]

  // Add education-specific variations if relevant
  if (isEducationRelated(baseKeyword)) {
    suggestions.push(
      {
        keyword: `${baseKeyword} admission Bangladesh`,
        search_volume: Math.floor(Math.random() * 2500) + 600,
        difficulty: Math.floor(Math.random() * 70),
        cpc: (Math.random() * 1.4 + 0.4).toFixed(2)
      },
      {
        keyword: `${baseKeyword} cost Bangladesh`,
        search_volume: Math.floor(Math.random() * 1800) + 400,
        difficulty: Math.floor(Math.random() * 65),
        cpc: (Math.random() * 1.2 + 0.3).toFixed(2)
      },
      {
        keyword: `${baseKeyword} scholarship Bangladesh`,
        search_volume: Math.floor(Math.random() * 1500) + 350,
        difficulty: Math.floor(Math.random() * 75),
        cpc: (Math.random() * 1.1 + 0.3).toFixed(2)
      },
      {
        keyword: `private ${baseKeyword} Bangladesh`,
        search_volume: Math.floor(Math.random() * 1200) + 280,
        difficulty: Math.floor(Math.random() * 80),
        cpc: (Math.random() * 1.5 + 0.5).toFixed(2)
      },
      {
        keyword: `public ${baseKeyword} Bangladesh`,
        search_volume: Math.floor(Math.random() * 1000) + 220,
        difficulty: Math.floor(Math.random() * 70),
        cpc: (Math.random() * 1.0 + 0.2).toFixed(2)
      }
    )
  }

  return suggestions
}

// Generate related keywords
function generateRelatedKeywords(keyword) {
  const baseKeyword = keyword.toLowerCase()
  
  const related = [
    `how to ${baseKeyword}`,
    `${baseKeyword} guide`,
    `${baseKeyword} tips`,
    `${baseKeyword} process`,
    `${baseKeyword} requirements`,
    `${baseKeyword} application`,
    `${baseKeyword} procedure`,
    `${baseKeyword} information`,
    `${baseKeyword} help`,
    `${baseKeyword} support`
  ]

  return related.map(kw => ({
    keyword: kw,
    search_volume: Math.floor(Math.random() * 1500) + 200,
    difficulty: Math.floor(Math.random() * 90),
    relevance_score: Math.floor(Math.random() * 40) + 60
  }))
}

// Generate search volume data
function generateSearchVolumes(keyword) {
  const baseVolume = Math.floor(Math.random() * 5000) + 1000
  
  return {
    monthly_average: baseVolume,
    trend_data: Array.from({ length: 12 }, () => 
      Math.floor(baseVolume * (0.7 + Math.random() * 0.6))
    ),
    seasonal_trends: {
      peak_months: ['January', 'September', 'October'],
      low_months: ['June', 'July', 'August']
    }
  }
}

// Generate competition data
function generateCompetitionData(keyword) {
  return {
    competition_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    top_competitors: [
      'educationconsultancy.com.bd',
      'studyabroad.bd',
      'universityguide.com.bd',
      'educationbd.com',
      'studyportal.bd'
    ].slice(0, Math.floor(Math.random() * 3) + 2),
    avg_cpc: (Math.random() * 2 + 0.5).toFixed(2),
    ad_competition: Math.floor(Math.random() * 100)
  }
}

// Generate market insights for Bangladesh
function generateMarketInsights(keyword) {
  const baseKeyword = keyword.toLowerCase()
  
  return {
    market_potential: Math.floor(Math.random() * 100) + 1,
    seasonal_trends: {
      peak_seasons: ['January-March', 'September-November'],
      low_season: 'June-August',
      reason: 'Academic year cycle in Bangladesh'
    },
    target_audience: getTargetAudience(baseKeyword),
    local_competition: Math.floor(Math.random() * 80) + 20,
    recommended_budget: `৳${(Math.random() * 50000 + 10000).toFixed(0)} - ৳${(Math.random() * 100000 + 50000).toFixed(0)} per month`
  }
}

// Generate optimization tips
function generateOptimizationTips(keyword) {
  const baseKeyword = keyword.toLowerCase()
  const tips = [
    'Include "Bangladesh" in your content for local relevance',
    'Target major cities: Dhaka, Chittagong, Sylhet for better reach',
    'Use Bengali language keywords alongside English for broader appeal',
    'Focus on mobile optimization as 80%+ users browse on mobile in Bangladesh',
    'Include local phone numbers and addresses for better local SEO'
  ]
  
  // Add context-specific tips
  if (isEducationRelated(baseKeyword)) {
    tips.push(
      'Highlight admission deadlines and requirements specific to Bangladesh students',
      'Include information about educational consultancy services',
      'Mention popular study destinations from Bangladesh (Canada, Australia, UK)'
    )
  }
  
  if (isBusinessRelated(baseKeyword)) {
    tips.push(
      'Include business registration information for Bangladesh',
      'Mention local business practices and cultural considerations',
      'Highlight success stories from Bangladeshi clients'
    )
  }
  
  return tips.slice(0, 5)
}

// Get target audience insights
function getTargetAudience(keyword) {
  if (isEducationRelated(keyword)) {
    return {
      primary: 'Students aged 18-25',
      secondary: 'Parents and guardians',
      demographics: 'Urban, middle to upper-middle class',
      interests: 'Higher education, career development, international study'
    }
  }
  
  if (isBusinessRelated(keyword)) {
    return {
      primary: 'Business owners and entrepreneurs',
      secondary: 'Working professionals',
      demographics: 'Urban professionals aged 25-45',
      interests: 'Business growth, professional services, consultation'
    }
  }
  
  return {
    primary: 'General audience',
    secondary: 'Service seekers',
    demographics: 'Urban population',
    interests: 'Information and services related to ' + keyword
  }
}

// Check if keyword is education-related
function isEducationRelated(keyword) {
  const educationTerms = [
    'university', 'college', 'education', 'study', 'admission', 'degree',
    'bachelor', 'master', 'phd', 'course', 'program', 'scholarship',
    'student', 'academic', 'learning', 'school', 'institute', 'ielts',
    'toefl', 'gre', 'gmat', 'visa', 'abroad', 'international'
  ]
  
  return educationTerms.some(term => keyword.toLowerCase().includes(term))
}

// Check if keyword is business-related
function isBusinessRelated(keyword) {
  const businessTerms = [
    'business', 'consultant', 'service', 'company', 'agency', 'professional',
    'expert', 'advisor', 'consulting', 'solution', 'strategy', 'management',
    'marketing', 'finance', 'legal', 'tax', 'accounting'
  ]
  
  return businessTerms.some(term => keyword.toLowerCase().includes(term))
}
