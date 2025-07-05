import React, { useEffect, useState } from 'react'
import { sanitizeHtml, rateLimiter, generateCSRFToken } from '../lib/security'

/**
 * Security Wrapper Component
 * Provides comprehensive security features for forms and sensitive content
 */
const SecurityWrapper = ({ 
  children, 
  requireAuth = false, 
  enableRateLimit = true,
  sanitizeInputs = true,
  generateCSRF = false,
  onSecurityViolation = null
}) => {
  const [csrfToken, setCsrfToken] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const [violations, setViolations] = useState(0)

  useEffect(() => {
    // Generate CSRF token if required
    if (generateCSRF) {
      setCsrfToken(generateCSRFToken())
    }

    // Monitor for security violations
    const handleSecurityEvent = (event) => {
      if (event.type === 'securityviolation' || 
          event.type === 'cspviolation' ||
          event.detail?.type === 'suspicious-activity') {
        
        setViolations(prev => prev + 1)
        
        if (violations >= 3) {
          setIsBlocked(true)
          if (onSecurityViolation) {
            onSecurityViolation(event)
          }
        }
      }
    }

    document.addEventListener('securityviolation', handleSecurityEvent)
    document.addEventListener('cspviolation', handleSecurityEvent)

    return () => {
      document.removeEventListener('securityviolation', handleSecurityEvent)
      document.removeEventListener('cspviolation', handleSecurityEvent)
    }
  }, [generateCSRF, violations, onSecurityViolation])

  // Rate limiting check
  useEffect(() => {
    if (enableRateLimit) {
      const identifier = getClientIdentifier()
      if (!rateLimiter.isAllowed(identifier)) {
        setIsBlocked(true)
        setTimeout(() => setIsBlocked(false), 60000) // Unblock after 1 minute
      }
    }
  }, [enableRateLimit])

  // Get client identifier for rate limiting
  const getClientIdentifier = () => {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      sessionStorage.length,
      localStorage.length
    ].join('|')
    
    return btoa(fingerprint).slice(0, 16)
  }

  // Enhanced form protection
  const protectForm = (formElement) => {
    if (!formElement) return

    // Add CSRF token to forms
    if (generateCSRF && csrfToken) {
      const existingToken = formElement.querySelector('input[name="_token"]')
      if (!existingToken) {
        const tokenInput = document.createElement('input')
        tokenInput.type = 'hidden'
        tokenInput.name = '_token'
        tokenInput.value = csrfToken
        formElement.appendChild(tokenInput)
      }
    }

    // Add input sanitization
    if (sanitizeInputs) {
      const inputs = formElement.querySelectorAll('input[type="text"], input[type="email"], textarea')
      inputs.forEach(input => {
        input.addEventListener('blur', (e) => {
          if (e.target.value) {
            e.target.value = sanitizeHtml(e.target.value)
          }
        })
      })
    }

    // Add honeypot fields (hidden fields to catch bots)
    const honeypot = document.createElement('input')
    honeypot.type = 'text'
    honeypot.name = 'website'
    honeypot.style.display = 'none'
    honeypot.tabIndex = -1
    honeypot.autoComplete = 'off'
    formElement.appendChild(honeypot)

    // Monitor for bot behavior
    formElement.addEventListener('submit', (e) => {
      const honeypotValue = formElement.querySelector('input[name="website"]')?.value
      if (honeypotValue) {
        e.preventDefault()
        console.warn('Bot detected - honeypot field filled')
        setIsBlocked(true)
        return false
      }
    })
  }

  // Apply security measures to child elements
  useEffect(() => {
    const forms = document.querySelectorAll('form')
    forms.forEach(protectForm)
  }, [csrfToken, sanitizeInputs, generateCSRF])

  // Block render if security violation detected
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-red-900 bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Temporarily Blocked</h2>
          <p className="text-gray-600 mb-6">
            Suspicious activity detected. Please wait a moment before trying again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="security-wrapper" data-csrf={csrfToken}>
      {children}
    </div>
  )
}

// Higher-order component for protecting specific components
export const withSecurity = (WrappedComponent, securityOptions = {}) => {
  return function SecurityProtectedComponent(props) {
    return (
      <SecurityWrapper {...securityOptions}>
        <WrappedComponent {...props} />
      </SecurityWrapper>
    )
  }
}

// Hook for accessing security context
export const useSecurity = () => {
  const [violations, setViolations] = useState(0)
  const [isSecure, setIsSecure] = useState(true)

  useEffect(() => {
    // Monitor for various security threats
    const threats = {
      // XSS attempts
      xss: () => {
        const scripts = document.getElementsByTagName('script')
        for (let script of scripts) {
          if (script.src && !script.src.startsWith(window.location.origin)) {
            return script.src.includes('malicious') || script.src.includes('xss')
          }
        }
        return false
      },

      // CSRF attempts
      csrf: () => {
        const forms = document.getElementsByTagName('form')
        for (let form of forms) {
          if (!form.querySelector('input[name="_token"]')) {
            return true
          }
        }
        return false
      },

      // Clickjacking attempts
      clickjacking: () => {
        return window.top !== window.self
      }
    }

    const checkThreats = () => {
      const detectedThreats = Object.keys(threats).filter(threat => threats[threat]())
      
      if (detectedThreats.length > 0) {
        setViolations(prev => prev + detectedThreats.length)
        setIsSecure(false)
        
        // Report security violation
        document.dispatchEvent(new CustomEvent('securityviolation', {
          detail: { threats: detectedThreats }
        }))
      }
    }

    // Check immediately and then periodically
    checkThreats()
    const interval = setInterval(checkThreats, 5000)

    return () => clearInterval(interval)
  }, [])

  return {
    violations,
    isSecure,
    generateToken: generateCSRFToken,
    sanitize: sanitizeHtml
  }
}

export default SecurityWrapper
