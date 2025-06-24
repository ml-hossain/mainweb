import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiAward, FiCheck, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import Footer from '../../components/Footer'

const ScholarshipGuidance = () => {
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
    'Comprehensive scholarship database search',
    'Eligibility assessment and matching',
    'Application strategy development',
    'Essay and personal statement writing',
    'Merit-based scholarship applications',
    'Need-based financial aid guidance',
    'Government scholarship programs',
    'University-specific scholarship opportunities'
  ]

  const scholarshipTypes = [
    {
      icon: FiAward,
      title: 'Merit-Based',
      description: 'Academic excellence and achievement-based scholarships',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: FiDollarSign,
      title: 'Need-Based',
      description: 'Financial assistance based on family income and circumstances',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiTrendingUp,
      title: 'Subject-Specific',
      description: 'Scholarships for specific fields of study and research areas',
      color: 'bg-blue-100 text-blue-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl mb-8 shadow-2xl">
            <FiAward className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-yellow-200 to-yellow-300 bg-clip-text text-transparent mb-6">
            Scholarship Guidance
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Maximize your chances of securing scholarships and financial aid to make your international education dreams affordable.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Scholarship Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scholarshipTypes.map((type, index) => {
              const IconComponent = type.icon
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-4">
                    {type.title}
                  </h3>
                  <p className="text-gray-300">{type.description}</p>
                </div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Unlock Scholarship Opportunities
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our scholarship guidance service helps you discover and apply for various funding opportunities that can significantly reduce your education costs. We have helped students secure over $50 million in scholarships.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 border border-yellow-400/50">
                      <FiCheck className="w-4 h-4 text-yellow-300" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                Success Statistics
              </h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">$50M+</div>
                  <div className="text-gray-300">Total Scholarships Secured</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
                  <div className="text-gray-600">Students Receive Funding</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">$25K</div>
                  <div className="text-gray-600">Average Scholarship Amount</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Start Your Scholarship Journey
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Discover scholarship opportunities that match your profile and goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/consultation" 
                className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
              >
                Find Scholarships
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
      <Footer />
    </div>
  )
}

export default ScholarshipGuidance
