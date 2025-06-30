import React, { useState } from 'react'
import { FiMapPin, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const UniversityCard = ({ university }) => {
  const {
    name,
    location,
    logo_url,
    slug,
    content = {}
  } = university || {}

  const {
    ranking,
    programs = [],
    tuition_fee_range,
    duration
  } = content

  const [showAllPrograms, setShowAllPrograms] = useState(false)

  // Add safety checks for undefined values
  const safeUniversity = name || 'Unknown University'
  const safeLocation = location || 'Unknown Location'
  const safeProgram = programs.length > 0 ? programs[0] : 'Various Programs'
  const safeDuration = duration || 'Contact for details'
  const safeBudget = tuition_fee_range || 'Contact for details'
  const safeRanking = ranking || 'Unranked'
  const safeSlug = slug || safeUniversity.toLowerCase().replace(/\s+/g, '-')

  // Determine which programs to display
  const initialProgramsToShow = 4
  const hasMorePrograms = programs.length > initialProgramsToShow
  const programsToShow = showAllPrograms ? programs : programs.slice(0, initialProgramsToShow)
  const moreCount = programs.length - initialProgramsToShow

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* University Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={logo_url || '/api/placeholder/400/300'}
          alt={`${safeUniversity} campus`}
          className="w-full h-full object-cover"
        />
        {/* QS Ranking - Top Right Corner on Image */}
        <div className="absolute top-4 right-4">
          <div className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
            {safeRanking}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* University Name - Left Top */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {safeUniversity}
        </h3>

        {/* Location with Icon */}
        <div className="flex items-center text-gray-600 mb-4">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{safeLocation}</span>
        </div>

        {/* Program Name */}
        <div className="mb-4">
          <span className="text-gray-700 font-medium">{safeProgram}</span>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <span className="text-gray-700">Duration: {safeDuration}</span>
        </div>

        {/* Total Budget */}
        <div className="mb-4">
          <span className="text-gray-700">Total Budget: {safeBudget}</span>
        </div>

        {/* Additional Programs */}
        {programs.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {programsToShow.map((prog, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                >
                  {prog}
                </span>
              ))}
              {hasMorePrograms && !showAllPrograms && (
                <button
                  onClick={() => setShowAllPrograms(true)}
                  className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors duration-200"
                >
                  +{moreCount} more
                </button>
              )}
              {showAllPrograms && (
                <button
                  onClick={() => setShowAllPrograms(false)}
                  className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          {/* Button */}
          <Link
            to={`/universities/${safeSlug}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            Get More Info
            <FiArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UniversityCard
