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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiBookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-800 mb-6">
            Test Preparation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Achieve your target scores with our comprehensive test preparation programs for all major standardized tests.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Tests Grid */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-800 text-center mb-12">
              Tests We Prepare You For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-heading font-bold text-red-600">{test.name}</h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Target Score</div>
                      <div className="text-lg font-bold text-gray-800">{test.score}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{test.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">
                Proven Test Prep Methodology
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our test preparation programs are designed by experts who understand the nuances of each test. We focus on strategic preparation that maximizes your score improvement in the shortest time possible.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">
                Our Results Speak
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FiTarget className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">25+ Point Improvement</div>
                    <div className="text-gray-600 text-sm">Average score increase</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">92% Success Rate</div>
                    <div className="text-gray-600 text-sm">Students achieve target scores</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiBookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Expert Instructors</div>
                    <div className="text-gray-600 text-sm">10+ years experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Achieve Your Target Score
            </h2>
            <p className="text-xl mb-8 opacity-90">
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
    </div>
  )
}

export default TestPreparation
