import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { FiChevronDown, FiGift } from 'react-icons/fi'

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const contentRef = useRef(null)
  const location = useLocation()

  const services = [
    { name: 'University Selection', path: '/services/university-selection' },
    { name: 'Application Assistance', path: '/services/application-assistance' },
    { name: 'Visa Processing', path: '/services/visa-processing' },
    { name: 'Scholarship Guidance', path: '/services/scholarship-guidance' },
    { name: 'Pre-Departure Orientation', path: '/services/pre-departure-orientation' }
  ]

  useEffect(() => {
    // Animate navbar content first, then hero section follows
    if (contentRef.current) {
      const navItems = contentRef.current.querySelectorAll('a, button')
      gsap.fromTo(navItems, 
        { y: -20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          ease: "power2.out", 
          stagger: 0.08,
          delay: 0.1 // Start navbar first
        }
      )
    }
  }, [])

  const handleServicesToggle = () => {
    setIsServicesOpen(!isServicesOpen)
  }

  const closeDropdown = () => {
    setIsServicesOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav ref={navRef} className="bg-gray-900 backdrop-blur-md sticky top-0 z-50 border-b border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MA</span>
            </div>
            <span className="font-bold text-xl text-white">Education</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`relative text-gray-300 hover:text-amber-400 font-medium text-sm uppercase tracking-wide transition-colors duration-300 px-3 py-2 group ${location.pathname === '/' ? 'text-amber-400' : ''}`}
            >
              Home
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
              <span className="absolute bottom-1 right-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleServicesToggle}
                className="relative text-gray-300 hover:text-amber-400 font-medium text-sm uppercase tracking-wide transition-colors duration-300 px-3 py-2 flex items-center space-x-1 focus:outline-none group"
              >
                <span>Services</span>
                <FiChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isServicesOpen ? 'transform rotate-180' : ''
                  }`} 
                />
                <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
                <span className="absolute bottom-1 right-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                  <Link
                    to="/services"
                    onClick={closeDropdown}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-400 transition-colors duration-200"
                  >
                    All Services
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      onClick={closeDropdown}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-400 transition-colors duration-200"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/success-stories" 
              className={`relative text-gray-300 hover:text-amber-400 font-medium text-sm uppercase tracking-wide transition-colors duration-300 px-3 py-2 group ${location.pathname === '/success-stories' ? 'text-amber-400' : ''}`}
            >
              Success Stories
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
              <span className="absolute bottom-1 right-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/about" 
              className={`relative text-gray-300 hover:text-amber-400 font-medium text-sm uppercase tracking-wide transition-colors duration-300 px-3 py-2 group ${location.pathname === '/about' ? 'text-amber-400' : ''}`}
            >
              About
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
              <span className="absolute bottom-1 right-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/contact" 
              className={`relative text-gray-300 hover:text-amber-400 font-medium text-sm uppercase tracking-wide transition-colors duration-300 px-3 py-2 group ${location.pathname === '/contact' ? 'text-amber-400' : ''}`}
            >
              Contact
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
              <span className="absolute bottom-1 right-0 w-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 group-hover:w-1/2 transition-all duration-300"></span>
            </Link>

            {/* CTA Button */}
            <div className="ml-6 pl-6 border-l border-gray-600">
              <Link 
                to="/consultation"
                className="relative bg-amber-400 text-gray-900 font-black text-sm py-3 px-6 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Bottom-right to Top-left White Background - 50% diagonal */}
                <span className="absolute inset-0 bg-white transform origin-bottom-right scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" style={{clipPath: 'polygon(50% 100%, 100% 100%, 100% 0%)'}}></span>
                {/* Top-left to Bottom-right White Background - 50% diagonal */}
                <span className="absolute inset-0 bg-white transform origin-top-left scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" style={{clipPath: 'polygon(0% 0%, 50% 0%, 0% 100%)'}}></span>
                <span className="relative z-10 flex items-center">
                  <FiGift className="mr-2 w-4 h-4" />
                  Free Consultation
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-amber-400">Home</Link>
              <Link to="/services" className="block px-3 py-2 text-gray-300 hover:text-amber-400">Services</Link>
              <Link to="/success-stories" className="block px-3 py-2 text-gray-300 hover:text-amber-400">Success Stories</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-300 hover:text-amber-400">About</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-300 hover:text-amber-400">Contact</Link>
              <Link 
                to="/consultation"
                className="relative bg-amber-400 text-gray-900 font-black text-sm py-3 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden group mt-2"
              >
                {/* Bottom-right to Top-left White Background - 50% diagonal */}
                <span className="absolute inset-0 bg-white transform origin-bottom-right scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" style={{clipPath: 'polygon(50% 100%, 100% 100%, 100% 0%)'}}></span>
                {/* Top-left to Bottom-right White Background - 50% diagonal */}
                <span className="absolute inset-0 bg-white transform origin-top-left scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" style={{clipPath: 'polygon(0% 0%, 50% 0%, 0% 100%)'}}></span>
                <span className="relative z-10 flex items-center">
                  <FiGift className="mr-2 w-4 h-4" />
                  Free Consultation
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
