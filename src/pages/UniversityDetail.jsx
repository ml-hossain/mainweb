import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiGlobe, FiStar, FiCheck } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const UniversityDetail = () => {
  const { id } = useParams()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUniversity()
  }, [id])

  const fetchUniversity = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setUniversity(data)
    } catch (error) {
      console.error('Error fetching university:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">University not found</h2>
          <Link to="/universities" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Back to Universities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/universities"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Universities
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {university.name}
                {university.is_featured && (
                  <FiStar className="inline-block w-6 h-6 text-yellow-500 fill-current ml-2" />
                )}
              </h1>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="w-4 h-4 mr-1" />
                <span>{university.country}</span>
              </div>
            </div>

            {university.logo_url && (
              <div className="w-40 h-40 bg-white rounded-lg shadow p-4 flex items-center justify-center">
                <img
                  src={university.logo_url}
                  alt={university.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {university.description && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About University</h2>
                <p className="text-gray-600 whitespace-pre-line">{university.description}</p>
              </div>
            )}

            {/* Programs */}
            {university.programs && university.programs.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Programs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {university.programs.map((program, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{program}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {university.requirements && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Admission Requirements</h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{university.requirements}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Information</h2>
              <div className="space-y-4">
                {university.ranking && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ranking</h3>
                    <p className="mt-1 text-lg text-gray-900">
                      #{university.ranking} {university.ranking_type}
                    </p>
                  </div>
                )}

                {university.tuition_fee_range && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tuition Fee Range</h3>
                    <p className="mt-1 text-lg text-green-600 font-medium">
                      {university.tuition_fee_range}
                    </p>
                  </div>
                )}

                {university.website_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Website</h3>
                    <a
                      href={university.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <FiGlobe className="w-4 h-4 mr-1" />
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Interested in Applying?</h2>
              <p className="text-blue-100 mb-6">
                Get personalized guidance and support for your application process.
              </p>
              <Link
                to="/consultation"
                className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300"
              >
                Schedule Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityDetail 