import React from 'react'
import { FiMapPin, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const UniversityListCard = ({ university }) => {
  const {
    name,
    location,
    logo_url,
    slug,
    description,
    content = {}
  } = university || {}

  const { country, ranking, ranking_type = 'QS Ranking' } = content

  // Safety checks for undefined values
  const safeUniversity = name || 'Unknown University'
  const safeLocation = location || country || 'Unknown Location'
  const safeDescription = description || 'Explore comprehensive programs and world-class education opportunities at this prestigious institution.'
  const safeSlug = slug || safeUniversity.toLowerCase().replace(/\s+/g, '-')

  // Truncate description to approximately 100 characters
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    const truncated = text.substr(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return truncated.substr(0, lastSpace) + '...'
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">
      {/* University Image */}
      <div className="relative h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
        <img
          src={logo_url || '/api/placeholder/400/300'}
          alt={`${safeUniversity} campus`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Ranking Badge - Top Right Corner */}
        {ranking && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold shadow-lg">
              #{ranking}
            </div>
          </div>
        )}

        {/* Location Badge - Bottom Left */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
          <div className="bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium flex items-center">
            <FiMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="hidden xs:inline break-words">{safeLocation}</span>
            <span className="xs:hidden break-words">{safeLocation.length > 8 ? safeLocation.substring(0, 8) + '...' : safeLocation}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        {/* University Name */}
        <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight break-words overflow-hidden">
          {safeUniversity}
        </h3>

        {/* Truncated Description */}
        <p className="text-gray-600 text-xs xs:text-sm leading-relaxed mb-3 xs:mb-4 sm:mb-6 flex-grow break-words overflow-hidden">
          <span className="sm:hidden block">{truncateDescription(safeDescription, 60)}</span>
          <span className="hidden sm:block">{truncateDescription(safeDescription, 100)}</span>
        </p>

        {/* See More Button */}
        <Link
          to={`/universities/${safeSlug}`}
          className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 rounded-lg text-xs xs:text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group/btn shadow-md"
        >
          <span className="hidden xs:inline whitespace-nowrap">See More</span>
          <span className="xs:hidden whitespace-nowrap">View</span>
          <FiArrowRight className="ml-1 xs:ml-2 w-3 h-3 xs:w-4 xs:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}

export default UniversityListCard
