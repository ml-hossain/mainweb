import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Security and Performance imports
import { registerServiceWorker, performanceMonitor } from './lib/performance'
import { getCSP } from './lib/security'
import './lib/console' // Setup console warning suppression

// Note: CSP and X-Frame-Options should be set via HTTP headers, not meta tags
// These are handled at the server level for proper security
// Keeping only meta tags that work properly via DOM

// Security headers via meta tags (only those that work via meta)
const securityMetas = [
  { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
  { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
  { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
  { name: 'robots', content: 'index, follow, max-image-preview:large' }
]

securityMetas.forEach(meta => {
  const metaTag = document.createElement('meta')
  if (meta.httpEquiv) metaTag.httpEquiv = meta.httpEquiv
  if (meta.name) metaTag.name = meta.name
  metaTag.content = meta.content
  document.head.appendChild(metaTag)
})

// Disable right-click context menu for additional security
document.addEventListener('contextmenu', (e) => {
  if (process.env.NODE_ENV === 'production') {
    e.preventDefault()
  }
})

// Security key combinations (only in production)
document.addEventListener('keydown', (e) => {
  if (process.env.NODE_ENV === 'production') {
    // Disable F12
    if (e.key === 'F12') {
      e.preventDefault()
      return false
    }
    
    // Disable Ctrl+Shift+I (Dev Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return false
    }
    
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      return false
    }
    
    // Disable Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      return false
    }
  }
  // In development, allow all keyboard shortcuts for debugging
})

// Register Service Worker for caching
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    registerServiceWorker()
  })
}

// Performance monitoring
if (typeof window !== 'undefined' && window.performance) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics()
    }, 100)
  })
}

// Preload critical resources only if they exist
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Only preload images that are actually used
    const criticalImages = [
      { src: '/hero-bg.jpg', checkElement: '.hero-bg' },
      { src: '/logo.png', checkElement: '.app-logo' }
    ]
    
    criticalImages.forEach(({ src, checkElement }) => {
      // Only preload if the element that uses this image exists
      if (document.querySelector(checkElement)) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      }
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
