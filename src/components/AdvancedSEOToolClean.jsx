import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiTarget, FiTrendingUp, FiLink, FiCheck, FiX, FiAlertCircle, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { seoApiHandler } from '../utils/demoSeoApiHandler'; // Using demo for now
import { seoScoreCalculator } from '../utils/seoScoreCalculator';
import { contentGenerator } from '../utils/contentGenerator';

/**
 * Advanced SEO Tool Component
 * 
 * Features:
 * - Context-aware (Blog/University) with dynamic field detection
 * - Real-time keyword research with API failover
 * - Competitor analysis and ranking prediction
 * - Backlink suggestions
 * - Live SEO score with auto-fix capabilities
 * - Smart API usage with limit monitoring
 */
const AdvancedSEOTool = ({ 
  context = 'blog', 
  fields = {},
  generateFor = [],
  onContentGenerated = () => {},
  initialData = {}
}) => {
  // State Management
  const [title, setTitle] = useState(initialData.title || '');
  const [keywords, setKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [backlinks, setBacklinks] = useState([]);
  const [generatedContent, setGeneratedContent] = useState({});
  const [seoScore, setSeoScore] = useState(0);
  const [seoSuggestions, setSeoSuggestions] = useState([]);
  const [loading, setLoading] = useState({});
  const [apiStatus, setApiStatus] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [rankingPrediction, setRankingPrediction] = useState(null);

  // Add notification
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Monitor API status
  useEffect(() => {
    const checkApiStatus = async () => {
      const status = await seoApiHandler.getApiStatus();
      setApiStatus(status);
      
      // Notify about API limits
      Object.entries(status).forEach(([api, info]) => {
        if (info.limitReached) {
          addNotification(`${api} API limit reached, switching to backup`, 'warning');
        }
      });
    };
    
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [addNotification]);

  // Fetch keywords when title changes
  useEffect(() => {
    if (title.length > 3) {
      fetchKeywords();
    }
  }, [title]);

  // Calculate SEO score when content changes
  useEffect(() => {
    const calculateScore = async () => {
      const score = await seoScoreCalculator.calculate({
        title,
        content: generatedContent,
        keywords: selectedKeywords,
        competitors
      });
      setSeoScore(score.score);
      setSeoSuggestions(score.suggestions);
    };
    
    if (title && Object.keys(generatedContent).length > 0) {
      calculateScore();
    }
  }, [title, generatedContent, selectedKeywords, competitors]);

  // Fetch keywords with API failover
  const fetchKeywords = async () => {
    setLoading(prev => ({ ...prev, keywords: true }));
    try {
      const result = await seoApiHandler.getKeywords(title);
      setKeywords(result.keywords || []);
      
      if (result.apiUsed) {
        addNotification(`Keywords fetched using ${result.apiUsed}`, 'success');
      }
    } catch (error) {
      addNotification(`Failed to fetch keywords: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, keywords: false }));
    }
  };

  // Fetch competitors
  const fetchCompetitors = async () => {
    setLoading(prev => ({ ...prev, competitors: true }));
    try {
      const result = await seoApiHandler.getCompetitors(title);
      setCompetitors(result.competitors || []);
      setRankingPrediction(result.rankingPrediction);
      
      if (result.apiUsed) {
        addNotification(`Competitors analyzed using ${result.apiUsed}`, 'success');
      }
    } catch (error) {
      addNotification(`Failed to analyze competitors: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, competitors: false }));
    }
  };

  // Fetch backlink suggestions
  const fetchBacklinks = async () => {
    setLoading(prev => ({ ...prev, backlinks: true }));
    try {
      const result = await seoApiHandler.getBacklinkSuggestions(title, generatedContent);
      setBacklinks(result.backlinks || []);
      
      if (result.apiUsed) {
        addNotification(`Backlinks analyzed using ${result.apiUsed}`, 'success');
      }
    } catch (error) {
      addNotification(`Failed to get backlink suggestions: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, backlinks: false }));
    }
  };

  // Generate content
  const generateContent = async () => {
    setLoading(prev => ({ ...prev, content: true }));
    try {
      const content = await contentGenerator.generate({
        title,
        keywords: selectedKeywords,
        context,
        fields: generateFor,
        competitors
      });
      
      setGeneratedContent(content);
      onContentGenerated(content);
      addNotification('Content generated successfully!', 'success');
    } catch (error) {
      addNotification(`Failed to generate content: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
    }
  };

  // Auto-fix SEO issues
  const autoFixSeo = async () => {
    setLoading(prev => ({ ...prev, autofix: true }));
    try {
      const fixedContent = await seoScoreCalculator.autoFix({
        title,
        content: generatedContent,
        suggestions: seoSuggestions,
        keywords: selectedKeywords
      });
      
      setGeneratedContent(fixedContent.content);
      setTitle(fixedContent.title);
      onContentGenerated(fixedContent.content);
      
      addNotification(`Auto-fixed ${fixedContent.fixedCount} issues`, 'success');
    } catch (error) {
      addNotification(`Auto-fix failed: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, autofix: false }));
    }
  };

  // Toggle keyword selection
  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // Export results
  const exportResults = () => {
    const data = {
      title,
      keywords: selectedKeywords,
      generatedContent,
      seoScore,
      competitors,
      backlinks,
      rankingPrediction,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-analysis-${title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FiTrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Advanced SEO Tool ({context === 'blog' ? 'Blog' : 'University'})
          </h2>
        </div>
        <button
          onClick={exportResults}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                notification.type === 'error' ? 'bg-red-100 text-red-700' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}
            >
              <FiAlertCircle className="w-4 h-4" />
              <span>{notification.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* API Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">API Status</h3>
        <div className="flex space-x-4">
          {Object.entries(apiStatus).map(([api, status]) => (
            <div key={api} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                status.limitReached ? 'bg-red-500' : 'bg-green-500'
              }`} />
              <span className="text-sm text-gray-600">{api}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter your title..."
        />
      </div>

      {/* Keywords Section */}
      {keywords.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Keywords</h3>
            {loading.keywords && (
              <FiRefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => toggleKeyword(keyword)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedKeywords.includes(keyword)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={generateContent}
          disabled={!title || selectedKeywords.length === 0 || loading.content}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.content ? (
            <FiRefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <FiSearch className="w-4 h-4" />
          )}
          <span>Generate Content</span>
        </button>
        
        <button
          onClick={fetchCompetitors}
          disabled={!title || loading.competitors}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.competitors ? (
            <FiRefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <FiTarget className="w-4 h-4" />
          )}
          <span>Analyze Competitors</span>
        </button>
        
        <button
          onClick={fetchBacklinks}
          disabled={!title || loading.backlinks}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.backlinks ? (
            <FiRefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <FiLink className="w-4 h-4" />
          )}
          <span>Get Backlinks</span>
        </button>
      </div>

      {/* Generated Content */}
      {Object.keys(generatedContent).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Content</h3>
          <div className="space-y-4">
            {Object.entries(generatedContent).map(([field, content]) => (
              <div key={field} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-600">{content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Score & Suggestions */}
      {seoScore > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">SEO Score</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-2xl font-bold ${
                seoScore >= 80 ? 'text-green-600' :
                seoScore >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {seoScore}/100
              </div>
              <button
                onClick={autoFixSeo}
                disabled={loading.autofix || seoSuggestions.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.autofix ? (
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FiCheck className="w-4 h-4" />
                )}
                <span>Auto Fix</span>
              </button>
            </div>
          </div>
          
          {seoSuggestions.length > 0 && (
            <div className="space-y-2">
              {seoSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <FiAlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ranking Prediction */}
      {rankingPrediction && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Ranking Prediction</h3>
          <p className="text-blue-700">
            Your article could potentially rank on page {rankingPrediction.page} 
            (positions {rankingPrediction.positions.join('-')}) based on current competition.
          </p>
        </div>
      )}

      {/* Competitors */}
      {competitors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Competitors</h3>
          <div className="space-y-3">
            {competitors.slice(0, 5).map((competitor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{competitor.title}</h4>
                  <p className="text-sm text-gray-600">{competitor.url}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Page {competitor.page}</div>
                  <div className="text-sm text-gray-500">DA: {competitor.domainAuthority}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backlinks */}
      {backlinks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Backlink Opportunities</h3>
          <div className="space-y-3">
            {backlinks.slice(0, 5).map((backlink, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{backlink.domain}</h4>
                  <p className="text-sm text-gray-600">{backlink.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">DA: {backlink.domainAuthority}</div>
                  <div className="text-sm text-gray-500">Difficulty: {backlink.difficulty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSEOTool;
