// Advanced SEO Score Calculator
export class SEOScoreCalculator {
  constructor() {
    this.weights = {
      title: 15,
      metaDescription: 10,
      content: 20,
      keywords: 15,
      headings: 10,
      images: 8,
      links: 7,
      technical: 10,
      readability: 5
    }
  }

  // Main scoring function
  calculateOverallScore(data, keywords = []) {
    const scores = {
      title: this.scoreTitleOptimization(data.title, keywords),
      metaDescription: this.scoreMetaDescription(data.meta_description || data.description, keywords),
      content: this.scoreContentOptimization(data.content || data.page_content, keywords),
      keywords: this.scoreKeywordOptimization(data, keywords),
      headings: this.scoreHeadingStructure(data.content || data.page_content),
      images: this.scoreImageOptimization(data.content || data.page_content),
      links: this.scoreLinkOptimization(data.content || data.page_content),
      technical: this.scoreTechnicalSEO(data),
      readability: this.scoreReadability(data.content || data.page_content)
    }

    // Calculate weighted score
    let totalScore = 0
    let totalWeight = 0

    Object.entries(scores).forEach(([category, score]) => {
      if (score !== null) {
        totalScore += score * this.weights[category]
        totalWeight += this.weights[category]
      }
    })

    return {
      overall: totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0,
      breakdown: scores,
      suggestions: this.generateSuggestions(scores, data, keywords)
    }
  }

  // Title optimization scoring
  scoreTitleOptimization(title, keywords = []) {
    if (!title) return 0

    let score = 0
    const titleLength = title.length

    // Length optimization (0-40 points)
    if (titleLength >= 30 && titleLength <= 60) {
      score += 40
    } else if (titleLength >= 25 && titleLength <= 70) {
      score += 30
    } else if (titleLength >= 20 && titleLength <= 80) {
      score += 20
    } else if (titleLength >= 15) {
      score += 10
    }

    // Keyword presence (0-40 points)
    if (keywords.length > 0) {
      const primaryKeyword = keywords[0]
      if (title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        score += 40
        
        // Bonus for keyword position (0-10 points)
        const keywordPosition = title.toLowerCase().indexOf(primaryKeyword.toLowerCase())
        if (keywordPosition === 0) {
          score += 10
        } else if (keywordPosition <= 10) {
          score += 5
        }
      }

      // Secondary keyword bonus (0-10 points)
      const secondaryKeywords = keywords.slice(1, 3)
      const secondaryMatches = secondaryKeywords.filter(kw => 
        title.toLowerCase().includes(kw.toLowerCase())
      )
      score += Math.min(secondaryMatches.length * 5, 10)
    }

    return Math.min(score, 100)
  }

  // Meta description scoring
  scoreMetaDescription(description, keywords = []) {
    if (!description) return 0

    let score = 0
    const descLength = description.length

    // Length optimization (0-40 points)
    if (descLength >= 120 && descLength <= 160) {
      score += 40
    } else if (descLength >= 100 && descLength <= 180) {
      score += 30
    } else if (descLength >= 80 && descLength <= 200) {
      score += 20
    } else if (descLength >= 50) {
      score += 10
    }

    // Keyword presence (0-30 points)
    if (keywords.length > 0) {
      const keywordMatches = keywords.filter(kw => 
        description.toLowerCase().includes(kw.toLowerCase())
      )
      score += Math.min(keywordMatches.length * 10, 30)
    }

    // Call-to-action presence (0-15 points)
    const ctaWords = ['learn', 'discover', 'find', 'get', 'read', 'explore', 'contact', 'apply']
    const hasCTA = ctaWords.some(word => 
      description.toLowerCase().includes(word)
    )
    if (hasCTA) score += 15

    // Uniqueness (0-15 points)
    const uniqueWords = new Set(description.toLowerCase().split(/\s+/))
    const uniquenessRatio = uniqueWords.size / description.split(/\s+/).length
    score += Math.round(uniquenessRatio * 15)

    return Math.min(score, 100)
  }

