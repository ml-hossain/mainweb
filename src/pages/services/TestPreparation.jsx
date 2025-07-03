import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiBookOpen, FiCheck, FiTarget, FiTrendingUp, FiArrowRight } from 'react-icons/fi'

const TestPreparation = () => {
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

  const tests = [
    { name: 'IELTS', description: 'International English Language Testing System', score: '8.5+' },
    { name: 'TOEFL', description: 'Test of English as a Foreign Language', score: '110+' },
    { name: 'GRE', description: 'Graduate Record Examinations', score: '330+' },
    { name: 'GMAT', description: 'Graduate Management Admission Test', score: '750+' },
    { name: 'SAT', description: 'Scholastic Assessment Test', score: '1500+' },
    { name: 'PTE', description: 'Pearson Test of English', score: '90+' }
  ]

  const features = [
    'Personalized study plans and strategies',
    'Expert instructors with proven track records',
    'Comprehensive study materials and resources',
    'Regular mock tests and performance analysis',
    'One-on-one coaching sessions',
    'Score improvement guarantee',
    'Flexible online and offline classes',
    'Test registration and scheduling support'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl mb-8 shadow-2xl">
            <FiBookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-red-200 to-red-300 bg-clip-text text-transparent mb-6">
            Test Preparation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Achieve your target scores with our comprehensive test preparation programs for all major standardized tests.
          </p>
        </div>

          <div className="space-y-16">
          
          {/* Tests Grid */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-white text-center mb-12">
              Tests We Prepare You For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-heading font-bold text-red-300">{test.name}</h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Target Score</div>
                      <div className="text-lg font-bold text-white">{test.score}</div>
                    </div>
                  </div>
                  <p className="text-gray-200 text-sm">{test.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Proven Test Prep Methodology
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our test preparation programs are designed by experts who understand the nuances of each test. We focus on strategic preparation that maximizes your score improvement in the shortest time possible.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 border border-red-400/50">
                      <FiCheck className="w-4 h-4 text-red-300" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                Our Results Speak
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-red-400/50">
                    <FiTarget className="w-6 h-6 text-red-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">25+ Point Improvement</div>
                    <div className="text-gray-300 text-sm">Average score increase</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-green-400/50">
                    <FiTrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">92% Success Rate</div>
                    <div className="text-gray-300 text-sm">Students achieve target scores</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/50">
                    <FiBookOpen className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Expert Instructors</div>
                    <div className="text-gray-300 text-sm">10+ years experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-red-600 to-red-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Achieve Your Target Score
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your test preparation journey with our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Start Preparation
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

export default TestPreparation
