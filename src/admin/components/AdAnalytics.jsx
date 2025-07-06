import React, { useState, useEffect } from 'react'
import { FiEye, FiMousePointer, FiTrendingUp, FiActivity } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

const AdAnalytics = ({ adId, className = '' }) => {
  const [analytics, setAnalytics] = useState({
    views: 0,
    clicks: 0,
    impressions: 0,
    ctr: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (adId) {
      fetchAnalytics()
    }
  }, [adId])

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('content_placements')
        .select('view_count, click_count, current_impressions')
        .eq('id', adId)
        .single()

      if (error) throw error

      const views = data.view_count || 0
      const clicks = data.click_count || 0
      const impressions = data.current_impressions || 0
      const ctr = views > 0 ? (clicks / views * 100).toFixed(2) : 0

      setAnalytics({
        views,
        clicks,
        impressions,
        ctr
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
          <FiEye className="w-4 h-4" />
          <span>Views</span>
        </div>
        <div className="text-2xl font-bold text-blue-700">
          {analytics.views.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
          <FiMousePointer className="w-4 h-4" />
          <span>Clicks</span>
        </div>
        <div className="text-2xl font-bold text-green-700">
          {analytics.clicks.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
          <FiActivity className="w-4 h-4" />
          <span>Impressions</span>
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {analytics.impressions.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
          <FiTrendingUp className="w-4 h-4" />
          <span>CTR</span>
        </div>
        <div className="text-2xl font-bold text-orange-700">
          {analytics.ctr}%
        </div>
      </div>
    </div>
  )
}

export default AdAnalytics