  // Content optimization scoring
  scoreContentOptimization(content, keywords = []) {
    if (!content) return 0

    let score = 0
    const wordCount = this.getWordCount(content)
    const cleanContent = this.stripHtml(content)

    // Content length (0-30 points)
    if (wordCount >= 1000) {
      score += 30
    } else if (wordCount >= 600) {
      score += 25
    } else if (wordCount >= 300) {
      score += 20
    } else if (wordCount >= 150) {
      score += 15
    } else if (wordCount >= 100) {
      score += 10
    }

    // Keyword density (0-25 points)
    if (keywords.length > 0) {
      const primaryKeyword = keywords[0]
      const keywordCount = this.countKeywordOccurrences(cleanContent, primaryKeyword)
      const density = (keywordCount / wordCount) * 100

      if (density >= 1 && density <= 3) {
        score += 25
      } else if (density >= 0.5 && density <= 4) {
        score += 20
      } else if (density >= 0.2 && density <= 5) {
        score += 15
      } else if (density > 0) {
        score += 10
      }
    }

    // Keyword distribution (0-20 points)
    if (keywords.length > 0) {
      const primaryKeyword = keywords[0]
      const paragraphs = cleanContent.split(/\n\s*\n/)
      
      // First paragraph keyword presence
      if (paragraphs[0] && paragraphs[0].toLowerCase().includes(primaryKeyword.toLowerCase())) {
        score += 10
      }
      
      // Last paragraph keyword presence
      if (paragraphs[paragraphs.length - 1] && 
          paragraphs[paragraphs.length - 1].toLowerCase().includes(primaryKeyword.toLowerCase())) {
        score += 5
      }
      
      // Middle content keyword presence
      const middleParagraphs = paragraphs.slice(1, -1)
      const middleMatches = middleParagraphs.filter(p => 
        p.toLowerCase().includes(primaryKeyword.toLowerCase())
      )
      if (middleMatches.length > 0) {
        score += 5
      }
    }

    // LSI keywords (0-15 points)
    const lsiScore = this.calculateLSIScore(cleanContent, keywords)
    score += lsiScore

    // Content freshness (0-10 points)
    const freshnessScore = this.calculateFreshnessScore(content)
    score += freshnessScore

    return Math.min(score, 100)
  }

  // Keyword optimization scoring
  scoreKeywordOptimization(data, keywords = []) {
    if (keywords.length === 0) return 0

    let score = 0

    // Meta keywords presence (0-20 points)
    if (data.meta_keywords) {
      const metaKeywords = data.meta_keywords.toLowerCase().split(',').map(k => k.trim())
      const matchingKeywords = keywords.filter(kw => 
        metaKeywords.some(mk => mk.includes(kw.toLowerCase()) || kw.toLowerCase().includes(mk))
      )
      score += Math.min((matchingKeywords.length / keywords.length) * 20, 20)
    }

    // URL optimization (0-25 points)
    if (data.slug) {
      const urlKeywords = keywords.filter(kw => 
        data.slug.toLowerCase().includes(kw.toLowerCase().replace(/\s+/g, '-'))
      )
      score += Math.min((urlKeywords.length / keywords.length) * 25, 25)
    }

    // Alt text optimization (0-20 points)
    const content = data.content || data.page_content || ''
    const altTextScore = this.calculateAltTextKeywordScore(content, keywords)
    score += altTextScore

    // Long-tail keyword usage (0-20 points)
    const longTailScore = this.calculateLongTailScore(content, keywords)
    score += longTailScore

    // Keyword variation (0-15 points)
    const variationScore = this.calculateKeywordVariationScore(content, keywords)
    score += variationScore

    return Math.min(score, 100)
  }

  // Heading structure scoring
  scoreHeadingStructure(content) {
    if (!content) return 0

    let score = 0
    const headings = this.extractHeadings(content)

    // H1 optimization (0-30 points)
    if (headings.h1 === 1) {
      score += 30
    } else if (headings.h1 === 0) {
      score += 0 // No H1
    } else {
      score += 5 // Multiple H1s
    }

    // H2 usage (0-25 points)
    if (headings.h2 >= 2 && headings.h2 <= 6) {
      score += 25
    } else if (headings.h2 === 1) {
      score += 20
    } else if (headings.h2 > 6) {
      score += 15
    }

    // Heading hierarchy (0-20 points)
    const hierarchyScore = this.calculateHeadingHierarchy(headings)
    score += hierarchyScore

    // Heading length (0-15 points)
    const lengthScore = this.calculateHeadingLengthScore(content)
    score += lengthScore

    // Heading keyword optimization (0-10 points)
    const keywordScore = this.calculateHeadingKeywordScore(content)
    score += keywordScore

    return Math.min(score, 100)
  }

