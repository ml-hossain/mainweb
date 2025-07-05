import { useEffect } from 'react'
import { useSeoData } from '../hooks/useSeoData'

const SeoHead = ({ pageSlug, fallbackData = {} }) => {
  const { seoData, loading } = useSeoData(pageSlug)

  // Use SEO data from database or fallback to props
  const seo = seoData || fallbackData

  useEffect(() => {
    if (loading) return

    // Update document title
    if (seo.meta_title) {
      document.title = seo.meta_title
    } else if (seo.page_title) {
      document.title = seo.page_title
    }

    // Function to update or create meta tag
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return

      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Update meta description
    updateMetaTag('description', seo.meta_description)

    // Update meta keywords
    updateMetaTag('keywords', seo.meta_keywords)

    // Update robots meta
    updateMetaTag('robots', seo.robots_meta || 'index, follow')

    // Update Open Graph tags
    updateMetaTag('og:title', seo.og_title, true)
    updateMetaTag('og:description', seo.og_description, true)
    updateMetaTag('og:image', seo.og_image_url, true)
    updateMetaTag('og:type', seo.og_type || 'website', true)
    updateMetaTag('og:url', seo.canonical_url, true)

    // Update Twitter Card tags
    updateMetaTag('twitter:card', seo.twitter_card || 'summary_large_image')
    updateMetaTag('twitter:title', seo.twitter_title)
    updateMetaTag('twitter:description', seo.twitter_description)
    updateMetaTag('twitter:image', seo.twitter_image_url)

    // Update canonical URL
    if (seo.canonical_url) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', seo.canonical_url)
    }

    // Update structured data (JSON-LD)
    if (seo.schema_markup && Object.keys(seo.schema_markup).length > 0) {
      let script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement('script')
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(seo.schema_markup)
    }

  }, [seo, loading])

  // This component doesn't render anything to the DOM
  return null
}

export default SeoHead
