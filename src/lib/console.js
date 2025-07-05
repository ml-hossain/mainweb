/**
 * Console Utilities
 * Manages console output and suppresses known development warnings
 */

// List of warnings to suppress in development
const SUPPRESS_PATTERNS = [
  'Download the React DevTools',
  'findDOMNode is deprecated',
  'DOMNodeInserted',
  'mutation event',
  'Support for this event type has been removed',
  'The Content Security Policy directive',
  'X-Frame-Options may only be set via an HTTP header'
]

// Store original console methods
const originalConsole = {
  warn: console.warn,
  error: console.error,
  log: console.log
}

// Enhanced console wrapper
export const setupConsole = () => {
  if (process.env.NODE_ENV === 'development') {
    // Suppress specific warnings in development
    console.warn = (...args) => {
      const message = args[0]
      if (typeof message === 'string' && SUPPRESS_PATTERNS.some(pattern => message.includes(pattern))) {
        return // Suppress the warning
      }
      originalConsole.warn.apply(console, args)
    }

    console.error = (...args) => {
      const message = args[0]
      if (typeof message === 'string' && SUPPRESS_PATTERNS.some(pattern => message.includes(pattern))) {
        return // Suppress the error
      }
      originalConsole.error.apply(console, args)
    }
  }
}

// Restore original console methods
export const restoreConsole = () => {
  console.warn = originalConsole.warn
  console.error = originalConsole.error
  console.log = originalConsole.log
}

// Clean logging for production
export const cleanLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    originalConsole.log.apply(console, args)
  }
}

// Setup console on import
setupConsole()
