import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import { FiLoader, FiAlertCircle } from 'react-icons/fi'

const UniversityPage = () => {
  const { slug } = useParams()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
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
      <div className="bg-white">
        <div className="relative h-64 md:h-96 bg-gray-800">
          <img
            src={university.banner_url || '/api/placeholder/1200/400'}
            alt={`${university.name} Banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          <div className="absolute inset-0 flex items-end p-8">
            <div className="max-w-7xl">
              <img src={university.logo_url} alt={`${university.name} Logo`} className="h-20 w-20 md:h-24 md:w-24 bg-white p-2 rounded-lg shadow-lg mb-4"/>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white shadow-md">{university.name}</h1>
              <p className="text-xl mt-2 text-gray-200 shadow-md">{university.location}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div 
            className="prose lg:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: university.content || '<p>No additional details available at the moment. Please check back later.</p>' }} 
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UniversityPage 