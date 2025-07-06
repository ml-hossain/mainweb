/**
 * SEO API Handler with Smart Failover
 * 
 * Handles all SEO API calls with automatic failover when limits are reached
 * Monitors API status and switches between available APIs
 */

class SeoApiHandler {
  constructor() {
    this.apiKeys = {
      moz: import.meta.env.VITE_MOZ_API_KEY,
      serpApi1: import.meta.env.VITE_SERP_API_KEY_1,
      serpApi2: import.meta.env.VITE_SERP_API_KEY_2,
      scaleSerp: import.meta.env.VITE_SCALE_SERP_API_KEY,
    };
    
    this.apiStatus = {
      moz: { limitReached: false, lastUsed: null, requestCount: 0 },
      serpApi1: { limitReached: false, lastUsed: null, requestCount: 0 },
      serpApi2: { limitReached: false, lastUsed: null, requestCount: 0 },
      scaleSerp: { limitReached: false, lastUsed: null, requestCount: 0 },
    };
    
    this.apiCapabilities = {
      moz: ['keywords', 'domainAuthority', 'keywordDifficulty'],
      serpApi1: ['keywords', 'competitors', 'relatedQueries', 'searchResults'],
      serpApi2: ['keywords', 'competitors', 'relatedQueries', 'searchResults'],
      scaleSerp: ['keywords', 'competitors', 'relatedQueries', 'searchResults', 'backlinks'],
    };
  }

  // Get current API status
  async getApiStatus() {
    return this.apiStatus;
  }

  // Check if API is available for a specific feature
  isApiAvailable(apiName, feature) {
    return (
      this.apiKeys[apiName] &&
      !this.apiStatus[apiName].limitReached &&
      this.apiCapabilities[apiName].includes(feature)
    );
  }

  // Mark API as rate limited
  markApiLimited(apiName, error) {
    this.apiStatus[apiName].limitReached = true;
    this.apiStatus[apiName].lastError = error;
    console.warn(`API ${apiName} marked as rate limited:`, error);
  }

  // Get available APIs for a feature
  getAvailableApis(feature) {
    return Object.keys(this.apiCapabilities).filter(api => 
      this.isApiAvailable(api, feature)
    );
  }

