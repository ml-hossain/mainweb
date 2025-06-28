import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { 
  FiGlobe, 
  FiFileText, 
  FiCreditCard, 
  FiAward, 
  FiSend,
  FiArrowRight 
} from 'react-icons/fi'

const Services = () => {
  const headerRef = useRef(null)
  const servicesRef = useRef(null)

  const services = [
    {
      icon: FiGlobe,
      title: 'University Selection',
      description: 'Get personalized recommendations for universities that match your profile, preferences, and career goals.',
      features: ['Profile matching', 'Ranking analysis', 'Location preferences', 'Cost comparison'],
      path: '/services/university-selection',
      color: 'bg-blue-500'
    },
    {
      icon: FiFileText,
      title: 'Application Assistance',
      description: 'Complete support for university applications including essay writing and document preparation.',
      features: ['Essay writing', 'Application forms', 'Document review', 'Deadline management'],
      path: '/services/application-assistance',
      color: 'bg-green-500'
    },
    {
      icon: FiCreditCard,
      title: 'Visa Processing',
      description: 'Expert guidance through the visa application process with high success rates.',
      features: ['Document preparation', 'Interview coaching', 'Application tracking', 'Success guarantee'],
      path: '/services/visa-processing',
      color: 'bg-purple-500'
    },
    {
      icon: FiAward,
      title: 'Scholarship Guidance',
      description: 'Find and apply for scholarships to reduce your education costs significantly.',
      features: ['Scholarship search', 'Application support', 'Merit assessment', 'Financial planning'],
      path: '/services/scholarship-guidance',
      color: 'bg-yellow-500'
    },
    {
      icon: FiSend,
      title: 'Pre-Departure Orientation',
      description: 'Get ready for your international education journey with comprehensive guidance.',
      features: ['Cultural briefing', 'Travel arrangements', 'Accommodation', 'Essential tips'],
      path: '/services/pre-departure-orientation',
      color: 'bg-teal-500'
    }
  ]

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(headerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(servicesRef.current.children,
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "back.out(1.7)" 
      },
      "-=0.4"
    )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 pt-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
            <FiAward className="w-4 h-4 mr-2" />
            Professional Education Services
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive support for your international education journey. From university selection to visa processing, we're with you every step of the way.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div 
                key={service.path}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group relative overflow-hidden h-full flex flex-col"
              >
                {/* Background gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-16 -translate-y-16"></div>
                
                {/* Icon */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Learn More Button - Fixed at bottom */}
                <div className="mt-auto">
                  <Link 
                    to={service.path}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg group/btn"
                  >
                    Learn More
                    <FiArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Spacer between cards and CTA */}
      <div className="py-16"></div>

      {/* CTA Section - Full Width */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 text-white">
            Get personalized guidance from our education experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Book Free Consultation
            </Link>
            <Link 
              to="/contact" 
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
