import React from 'react';

/**
 * Google Ads Component
 * 
 * A reusable component for displaying Google AdSense ads
 * Replace the placeholder content with actual Google AdSense code
 */
const GoogleAds = ({ 
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
      
      {/* Google Ads Placeholder - Replace with actual AdSense code */}
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
      
      {/* 
        Replace the placeholder above with actual Google AdSense code:
        
        <ins className="adsbygoogle"
             style={{display:'block'}}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        
        Don't forget to include the AdSense script in your HTML head:
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
      */}
    </div>
  );
};

export default GoogleAds;
