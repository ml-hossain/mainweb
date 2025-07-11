import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiSend, FiCheck, FiHome, FiMapPin, FiArrowRight } from 'react-icons/fi'

const PreDepartureOrientation = () => {
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(headerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(contentRef.current.children,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power3.out" 
      },
      "-=0.4"
    )
  }, [])

  const features = [
    'Cultural orientation and adaptation tips',
    'Travel arrangements and booking assistance',
    'Accommodation search and booking support',
    'Banking and financial setup guidance',
    'Health insurance and medical requirements',
    'Essential items checklist and packing tips',
    'Airport pickup and local transport guidance',
    'Emergency contacts and support network'
  ]

  const orientationAreas = [
    {
      icon: FiMapPin,
      title: 'Cultural Adaptation',
      description: 'Understanding local customs, etiquette, and social norms',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: FiHome,
      title: 'Living Arrangements',
      description: 'Finding accommodation and settling into your new environment',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiSend,
      title: 'Travel Planning',
      description: 'Flight bookings, airport procedures, and arrival logistics',
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-cyan-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl mb-8 shadow-2xl">
            <FiSend className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-teal-200 to-teal-300 bg-clip-text text-transparent mb-6">
            Pre-Departure Orientation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive preparation for your international education journey with cultural, practical, and logistical guidance.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Orientation Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {orientationAreas.map((area, index) => {
              const IconComponent = area.icon
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 ${area.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-4">
                    {area.title}
                  </h3>
                  <p className="text-gray-300">{area.description}</p>
                </div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Complete Pre-Departure Support
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Starting your international education journey can feel overwhelming. Our pre-departure orientation ensures you're fully prepared for the transition, covering everything from cultural adaptation to practical logistics.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 border border-teal-400/50">
                      <FiCheck className="w-4 h-4 text-teal-300" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                Essential Preparation Areas
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Documentation</h4>
                  <p className="text-gray-300 text-sm">Passport, visa, university documents, medical records, and insurance papers.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Financial Planning</h4>
                  <p className="text-gray-300 text-sm">Bank account setup, foreign exchange, budgeting, and expense management.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Health & Safety</h4>
                  <p className="text-gray-300 text-sm">Medical check-ups, vaccinations, health insurance, and emergency contacts.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Academic Preparation</h4>
                  <p className="text-gray-300 text-sm">Course materials, study methods, academic expectations, and university resources.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-white text-center mb-12">
              Pre-Departure Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-teal-400/30"></div>
              <div className="space-y-12">
                {[
                  { time: '3 Months Before', title: 'Travel Planning', desc: 'Book flights, arrange accommodation, apply for health insurance' },
                  { time: '2 Months Before', title: 'Documentation', desc: 'Prepare and organize all required documents and certifications' },
                  { time: '1 Month Before', title: 'Cultural Prep', desc: 'Cultural orientation sessions and practical preparation' },
                  { time: '1 Week Before', title: 'Final Checklist', desc: 'Last-minute preparations and departure readiness check' }
                ].map((item, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="text-sm text-teal-300 font-semibold">{item.time}</div>
                      <h3 className="text-xl font-heading font-bold text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.desc}</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal-400 rounded-full border-2 border-teal-300 shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Start Your Journey Prepared
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get comprehensive pre-departure support for a smooth transition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Begin Orientation
              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreDepartureOrientation
