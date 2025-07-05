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
            <span className="font-bold text-xl text-white whitespace-nowrap">Education</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`relative group transition-all duration-300 ${location.pathname === '/' ? 'text-white' : 'text-gray-300'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}></div>
              <div className="relative z-10 flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm uppercase tracking-wide">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                <span className="whitespace-nowrap">Home</span>
              </div>
              <div className={`absolute inset-0 bg-blue-500 rounded-full blur-md transition-opacity duration-300 -z-10 ${location.pathname === '/' ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleServicesToggle}
                className="relative text-gray-300 hover:text-amber-400 font-medium text-sm uppercase tracking-wide transition-colors duration-300 px-3 py-2 flex items-center space-x-1 focus:outline-none group"
              >
                <span className="whitespace-nowrap">Services</span>
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
              to="/universities" 
              className={`relative group transition-all duration-300 ${location.pathname === '/universities' || location.pathname.startsWith('/universities/') ? 'text-white' : 'text-gray-300'}`}
            >
              {/* Background Pill */}
              <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300 ${location.pathname === '/universities' || location.pathname.startsWith('/universities/') ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}></div>
              
              {/* Main Content */}
              <div className="relative z-10 flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm uppercase tracking-wide">
                {/* University Icon */}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                
                {/* Text */}
                <span className="whitespace-nowrap">Universities</span>
              </div>
              
              {/* Subtle Shadow */}
              <div className={`absolute inset-0 bg-emerald-500 rounded-full blur-md transition-opacity duration-300 -z-10 ${location.pathname === '/universities' || location.pathname.startsWith('/universities/') ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
            </Link>
            
            <Link 
              to="/success-stories" 
              className={`relative group transition-all duration-300 ${location.pathname === '/success-stories' ? 'text-white' : 'text-gray-300'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300 ${location.pathname === '/success-stories' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}></div>
              <div className="relative z-10 flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm uppercase tracking-wide">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="whitespace-nowrap">Success Stories</span>
              </div>
              <div className={`absolute inset-0 bg-purple-500 rounded-full blur-md transition-opacity duration-300 -z-10 ${location.pathname === '/success-stories' ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
            </Link>
            
            <Link 
              to="/about" 
              className={`relative group transition-all duration-300 ${location.pathname === '/about' ? 'text-white' : 'text-gray-300'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ${location.pathname === '/about' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}></div>
              <div className="relative z-10 flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm uppercase tracking-wide">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span className="whitespace-nowrap">About</span>
              </div>
              <div className={`absolute inset-0 bg-indigo-500 rounded-full blur-md transition-opacity duration-300 -z-10 ${location.pathname === '/about' ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
            </Link>
            
            <Link 
              to="/contact" 
              className={`relative group transition-all duration-300 ${location.pathname === '/contact' ? 'text-white' : 'text-gray-300'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-300 ${location.pathname === '/contact' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}></div>
              <div className="relative z-10 flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm uppercase tracking-wide">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span className="whitespace-nowrap">Contact</span>
              </div>
              <div className={`absolute inset-0 bg-pink-500 rounded-full blur-md transition-opacity duration-300 -z-10 ${location.pathname === '/contact' ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
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
                  <span className="whitespace-nowrap">Free Consultation</span>
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
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-amber-400 break-words">Home</Link>
              <Link to="/services" className="block px-3 py-2 text-gray-300 hover:text-amber-400 break-words">Services</Link>
              <Link to="/universities" className="block px-3 py-2 text-gray-300 hover:text-amber-400 break-words">Universities</Link>
              <Link to="/success-stories" className="block px-3 py-2 text-gray-300 hover:text-amber-400 break-words">Success Stories</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-300 hover:text-amber-400 break-words">About</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-300 hover:text-amber-400 break-words">Contact</Link>
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
                  <span className="whitespace-nowrap">Free Consultation</span>
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
