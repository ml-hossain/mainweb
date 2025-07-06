// Initialize console suppression as early as possible
if (typeof window !== 'undefined') {
  const suppressedPatterns = [
    'DOMNodeInserted',
    'mutation event', 
    'Support for this event type has been removed',
    'Listener added for a \'DOMNodeInserted\' mutation event',
    '[Deprecation]',
    'chromestatus.com/feature/5083947249172480'
  ];
  
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && suppressedPatterns.some(pattern => message.includes(pattern))) {
      return; // Suppress warning
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && suppressedPatterns.some(pattern => message.includes(pattern))) {
      return; // Suppress error
    }
    originalError.apply(console, args);
  };
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

// Security and Performance imports
import { registerServiceWorker, performanceMonitor } from './lib/performance'
import { getCSP } from './lib/security'
import './lib/console' // Setup console warning suppression

// Development environment tests
if (import.meta.env.DEV) {
  import('./utils/envTest.js');
}

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

// Register Service Worker for caching (only in production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    registerServiceWorker()
  })
} else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Unregister service worker in development
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister()
    })
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
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
