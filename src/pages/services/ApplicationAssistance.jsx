import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiFileText, FiCheck, FiEdit, FiClock, FiArrowRight } from 'react-icons/fi'
import Footer from '../../components/Footer'

const ApplicationAssistance = () => {
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
    'Personal Statement and Essay Writing',
    'Statement of Purpose (SOP) crafting',
    'Letter of Recommendation guidance',
    'Resume/CV optimization',
    'Application form completion',
    'Portfolio development (if required)',
    'Deadline management and tracking',
    'Multiple application submissions'
  ]

  const services = [
    {
      icon: FiEdit,
      title: 'Essay Writing',
      description: 'Compelling essays that showcase your unique story and achievements',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiFileText,
      title: 'Document Review',
      description: 'Thorough review and editing of all application documents',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiClock,
      title: 'Deadline Management',
      description: 'Strategic planning to meet all application deadlines',
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-16">
      <div className="max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-6">
            <FiFileText className="w-4 h-4 mr-2" />
            Professional Application Support
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Application Assistance
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Complete support for your university applications with expert essay writing, document preparation, and deadline management.
          </p>
        </div>

        <div ref={contentRef} className="space-y-16">
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 text-center hover:bg-gray-800/70 transition-all duration-300">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Comprehensive Application Support
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our application assistance service covers every aspect of your university application. From crafting compelling essays to managing deadlines, we ensure your application stands out from the competition.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                What Makes Us Different
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Personalized Approach</h4>
                  <p className="text-gray-300 text-sm">Every application is tailored to highlight your unique strengths and experiences.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Expert Writers</h4>
                  <p className="text-gray-300 text-sm">Our team includes former admissions officers and professional writers.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Proven Results</h4>
                  <p className="text-gray-300 text-sm">95% of our students get accepted to their top choice universities.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Unlimited Revisions</h4>
                  <p className="text-gray-300 text-sm">We work with you until you're completely satisfied with your application.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-white text-center mb-12">
              Our Application Process
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-green-500/30"></div>
              <div className="space-y-12">
                {[
                  { title: 'Initial Consultation', desc: 'We discuss your goals, background, and target universities' },
                  { title: 'Document Planning', desc: 'Create a comprehensive plan for all required documents' },
                  { title: 'Writing & Development', desc: 'Craft compelling essays and prepare all materials' },
                  { title: 'Review & Refinement', desc: 'Multiple rounds of review and improvement' },
                  { title: 'Final Submission', desc: 'Submit applications and track their progress' }
                ].map((step, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <h3 className="text-xl font-heading font-bold text-white">{step.title}</h3>
                      <p className="text-gray-300">{step.desc}</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Let's Build Your Winning Application
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get expert help with every aspect of your university application
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Start Your Application
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

      <Footer />
    </div>
  )
}

export default ApplicationAssistance
