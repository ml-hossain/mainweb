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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* University Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={logo_url || '/api/placeholder/400/300'}
          alt={`${safeUniversity} campus`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Ranking Badge - Top Right Corner */}
        {ranking && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              #{ranking}
            </div>
          </div>
        )}

        {/* Location Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <FiMapPin className="w-3 h-3 mr-1" />
            {safeLocation}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* University Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {safeUniversity}
        </h3>

        {/* Truncated Description */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {truncateDescription(safeDescription)}
        </p>

        {/* See More Button */}
        <Link
          to={`/universities/${safeSlug}`}
          className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group/btn shadow-md"
        >
          See More
          <FiArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}

export default UniversityListCard
