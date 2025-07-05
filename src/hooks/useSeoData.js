import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useSeoData = (pageSlug) => {
  const [seoData, setSeoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!pageSlug) {
      setLoading(false)
      return
    }

    const fetchSeoData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('page_seo_settings')
          .select('*')
          .eq('page_slug', pageSlug)
          .eq('is_active', true)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error
        }

        setSeoData(data || null)
      } catch (err) {
        console.error('Error fetching SEO data:', err)
        setError(err)
        setSeoData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSeoData()

    // Set up real-time subscription for changes
    const channel = supabase
      .channel(`seo-${pageSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_seo_settings',
          filter: `page_slug=eq.${pageSlug}`
        },
        (payload) => {
          console.log('SEO data updated:', payload)
          
          if (payload.eventType === 'DELETE') {
            setSeoData(null)
          } else if (payload.new && payload.new.is_active) {
            setSeoData(payload.new)
          } else if (payload.new && !payload.new.is_active) {
            setSeoData(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pageSlug])

  return { seoData, loading, error }
}

export default useSeoData
