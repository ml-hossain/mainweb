import React from 'react'
import { FiMapPin, FiArrowRight, FiClock, FiDollarSign, FiGlobe, FiBook } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const UniversityCard = ({ university }) => {
  const {
    name,
    location,
    logo_url,
    banner_url,
    slug,
    content = {},
    description
  } = university || {}

  const {
    ranking,
    ranking_type = 'QS Ranking',
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
  const safeDescription = description || 'Explore comprehensive programs and world-class education opportunities.'
  const safeSlug = slug || safeUniversity.toLowerCase().replace(/\s+/g, '-')

  // Use banner_url for main image, fallback to logo_url, then placeholder
  const displayImage = banner_url || logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop'

  // Display only first line of subjects/programs
  const displayPrograms = popular_courses.length > 0 ? popular_courses : programs
  const subjectsToShow = displayPrograms.slice(0, 2) // Show only first 2 subjects
  const hasMoreSubjects = displayPrograms.length > 2

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* University Image with Ranking Badge */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={`${safeUniversity} campus`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Logo overlay in bottom-left corner if we have both banner and logo */}
        {banner_url && logo_url && (
          <div className="absolute bottom-3 left-3">
            <img
              src={logo_url}
              alt={`${safeUniversity} logo`}
              className="w-12 h-12 object-contain bg-white rounded-lg p-1 shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Ranking Badge - Top Right Corner */}
        {ranking && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {ranking_type}: #{ranking}
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* University Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {safeUniversity}
        </h3>

        {/* Short Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {safeDescription}
        </p>

        {/* Key Information Grid */}
        <div className="space-y-3 mb-6">
          {/* Initial Payment */}
          {initial_payment && (
            <div className="flex items-center text-sm">
              <FiDollarSign className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">
                <span className="font-medium">Initial Payment:</span> {initial_payment}
              </span>
            </div>
          )}

          {/* Course Duration */}
          {duration && (
            <div className="flex items-center text-sm">
              <FiClock className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">
                <span className="font-medium">Duration:</span> {duration}
              </span>
            </div>
          )}

          {/* Language Requirements */}
          {language_requirements.length > 0 && (
            <div className="flex items-center text-sm">
              <FiGlobe className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">
                <span className="font-medium">Language:</span> {language_requirements.join(', ')}
              </span>
            </div>
          )}

          {/* Popular Courses/Subjects - Only one line */}
          {displayPrograms.length > 0 && (
            <div className="flex items-start text-sm">
              <FiBook className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-medium text-gray-700">Popular Courses: </span>
                <span className="text-gray-600">
                  {subjectsToShow.join(', ')}
                  {hasMoreSubjects && '...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Flexible Spacer */}
        <div className="flex-grow"></div>

        {/* Learn More Button */}
        <Link
          to={`/universities/${safeSlug}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg text-center font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center group/btn shadow-lg"
        >
          Learn More
          <FiArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}

export default UniversityCard
