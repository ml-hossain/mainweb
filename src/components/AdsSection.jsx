import React, { useEffect, useRef } from 'react'
import { FiInfo, FiX } from 'react-icons/fi'

const AdsSection = ({ 
  type = 'banner', // 'banner', 'square', 'sidebar', 'mobile'
  position = 'center', // 'left', 'center', 'right'
  showLabel = true,
  className = '',
  style = {},
  adSlot = '', // Google AdSense slot ID
  adClient = '', // Google AdSense client ID
  children, // For custom ad content
  dismissible = false,
  onDismiss = null
}) => {
  const adRef = useRef(null)
  const [isDismissed, setIsDismissed] = React.useState(false)

  // Google AdSense integration
  useEffect(() => {
    if (adClient && adSlot && window.adsbygoogle && !isDismissed) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.warn('AdSense error:', error)
      }
    }
  }, [adClient, adSlot, isDismissed])

  // Handle dismiss
  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  if (isDismissed) {
    return null
  }

  // Ad size configurations
  const adSizes = {
    banner: {
      desktop: 'min-h-[90px] max-h-[250px]',
      mobile: 'min-h-[50px] max-h-[100px]',
      width: 'w-full max-w-[728px]'
    },
    square: {
      desktop: 'min-h-[250px] max-h-[300px]',
      mobile: 'min-h-[200px] max-h-[250px]',
      width: 'w-full max-w-[300px]'
    },
    sidebar: {
      desktop: 'min-h-[600px] max-h-[800px]',
      mobile: 'min-h-[250px] max-h-[300px]',
      width: 'w-full max-w-[160px] lg:max-w-[300px]'
    },
    mobile: {
      desktop: 'min-h-[50px] max-h-[100px]',
      mobile: 'min-h-[50px] max-h-[100px]',
      width: 'w-full max-w-[320px]'
    }
  }

  const currentSize = adSizes[type] || adSizes.banner

  // Position classes
  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div className={`w-full flex ${positionClasses[position]} my-4 sm:my-6 ${className}`}>
      <div 
        ref={adRef}
        className={`relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm ${currentSize.width} ${currentSize.desktop} sm:${currentSize.mobile}`}
        style={style}
      >
        {/* Ad Label */}
        {showLabel && (
          <div className="absolute top-1 left-1 z-10">
            <div className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
              <FiInfo className="w-3 h-3" />
              <span>Ad</span>
            </div>
          </div>
        )}

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-1 right-1 z-10 bg-gray-600 hover:bg-gray-700 text-white p-1 rounded transition-colors duration-200"
            aria-label="Close ad"
          >
            <FiX className="w-3 h-3" />
          </button>
        )}

        {/* Google AdSense Ad */}
        {adClient && adSlot && (
          <ins 
            className="adsbygoogle block w-full h-full"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}

        {/* Custom Ad Content */}
        {children && (
          <div className="w-full h-full flex items-center justify-center p-4">
            {children}
          </div>
        )}

        {/* Default Placeholder Ad */}
        {!children && !adClient && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-500">
            {/* Demo Ad Content */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-2">
                <h3 className="font-bold text-sm sm:text-base">🎓 Study Abroad Programs</h3>
                <p className="text-xs sm:text-sm opacity-90 mt-1">
                  Discover top universities worldwide. Get expert guidance!
                </p>
                <button className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold mt-2 hover:bg-gray-100 transition-colors">
                  Learn More
                </button>
              </div>
              <p className="text-xs text-gray-400">Advertisement Space</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdsSection
