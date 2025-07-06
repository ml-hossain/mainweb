import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Dynamic Google Ads Component
 * 
 * Fetches ad data from the database and displays appropriate ads based on placement
 * Supports Google AdSense integration and custom ad content
 */
const DynamicGoogleAds = ({ 
  placement = 'blog-sidebar',
  adSize = 'medium-rectangle',
  className = '',
  fallback = true
}) => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ads from database
  useEffect(() => {
    fetchAds();
  }, [placement]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current page path for targeting
      const currentPath = window.location.pathname;
      
      const { data, error } = await supabase
        .from('content_placements')
        .select('*')
        .eq('status', 'active')
        .eq('placement', placement);

      if (error) throw error;

      // Filter ads based on date, impression limits, and page targeting
      const now = new Date();
      const validAds = (data || []).filter(ad => {
        // Check date range
        if (ad.start_date && new Date(ad.start_date) > now) return false;
        if (ad.end_date && new Date(ad.end_date) < now) return false;
        
        // Check impression limits
        if (ad.max_impressions && ad.current_impressions >= ad.max_impressions) return false;
        
        // Check page targeting
        if (ad.target_pages && ad.target_pages.length > 0) {
          const targetPages = ad.target_pages;
          const hasWildcard = targetPages.includes('*');
          const hasCurrentPath = targetPages.includes(currentPath);
          
          if (!hasWildcard && !hasCurrentPath) return false;
        }
        
        return true;
      });

      setAds(validAds);
      
      // Select a random ad from valid ads
      if (validAds.length > 0) {
        const randomIndex = Math.floor(Math.random() * validAds.length);
        setCurrentAd(validAds[randomIndex]);
        
        // Track impression
        await trackImpression(validAds[randomIndex].id);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId) => {
    try {
      const { data, error } = await supabase
        .from('content_placements')
        .select('view_count, current_impressions')
        .eq('id', adId)
        .single();

      if (error) throw error;

      await supabase
        .from('content_placements')
        .update({ 
          view_count: (data.view_count || 0) + 1,
          current_impressions: (data.current_impressions || 0) + 1
        })
        .eq('id', adId);
    } catch (err) {
      console.error('Error tracking impression:', err);
    }
  };

  const trackClick = async (adId) => {
    try {
      const { data, error } = await supabase
        .from('content_placements')
        .select('click_count')
        .eq('id', adId)
        .single();

      if (error) throw error;

      await supabase
        .from('content_placements')
        .update({ 
          click_count: (data.click_count || 0) + 1
        })
        .eq('id', adId);
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const handleAdClick = (ad) => {
    if (ad.link_url) {
      trackClick(ad.id);
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-4 border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // If no ads and fallback is disabled
  if (!currentAd && !fallback) {
    return null;
  }

  // If no ads found, show fallback
  if (!currentAd) {
    return <StaticGoogleAds adSize={adSize} className={className} />;
  }

  // Custom styling from ad data
  const customStyles = {};
  if (currentAd.background_color) {
    customStyles.backgroundColor = currentAd.background_color;
  }
  if (currentAd.border_color) {
    customStyles.borderColor = currentAd.border_color;
  }

  return (
    <div 
      className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-4 border border-gray-200 ${className}`}
      style={customStyles}
    >
      {/* Ad Label */}
      {currentAd.show_label && (
        <div className="text-center mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {currentAd.label_text || 'Advertisement'}
          </p>
        </div>
      )}

      {/* Google AdSense Ad */}
      {currentAd.ad_client && currentAd.ad_slot && (
        <div className="text-center">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={currentAd.ad_client}
            data-ad-slot={currentAd.ad_slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {/* Custom HTML Content */}
      {currentAd.custom_html && (
        <div 
          dangerouslySetInnerHTML={{ __html: currentAd.custom_html }}
          className="w-full"
        />
      )}

      {/* Default Custom Ad */}
      {!currentAd.ad_client && !currentAd.custom_html && (
        <div 
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
          style={{ minHeight: '250px' }}
          onClick={() => handleAdClick(currentAd)}
        >
          {/* Background Image */}
          {currentAd.image_url && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${currentAd.image_url})` }}
            />
          )}
          
          {/* Content */}
          <div className="relative z-10 text-center p-4">
            {currentAd.title && (
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                {currentAd.title}
              </h4>
            )}
            
            {currentAd.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {currentAd.description}
              </p>
            )}
            
            {currentAd.link_url && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Learn More
              </button>
            )}
          </div>
        </div>
      )}

      {/* Support Message */}
      {currentAd.show_label && (
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            Ads help support our free educational content
          </p>
        </div>
      )}

      {/* Custom CSS */}
      {currentAd.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: currentAd.custom_css }} />
      )}
    </div>
  );
};

// Static fallback component (original GoogleAds)
const StaticGoogleAds = ({ 
  adSize = 'medium-rectangle',
  className = '',
  label = 'Advertisement',
  showLabel = true
}) => {
  // Define ad dimensions based on size
  const adDimensions = {
    'banner': { width: 728, height: 90, name: 'Banner' },
    'large-banner': { width: 970, height: 90, name: 'Large Banner' },
    'medium-rectangle': { width: 300, height: 250, name: 'Medium Rectangle' },
    'large-rectangle': { width: 336, height: 280, name: 'Large Rectangle' },
    'leaderboard': { width: 728, height: 90, name: 'Leaderboard' },
    'skyscraper': { width: 160, height: 600, name: 'Skyscraper' },
    'wide-skyscraper': { width: 160, height: 600, name: 'Wide Skyscraper' },
    'mobile-banner': { width: 320, height: 50, name: 'Mobile Banner' },
    'square': { width: 250, height: 250, name: 'Square' }
  };

  const dimensions = adDimensions[adSize] || adDimensions['medium-rectangle'];

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-4 border border-gray-200 ${className}`}>
      {showLabel && (
        <div className="text-center mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        </div>
      )}
      
      {/* Google Ads Placeholder */}
      <div 
        className="bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ 
          minHeight: `${Math.min(dimensions.height, 250)}px`,
          maxWidth: `${dimensions.width}px`,
          margin: '0 auto'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-6 gap-2 h-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-gray-400 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center p-4">
          <svg className="w-8 h-8 text-gray-400 mb-2 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Google AdSense</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            {dimensions.name} Ad Space
          </p>
          <div className="mt-2 text-xs text-gray-400">
            {dimensions.width} x {dimensions.height}
          </div>
        </div>
      </div>
      
      {showLabel && (
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            Ads help support our free educational content
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicGoogleAds;
