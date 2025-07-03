import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import UniversityListCard from '../components/UniversityListCard'
import { FiLoader, FiGlobe, FiSearch, FiFilter } from 'react-icons/fi'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-blue-600 text-4xl mb-4" />
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Universities Worldwide
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover top universities across different countries and find the perfect institution for your academic journey
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiSearch className="inline w-4 h-4 mr-1" />
                Search Universities
              </label>
              <input
                type="text"
                placeholder="Search by name, location, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiGlobe className="inline w-4 h-4 mr-1" />
                Country
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCountry === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {countries.map(country => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCountry === country
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFilter className="inline w-4 h-4 mr-1" />
                University Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Types
                </button>
                {universityTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredUniversities.length} of {universities.length} universities
            {selectedCountry !== 'all' && ` in ${getCountryDisplayName(selectedCountry)}`}
            {selectedType !== 'all' && ` (${selectedType.replace('-', ' ')} universities)`}
          </p>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUniversities.map(university => (
              <UniversityListCard key={university.id} university={university} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiGlobe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedCountry !== 'all' || selectedType !== 'all' || searchTerm
                ? 'No universities found'
                : 'Coming Soon'
              }
            </h3>
            <p className="text-gray-600 mb-6">
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
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
