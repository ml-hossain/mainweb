import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { 
  FiGlobe, 
  FiCheck, 
  FiUsers, 
  FiTrendingUp, 
  FiArrowRight,
  FiStar,
  FiAward,
  FiMapPin,
  FiDollarSign,
  FiBookOpen,
  FiTarget,
  FiFilter,
  FiSearch,
  FiBarChart2,
  FiHeart,
  FiShield
} from 'react-icons/fi'
import Footer from '../../components/Footer'

gsap.registerPlugin(ScrollTrigger)

const UniversitySelection = () => {
  const headerRef = useRef(null)
  const contentRef = useRef(null)
  const statsRef = useRef(null)
  const [activeTab, setActiveTab] = useState('criteria')

  useEffect(() => {
    const tl = gsap.timeline()

    // Header animation
    tl.fromTo(headerRef.current,
      { opacity: 0, y: 80, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    )

    // Content sections animation
    gsap.fromTo(contentRef.current.children,
      { opacity: 0, y: 60 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    )

    // Stats counter animation
    const statsElements = statsRef.current?.querySelectorAll('.stat-number')
    statsElements?.forEach((stat) => {
      const finalValue = parseInt(stat.textContent)
      gsap.fromTo(stat, 
        { textContent: 0 },
        {
          textContent: finalValue,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const selectionCriteria = [
    {
      icon: FiTarget,
      title: 'Academic Excellence',
      description: 'Global rankings, accreditation status, faculty-to-student ratio, research opportunities',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiMapPin,
      title: 'Location & Environment',
      description: 'Climate preferences, cultural fit, safety ratings, proximity to industry hubs',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FiDollarSign,
      title: 'Financial Considerations',
      description: 'Tuition fees, living costs, scholarship opportunities, ROI analysis',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FiBookOpen,
      title: 'Program Specifics',
      description: 'Curriculum depth, specializations, industry connections, internship programs',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FiUsers,
      title: 'Student Experience',
      description: 'Campus facilities, diversity index, student satisfaction, alumni network',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: FiTrendingUp,
      title: 'Career Prospects',
      description: 'Employment rates, salary benchmarks, industry partnerships, placement support',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const process = [
    {
      step: '01',
      title: 'Comprehensive Profiling',
      description: 'Deep-dive assessment of academic background, career aspirations, personal preferences, and financial capacity',
      features: ['Academic transcript analysis', 'Career goal mapping', 'Personality assessment', 'Budget planning'],
      icon: FiSearch
    },
    {
      step: '02',
      title: 'AI-Powered Matching',
      description: 'Our proprietary algorithm analyzes 50+ parameters to shortlist universities that perfectly match your profile',
      features: ['Machine learning algorithms', '500+ university database', 'Real-time data updates', 'Predictive analysis'],
      icon: FiFilter
    },
    {
      step: '03',
      title: 'Expert Evaluation',
      description: 'Our counselors provide detailed insights, pros/cons analysis, and personalized recommendations',
      features: ['Expert consultations', 'Comparative analysis', 'Risk assessment', 'Strategy development'],
      icon: FiBarChart2
    },
    {
      step: '04',
      title: 'Strategic Selection',
      description: 'Finalize your university list with safety, target, and reach schools for optimal application strategy',
      features: ['Balanced portfolio', 'Application timeline', 'Backup strategies', 'Success optimization'],
      icon: FiTarget
    }
  ]

  const stats = [
    { number: 98, suffix: '%', label: 'Student Satisfaction Rate', icon: FiHeart },
    { number: 500, suffix: '+', label: 'Partner Universities', icon: FiGlobe },
    { number: 25, suffix: '+', label: 'Countries Covered', icon: FiMapPin },
    { number: 15, suffix: 'k+', label: 'Students Placed', icon: FiUsers }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      university: 'Stanford University',
      program: 'MS Computer Science',
      quote: 'The personalized approach helped me discover universities I never considered. Now I\'m at my dream school!',
      rating: 5
    },
    {
      name: 'Raj Patel',
      university: 'MIT',
      program: 'PhD Engineering',
      quote: 'Their data-driven matching process was incredible. They found the perfect fit for my research interests.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      university: 'Oxford University',
      program: 'MBA',
      quote: 'Beyond just rankings, they helped me understand the culture and environment of each university.',
      rating: 5
    }
  ]

  const tabs = [
    { id: 'criteria', label: 'Selection Criteria', icon: FiFilter },
    { id: 'process', label: 'Our Process', icon: FiTarget },
    { id: 'testimonials', label: 'Success Stories', icon: FiStar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div ref={headerRef} className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-8 shadow-2xl">
              <FiGlobe className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent mb-6">
              University Selection
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover your perfect academic destination with our AI-powered matching system and expert guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Your Journey
              </button>
              <button className="border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-300 px-8 py-4 rounded-2xl font-bold transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-800 mb-2">
                  <span className="stat-number">{stat.number}</span>{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-16">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selection Criteria Tab */}
        {activeTab === 'criteria' && (
          <div className="space-y-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Our Selection Criteria
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We evaluate universities across multiple dimensions to ensure the perfect match for your goals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectionCriteria.map((criteria, index) => {
                const IconComponent = criteria.icon
                return (
                  <div key={index} className="group">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 h-full">
                      <div className={`w-16 h-16 bg-gradient-to-r ${criteria.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-gray-800 mb-4">
                        {criteria.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {criteria.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="space-y-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Our Advanced Process
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A systematic, data-driven approach combining AI technology with human expertise
              </p>
            </div>
            
            <div className="space-y-12">
              {process.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="lg:w-1/2">
                      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white mr-4">
                            {step.step}
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-gray-800 mb-4">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                          {step.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {step.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2">
                      <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                        <IconComponent className="w-32 h-32 text-blue-500" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real students, real results. See how we've helped students achieve their dreams
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-blue-600 font-semibold">{testimonial.university}</div>
                    <div className="text-gray-500 text-sm">{testimonial.program}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiShield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
            Join thousands of students who've found their dream universities with our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group shadow-xl"
            >
              Start Free Consultation
              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all duration-300"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default UniversitySelection
