import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiCreditCard, FiCheck, FiShield, FiClock, FiArrowRight } from 'react-icons/fi'

const VisaProcessing = () => {
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
    'Complete visa documentation assistance',
    'Financial documentation preparation',
    'Visa interview preparation and coaching',
    'Form filling and application submission',
    'Embassy appointment scheduling',
    'Mock interview sessions',
    'Visa tracking and follow-up',
    'Post-visa approval guidance'
  ]

  const countries = [
    { name: 'USA', rate: '98%', flag: '🇺🇸' },
    { name: 'Canada', rate: '97%', flag: '🇨🇦' },
    { name: 'UK', rate: '96%', flag: '🇬🇧' },
    { name: 'Australia', rate: '98%', flag: '🇦🇺' },
    { name: 'Germany', rate: '95%', flag: '🇩🇪' },
    { name: 'Singapore', rate: '99%', flag: '🇸🇬' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiCreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-800 mb-6">
            Visa Processing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert guidance through the visa application process with industry-leading success rates and comprehensive support.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Success Rates */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-800 text-center mb-12">
              Our Visa Success Rates
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {countries.map((country, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="text-4xl mb-3">{country.flag}</div>
                  <h3 className="font-heading font-bold text-gray-800 mb-2">{country.name}</h3>
                  <div className="text-2xl font-bold text-purple-600">{country.rate}</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">
                Why Choose Our Visa Services?
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Navigating visa requirements can be complex and stressful. Our experienced visa consultants have helped thousands of students secure their visas with our proven methodology and personalized approach.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">
                Service Guarantees
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiShield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Success Guarantee</div>
                    <div className="text-gray-600 text-sm">97% average success rate</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Fast Processing</div>
                    <div className="text-gray-600 text-sm">Quick turnaround times</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiCreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Complete Support</div>
                    <div className="text-gray-600 text-sm">End-to-end assistance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-800 text-center mb-12">
              Our Visa Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Document Review', desc: 'Comprehensive review of all required documents' },
                { step: '02', title: 'Application Prep', desc: 'Careful preparation and form completion' },
                { step: '03', title: 'Interview Training', desc: 'Mock interviews and personalized coaching' },
                { step: '04', title: 'Submission & Follow-up', desc: 'Application submission and tracking' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Secure Your Student Visa Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let our visa experts guide you through the process with confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/consultation" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
              >
                Start Visa Process
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

export default VisaProcessing
