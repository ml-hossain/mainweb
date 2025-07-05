import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiMic, FiCheck, FiUsers, FiTarget, FiArrowRight, FiVideo } from 'react-icons/fi'

const InterviewPreparation = () => {
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
    'Comprehensive mock interview sessions',
    'University-specific interview preparation',
    'Common interview questions database',
    'Body language and presentation coaching',
    'Confidence building techniques',
    'Video interview practice',
    'Personalized feedback and improvement tips',
    'Last-minute preparation support'
  ]

  const interviewTypes = [
    {
      icon: FiVideo,
      title: 'Video Interviews',
      description: 'Master virtual interview techniques and technology',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: FiMic,
      title: 'Phone Interviews',
      description: 'Excel in voice-only interview scenarios',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiUsers,
      title: 'Panel Interviews',
      description: 'Navigate multi-interviewer situations with confidence',
      color: 'bg-green-100 text-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-rose-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl mb-8 shadow-2xl">
            <FiUsers className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-pink-200 to-pink-300 bg-clip-text text-transparent mb-6">
            Interview Preparation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Build confidence and excel in university interviews with our comprehensive preparation program and expert coaching.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Interview Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {interviewTypes.map((type, index) => {
              const IconComponent = type.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">
                    {type.title}
                  </h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">
                Master Your University Interview
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                University interviews can be nerve-wracking, but with proper preparation, they become opportunities to showcase your personality and passion. Our interview coaching helps you present your best self confidently.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">
                Common Interview Topics
              </h3>
              <div className="space-y-4">
                {[
                  'Why this university/program?',
                  'Academic background and achievements',
                  'Career goals and aspirations',
                  'Research interests and experience',
                  'Leadership and teamwork examples',
                  'Challenges overcome',
                  'Future plans and contribution',
                  'Questions about the program'
                ].map((topic, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <h4 className="font-semibold text-gray-800 mb-2">Success Rate</h4>
                <div className="text-3xl font-bold text-pink-600">94%</div>
                <p className="text-sm text-gray-600">Students pass interviews after our preparation</p>
              </div>
            </div>
          </div>

          {/* Preparation Process */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-800 text-center mb-12">
              Our Preparation Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Assessment', desc: 'Evaluate current interview skills and confidence level' },
                { step: '02', title: 'Practice', desc: 'Multiple mock interview sessions with feedback' },
                { step: '03', title: 'Refinement', desc: 'Polish responses and improve presentation skills' },
                { step: '04', title: 'Final Prep', desc: 'Last-minute coaching and confidence building' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-pink-600 to-pink-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ace Your University Interview
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Build confidence and interview skills with our expert coaching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
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

export default InterviewPreparation
