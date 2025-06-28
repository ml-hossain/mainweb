import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiSend, FiCheck, FiHome, FiMapPin, FiArrowRight } from 'react-icons/fi'
import Footer from '../../components/Footer'

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
    <div className="min-h-screen bg-gray-900">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Service Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-teal-500/10 text-teal-400 ring-1 ring-inset ring-teal-500/20">
            <FiSend className="mr-2 h-4 w-4" />
            Pre-Departure Guidance
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6">
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
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700 text-center hover:bg-gray-800/70 transition-all duration-300">
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
                    <div className="w-6 h-6 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 border border-teal-400/30">
                      <FiCheck className="w-4 h-4 text-teal-300" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700">
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
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-700"></div>
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
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal-400/80 rounded-full border-2 border-teal-300 shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Full width */}
      <div className="w-full bg-[#7C3AED] mx-auto px-4 py-16  mb-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
            Start Your Journey Prepared
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Get comprehensive pre-departure support for a smooth transition
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-[#7C3AED] hover:bg-gray-100 px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group text-lg"
            >
              Begin Orientation
              <FiArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-white/50 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold transition-all duration-300 text-lg"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PreDepartureOrientation
