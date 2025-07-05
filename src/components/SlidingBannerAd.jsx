import React, { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiX, FiInfo } from 'react-icons/fi'

const SlidingBannerAd = ({ 
  autoSlide = true,
  slideInterval = 5000, // 5 seconds
  showDots = true,
  showArrows = true,
  closeable = true,
  showLabel = true,
  className = '',
  onClose = () => {},
  ads = [] // Array of ad objects
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Default ads if none provided
  const defaultAds = [
    {
      id: 1,
      title: "🎓 Study in Canada",
      subtitle: "World-class education with post-graduation work permits",
      image: "https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?w=1200&h=300&fit=crop",
      buttonText: "Apply Now",
      link: "/consultation",
      bgColor: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      title: "💰 Education Loans Available",
      subtitle: "Get up to 100% financing for your international education",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=300&fit=crop",
      buttonText: "Check Eligibility",
      link: "/consultation",
      bgColor: "from-green-600 to-green-800"
    },
    {
      id: 3,
      title: "🌟 Scholarship Opportunities",
      subtitle: "Discover merit-based scholarships up to $50,000",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=300&fit=crop",
      buttonText: "Explore",
      link: "/consultation", 
      bgColor: "from-purple-600 to-purple-800"
    },
    {
      id: 4,
      title: "🏆 Top Universities",
      subtitle: "Get admitted to QS Top 100 universities worldwide",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=300&fit=crop",
      buttonText: "See Universities",
      link: "/universities",
      bgColor: "from-orange-600 to-orange-800"
    }
  ]

  const adList = ads.length > 0 ? ads : defaultAds

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || isPaused || !isVisible) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adList.length)
    }, slideInterval)

    return () => clearInterval(timer)
  }, [autoSlide, slideInterval, isPaused, isVisible, adList.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + adList.length) % adList.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % adList.length)
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  const handleAdClick = (link) => {
    if (link) {
      window.open(link, '_blank')
    }
  }

  if (!isVisible) return null

  const currentAd = adList[currentSlide]

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Ad Label */}
      {showLabel && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <FiInfo className="w-3 h-3" />
            <span>Sponsored</span>
          </div>
        </div>
      )}

      {/* Close Button */}
      {closeable && (
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200"
          aria-label="Close advertisement"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}

      {/* Banner Container */}
      <div 
        className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => handleAdClick(currentAd.link)}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform group-hover:scale-105"
          style={{ backgroundImage: `url(${currentAd.image})` }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentAd.bgColor} opacity-80`} />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-between px-6 sm:px-8 md:px-12">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2">
              {currentAd.title}
            </h3>
            <p className="text-white text-sm sm:text-base md:text-lg opacity-90 max-w-2xl">
              {currentAd.subtitle}
            </p>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <button className="bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              {currentAd.buttonText}
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {showArrows && adList.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous ad"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Next ad"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {showDots && adList.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {adList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-500 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoSlide && !isPaused && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
          <div 
            className="h-full bg-white bg-opacity-60 transition-all ease-linear"
            style={{ 
              width: '100%',
              animation: `progress ${slideInterval}ms linear infinite`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}

export default SlidingBannerAd