  // Image optimization scoring
  scoreImageOptimization(content) {
    if (!content) return 50 // Neutral score if no content

    let score = 0
    const images = this.extractImages(content)

    if (images.total === 0) return 80 // Good score if no images to optimize

    // Alt text coverage (0-40 points)
    const altCoverage = (images.withAlt / images.total) * 100
    if (altCoverage === 100) {
      score += 40
    } else if (altCoverage >= 80) {
      score += 30
    } else if (altCoverage >= 60) {
      score += 20
    } else if (altCoverage >= 40) {
      score += 10
    }

    // Image-to-content ratio (0-20 points)
    const wordCount = this.getWordCount(content)
    const imageRatio = (images.total / wordCount) * 1000
    if (imageRatio >= 5 && imageRatio <= 15) {
      score += 20
    } else if (imageRatio >= 2 && imageRatio <= 20) {
      score += 15
    } else if (imageRatio >= 1) {
      score += 10
    }

    // Descriptive alt text (0-20 points)
    const descriptiveScore = this.calculateDescriptiveAltScore(content)
    score += descriptiveScore

    // Image file name optimization (0-20 points)
    const filenameScore = this.calculateImageFilenameScore(content)
    score += filenameScore

    return Math.min(score, 100)
  }

  // Link optimization scoring
  scoreLinkOptimization(content) {
    if (!content) return 60 // Neutral score

    let score = 0
    const links = this.extractLinks(content)

    // Internal linking (0-40 points)
    const internalLinks = links.filter(link => this.isInternalLink(link))
    if (internalLinks.length >= 3 && internalLinks.length <= 8) {
      score += 40
    } else if (internalLinks.length >= 1 && internalLinks.length <= 10) {
      score += 30
    } else if (internalLinks.length > 0) {
      score += 20
    }

    // External linking (0-30 points)
    const externalLinks = links.filter(link => !this.isInternalLink(link))
    if (externalLinks.length >= 1 && externalLinks.length <= 3) {
      score += 30
    } else if (externalLinks.length > 0 && externalLinks.length <= 5) {
      score += 20
    }

    // Anchor text optimization (0-30 points)
    const anchorScore = this.calculateAnchorTextScore(content)
    score += anchorScore

    return Math.min(score, 100)
  }

  // Technical SEO scoring
  scoreTechnicalSEO(data) {
    let score = 0

    // URL structure (0-25 points)
    if (data.slug) {
      const slug = data.slug
      if (slug.length <= 60 && slug.includes('-') && !slug.includes('_')) {
        score += 25
      } else if (slug.length <= 80) {
        score += 20
      } else if (slug.length <= 100) {
        score += 15
      } else {
        score += 10
      }
    }

    // Meta tags presence (0-30 points)
    if (data.meta_title) score += 10
    if (data.meta_description) score += 10
    if (data.meta_keywords) score += 10

    // Content structure (0-25 points)
    const content = data.content || data.page_content
    if (content) {
      if (content.includes('<h1>') || content.includes('<h1 ')) score += 10
      if (content.includes('<h2>') || content.includes('<h2 ')) score += 8
      if (content.includes('<p>')) score += 7
    }

    // Schema markup potential (0-20 points)
    const schemaScore = this.calculateSchemaScore(data)
    score += schemaScore

    return Math.min(score, 100)
  }

  // Readability scoring
  scoreReadability(content) {
    if (!content) return 0

    let score = 0
    const cleanContent = this.stripHtml(content)
    const readabilityScore = this.calculateFleschScore(cleanContent)

    // Flesch score interpretation (0-40 points)
    if (readabilityScore >= 60) {
      score += 40
    } else if (readabilityScore >= 50) {
      score += 30
    } else if (readabilityScore >= 40) {
      score += 20
    } else if (readabilityScore >= 30) {
      score += 10
    }

    // Sentence length (0-30 points)
    const avgSentenceLength = this.calculateAverageSentenceLength(cleanContent)
    if (avgSentenceLength <= 20) {
      score += 30
    } else if (avgSentenceLength <= 25) {
      score += 20
    } else if (avgSentenceLength <= 30) {
      score += 10
    }

    // Paragraph length (0-30 points)
    const avgParagraphLength = this.calculateAverageParagraphLength(cleanContent)
    if (avgParagraphLength <= 150) {
      score += 30
    } else if (avgParagraphLength <= 200) {
      score += 20
    } else if (avgParagraphLength <= 250) {
      score += 10
    }

    return Math.min(score, 100)
  }

  // Utility functions
  getWordCount(content) {
    return this.stripHtml(content).split(/\s+/).filter(word => word.length > 0).length
  }