  // Generic API call with error handling
  async callApi(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get keywords with API failover
  async getKeywords(query) {
    const availableApis = this.getAvailableApis('keywords');
    
    if (availableApis.length === 0) {
      throw new Error('No APIs available for keyword research');
    }

    // Try APIs in order of preference
    for (const apiName of availableApis) {
      try {
        let result;
        
        switch (apiName) {
          case 'serpApi1':
          case 'serpApi2':
            result = await this.getSerpApiKeywords(query, apiName);
            break;
          case 'scaleSerp':
            result = await this.getScaleSerpKeywords(query);
            break;
          case 'moz':
            result = await this.getMozKeywords(query);
            break;
          default:
            continue;
        }

        this.apiStatus[apiName].lastUsed = Date.now();
        this.apiStatus[apiName].requestCount++;
        
        return {
          keywords: result,
          apiUsed: apiName,
        };
      } catch (error) {
        if (error.message.includes('Rate limit') || error.message.includes('429')) {
          this.markApiLimited(apiName, error.message);
          continue;
        }
        throw error;
      }
    }
    
    throw new Error('All keyword APIs are unavailable');
  }

  // SerpAPI keywords
  async getSerpApiKeywords(query, apiName) {
    const apiKey = this.apiKeys[apiName];
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
    
    const data = await this.callApi(url);
    
    const keywords = [];
    
    // Extract keywords from related searches
    if (data.related_searches) {
      keywords.push(...data.related_searches.map(item => item.query));
    }
    
    // Extract keywords from people also ask
    if (data.people_also_ask) {
      keywords.push(...data.people_also_ask.map(item => item.question));
    }
    
    // Extract keywords from organic results
    if (data.organic_results) {
      data.organic_results.forEach(result => {
        if (result.title) {
          // Extract potential keywords from titles
          const titleWords = result.title.toLowerCase().split(/\s+/);
          keywords.push(...titleWords.filter(word => word.length > 3));
        }
      });
    }
    
    return [...new Set(keywords)].slice(0, 20);
  }

  // ScaleSerp keywords
  async getScaleSerpKeywords(query) {
    const apiKey = this.apiKeys.scaleSerp;
    const url = `https://api.scaleserp.com/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&search_type=web`;
    
    const data = await this.callApi(url);
    
    const keywords = [];
    
    // Extract keywords from related searches
    if (data.related_searches) {
      keywords.push(...data.related_searches.map(item => item.query));
    }
    
    // Extract keywords from organic results
    if (data.organic_results) {
      data.organic_results.forEach(result => {
        if (result.title) {
          const titleWords = result.title.toLowerCase().split(/\s+/);
          keywords.push(...titleWords.filter(word => word.length > 3));
        }
      });
    }
    
    return [...new Set(keywords)].slice(0, 20);
  }

  // Moz keywords (basic implementation)
  async getMozKeywords(query) {
    // Note: Moz API doesn't directly provide keyword suggestions
    // This is a placeholder for domain authority and difficulty data
    // In a real implementation, you'd combine this with other keyword sources
    return [query, `${query} guide`, `${query} tips`, `${query} 2024`];
  }

  // Get competitors with API failover
  async getCompetitors(query) {
    const availableApis = this.getAvailableApis('competitors');
    
    if (availableApis.length === 0) {
      throw new Error('No APIs available for competitor analysis');
    }

    for (const apiName of availableApis) {
      try {
        let result;
        
        switch (apiName) {
          case 'serpApi1':
          case 'serpApi2':
            result = await this.getSerpApiCompetitors(query, apiName);
            break;
          case 'scaleSerp':
            result = await this.getScaleSerpCompetitors(query);
            break;
          default:
            continue;
        }

        this.apiStatus[apiName].lastUsed = Date.now();
        this.apiStatus[apiName].requestCount++;
        
        return {
          competitors: result.competitors,
          rankingPrediction: result.rankingPrediction,
          apiUsed: apiName,
        };
      } catch (error) {
        if (error.message.includes('Rate limit') || error.message.includes('429')) {
          this.markApiLimited(apiName, error.message);
          continue;
        }
        throw error;
      }
    }
    
    throw new Error('All competitor analysis APIs are unavailable');
  }

  // SerpAPI competitors
  async getSerpApiCompetitors(query, apiName) {
    const apiKey = this.apiKeys[apiName];
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=20`;
    
    const data = await this.callApi(url);
    
    const competitors = [];
    
    if (data.organic_results) {
      data.organic_results.forEach((result, index) => {
        competitors.push({
          title: result.title,
          url: result.link,
          snippet: result.snippet,
          position: index + 1,
          page: Math.ceil((index + 1) / 10),
          domainAuthority: Math.floor(Math.random() * 100), // Placeholder
        });
      });
    }
    
    // Simple ranking prediction based on competition
    const avgDomainAuthority = competitors.reduce((acc, comp) => acc + comp.domainAuthority, 0) / competitors.length;
    const rankingPrediction = {
      page: avgDomainAuthority > 70 ? 2 : 1,
      positions: avgDomainAuthority > 70 ? [11, 20] : [1, 10],
    };
    
    return { competitors, rankingPrediction };
  }

  // ScaleSerp competitors
  async getScaleSerpCompetitors(query) {
    const apiKey = this.apiKeys.scaleSerp;
    const url = `https://api.scaleserp.com/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&search_type=web&num=20`;
    
    const data = await this.callApi(url);
    
    const competitors = [];
    
    if (data.organic_results) {
      data.organic_results.forEach((result, index) => {
        competitors.push({
          title: result.title,
          url: result.link,
          snippet: result.snippet,
          position: index + 1,
          page: Math.ceil((index + 1) / 10),
          domainAuthority: Math.floor(Math.random() * 100), // Placeholder
        });
      });
    }
    
    const avgDomainAuthority = competitors.reduce((acc, comp) => acc + comp.domainAuthority, 0) / competitors.length;
    const rankingPrediction = {
      page: avgDomainAuthority > 70 ? 2 : 1,
      positions: avgDomainAuthority > 70 ? [11, 20] : [1, 10],
    };
    
    return { competitors, rankingPrediction };
  }

  // Get backlink suggestions
  async getBacklinkSuggestions(query, content) {
    const availableApis = this.getAvailableApis('backlinks');
    
    if (availableApis.length === 0) {
      // Fallback to static suggestions
      return {
        backlinks: this.getStaticBacklinkSuggestions(query),
        apiUsed: 'static',
      };
    }

    for (const apiName of availableApis) {
      try {
        let result;
        
        switch (apiName) {
          case 'scaleSerp':
            result = await this.getScaleSerpBacklinks(query);
            break;
          default:
            result = this.getStaticBacklinkSuggestions(query);
        }

        this.apiStatus[apiName].lastUsed = Date.now();
        this.apiStatus[apiName].requestCount++;
        
        return {
          backlinks: result,
          apiUsed: apiName,
        };
      } catch (error) {
        if (error.message.includes('Rate limit') || error.message.includes('429')) {
          this.markApiLimited(apiName, error.message);
          continue;
        }
        throw error;
      }
    }
    
    return {
      backlinks: this.getStaticBacklinkSuggestions(query),
      apiUsed: 'static',
    };
  }

  // Static backlink suggestions as fallback
  getStaticBacklinkSuggestions(query) {
    return [
      {
        domain: 'reddit.com',
        reason: 'High-traffic forum with relevant communities',
        domainAuthority: 91,
        difficulty: 'Medium',
      },
      {
        domain: 'quora.com',
        reason: 'Q&A platform with educational content',
        domainAuthority: 85,
        difficulty: 'Easy',
      },
      {
        domain: 'medium.com',
        reason: 'Popular blogging platform',
        domainAuthority: 82,
        difficulty: 'Easy',
      },
      {
        domain: 'linkedin.com',
        reason: 'Professional networking platform',
        domainAuthority: 89,
        difficulty: 'Medium',
      },
      {
        domain: 'facebook.com',
        reason: 'Social media platform with groups',
        domainAuthority: 96,
        difficulty: 'Hard',
      },
    ];
  }

  // ScaleSerp backlinks (placeholder)
  async getScaleSerpBacklinks(query) {
    // This would typically analyze competitor backlinks
    // For now, return enhanced static suggestions
    return this.getStaticBacklinkSuggestions(query);
  }
}

export const seoApiHandler = new SeoApiHandler();
