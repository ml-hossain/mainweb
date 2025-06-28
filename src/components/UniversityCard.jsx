import React from 'react'
import { Link } from 'react-router-dom'
import { FiStar, FiMapPin } from 'react-icons/fi'

const UniversityCard = ({ university }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* University Logo/Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
        {university.logo_url ? (
          <img
            src={university.logo_url}
            alt={university.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-xl text-gray-900">{university.name}</h3>
          {university.is_featured && (
            <FiStar className="w-5 h-5 text-yellow-500 fill-current" />
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{university.country}</span>
        </div>

        {university.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {university.description}
          </p>
        )}

        {/* Quick Info */}
        <div className="space-y-2 mb-6">
          {university.ranking && (
            <div className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
              #{university.ranking} {university.ranking_type}
            </div>
          )}
          {university.tuition_fee_range && (
            <div className="text-sm text-green-700 font-medium">
              {university.tuition_fee_range}
            </div>
          )}
        </div>

        {/* Programs Preview */}
        {university.programs && university.programs.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {university.programs.slice(0, 3).map((program, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {program}
                </span>
              ))}
              {university.programs.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{university.programs.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/universities/${university.id}`}
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Get More Info
        </Link>
      </div>
    </div>
  )
}

export default UniversityCard
