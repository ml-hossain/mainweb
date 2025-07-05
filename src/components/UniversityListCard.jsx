import React from 'react'
import { FiMapPin, FiArrowRight, FiGlobe } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const UniversityListCard = ({ university }) => {
  const {
    name,
    location,
    logo_url,
    banner_url,
    slug,
    description,
    content = {}
  } = university || {}

  const { country } = content

  // Safety checks for undefined values
  const safeUniversity = name || 'Unknown University'
  const safeLocation = location || country || 'Unknown Location'
  const safeDescription = description || 'Explore comprehensive programs and world-class education opportunities at this prestigious institution.'
  const safeSlug = slug || safeUniversity.toLowerCase().replace(/\s+/g, '-')

  // Use banner_url for main image, fallback to logo_url, then placeholder
  const displayImage = banner_url || logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop'

  // Truncate description
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    const truncated = text.substr(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return truncated.substr(0, lastSpace) + '...'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col transition-transform duration-200 hover:scale-[1.02]">
      
      {/* University Image - Shorter height, wider aspect */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img
          src={displayImage}
          alt={`${safeUniversity} campus`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Logo overlay in bottom-right corner if we have both banner and logo */}
        {banner_url && logo_url && (
          <div className="absolute bottom-2 right-2">
            <img
              src={logo_url}
              alt={`${safeUniversity} logo`}
              className="w-10 h-10 object-contain bg-white rounded-lg p-1 shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Location Badge */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>{safeLocation}</span>
          </div>
        </div>
      </div>

      {/* Card Content - Compact vertical spacing */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* University Name */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
          {safeUniversity}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {truncateDescription(safeDescription, 100)}
        </p>

        {/* CTA Button - Compact */}
        <Link
          to={`/universities/${safeSlug}`}
          className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold shadow-md"
        >
          <FiGlobe className="mr-2 w-4 h-4" />
          <span>View Details</span>
          <FiArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default UniversityListCard