  stripHtml(content) {
    return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  countKeywordOccurrences(content, keyword) {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    return (content.match(regex) || []).length
  }

  extractHeadings(content) {
    return {
      h1: (content.match(/<h1[^>]*>/gi) || []).length,
      h2: (content.match(/<h2[^>]*>/gi) || []).length,
      h3: (content.match(/<h3[^>]*>/gi) || []).length,
      h4: (content.match(/<h4[^>]*>/gi) || []).length,
      h5: (content.match(/<h5[^>]*>/gi) || []).length,
      h6: (content.match(/<h6[^>]*>/gi) || []).length
    }
  }

  extractImages(content) {
    const images = content.match(/<img[^>]*>/gi) || []
    const withAlt = content.match(/<img[^>]*alt\s*=\s*["'][^"']+["'][^>]*>/gi) || []
    
    return {
      total: images.length,
      withAlt: withAlt.length,
      withoutAlt: images.length - withAlt.length
    }
  }

  extractLinks(content) {
    const linkMatches = content.match(/<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi) || []
    return linkMatches.map(match => {
      const hrefMatch = match.match(/href\s*=\s*["']([^"']*)["']/i)
      return hrefMatch ? hrefMatch[1] : ''
    }).filter(href => href)
  }

  isInternalLink(url) {
    return !url.startsWith('http') || url.includes(window.location?.hostname || 'localhost')
  }

  calculateFleschScore(content) {
    const words = content.split(/\s+/).length
    const sentences = content.split(/[.!?]+/).length
    const syllables = this.countSyllables(content)
    
    if (sentences === 0 || words === 0) return 0
    
    return 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
  }

  countSyllables(text) {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[^aeiouy]+/g, ' ')
      .trim()
      .split(/\s+/)
      .length
  }

