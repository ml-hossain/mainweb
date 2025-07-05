/**
 * Security Utilities
 * Provides comprehensive security measures for the application
 */

// XSS Protection - Sanitize HTML content
export const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Input validation and sanitization
export const validateInput = (input, type = 'text') => {
  if (!input || typeof input !== 'string') return false
  
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    name: /^[a-zA-Z\s]{2,50}$/,
    text: /^.{1,1000}$/,
    url: /^https?:\/\/.+/,
    alphanumeric: /^[a-zA-Z0-9]+$/
  }
  
  return patterns[type] ? patterns[type].test(input.trim()) : true
}

// SQL Injection Prevention
export const sanitizeForDatabase = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/sp_/gi, '')
}

// Rate limiting for API calls
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.requests = new Map()
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }
  
  isAllowed(identifier) {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }
}

export const rateLimiter = new RateLimiter()

// CSRF Protection
export const generateCSRFToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Content Security Policy
export const getCSP = () => {
  return {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' https://unpkg.com",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'img-src': "'self' data: https: blob:",
    'connect-src': "'self' https://*.supabase.co wss://*.supabase.co",
    'frame-ancestors': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'"
  }
}

// Encrypt sensitive data in localStorage
export const secureStorage = {
  set: (key, value) => {
    try {
      const encrypted = btoa(JSON.stringify(value))
      localStorage.setItem(`sec_${key}`, encrypted)
    } catch (error) {
      console.error('Failed to store data securely:', error)
    }
  },
  
  get: (key) => {
    try {
      const encrypted = localStorage.getItem(`sec_${key}`)
      if (!encrypted) return null
      return JSON.parse(atob(encrypted))
    } catch (error) {
      console.error('Failed to retrieve data securely:', error)
      return null
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(`sec_${key}`)
  },
  
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sec_')) {
        localStorage.removeItem(key)
      }
    })
  }
}

// Browser fingerprinting prevention
export const antiFingerprint = {
  // Randomize canvas fingerprinting
  protectCanvas: () => {
    if (typeof window !== 'undefined') {
      const originalGetContext = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function(...args) {
        const context = originalGetContext.apply(this, args)
        if (context && context.getImageData) {
          const originalGetImageData = context.getImageData
          context.getImageData = function(...args) {
            const imageData = originalGetImageData.apply(this, args)
            // Add slight random noise
            for (let i = 0; i < imageData.data.length; i += 4) {
              imageData.data[i] += Math.floor(Math.random() * 3) - 1
            }
            return imageData
          }
        }
        return context
      }
    }
  },
  
  // Protect against audio fingerprinting
  protectAudio: () => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const originalCreateAnalyser = AudioContext.prototype.createAnalyser
      AudioContext.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.apply(this)
        const originalGetByteFrequencyData = analyser.getByteFrequencyData
        analyser.getByteFrequencyData = function(array) {
          originalGetByteFrequencyData.apply(this, arguments)
          // Add noise to audio data
          for (let i = 0; i < array.length; i++) {
            array[i] += Math.floor(Math.random() * 3) - 1
          }
        }
        return analyser
      }
    }
  }
}

// Initialize anti-fingerprinting protection
if (typeof window !== 'undefined') {
  antiFingerprint.protectCanvas()
  antiFingerprint.protectAudio()
}

// Password strength validation
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    length: password.length >= minLength,
    upperCase: hasUpperCase,
    lowerCase: hasLowerCase,
    numbers: hasNumbers,
    specialChar: hasSpecialChar
  }
}

// Secure form submission
export const secureSubmit = async (formData, endpoint, options = {}) => {
  // Add CSRF token
  const csrfToken = generateCSRFToken()
  
  // Sanitize form data
  const sanitizedData = {}
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitizedData[key] = sanitizeHtml(value.trim())
    } else {
      sanitizedData[key] = value
    }
  }
  
  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    },
    body: JSON.stringify({
      ...sanitizedData,
      _token: csrfToken
    })
  }
  
  return fetch(endpoint, secureOptions)
}
