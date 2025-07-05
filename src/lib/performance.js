/**
 * Performance Optimization Utilities
 * Provides tools to maximize website speed and responsiveness
 */

// Lazy loading utility for images
export const lazyLoadImage = (src, placeholder = '/api/placeholder/400/300') => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(placeholder)
    img.src = src
  })
}

// Debounce function for expensive operations
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Preload critical resources
export const preloadResource = (href, as = 'script', crossorigin = null) => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossorigin) link.crossOrigin = crossorigin
    document.head.appendChild(link)
  }
}

// Critical resource preloader
export const preloadCriticalResources = () => {
  const criticalResources = [
    { href: '/fonts/main.woff2', as: 'font', crossorigin: 'anonymous' },
    { href: '/css/critical.css', as: 'style' }
  ]
  
  criticalResources.forEach(resource => {
    preloadResource(resource.href, resource.as, resource.crossorigin)
  })
}

// Memory management for large datasets
export const createVirtualList = (items, itemHeight = 50, containerHeight = 400) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const buffer = 5 // Extra items to render for smooth scrolling
  
  return {
    getVisibleItems: (scrollTop) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
      const endIndex = Math.min(items.length - 1, startIndex + visibleCount + buffer * 2)
      
      return {
        items: items.slice(startIndex, endIndex + 1),
        startIndex,
        endIndex,
        offsetY: startIndex * itemHeight
      }
    },
    totalHeight: items.length * itemHeight
  }
}

// Optimize animations with RAF
export const animateWithRAF = (draw, duration = 1000) => {
  const start = performance.now()
  
  const animate = (currentTime) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)
    
    draw(progress)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

// Efficient DOM updates with batching
class DOMBatcher {
  constructor() {
    this.reads = []
    this.writes = []
    this.scheduled = false
  }
  
  read(fn) {
    this.reads.push(fn)
    this.schedule()
  }
  
  write(fn) {
    this.writes.push(fn)
    this.schedule()
  }
  
  schedule() {
    if (!this.scheduled) {
      this.scheduled = true
      requestAnimationFrame(() => this.flush())
    }
  }
  
  flush() {
    // Batch all reads first
    this.reads.forEach(fn => fn())
    this.reads = []
    
    // Then all writes
    this.writes.forEach(fn => fn())
    this.writes = []
    
    this.scheduled = false
  }
}

export const domBatcher = new DOMBatcher()

// Image optimization and compression
export const optimizeImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate optimal dimensions
      let { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      
      if (ratio < 1) {
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Smart caching with expiration
class SmartCache {
  constructor(maxSize = 100, defaultTTL = 300000) { // 5 minutes default
    this.cache = new Map()
    this.timers = new Map()
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }
  
  set(key, value, ttl = this.defaultTTL) {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.delete(firstKey)
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
    
    // Set expiration timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }
    
    const timer = setTimeout(() => this.delete(key), ttl)
    this.timers.set(key, timer)
  }
  
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }
    
    return item.value
  }
  
  delete(key) {
    this.cache.delete(key)
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
  }
  
  clear() {
    this.cache.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }
}

export const cache = new SmartCache()

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }
  
  if (typeof IntersectionObserver !== 'undefined') {
    return new IntersectionObserver(callback, defaultOptions)
  }
  
  // Fallback for browsers without IntersectionObserver
  return {
    observe: (element) => {
      // Immediate callback for fallback
      callback([{ target: element, isIntersecting: true }])
    },
    unobserve: () => {},
    disconnect: () => {}
  }
}

// Resource loading priority manager
export const loadResourceWithPriority = async (url, priority = 'low') => {
  const controller = new AbortController()
  
  const options = {
    signal: controller.signal,
    ...(priority === 'high' && { priority: 'high' })
  }
  
  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Resource loading failed:', error)
    }
    throw error
  }
}

// Web Worker utility for heavy computations
export const createWorker = (workerFunction) => {
  const blob = new Blob([`(${workerFunction.toString()})()`], {
    type: 'application/javascript'
  })
  return new Worker(URL.createObjectURL(blob))
}

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Service Worker registered:', registration)
      }
      return registration
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Service Worker registration failed:', error)
      }
    }
  }
}

// Performance monitoring
export const performanceMonitor = {
  // Measure page load time
  getPageLoadTime: () => {
    const navigation = performance.getEntriesByType('navigation')[0]
    return navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
  },
  
  // Measure First Contentful Paint
  getFCP: () => {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
    return fcpEntry ? fcpEntry.startTime : 0
  },
  
  // Measure Largest Contentful Paint
  getLCP: () => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
        observer.disconnect()
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    })
  },
  
  // Log performance metrics
  logMetrics: () => {
    const metrics = {
      pageLoad: performanceMonitor.getPageLoadTime(),
      fcp: performanceMonitor.getFCP(),
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    }
    
    console.log('Performance Metrics:', metrics)
    return metrics
  }
}