  calculateAverageSentenceLength(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).length
    return sentences.length > 0 ? words / sentences.length : 0
  }

  calculateAverageParagraphLength(content) {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    const words = content.split(/\s+/).length
    return paragraphs.length > 0 ? words / paragraphs.length : 0
  }

  // Additional scoring helper methods
  calculateLSIScore(content, keywords) {
    // Simplified LSI keyword scoring
    const lsiKeywords = this.generateLSIKeywords(keywords)
    const matches = lsiKeywords.filter(lsi => 
      content.toLowerCase().includes(lsi.toLowerCase())
    )
    return Math.min((matches.length / lsiKeywords.length) * 15, 15)
  }

  generateLSIKeywords(keywords) {
    // Generate related terms
    const related = []
    keywords.forEach(keyword => {
      related.push(
        `${keyword} guide`,
        `${keyword} tips`,
        `${keyword} services`,
        `best ${keyword}`,
        `${keyword} help`
      )
    })
    return related
  }

  calculateFreshnessScore(content) {
    // Check for date mentions, recent terminology
    const currentYear = new Date().getFullYear()
    const hasCurrentYear = content.includes(currentYear.toString())
    const hasRecentTerms = /\b(latest|new|updated|recent|current)\b/i.test(content)
    
    let score = 0
    if (hasCurrentYear) score += 5
    if (hasRecentTerms) score += 5
    return score
  }

  calculateAltTextKeywordScore(content, keywords) {
    const altTexts = content.match(/alt\s*=\s*["']([^"']*)["']/gi) || []
    const keywordMatches = altTexts.filter(alt => 
      keywords.some(kw => alt.toLowerCase().includes(kw.toLowerCase()))
    )
    return altTexts.length > 0 ? Math.min((keywordMatches.length / altTexts.length) * 20, 20) : 0
  }

  calculateLongTailScore(content, keywords) {
    const longTailKeywords = keywords.filter(kw => kw.split(' ').length >= 3)
    if (longTailKeywords.length === 0) return 10 // Neutral score
    
    const matches = longTailKeywords.filter(ltk => 
      content.toLowerCase().includes(ltk.toLowerCase())
    )
    return Math.min((matches.length / longTailKeywords.length) * 20, 20)
  }

  calculateKeywordVariationScore(content, keywords) {
    // Check for keyword variations (plurals, synonyms, etc.)
    let variationCount = 0
    keywords.forEach(keyword => {
      const variations = [
        keyword + 's',
        keyword + 'es',
        keyword.replace(/y$/, 'ies'),
        keyword.replace(/ing$/, ''),
        keyword.replace(/ed$/, '')
      ]
      
      variationCount += variations.filter(variation => 
        content.toLowerCase().includes(variation.toLowerCase())
      ).length
    })
    
    return Math.min(variationCount * 3, 15)
  }

  calculateHeadingHierarchy(headings) {
    let score = 0
    
    // Check if H2s exist when H3s exist
    if (headings.h3 > 0 && headings.h2 > 0) score += 10
    
    // Check if hierarchy is logical
    if (headings.h1 <= 1 && headings.h2 > 0) score += 10
    
    return score
  }

  calculateHeadingLengthScore(content) {
    const headingMatches = content.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi) || []
    const wellSizedHeadings = headingMatches.filter(heading => {
      const text = heading.replace(/<[^>]*>/g, '').trim()
      return text.length >= 10 && text.length <= 70
    })
    
    return headingMatches.length > 0 ? 
      Math.min((wellSizedHeadings.length / headingMatches.length) * 15, 15) : 0
  }

  calculateHeadingKeywordScore(content) {
    // Simplified - just check if headings contain important words
    const headingMatches = content.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi) || []
    const keywordHeadings = headingMatches.filter(heading => {
      const text = heading.replace(/<[^>]*>/g, '').toLowerCase()
      return /\b(guide|tips|how|what|why|best|top)\b/.test(text)
    })
    
    return headingMatches.length > 0 ? 
      Math.min((keywordHeadings.length / headingMatches.length) * 10, 10) : 0
  }

  calculateDescriptiveAltScore(content) {
    const altTexts = content.match(/alt\s*=\s*["']([^"']*)["']/gi) || []
    const descriptiveAlts = altTexts.filter(alt => {
      const text = alt.replace(/alt\s*=\s*["']|["']/gi, '').trim()
      return text.length >= 10 && text.length <= 125
    })
    
    return altTexts.length > 0 ? 
      Math.min((descriptiveAlts.length / altTexts.length) * 20, 20) : 0
  }

  calculateImageFilenameScore(content) {
    // Simplified filename scoring
    const srcMatches = content.match(/src\s*=\s*["']([^"']*)["']/gi) || []
    const goodFilenames = srcMatches.filter(src => {
      const filename = src.match(/([^/]+\.(jpg|jpeg|png|gif|webp))/i)
      if (!filename) return false
      return filename[1].includes('-') && !filename[1].includes('_')
    })
    
    return srcMatches.length > 0 ? 
      Math.min((goodFilenames.length / srcMatches.length) * 20, 20) : 0
  }

  calculateAnchorTextScore(content) {
    const linkMatches = content.match(/<a[^>]*>([^<]*)<\/a>/gi) || []
    const descriptiveLinks = linkMatches.filter(link => {
      const text = link.replace(/<[^>]*>/g, '').trim()
      return text.length >= 3 && !/(click here|read more|here|more)/i.test(text)
    })
    
    return linkMatches.length > 0 ? 
      Math.min((descriptiveLinks.length / linkMatches.length) * 30, 30) : 15
  }

  calculateSchemaScore(data) {
    let score = 0
    
    // Check for structured data potential
    if (data.category) score += 5
    if (data.tags && data.tags.length > 0) score += 5
    if (data.created_at || data.published_date) score += 5
    if (data.author) score += 5
    
    return score
  }

  // Generate suggestions based on scores
  generateSuggestions(scores, data, keywords) {
    const suggestions = []
    
    Object.entries(scores).forEach(([category, score]) => {
      if (score !== null && score < 70) {
        suggestions.push(...this.getCategorySuggestions(category, score, data, keywords))
      }
    })
    
    return suggestions.slice(0, 10) // Limit to top 10 suggestions
  }

  getCategorySuggestions(category, score, data, keywords) {
    const suggestions = []
    
    switch (category) {
      case 'title':
        if (score < 50) {
          suggestions.push({
            type: 'title',
            priority: 'high',
            message: 'Optimize your title length (30-60 characters) and include primary keyword',
            action: 'edit_title'
          })
        }
        break
        
      case 'metaDescription':
        if (score < 50) {
          suggestions.push({
            type: 'meta',
            priority: 'high',
            message: 'Write a compelling meta description (120-160 characters) with keywords',
            action: 'edit_meta_description'
          })
        }
        break
        
      case 'content':
        if (score < 50) {
          suggestions.push({
            type: 'content',
            priority: 'high',
            message: 'Expand your content and improve keyword usage',
            action: 'expand_content'
          })
        }
        break
        
      case 'headings':
        if (score < 60) {
          suggestions.push({
            type: 'structure',
            priority: 'medium',
            message: 'Improve heading structure with proper H1, H2, H3 hierarchy',
            action: 'fix_headings'
          })
        }
        break
        
      case 'images':
        if (score < 60) {
          suggestions.push({
            type: 'images',
            priority: 'medium',
            message: 'Add descriptive alt text to all images',
            action: 'fix_alt_text'
          })
        }
        break
    }
    
    return suggestions
  }
}

export default new SEOScoreCalculator()
