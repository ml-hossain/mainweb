import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { FiChevronDown, FiGift, FiMenu, FiX } from 'react-icons/fi'

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

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDropdown()
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    closeDropdown()
  }, [location.pathname])

  return (
    <header role="banner">
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-white/10 shadow-2xl" role="navigation" aria-label="Main navigation">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-emerald-900/20 backdrop-blur-sm"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout Container */}
        <div ref={contentRef} className="grid grid-cols-12 items-center h-20 gap-1">
          
          {/* Logo Section - Spans 2 columns */}
          <div className="col-span-2 flex items-center justify-start">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  <span className="text-white font-black text-xl tracking-tight">SM</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-3xl text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300">Safa</span>
                <span className="text-base text-emerald-300 font-medium -mt-1 tracking-wide">Malaysia</span>
              </div>
            </Link>
          </div>

          {/* Navigation Section - Spans 8 columns */}
          <div className="col-span-8 hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Link 
                to="/" 
                className={`transition-colors duration-200 ${location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                  <span className={`whitespace-nowrap ${location.pathname === '/' ? 'border-b-2 border-white' : ''}`}>Home</span>
                </div>
              </Link>
              
              {/* Services Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleServicesToggle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleServicesToggle()
                    }
                    if (e.key === 'Escape') {
                      closeDropdown()
                    }
                  }}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-label="Services menu"
                  className="transition-colors duration-200 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 rounded-lg"
                >
                  <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="whitespace-nowrap">Services</span>
                    <FiChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isServicesOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                {isServicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 overflow-hidden z-50 animate-fadeInUp">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl"></div>
                    <div className="relative z-10">
                      <Link
                        to="/services"
                        onClick={closeDropdown}
                        className="block px-6 py-3 text-sm font-semibold text-white hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-300 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>All Services</span>
                        </div>
                      </Link>
                      <div className="border-t border-white/10 my-2"></div>
                      {services.map((service) => (
                        <Link
                          key={service.path}
                          to={service.path}
                          onClick={closeDropdown}
                          className="block px-6 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:text-blue-300 transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                            <span>{service.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/universities" 
                className={`transition-colors duration-200 ${location.pathname === '/universities' || location.pathname.startsWith('/universities/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  <span className={`whitespace-nowrap ${location.pathname === '/universities' || location.pathname.startsWith('/universities/') ? 'border-b-2 border-white' : ''}`}>Universities</span>
                </div>
              </Link>
              
              <Link 
                to="/success-stories" 
                className={`transition-colors duration-200 ${location.pathname === '/success-stories' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className={`whitespace-nowrap ${location.pathname === '/success-stories' ? 'border-b-2 border-white' : ''}`}>Success Stories</span>
                </div>
              </Link>
              
              <Link 
                to="/about" 
                className={`transition-colors duration-200 ${location.pathname === '/about' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span className={`whitespace-nowrap ${location.pathname === '/about' ? 'border-b-2 border-white' : ''}`}>About</span>
                </div>
              </Link>
              
              <Link 
                to="/blog" 
                className={`transition-colors duration-200 ${location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                  </svg>
                  <span className={`whitespace-nowrap ${location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'border-b-2 border-white' : ''}`}>Blog</span>
                </div>
              </Link>
              
              <Link 
                to="/contact" 
                className={`transition-colors duration-200 ${location.pathname === '/contact' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center space-x-1 px-2 py-2 font-semibold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className={`whitespace-nowrap ${location.pathname === '/contact' ? 'border-b-2 border-white' : ''}`}>Contact</span>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA Button Section - Spans 2 columns */}
          <div className="col-span-2 flex items-center justify-end">
            <div className="hidden md:block ml-2">
              <Link 
                to="/consultation"
                className="relative bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 font-bold text-sm py-2 px-2 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out overflow-hidden group transform hover:scale-102 hover:shadow-xl"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/25 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-left"></div>
                
                <span className="relative z-10 flex items-center">
                  <FiGift className="mr-2 w-4 h-4 transform group-hover:rotate-6 transition-transform duration-300 ease-out" />
                  <span className="whitespace-nowrap">Free Consultation</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden col-span-2 flex justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-controls="mobile-menu"
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 rounded-lg transform hover:scale-105 transition-all duration-200 p-2"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-700/50 backdrop-blur-lg animate-fadeInUp" role="navigation" aria-label="Mobile navigation">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words">Home</Link>
              
              {/* Services Section */}
              <div className="space-y-1">
                <Link to="/services" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words font-semibold border-b border-gray-700/50 pb-2 mb-2">All Services</Link>
                {services.map((service) => (
                  <Link 
                    key={service.path}
                    to={service.path} 
                    className="block px-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words"
                  >
                    • {service.name}
                  </Link>
                ))}
              </div>
              
              <Link to="/universities" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words">Universities</Link>
              <Link to="/success-stories" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words">Success Stories</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words">About</Link>
              <Link to="/blog" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words">Blog</Link>
              <Link to="/seo-demo" className="block px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 rounded-lg transition-all duration-200 break-words font-medium">🎯 SEO Demo</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 break-words">Contact</Link>
              <Link 
                to="/consultation"
                className="relative bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-black text-sm py-3 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden group mt-2 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative z-10 flex items-center">
                  <FiGift className="mr-2 w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300" />
                  <span className="whitespace-nowrap">Free Consultation</span>
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    </header>
  )
}

export default Navbar
