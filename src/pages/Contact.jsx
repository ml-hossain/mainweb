import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiMessageSquare,
  FiArrowRight,
  FiUsers,
  FiGlobe,
  FiHeart,
  FiHeadphones
} from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { validateInput, sanitizeHtml } from '../lib/security'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const headerRef = useRef(null)
  const contentRef = useRef(null)
  const statsRef = useRef(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Security validation
      if (!validateInput(formData.firstName, 'name')) {
        setSubmitMessage('Please enter a valid first name (2-50 characters, letters only)')
        setIsSubmitting(false)
        return
      }

      if (!validateInput(formData.lastName, 'name')) {
        setSubmitMessage('Please enter a valid last name (2-50 characters, letters only)')
        setIsSubmitting(false)
        return
      }

      if (!validateInput(formData.email, 'email')) {
        setSubmitMessage('Please enter a valid email address')
        setIsSubmitting(false)
        return
      }

      if (formData.phone && !validateInput(formData.phone, 'phone')) {
        setSubmitMessage('Please enter a valid phone number')
        setIsSubmitting(false)
        return
      }

      if (!validateInput(formData.message, 'text')) {
        setSubmitMessage('Message is required and must be under 1000 characters')
        setIsSubmitting(false)
        return
      }

      // Sanitize and prepare data for Supabase
      const contactData = {
        name: `${sanitizeHtml(formData.firstName.trim())} ${sanitizeHtml(formData.lastName.trim())}`,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? sanitizeHtml(formData.phone.trim()) : null,
        message: `Subject: ${sanitizeHtml(formData.subject || 'General Inquiry')}\n\n${sanitizeHtml(formData.message.trim())}`,
        status: 'pending'
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('contact_requests')
        .insert([contactData])

      if (error) {
        throw error
      }

      // Success
      setSubmitMessage('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })

    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }


  const contactMethods = [
    {
      icon: FiPhone,
      title: 'Phone Support',
      description: 'Speak directly with our counselors',
      info: '+1 (555) 123-4567',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FiMail,
      title: 'Email Support',
      description: 'Get detailed responses to your queries',
      info: 'info@maeducation.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiMessageSquare,
      title: 'Live Chat',
      description: 'Instant support for quick questions',
      info: 'Available 24/7',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FiMapPin,
      title: 'Visit Our Office',
      description: 'Schedule an in-person consultation',
      info: '123 Education Street, NY',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div ref={headerRef} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-8">
              <FiHeadphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Ready to start your journey? Our expert counselors are here to guide you every step of the way
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-colors">
                Schedule Free Consultation
              </button>
              <button className="border border-gray-600 hover:border-blue-600 text-gray-300 hover:text-blue-400 px-8 py-4 rounded-lg font-bold transition-colors">
                Emergency Support
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Contact Methods */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              How to Reach Us
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your preferred way to connect with our expert team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <div key={index} className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:bg-gray-700 transition-all duration-300 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  <p className="text-blue-400 font-bold">
                    {method.info}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <FiPhone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-300">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Email</h3>
                  <p className="text-gray-300">info@maeducation.com</p>
                  <p className="text-gray-300">counseling@maeducation.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Address</h3>
                  <p className="text-gray-300">
                    123 Education Street<br />
                    Suite 456<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Office Hours</h3>
                  <p className="text-gray-300">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-green-600/20 border border-green-600/30 rounded-xl">
              <h3 className="text-lg font-bold text-green-400 mb-2">Need Immediate Help?</h3>
              <p className="text-gray-300 mb-4">
                Our counselors are available for urgent queries and emergency support.
              </p>
              <p className="text-green-400 font-bold">Emergency Hotline: +1 (555) 999-0000</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
            
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-xl ${submitMessage.includes('successfully') ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-red-600/20 text-red-400 border border-red-600/30'}`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-white mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-white mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-white mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="consultation">Free Consultation</option>
                  <option value="services">Services Information</option>
                  <option value="application">Application Support</option>
                  <option value="visa">Visa Assistance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-white mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Tell us about your educational goals and how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiMessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
            Don't wait - take the first step towards your international education dreams today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group shadow-xl"
            >
              Book Free Consultation
              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
