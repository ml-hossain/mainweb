import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiFileText, FiCheck, FiShield, FiClock, FiArrowRight, FiFolder } from 'react-icons/fi'

const DocumentationSupport = () => {
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

  const documents = [
    'Academic Transcripts',
    'Letters of Recommendation',
    'Statement of Purpose (SOP)',
    'Personal Statement',
    'Resume/CV',
    'Financial Documents',
    'Passport and Visa Documents',
    'English Proficiency Certificates',
    'Work Experience Letters',
    'Portfolio (if required)'
  ]

  const services = [
    {
      icon: FiFileText,
      title: 'Document Preparation',
      description: 'Professional formatting and preparation of all required documents',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: FiShield,
      title: 'Verification & Review',
      description: 'Thorough verification and quality review of all documents',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiFolder,
      title: 'Organization & Submission',
      description: 'Systematic organization and timely submission support',
      color: 'bg-blue-100 text-blue-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl mb-8 shadow-2xl">
            <FiFileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-300 bg-clip-text text-transparent mb-6">
            Documentation Support
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional assistance with document preparation, verification, and organization for your university applications.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">
                Complete Documentation Assistance
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Proper documentation is crucial for successful university applications. Our team ensures all your documents meet university standards and are professionally presented to maximize your chances of acceptance.
              </p>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">
                  Documents We Help With
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">
                  Our Process
                </h3>
                <div className="space-y-4">
                  {[
                    'Document checklist creation',
                    'Individual document review',
                    'Professional formatting',
                    'Translation services (if needed)',
                    'Quality assurance check',
                    'Final submission support'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-indigo-600 font-bold text-xs">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="font-heading font-bold text-gray-800 mb-3">Why Documentation Matters</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Incomplete or poorly formatted documents are one of the top reasons for application rejections. Our service ensures your documents are perfect.
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">99.8%</div>
                  <div className="text-sm text-gray-600">Document Acceptance Rate</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Get Your Documents Ready
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Ensure your documents meet all requirements with our professional support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Start Documentation
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

export default DocumentationSupport
