import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEOHead = ({ 
  title = "MA Education - Your Gateway to Global Education",
  description = "Expert guidance for international education. Find the best universities worldwide, get scholarship assistance, visa processing, and complete support for your study abroad journey.",
  keywords = "study abroad, international education, university admission, scholarship guidance, visa processing, overseas education, educational consultancy, global universities, student visa, study overseas",
  canonical = null,
  image = null,
  type = "website",
  noindex = false
}) => {
  const siteUrl = "https://ma-education.com"
  const defaultImage = `${siteUrl}/og-image.jpg`
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="MA Education" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl)} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content="MA Education" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:site" content="@MAEducation" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="application-name" content="MA Education" />
      
      {/* Language and Region */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="BD" />
      <meta name="geo.country" content="Bangladesh" />
      
      {/* Schema.org JSON-LD for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MA Education",
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "description": "Expert guidance for international education and study abroad opportunities",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BD"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English", "Bengali"]
          },
          "sameAs": [
            "https://facebook.com/maeducation",
            "https://twitter.com/maeducation",
            "https://linkedin.com/company/maeducation"
          ]
        })}
      </script>
    </Helmet>
  )
}

export default SEOHead
