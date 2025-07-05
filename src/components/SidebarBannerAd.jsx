import React, { useState, useEffect } from 'react'
import { FiX, FiInfo, FiChevronUp, FiChevronDown } from 'react-icons/fi'

const SidebarBannerAd = ({ 
  autoSlide = true,
  slideInterval = 7000, // 7 seconds for sidebar
  closeable = true,
  showLabel = true,
  className = '',
  onClose = () => {},
  ads = [] // Array of ad objects
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Default tall sidebar ads if none provided
  const defaultAds = [
    {
      id: 1,
      title: "💳 International Student Card",
      subtitle: "Get exclusive discounts on travel, accommodation, and textbooks worldwide",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop",
      buttonText: "Get Card",
      link: "/consultation",
      bgColor: "from-purple-600 via-purple-700 to-indigo-800"
    },
    {
      id: 2,
      title: "🏠 Student Housing",
      subtitle: "Find verified, safe and affordable accommodation near your university campus",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=600&fit=crop",
      buttonText: "Find Housing",
      link: "/consultation",
      bgColor: "from-teal-600 via-cyan-700 to-blue-800"
    },
    {
      id: 3,
      title: "📚 Study Materials",
      subtitle: "Access digital textbooks, study guides and exam prep materials for all subjects",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      buttonText: "Browse",
      link: "/consultation",
      bgColor: "from-orange-600 via-red-600 to-pink-700"
    },
    {
      id: 4,
      title: "✈️ Student Travel",
      subtitle: "Book discounted flights, get travel insurance and explore study abroad destinations",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop",
      buttonText: "Book Now",
      link: "/consultation",
      bgColor: "from-green-600 via-emerald-700 to-teal-800"
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

      {/* Navigation Arrows */}
      {adList.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
            aria-label="Previous ad"
          >
            <FiChevronUp className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
            aria-label="Next ad"
          >
            <FiChevronDown className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Tall Banner Container */}
      <div 
        className="relative w-full h-96 lg:h-[500px] xl:h-[600px] rounded-lg overflow-hidden shadow-lg cursor-pointer group"
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
        <div className={`absolute inset-0 bg-gradient-to-b ${currentAd.bgColor} opacity-85`} />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <div className="text-center">
            <h3 className="text-white font-bold text-xl lg:text-2xl xl:text-3xl mb-3 leading-tight">
              {currentAd.title}
            </h3>
            <p className="text-white text-sm lg:text-base opacity-90 mb-6 leading-relaxed">
              {currentAd.subtitle}
            </p>
            
            <button className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-semibold text-sm lg:text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              {currentAd.buttonText}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {autoSlide && !isPaused && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-white bg-opacity-60 transition-all ease-linear"
              style={{ 
                width: '100%',
                animation: `sidebarProgress ${slideInterval}ms linear infinite`
              }}
            />
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      {adList.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {adList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
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
    </div>
  )
}

export default SidebarBannerAd
