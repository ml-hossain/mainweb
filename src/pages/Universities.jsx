import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FiSearch, FiFilter, FiGlobe, FiLoader } from 'react-icons/fi'
import UniversityListCard from '../components/UniversityListCard'
const Universities = () => {
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Available countries and types
  const countries = ['canada', 'malaysia', 'usa', 'uk', 'australia', 'germany', 'sweden', 'netherlands']
  const universityTypes = ['public', 'semi-government', 'private', 'international']

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    filterUniversities()
  }, [universities, selectedCountry, selectedType, searchTerm])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setUniversities(data || [])
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUniversities = () => {
    let filtered = universities

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(uni => 
        uni.content?.country?.toLowerCase() === selectedCountry ||
        uni.location?.toLowerCase().includes(selectedCountry)
      )
    }

    // Filter by university type
    if (selectedType !== 'all') {
      filtered = filtered.filter(uni => 
        uni.content?.university_type?.toLowerCase().includes(selectedType)
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(uni =>
        uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.content?.programs?.some(program => 
          program.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    setFilteredUniversities(filtered)
  }

  const getCountryDisplayName = (country) => {
    const countryNames = {
      'canada': 'Canada',
      'malaysia': 'Malaysia', 
      'usa': 'USA',
      'uk': 'United Kingdom',
      'australia': 'Australia',
      'germany': 'Germany',
      'sweden': 'Sweden',
      'netherlands': 'Netherlands'
    }
    return countryNames[country] || country.charAt(0).toUpperCase() + country.slice(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-blue-400 text-4xl mb-4" />
          <p className="text-gray-300">Loading universities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Hero Section - Fully Responsive */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent leading-tight break-words">
              Explore Universities Worldwide
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-1 sm:px-2 leading-relaxed break-words">
              Discover top universities across different countries and find the perfect institution for your academic journey
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search */}
            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <FiSearch className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Search Universities
              </label>
              <input
                type="text"
                placeholder="Search by name, location, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 break-words"
              />
            </div>

            {/* Country Filter */}
            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <FiGlobe className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Country
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedCountry === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {countries.map(country => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedCountry === country
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {getCountryDisplayName(country)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* University Type Filter - Only show when a country is selected */}
          {selectedCountry !== 'all' && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <FiFilter className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                University Type
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All Types
                </button>
                {universityTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedType === type
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm md:text-base text-gray-300 px-1 break-words">
            Showing {filteredUniversities.length} of {universities.length} universities
            {selectedCountry !== 'all' && ` in ${getCountryDisplayName(selectedCountry)}`}
            {selectedType !== 'all' && ` (${selectedType.replace('-', ' ')} universities)`}
          </p>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filteredUniversities.map(university => (
              <UniversityListCard key={university.id} university={university} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 md:py-16 px-4">
            <FiGlobe className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 break-words">
              {selectedCountry !== 'all' || selectedType !== 'all' || searchTerm
                ? 'No universities found'
                : 'Coming Soon'
              }
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto break-words">
              {selectedCountry !== 'all' || selectedType !== 'all' || searchTerm
                ? 'Try adjusting your filters or search terms to find universities.'
                : 'We are working on adding more universities. Please check back soon!'
              }
            </p>
            {(selectedCountry !== 'all' || selectedType !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCountry('all')
                  setSelectedType('all')
                  setSearchTerm('')
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Universities
