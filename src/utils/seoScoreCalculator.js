/**
 * SEO Score Calculator
 * 
 * Calculates SEO scores and provides suggestions for improvement
 * Includes auto-fix functionality for common SEO issues
 */

class SeoScoreCalculator {
  constructor() {
    this.weights = {
      titleLength: 10,
      titleKeywords: 15,
      metaDescription: 10,
      contentLength: 15,
      keywordDensity: 10,
      headings: 10,
      readability: 10,
      internalLinks: 5,
      externalLinks: 5,
      imageAlt: 5,
      urlStructure: 5,
      competition: 5,
    };
  }

  // Calculate overall SEO score
  async calculate({ title, content, keywords, competitors }) {
    const scores = {};
    const suggestions = [];

    // Title optimization
    const titleScore = this.calculateTitleScore(title, keywords);
    scores.title = titleScore.score;
    suggestions.push(...titleScore.suggestions);

    // Content optimization
    const contentScore = this.calculateContentScore(content, keywords);
    scores.content = contentScore.score;
    suggestions.push(...contentScore.suggestions);

    // Keyword optimization
    const keywordScore = this.calculateKeywordScore(title, content, keywords);
    scores.keywords = keywordScore.score;
    suggestions.push(...keywordScore.suggestions);

    // Competition analysis
    const competitionScore = this.calculateCompetitionScore(competitors);
    scores.competition = competitionScore.score;
    suggestions.push(...competitionScore.suggestions);

    // Calculate weighted total
    const totalScore = Math.round(
      (scores.title * this.weights.titleLength +
       scores.content * this.weights.contentLength +
       scores.keywords * this.weights.keywordDensity +
       scores.competition * this.weights.competition) / 100
    );

    return {
      score: Math.min(totalScore, 100),
      breakdown: scores,
      suggestions: suggestions.filter(s => s), // Remove empty suggestions
    };
  }

  // Calculate title score
  calculateTitleScore(title, keywords) {
    const suggestions = [];
    let score = 0;

    if (!title) {
      suggestions.push('Title is required');
      return { score: 0, suggestions };
    }

    // Title length (50-60 characters is optimal)
    const titleLength = title.length;
    if (titleLength < 30) {
      suggestions.push('Title is too short. Aim for 50-60 characters.');
      score += 20;
    } else if (titleLength > 60) {
      suggestions.push('Title is too long. Keep it under 60 characters.');
      score += 60;
    } else {
      score += 100;
    }

    // Keyword presence in title
    const titleLower = title.toLowerCase();
    const keywordInTitle = keywords.some(keyword => 
      titleLower.includes(keyword.toLowerCase())
    );
    
    if (keywordInTitle) {
      score += 100;
    } else {
      suggestions.push('Include your target keywords in the title');
    }

    // Title readability
    const words = title.split(' ');
    if (words.length < 5) {
      suggestions.push('Title should be more descriptive (5+ words)');
      score += 50;
    } else if (words.length > 12) {
      suggestions.push('Title is too wordy. Keep it concise.');
      score += 70;
    } else {
      score += 100;
    }

    return {
      score: Math.round(score / 3), // Average of 3 checks
      suggestions,
    };
  }

  // Calculate content score
  calculateContentScore(content, keywords) {
    const suggestions = [];
    let score = 0;

    if (!content || Object.keys(content).length === 0) {
      suggestions.push('Content is required');
      return { score: 0, suggestions };
    }

    // Get total content length
    const totalContent = Object.values(content).join(' ');
    const wordCount = totalContent.split(/\s+/).length;

    // Content length
    if (wordCount < 300) {
      suggestions.push('Content is too short. Aim for at least 300 words.');
      score += 30;
    } else if (wordCount > 2000) {
      suggestions.push('Content might be too long. Consider breaking it up.');
      score += 80;
    } else {
      score += 100;
    }

    // Keyword density
    const keywordDensity = this.calculateKeywordDensity(totalContent, keywords);
    if (keywordDensity < 0.5) {
      suggestions.push('Keyword density is too low. Include more target keywords.');
      score += 40;
    } else if (keywordDensity > 3) {
      suggestions.push('Keyword density is too high. Avoid keyword stuffing.');
      score += 60;
    } else {
      score += 100;
    }

    // Content structure
    const hasHeadings = this.hasHeadings(totalContent);
    if (!hasHeadings) {
      suggestions.push('Add headings (H2, H3) to improve content structure.');
      score += 70;
    } else {
      score += 100;
    }

    return {
      score: Math.round(score / 3), // Average of 3 checks
      suggestions,
    };
  }

  // Calculate keyword score
  calculateKeywordScore(title, content, keywords) {
    const suggestions = [];
    let score = 0;

    if (!keywords || keywords.length === 0) {
      suggestions.push('Select target keywords');
      return { score: 0, suggestions };
    }

    // Keyword count
    if (keywords.length < 3) {
      suggestions.push('Add more target keywords (3-5 recommended)');
      score += 60;
    } else if (keywords.length > 8) {
      suggestions.push('Too many keywords. Focus on 3-5 primary keywords.');
      score += 70;
    } else {
      score += 100;
    }

    // Keyword placement
    const titleLower = title.toLowerCase();
    const keywordsInTitle = keywords.filter(keyword => 
      titleLower.includes(keyword.toLowerCase())
    ).length;
    
    if (keywordsInTitle === 0) {
      suggestions.push('Include keywords in the title');
      score += 30;
    } else {
      score += 100;
    }

    // Keyword variation
    const hasLongTail = keywords.some(keyword => keyword.split(' ').length > 2);
    if (!hasLongTail) {
      suggestions.push('Include some long-tail keywords (3+ words)');
      score += 80;
    } else {
      score += 100;
    }

    return {
      score: Math.round(score / 3), // Average of 3 checks
      suggestions,
    };
  }

