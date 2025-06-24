import React, { useState, useEffect } from 'react'
import { 
  FiTrendingUp,
  FiUsers,
  FiGlobe,
  FiMessageSquare,
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiEye
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Analytics = ({ onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  
  const [analyticsData] = useState({
    overview: {
      totalUsers: { value: 1245, change: 12.5, trend: 'up' },
      newRegistrations: { value: 89, change: -3.2, trend: 'down' },
      consultations: { value: 156, change: 24.8, trend: 'up' },
      conversions: { value: 67, change: 8.7, trend: 'up' },
      revenue: { value: 125000, change: 15.3, trend: 'up' },
      avgSessionDuration: { value: '4m 32s', change: 5.2, trend: 'up' }
    },
    traffic: {
      totalVisitors: 8450,
      pageViews: 24680,
      bounceRate: 42.3,
      avgSessionDuration: '4m 32s',
      topPages: [
        { page: '/services', views: 3420, percentage: 22.1 },
        { page: '/', views: 2890, percentage: 18.7 },
        { page: '/about', views: 1560, percentage: 10.1 },
        { page: '/consultation', views: 1340, percentage: 8.7 },
        { page: '/contact', views: 980, percentage: 6.3 }
      ],
      sources: [
        { source: 'Google Search', visitors: 3200, percentage: 38.9 },
        { source: 'Direct', visitors: 2100, percentage: 25.5 },
        { source: 'Social Media', visitors: 1800, percentage: 21.9 },
        { source: 'Referrals', visitors: 890, percentage: 10.8 },
        { source: 'Email', visitors: 250, percentage: 3.0 }
      ]
    },
    services: {
      mostPopular: [
        { service: 'University Selection', requests: 145, conversion: 78.6 },
        { service: 'Application Assistance', requests: 98, conversion: 82.3 },
        { service: 'Visa Processing', requests: 76, conversion: 91.2 },
        { service: 'Scholarship Guidance', requests: 54, conversion: 68.5 },
        { service: 'Test Preparation', requests: 43, conversion: 74.4 }
      ],
      satisfaction: {
        average: 4.7,
        total: 287,
        distribution: [
          { rating: 5, count: 189, percentage: 65.9 },
          { rating: 4, count: 67, percentage: 23.3 },
          { rating: 3, count: 21, percentage: 7.3 },
          { rating: 2, count: 7, percentage: 2.4 },
          { rating: 1, count: 3, percentage: 1.0 }
        ]
      }
    },
    geographical: [
      { country: 'Malaysia', users: 456, percentage: 42.1 },
      { country: 'Indonesia', users: 234, percentage: 21.6 },
      { country: 'Singapore', users: 123, percentage: 11.4 },
      { country: 'Thailand', users: 89, percentage: 8.2 },
      { country: 'Vietnam', users: 67, percentage: 6.2 },
      { country: 'Others', users: 114, percentage: 10.5 }
    ]
  })

  const periods = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' },
    { value: '1year', label: 'Last year' }
  ]

  const metrics = [
    { value: 'overview', label: 'Overview', icon: FiBarChart2 },
    { value: 'traffic', label: 'Website Traffic', icon: FiActivity },
    { value: 'services', label: 'Services Analytics', icon: FiGlobe },
    { value: 'users', label: 'User Behavior', icon: FiUsers },
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

  const MetricCard = ({ title, value, change, trend, icon: Icon, isCurrency = false }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {isCurrency ? formatCurrency(value) : (typeof value === 'number' ? formatNumber(value) : value)}
          </p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={analyticsData.overview.totalUsers.value}
          change={analyticsData.overview.totalUsers.change}
          trend={analyticsData.overview.totalUsers.trend}
          icon={FiUsers}
        />
        <MetricCard
          title="New Registrations"
          value={analyticsData.overview.newRegistrations.value}
          change={analyticsData.overview.newRegistrations.change}
          trend={analyticsData.overview.newRegistrations.trend}
          icon={FiUserPlus}
        />
        <MetricCard
          title="Consultations"
          value={analyticsData.overview.consultations.value}
          change={analyticsData.overview.consultations.change}
          trend={analyticsData.overview.consultations.trend}
          icon={FiMessageSquare}
        />
        <MetricCard
          title="Conversions"
          value={analyticsData.overview.conversions.value}
          change={analyticsData.overview.conversions.change}
          trend={analyticsData.overview.conversions.trend}
          icon={FiTrendingUp}
        />
        <MetricCard
          title="Revenue"
          value={analyticsData.overview.revenue.value}
          change={analyticsData.overview.revenue.change}
          trend={analyticsData.overview.revenue.trend}
          icon={FiDollarSign}
          isCurrency={true}
        />
        <MetricCard
          title="Avg Session Duration"
          value={analyticsData.overview.avgSessionDuration.value}
          change={analyticsData.overview.avgSessionDuration.change}
          trend={analyticsData.overview.avgSessionDuration.trend}
          icon={FiActivity}
        />
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Chart visualization would be integrated here</p>
            <p className="text-sm text-gray-500">Using libraries like Chart.js or D3.js</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTraffic = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.traffic.totalVisitors)}</div>
          <div className="text-sm text-gray-600">Total Visitors</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.traffic.pageViews)}</div>
          <div className="text-sm text-gray-600">Page Views</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-gray-900">{analyticsData.traffic.bounceRate}%</div>
          <div className="text-sm text-gray-600">Bounce Rate</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-gray-900">{analyticsData.traffic.avgSessionDuration}</div>
          <div className="text-sm text-gray-600">Avg Session</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analyticsData.traffic.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{page.page}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-900">{formatNumber(page.views)}</div>
                  <div className="text-xs text-gray-500">{page.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {analyticsData.traffic.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{source.source}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-900">{formatNumber(source.visitors)}</div>
                  <div className="text-xs text-gray-500">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderServices = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Services</h3>
          <div className="space-y-4">
            {analyticsData.services.mostPopular.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{service.service}</div>
                  <div className="text-xs text-gray-500">{service.requests} requests</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{service.conversion}%</div>
                  <div className="text-xs text-gray-500">conversion</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900">{analyticsData.services.satisfaction.average}</div>
            <div className="text-sm text-gray-500">Average rating from {analyticsData.services.satisfaction.total} reviews</div>
          </div>
          <div className="space-y-2">
            {analyticsData.services.satisfaction.distribution.map((rating, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-sm text-gray-600 w-8">{rating.rating}★</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">{rating.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderGeographical = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Country</h3>
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
      case 'traffic': return renderTraffic()
      case 'services': return renderServices()
      case 'geographical': return renderGeographical()
      default: return renderOverview()
    }
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track performance, user behavior, and business metrics</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiDownload className="w-4 h-4 mr-2" />
              Export Report
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

// Missing import for FiUserPlus
const FiUserPlus = FiUsers

export default Analytics
