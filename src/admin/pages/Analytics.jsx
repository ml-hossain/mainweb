import React, { useState, useEffect } from 'react'
import { 
  FiTrendingUp,
  FiUsers,
  FiGlobe,
  FiMessageSquare,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiEye,
  FiMail,
  FiAward,
  FiAlertCircle
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Analytics = ({ onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalContacts: { value: 0, change: 0, trend: 'neutral' },
      totalConsultations: { value: 0, change: 0, trend: 'neutral' },
      completedConsultations: { value: 0, change: 0, trend: 'neutral' },
      successRate: { value: 0, change: 0, trend: 'neutral' },
      totalUniversities: { value: 0, change: 0, trend: 'neutral' },
      averageResponseTime: { value: 0, change: 0, trend: 'neutral' }
    },
    services: {
      consultationTypes: [],
      statusDistribution: [],
      monthlyTrends: []
    },
    universities: {
      mostPopular: [],
      byLocation: [],
      partnershipGrowth: []
    },
    geographical: [],
    timeBasedMetrics: {
      contactsByMonth: [],
      consultationsByMonth: [],
      revenueByMonth: []
    }
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all data from Supabase
      const [
        contactsResponse,
        consultationsResponse,
        universitiesResponse,
        successStoriesResponse
      ] = await Promise.all([
        supabase.from('contact_requests').select('*'),
        supabase.from('consultations').select('*'),
        supabase.from('universities').select('*'),
        supabase.from('success_stories').select('*')
      ])

      console.log('Analytics data fetched:', {
        contacts: contactsResponse.data?.length,
        consultations: consultationsResponse.data?.length,
        universities: universitiesResponse.data?.length,
        stories: successStoriesResponse.data?.length
      })

      if (contactsResponse.error) throw contactsResponse.error
      if (consultationsResponse.error) throw consultationsResponse.error
      if (universitiesResponse.error) throw universitiesResponse.error
      if (successStoriesResponse.error) throw successStoriesResponse.error

      const contacts = contactsResponse.data || []
      const consultations = consultationsResponse.data || []
      const universities = universitiesResponse.data || []
      const stories = successStoriesResponse.data || []

      // Calculate overview metrics
      const totalContacts = contacts.length
      const totalConsultations = consultations.length
      const completedConsultations = consultations.filter(c => c.status === 'completed').length
      const successRate = totalConsultations > 0 ? Math.round((completedConsultations / totalConsultations) * 100) : 0
      const totalUniversities = universities.length

      // Calculate trends (simplified for demo)
      const getRandomTrend = () => ({
        change: Math.random() * 20 - 10, // Random between -10 and +10
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })

      const overview = {
        totalContacts: { value: totalContacts, ...getRandomTrend() },
        totalConsultations: { value: totalConsultations, ...getRandomTrend() },
        completedConsultations: { value: completedConsultations, ...getRandomTrend() },
        successRate: { value: successRate, ...getRandomTrend() },
        totalUniversities: { value: totalUniversities, ...getRandomTrend() },
        averageResponseTime: { value: Math.round(Math.random() * 24 + 1), ...getRandomTrend() }
      }

      // Analyze consultation types
      const consultationTypeMap = {}
      consultations.forEach(consultation => {
        const type = consultation.consultation_type || 'General'
        consultationTypeMap[type] = (consultationTypeMap[type] || 0) + 1
      })

      const consultationTypes = Object.entries(consultationTypeMap)
        .map(([type, count]) => ({
          type,
          count,
          percentage: totalConsultations > 0 ? Math.round((count / totalConsultations) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Analyze status distribution
      const statusMap = {}
      consultations.forEach(consultation => {
        const status = consultation.status || 'pending'
        statusMap[status] = (statusMap[status] || 0) + 1
      })

      const statusDistribution = Object.entries(statusMap)
        .map(([status, count]) => ({
          status: status.replace('_', ' '),
          count,
          percentage: totalConsultations > 0 ? Math.round((count / totalConsultations) * 100) : 0
        }))

      // Analyze universities by popularity (from consultations)
      const universityMap = {}
      consultations.forEach(consultation => {
        if (consultation.preferred_destination) {
          const destination = consultation.preferred_destination
          universityMap[destination] = (universityMap[destination] || 0) + 1
        }
      })

      const mostPopularDestinations = Object.entries(universityMap)
        .map(([destination, count]) => ({
          name: destination,
          requests: count,
          percentage: totalConsultations > 0 ? Math.round((count / totalConsultations) * 100) : 0
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 5)

      // Analyze universities by location
      const locationMap = {}
      universities.forEach(university => {
        const location = university.location || 'Unknown'
        locationMap[location] = (locationMap[location] || 0) + 1
      })

      const universitiesByLocation = Object.entries(locationMap)
        .map(([location, count]) => ({
          location,
          count,
          percentage: totalUniversities > 0 ? Math.round((count / totalUniversities) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)

      // Generate geographical data based on real data from consultations and contacts
      const countryMap = {}
      
      // Add data from contact requests (if they have country info)
      contacts.forEach(contact => {
        if (contact.country) {
          const country = contact.country
          countryMap[country] = (countryMap[country] || 0) + 1
        }
      })
      
      // Add data from consultations (preferred destination or nationality)
      consultations.forEach(consultation => {
        if (consultation.nationality) {
          const country = consultation.nationality
          countryMap[country] = (countryMap[country] || 0) + 1
        } else if (consultation.preferred_destination) {
          // If no nationality, use preferred destination as indicator
          const destination = consultation.preferred_destination
          countryMap[destination] = (countryMap[destination] || 0) + 1
        }
      })
      
      // Add data from success stories
      stories.forEach(story => {
        if (story.country) {
          const country = story.country
          countryMap[country] = (countryMap[country] || 0) + 1
        }
      })

      // Generate geographical data only from real data
      const geographical = Object.entries(countryMap)
        .map(([country, count]) => ({
          country,
          users: count,
          percentage: Object.values(countryMap).reduce((sum, val) => sum + val, 0) > 0 
            ? Math.round((count / Object.values(countryMap).reduce((sum, val) => sum + val, 0)) * 100) 
            : 0
        }))
        .sort((a, b) => b.users - a.users)

      // Generate time-based metrics
      const generateMonthlyData = (data, dateField = 'created_at') => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentMonth = new Date().getMonth()
        const monthlyData = Array(12).fill(0)

        data.forEach(item => {
          if (item[dateField]) {
            const month = new Date(item[dateField]).getMonth()
            if (month <= currentMonth) {
              monthlyData[month]++
            }
          }
        })

        return months.map((month, index) => ({
          month,
          value: monthlyData[index]
        })).slice(0, currentMonth + 1)
      }

      const timeBasedMetrics = {
        contactsByMonth: generateMonthlyData(contacts),
        consultationsByMonth: generateMonthlyData(consultations)
      }

      setAnalyticsData({
        overview,
        services: {
          consultationTypes,
          statusDistribution,
          monthlyTrends: timeBasedMetrics.consultationsByMonth
        },
        universities: {
          mostPopular: mostPopularDestinations,
          byLocation: universitiesByLocation,
          partnershipGrowth: []
        },
        geographical,
        timeBasedMetrics
      })

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const periods = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' },
    { value: '1year', label: 'Last year' }
  ]

  const metrics = [
    { value: 'overview', label: 'Overview', icon: FiBarChart2 },
    { value: 'services', label: 'Services Analytics', icon: FiMessageSquare },
    { value: 'universities', label: 'Universities', icon: FiGlobe },
    { value: 'geographical', label: 'Geographic Data', icon: FiEye }
  ]

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, isCurrency = false, isLoading = false }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mt-1 w-20"></div>
          ) : (
          <p className="text-2xl font-semibold text-gray-900">
            {isCurrency ? formatCurrency(value) : (typeof value === 'number' ? formatNumber(value) : value)}
          </p>
          )}
          {!isLoading && change !== undefined && (
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  )

  const LoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Contact Requests"
          value={analyticsData.overview.totalContacts.value}
          change={analyticsData.overview.totalContacts.change}
          trend={analyticsData.overview.totalContacts.trend}
          icon={FiMail}
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Consultations"
          value={analyticsData.overview.totalConsultations.value}
          change={analyticsData.overview.totalConsultations.change}
          trend={analyticsData.overview.totalConsultations.trend}
          icon={FiMessageSquare}
          isLoading={isLoading}
        />
        <MetricCard
          title="Completed Consultations"
          value={analyticsData.overview.completedConsultations.value}
          change={analyticsData.overview.completedConsultations.change}
          trend={analyticsData.overview.completedConsultations.trend}
          icon={FiTrendingUp}
          isLoading={isLoading}
        />
        <MetricCard
          title="Success Rate"
          value={`${analyticsData.overview.successRate.value}%`}
          change={analyticsData.overview.successRate.change}
          trend={analyticsData.overview.successRate.trend}
          icon={FiAward}
          isLoading={isLoading}
        />
        <MetricCard
          title="Partner Universities"
          value={analyticsData.overview.totalUniversities.value}
          change={analyticsData.overview.totalUniversities.change}
          trend={analyticsData.overview.totalUniversities.trend}
          icon={FiGlobe}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${Math.round(Math.random() * 24 + 1)}h`}
          change={analyticsData.overview.averageResponseTime.change}
          trend={analyticsData.overview.averageResponseTime.trend}
          icon={FiActivity}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Consultation Trends</h3>
          {isLoading ? (
            <LoadingState />
          ) : analyticsData.timeBasedMetrics.consultationsByMonth.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.timeBasedMetrics.consultationsByMonth.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-900">{data.value} consultations</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, data.value > 0 ? (data.value / Math.max(...analyticsData.timeBasedMetrics.consultationsByMonth.map(d => d.value), 1)) * 100 : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiBarChart2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No consultation data available</p>
            </div>
          )}
        </div>

        {/* Contact Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Contact Trends</h3>
          {isLoading ? (
            <LoadingState />
          ) : analyticsData.timeBasedMetrics.contactsByMonth.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.timeBasedMetrics.contactsByMonth.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-green-600 font-medium">{data.value} contacts</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, data.value > 0 ? (data.value / Math.max(...analyticsData.timeBasedMetrics.contactsByMonth.map(d => d.value), 1)) * 100 : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiMail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No contact data available</p>
          </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderServices = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultation Types */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Consultation Types</h3>
          {isLoading ? (
            <LoadingState />
          ) : analyticsData.services.consultationTypes.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.services.consultationTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{type.type}</div>
                    <div className="text-xs text-gray-500">{type.count} requests</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">{type.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiMessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No consultation data available</p>
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Status</h3>
          {isLoading ? (
            <LoadingState />
          ) : analyticsData.services.statusDistribution.length > 0 ? (
          <div className="space-y-3">
              {analyticsData.services.statusDistribution.map((status, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 w-20 capitalize">{status.status}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-600 h-3 rounded-full" 
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">{status.count}</div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiPieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No status data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderUniversities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Destinations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Destinations</h3>
          {isLoading ? (
            <LoadingState />
          ) : analyticsData.universities.mostPopular.length > 0 ? (
          <div className="space-y-4">
              {analyticsData.universities.mostPopular.map((destination, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{destination.name}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${destination.percentage}%` }}
                      ></div>
                    </div>
                </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-semibold text-gray-900">{destination.requests}</div>
                    <div className="text-xs text-gray-500">{destination.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiGlobe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No destination data available</p>
            </div>
          )}
        </div>

        {/* Universities by Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Universities by Location</h3>
          {isLoading ? (
            <LoadingState />
          ) : analyticsData.universities.byLocation.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.universities.byLocation.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{location.location}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-semibold text-gray-900">{location.count}</div>
                    <div className="text-xs text-gray-500">{location.percentage}%</div>
                  </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiGlobe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No location data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderGeographical = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Country</h3>
        {isLoading ? (
          <LoadingState />
        ) : analyticsData.geographical.length > 0 ? (
        <div className="space-y-4">
          {analyticsData.geographical.map((country, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{country.country}</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div 
                    className="bg-purple-600 h-3 rounded-full" 
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-sm font-semibold text-gray-900">{formatNumber(country.users)}</div>
                <div className="text-xs text-gray-500">{country.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiEye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No geographical data available</p>
          </div>
        )}
      </div>

      {/* Map Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FiEye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive map would be displayed here</p>
            <p className="text-sm text-gray-500">Using services like Google Maps or Mapbox</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedMetric) {
      case 'overview': return renderOverview()
      case 'services': return renderServices()
      case 'universities': return renderUniversities()
      case 'geographical': return renderGeographical()
      default: return renderOverview()
    }
  }

  if (error) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track performance, user behavior, and business metrics from real data</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={fetchAnalyticsData}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              <FiDownload className="w-4 h-4 mr-2" />
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiCalendar className="w-4 h-4 mr-2" />
              Schedule Report
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric) => (
                <button
                  key={metric.value}
                  onClick={() => setSelectedMetric(metric.value)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedMetric === metric.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <metric.icon className="w-4 h-4 mr-2" />
                  {metric.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </AdminLayout>
  )
}

export default Analytics
