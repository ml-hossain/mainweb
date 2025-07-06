/**
 * Demo SEO API Handler
 * 
 * This provides demo data for testing the SEO tool without hitting actual APIs
 * Can be switched to real APIs by changing the implementation
 */

class DemoSeoApiHandler {
  constructor() {
    this.apiStatus = {
      serpApi1: { limitReached: false, lastUsed: null, requestCount: 0 },
      serpApi2: { limitReached: false, lastUsed: null, requestCount: 0 },
      scaleSerp: { limitReached: false, lastUsed: null, requestCount: 0 },
      moz: { limitReached: false, lastUsed: null, requestCount: 0 },
    };
  }

  async getApiStatus() {
    return this.apiStatus;
  }

  async getKeywords(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoKeywords = [
      `${query} guide`,
      `${query} tips`,
      `${query} 2024`,
      `best ${query}`,
      `${query} tutorial`,
      `${query} for beginners`,
      `${query} advanced`,
      `${query} strategies`,
      `${query} techniques`,
      `${query} benefits`,
      `${query} comparison`,
      `${query} reviews`,
      `${query} alternatives`,
      `${query} cost`,
      `${query} requirements`,
      `${query} checklist`,
      `${query} examples`,
      `${query} case study`,
      `${query} success stories`,
      `${query} mistakes to avoid`
    ];
    
    return {
      keywords: demoKeywords.slice(0, 12),
      apiUsed: 'Demo API',
    };
  }

  async getCompetitors(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const demoCompetitors = [
      {
        title: `Ultimate Guide to ${query} - Expert Tips & Strategies`,
        url: `https://example1.com/${query.replace(/\s+/g, '-')}`,
        snippet: `Learn everything about ${query} with our comprehensive guide. Discover proven strategies and expert tips.`,
        position: 1,
        page: 1,
        domainAuthority: 85,
      },
      {
        title: `${query}: Complete Beginner's Guide 2024`,
        url: `https://example2.com/${query.replace(/\s+/g, '-')}-guide`,
        snippet: `Start your ${query} journey with our beginner-friendly guide. Updated for 2024 with latest trends.`,
        position: 2,
        page: 1,
        domainAuthority: 78,
      },
      {
        title: `Top 10 ${query} Tips That Actually Work`,
        url: `https://example3.com/top-${query.replace(/\s+/g, '-')}-tips`,
        snippet: `Discover the most effective ${query} tips that have helped thousands achieve their goals.`,
        position: 3,
        page: 1,
        domainAuthority: 72,
      },
      {
        title: `${query} Mistakes to Avoid in 2024`,
        url: `https://example4.com/${query.replace(/\s+/g, '-')}-mistakes`,
        snippet: `Avoid these common ${query} mistakes that could cost you time and money.`,
        position: 4,
        page: 1,
        domainAuthority: 68,
      },
      {
        title: `Best ${query} Tools and Resources`,
        url: `https://example5.com/best-${query.replace(/\s+/g, '-')}-tools`,
        snippet: `Comprehensive list of the best ${query} tools and resources to boost your success.`,
        position: 5,
        page: 1,
        domainAuthority: 75,
      },
    ];
    
    const avgDA = demoCompetitors.reduce((sum, comp) => sum + comp.domainAuthority, 0) / demoCompetitors.length;
    const rankingPrediction = {
      page: avgDA > 75 ? 2 : 1,
      positions: avgDA > 75 ? [11, 20] : [6, 15],
    };
    
    return {
      competitors: demoCompetitors,
      rankingPrediction,
      apiUsed: 'Demo API',
    };
  }

  async getBacklinkSuggestions(query, content) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoBacklinks = [
      {
        domain: 'reddit.com',
        reason: `High-traffic communities discussing ${query}`,
        domainAuthority: 91,
        difficulty: 'Medium',
      },
      {
        domain: 'quora.com',
        reason: `Q&A platform with ${query} related questions`,
        domainAuthority: 85,
        difficulty: 'Easy',
      },
      {
        domain: 'medium.com',
        reason: `Popular blogging platform for ${query} content`,
        domainAuthority: 82,
        difficulty: 'Easy',
      },
      {
        domain: 'linkedin.com',
        reason: `Professional networking for ${query} experts`,
        domainAuthority: 89,
        difficulty: 'Medium',
      },
      {
        domain: 'facebook.com',
        reason: `Social media groups focused on ${query}`,
        domainAuthority: 96,
        difficulty: 'Hard',
      },
      {
        domain: 'twitter.com',
        reason: `Active ${query} community and discussions`,
        domainAuthority: 93,
        difficulty: 'Medium',
      },
      {
        domain: 'youtube.com',
        reason: `Video content opportunities for ${query}`,
        domainAuthority: 95,
        difficulty: 'Hard',
      },
      {
        domain: 'pinterest.com',
        reason: `Visual content sharing for ${query} topics`,
        domainAuthority: 86,
        difficulty: 'Medium',
      },
    ];
    
    return {
      backlinks: demoBacklinks.slice(0, 6),
      apiUsed: 'Demo API',
    };
  }
}

// Export demo handler - can be easily switched to real handler
export const seoApiHandler = new DemoSeoApiHandler();