  // Calculate competition score
  calculateCompetitionScore(competitors) {
    const suggestions = [];
    let score = 100; // Start with perfect score

    if (!competitors || competitors.length === 0) {
      suggestions.push('Analyze competitors to understand ranking difficulty');
      return { score: 50, suggestions };
    }

    // Average domain authority of competitors
    const avgDA = competitors.reduce((sum, comp) => sum + (comp.domainAuthority || 0), 0) / competitors.length;
    
    if (avgDA > 80) {
      suggestions.push('High competition. Consider targeting long-tail keywords.');
      score = 30;
    } else if (avgDA > 60) {
      suggestions.push('Moderate competition. Focus on quality content and backlinks.');
      score = 60;
    } else {
      suggestions.push('Low competition. Good opportunity for ranking.');
      score = 90;
    }

    // Competition density
    const topPageCompetitors = competitors.filter(comp => comp.page === 1).length;
    if (topPageCompetitors > 8) {
      suggestions.push('First page is highly competitive. Consider alternative keywords.');
      score = Math.min(score, 40);
    }

    return { score, suggestions };
  }

  // Auto-fix SEO issues
  async autoFix({ title, content, suggestions, keywords }) {
    let fixedTitle = title;
    let fixedContent = { ...content };
    let fixedCount = 0;

    // Auto-fix title issues
    if (suggestions.some(s => s.includes('Title is too long'))) {
      fixedTitle = this.truncateTitle(title, 60);
      fixedCount++;
    }

    if (suggestions.some(s => s.includes('Include your target keywords in the title'))) {
      fixedTitle = this.addKeywordsToTitle(fixedTitle, keywords);
      fixedCount++;
    }

    // Auto-fix content issues
    if (suggestions.some(s => s.includes('Add headings'))) {
      fixedContent = this.addHeadings(fixedContent);
      fixedCount++;
    }

    if (suggestions.some(s => s.includes('Keyword density is too low'))) {
      fixedContent = this.improveKeywordDensity(fixedContent, keywords);
      fixedCount++;
    }

    if (suggestions.some(s => s.includes('Content is too short'))) {
      fixedContent = this.expandContent(fixedContent, keywords);
      fixedCount++;
    }

    return {
      title: fixedTitle,
      content: fixedContent,
      fixedCount,
    };
  }

  // Helper methods
  calculateKeywordDensity(content, keywords) {
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = keywords.reduce((count, keyword) => {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      return count + this.countOccurrences(words, keywordWords);
    }, 0);
    
    return (keywordCount / words.length) * 100;
  }

  countOccurrences(words, keywordWords) {
    let count = 0;
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      if (keywordWords.every((word, j) => words[i + j] === word)) {
        count++;
      }
    }
    return count;
  }

  hasHeadings(content) {
    return /#{1,6}\s/.test(content) || /<h[1-6]/.test(content);
  }

  truncateTitle(title, maxLength) {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
  }

  addKeywordsToTitle(title, keywords) {
    if (keywords.length === 0) return title;
    
    const primaryKeyword = keywords[0];
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes(primaryKeyword.toLowerCase())) {
      return title;
    }
    
    return `${primaryKeyword} - ${title}`;
  }

  addHeadings(content) {
    const fixedContent = { ...content };
    
    Object.keys(fixedContent).forEach(key => {
      if (typeof fixedContent[key] === 'string' && fixedContent[key].length > 100) {
        const paragraphs = fixedContent[key].split('\n\n');
        if (paragraphs.length > 1) {
          fixedContent[key] = paragraphs.map((para, index) => 
            index === 0 ? para : `## Key Point ${index + 1}\n\n${para}`
          ).join('\n\n');
        }
      }
    });
    
    return fixedContent;
  }

  improveKeywordDensity(content, keywords) {
    const fixedContent = { ...content };
    
    if (keywords.length === 0) return fixedContent;
    
    const primaryKeyword = keywords[0];
    
    Object.keys(fixedContent).forEach(key => {
      if (typeof fixedContent[key] === 'string') {
        const contentLower = fixedContent[key].toLowerCase();
        
        // Add keyword if not present
        if (!contentLower.includes(primaryKeyword.toLowerCase())) {
          fixedContent[key] = `${fixedContent[key]} This comprehensive guide covers everything about ${primaryKeyword}.`;
        }
      }
    });
    
    return fixedContent;
  }

  expandContent(content, keywords) {
    const fixedContent = { ...content };
    
    // Add additional content sections
    if (!fixedContent.additionalInfo) {
      fixedContent.additionalInfo = `
## Additional Information

This section provides comprehensive details about ${keywords[0] || 'the topic'}. 
Our research shows that understanding these key aspects is crucial for success.

Key benefits include:
- Improved understanding of the subject matter
- Better decision-making capabilities
- Enhanced practical application
- Long-term value and sustainability

For more detailed information, consider consulting with experts in the field.
      `.trim();
    }
    
    return fixedContent;
  }
}

export const seoScoreCalculator = new SeoScoreCalculator();
