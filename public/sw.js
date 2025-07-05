// Service Worker for Aggressive Caching and Security
const CACHE_NAME = 'ma-education-v1.2.1'
const STATIC_CACHE = 'static-cache-v1.2.1'
const DYNAMIC_CACHE = 'dynamic-cache-v1.2.1'
const IMAGE_CACHE = 'image-cache-v1.2.1'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
]

// Images and media to cache
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico']

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip cross-origin requests except for known CDNs
  if (url.origin !== location.origin && !isTrustedOrigin(url.origin)) {
    return
  }
  
  event.respondWith(handleRequest(request))
})

// Handle different types of requests with appropriate caching strategies
async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Static assets - Cache First strategy
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE)
    }
    
    // Images - Cache First with fallback
    if (isImage(url.pathname)) {
      return await cacheFirstWithFallback(request, IMAGE_CACHE)
    }
    
    // API calls - Network First strategy
    if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
      return await networkFirst(request, DYNAMIC_CACHE)
    }
    
    // HTML pages - Stale While Revalidate
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE)
    }
    
    // Default - Network First
    return await networkFirst(request, DYNAMIC_CACHE)
  } catch (error) {
    console.error('Service Worker fetch error:', error)
    return await handleOffline(request)
  }
}

// Cache First strategy - for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return await handleOffline(request)
  }
}

// Cache First with fallback - for images
async function cacheFirstWithFallback(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request, {
      headers: {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    })
    
    if (response.ok) {
      // Clone and cache the response
      cache.put(request, response.clone())
      return response
    } else {
      throw new Error('Image fetch failed')
    }
  } catch (error) {
    // Return placeholder image for failed image loads
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image not available</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    )
  }
}

// Network First strategy - for API calls
async function networkFirst(request, cacheName, timeout = 8000) {
  const cache = await caches.open(cacheName)
  
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(request, {
      signal: controller.signal,
      headers: {
        ...request.headers,
        'Cache-Control': 'no-cache'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Fallback to cache
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

// Stale While Revalidate - for HTML pages
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  // Always try to fetch fresh content in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)
  
  // Return cached version immediately if available
  if (cached) {
    return cached
  }
  
  // If no cache, wait for network
  return await fetchPromise || handleOffline(request)
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url)
  
  // Return offline page for HTML requests
  if (request.headers.get('accept')?.includes('text/html')) {
    return await caches.match('/offline.html') || new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
  
  // Return error for other requests
  return new Response('Network error occurred', {
    status: 408,
    statusText: 'Request Timeout'
  })
}

// Helper functions
function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|ttf|eot)$/i.test(pathname) ||
         pathname.includes('/assets/') ||
         pathname === '/' ||
         pathname === '/index.html'
}

function isImage(pathname) {
  return IMAGE_EXTENSIONS.some(ext => pathname.toLowerCase().includes(ext))
}

function isTrustedOrigin(origin) {
  const trustedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://unpkg.com',
    'https://supabase.co',
    'https://supabase.com'
  ]
  
  return trustedOrigins.some(trusted => origin.includes(trusted))
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  // Handle queued form submissions when connection is restored
  const cache = await caches.open(DYNAMIC_CACHE)
  const requests = await cache.keys()
  
  for (const request of requests) {
    if (request.url.includes('/api/') && request.method === 'POST') {
      try {
        await fetch(request)
        await cache.delete(request)
      } catch (error) {
        console.log('Background sync failed for:', request.url)
      }
    }
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: data.tag || 'notification',
    requireInteraction: true,
    actions: data.actions || []
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})

// Performance optimization - preload critical resources
self.addEventListener('message', (event) => {
  if (event.data?.type === 'PRELOAD_RESOURCES') {
    event.waitUntil(preloadResources(event.data.resources))
  }
})

async function preloadResources(resources) {
  const cache = await caches.open(STATIC_CACHE)
  
  for (const resource of resources) {
    try {
      const response = await fetch(resource)
      if (response.ok) {
        await cache.put(resource, response)
      }
    } catch (error) {
      console.log('Preload failed for:', resource)
    }
  }
}
