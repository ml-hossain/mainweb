import React from 'react'
import { FiMapPin, FiDollarSign, FiClock, FiGlobe, FiBookOpen, FiAward } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const HomeUniversityCard = ({ university }) => {
  const {
    name,
    location,
    logo_url,
    slug,
    content = {},
    description
  } = university || {}

  const {
    ranking,
    ranking_type = 'QS',
    programs = [],
    tuition_fee_range,
    duration,
    initial_payment,
    popular_courses = [],
    language_requirements = [],
    country,
    university_type
  } = content

  // Safety checks for undefined values
  const safeUniversity = name || 'Unknown University'
  const safeLocation = location || 'Unknown Location'
  const safeSlug = slug || safeUniversity.toLowerCase().replace(/\s+/g, '-')
  const safeProgram = popular_courses.length > 0 ? popular_courses[0] : (programs.length > 0 ? programs[0] : 'Various Programs')
  const safeDuration = duration || 'Contact for details'
  const safeTotalCost = tuition_fee_range || initial_payment || 'Contact for details'

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300 group transform hover:-translate-y-1 h-full flex flex-col">
      {/* Image Section with Ranking Badge */}
      <div className="relative h-52 bg-gray-100">
        <img
          src={logo_url || '/api/placeholder/300/200'}
          alt={`${safeUniversity} campus`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Ranking Badge - Top Right Corner */}
        {ranking && (
          <div className="absolute top-3 right-3">
            <div className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-xl border border-orange-400">
              {ranking_type} #{ranking}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 flex flex-col flex-grow">
        {/* University Name */}
        <h3 className="font-black text-gray-900 text-xl leading-tight tracking-tight mb-3">
          {safeUniversity}
        </h3>

        {/* Short Description */}
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Information Grid */}
        <div className="space-y-3">
          {/* Location with Icon */}
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <FiMapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-900">{country || safeLocation}</span>
            </div>
          </div>

          {/* Initial Payment */}
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <FiDollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <span className="text-gray-600 text-xs font-medium">Initial Payment:</span>
              <span className="font-bold text-gray-900 ml-1">{initial_payment || safeTotalCost}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <FiClock className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <span className="text-gray-600 text-xs font-medium">Duration:</span>
              <span className="font-bold text-gray-900 ml-1">{safeDuration}</span>
            </div>
          </div>

          {/* Language Requirements */}
          {language_requirements && language_requirements.length > 0 && (
            <div className="flex items-center text-gray-700 text-sm">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <FiGlobe className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-gray-600 text-xs font-medium">Language:</span>
                <span className="font-bold text-gray-900 ml-1">{language_requirements[0]}</span>
              </div>
            </div>
          )}

          {/* Popular Courses */}
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <FiBookOpen className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <span className="text-gray-600 text-xs font-medium">Popular Courses:</span>
              <span className="font-bold text-gray-900 ml-1">
                {popular_courses.length > 0 
                  ? popular_courses.slice(0, 2).join(', ')
                  : (programs.length > 0 ? programs.slice(0, 2).join(', ') : 'Various Programs')
                }
                {(popular_courses.length > 2 || programs.length > 2) && '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Flexible Spacer */}
        <div className="flex-grow"></div>

        {/* Button */}
        <Link
          to={`/universities/${safeSlug}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-6 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center mt-6 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Learn More →
        </Link>
      </div>
    </div>
  )
}

export default HomeUniversityCard
