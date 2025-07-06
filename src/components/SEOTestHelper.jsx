import React, { useEffect, useState } from 'react'

// This component helps verify that SEO tags are properly set
const SEOTestHelper = () => {
  const [seoData, setSeoData] = useState({})
  
  useEffect(() => {
    // Check for meta tags after component mounts
    const title = document.title
    const description = document.querySelector('meta[name="description"]')?.content
    const keywords = document.querySelector('meta[name="keywords"]')?.content
    const canonical = document.querySelector('link[rel="canonical"]')?.href
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content
    const ogDescription = document.querySelector('meta[property="og:description"]')?.content
    const ogImage = document.querySelector('meta[property="og:image"]')?.content
    const twitterCard = document.querySelector('meta[name="twitter:card"]')?.content
    const robots = document.querySelector('meta[name="robots"]')?.content

    setSeoData({
      title,
      description,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      robots
    })
  }, [])

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      display: 'none' // Hidden by default, can be toggled via console
    }} id="seo-debug">
      <h4>SEO Debug Info:</h4>
      <div><strong>Title:</strong> {seoData.title}</div>
      <div><strong>Description:</strong> {seoData.description?.substring(0, 50)}...</div>
      <div><strong>Keywords:</strong> {seoData.keywords ? 'Set' : 'Missing'}</div>
      <div><strong>Canonical:</strong> {seoData.canonical ? 'Set' : 'Missing'}</div>
      <div><strong>OG Tags:</strong> {seoData.ogTitle ? 'Set' : 'Missing'}</div>
      <div><strong>Twitter Card:</strong> {seoData.twitterCard ? 'Set' : 'Missing'}</div>
      <div><strong>Robots:</strong> {seoData.robots}</div>
    </div>
  )
}

export default SEOTestHelper
