import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FiLoader, FiAlertCircle, FiMapPin, FiExternalLink, FiStar } from 'react-icons/fi'

const UniversityPage = () => {
  const { slug } = useParams()
  const [university, setUniversity] = useState(null)
  const [otherUniversities, setOtherUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOthers, setLoadingOthers] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUniversityData = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error) throw error
        setUniversity(data)

      } catch (err) {
        console.error('Error fetching university data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchUniversityData()
    }
  }, [slug])

  useEffect(() => {
    const fetchOtherUniversities = async () => {
      setLoadingOthers(true)
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .eq('is_active', true)
          .neq('slug', slug)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(8)

        if (error) throw error
        setOtherUniversities(data || [])

      } catch (err) {
        console.error('Error fetching other universities:', err)
      } finally {
        setLoadingOthers(false)
      }
    }

    if (slug) {
      fetchOtherUniversities()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <FiAlertCircle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Failed to load data</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">University Not Found</h2>
        <p className="text-gray-600 mt-2">We couldn't find the university you're looking for.</p>
      </div>
    )
  }

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative bg-gray-900">
        <img
          src={university.banner_url || '/api/placeholder/1200/400'}
          alt={`${university.name} Banner`}
          className="w-full h-72 md:h-96 object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* Layered Card Effect */}
        <div className="absolute left-1/2 top-56 md:top-72 transform -translate-x-1/2 w-full px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Logo Card */}
            <div className="-mt-24 md:-mt-32 bg-white rounded-full shadow-xl border-4 border-white w-32 h-32 md:w-40 md:h-40 flex items-center justify-center overflow-hidden relative z-20">
              <img
                src={university.logo_url || '/api/placeholder/120/120'}
                alt={`${university.name} Logo`}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </div>
            {/* Name & Location */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
                {university.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-lg text-blue-100 font-medium">
                <FiMapPin className="inline-block w-5 h-5 text-blue-300" />
                <span>{university.location}</span>
                {university.featured && (
                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-400 text-xs font-semibold text-gray-900">
                    <FiStar className="w-4 h-4 mr-1" /> Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="h-24 md:h-32" /> {/* Spacer for overlap */}
      </div>

      {/* MAIN CONTENT & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">About {university.name}</h2>
              <div
                className="prose lg:prose-xl max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: university.content || '<p>No additional details available at the moment. Please check back later.</p>' }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Info Card */}
            <div className="bg-gray-50 rounded-2xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiMapPin className="w-4 h-4 text-blue-500" />
                  <span>{university.location}</span>
                </div>
                {university.content?.ranking && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                    <span>Ranking: <span className="font-semibold">#{university.content.ranking}</span></span>
                  </div>
                )}
                {university.website_url && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiExternalLink className="w-4 h-4 text-blue-500" />
                    <a
                      href={university.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline font-medium"
                    >
                      Official Website
                    </a>
                  </div>
                )}
                {university.content?.tuition_fee_range && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Tuition Fee Range</span>
                    <p className="text-sm text-gray-700 mt-1 font-semibold">{university.content.tuition_fee_range}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Other Universities Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Other Universities</h3>
              {loadingOthers ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {otherUniversities.map((uni) => (
                    <Link
                      key={uni.id}
                      to={`/universities/${uni.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                    >
                      <img
                        src={uni.logo_url || '/api/placeholder/48/48'}
                        alt={`${uni.name} logo`}
                        className="w-12 h-12 object-contain bg-white border border-gray-200 rounded-full flex-shrink-0 shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {uni.name}
                        </h4>
                        <div className="flex items-center mt-1 gap-1">
                          <FiMapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 truncate">{uni.location}</span>
                        </div>
                        {uni.featured && (
                          <div className="flex items-center mt-1">
                            <FiStar className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-600">Featured</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                  {otherUniversities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No other universities available
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Contact CTA Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need More Information?</h3>
              <p className="text-sm mb-4 opacity-90">
                Get personalized guidance for your university application process.
              </p>
              <Link
                to="/consultation"
                className="w-full bg-white text-blue-700 py-2 px-4 rounded-lg text-center font-bold hover:bg-blue-50 transition-colors duration-300 inline-block shadow"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UniversityPage 