import React, { useState } from 'react'
import { FiCalendar, FiClock, FiMessageSquare, FiUser, FiVideo, FiCheck, FiAlertCircle } from 'react-icons/fi'

const Consultation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setIsSubmitting(true)

    // Get form data
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'consultationType', 'dateTime', 'message']
    const emptyFields = requiredFields.filter(field => !data[field])

    if (emptyFields.length > 0) {
      setFormError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      setFormError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    // Validate date is in the future
    const selectedDate = new Date(data.dateTime)
    if (selectedDate <= new Date()) {
      setFormError('Please select a future date and time')
      setIsSubmitting(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      setIsSubmitted(true)
      e.target.reset()
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      setFormError('Failed to book consultation. Please try again.')
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const consultationTypes = [
    {
      icon: FiVideo,
      title: 'Video Consultation',
      description: 'Meet with our counselors face-to-face through video call',
      duration: '45 minutes',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: FiCalendar,
      title: 'In-Person Meeting',
      description: 'Visit our office for a detailed discussion',
      duration: '1 hour',
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      icon: FiMessageSquare,
      title: 'Quick Chat',
      description: 'Brief online consultation for quick queries',
      duration: '20 minutes',
      color: 'bg-emerald-500/20 text-emerald-400'
    }
  ]

  const topics = [
    'University Selection Strategy',
    'Course and Career Guidance',
    'Application Process Overview',
    'Scholarship Opportunities',
    'Visa Application Process',
    'Financial Planning',
    'Accommodation Options',
    'Student Life Abroad'
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Service Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <FiCalendar className="mr-2 h-4 w-4" />
            Free Consultation
          </span>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
            Book Your Free Consultation
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Get expert guidance on your study abroad journey with our experienced counselors.
          </p>
        </div>

        {/* Consultation Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {consultationTypes.map((type, index) => {
            const IconComponent = type.icon
            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 text-center hover:bg-gray-800/70 transition-all duration-300">
                <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-4">
                  {type.title}
                </h3>
                <p className="text-gray-300 mb-4">{type.description}</p>
                <div className="flex items-center justify-center text-gray-400">
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>{type.duration}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Consultation Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Schedule Your Session</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Consultation Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="consultationType"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select consultation type</option>
                  <option value="video">Video Consultation</option>
                  <option value="inperson">In-Person Meeting</option>
                  <option value="chat">Quick Chat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Date and Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us about your educational goals and any specific questions you have..."
                ></textarea>
              </div>

              {formError && (
                <div className="flex items-center space-x-2 text-red-400 bg-red-900/10 px-4 py-3 rounded-lg">
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{formError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full relative font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                  isSubmitted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className={`inline-flex items-center transition-opacity ${
                  isSubmitting ? 'opacity-0' : 'opacity-100'
                }`}>
                  {isSubmitted ? (
                    <>
                      <FiCheck className="w-5 h-5 mr-2" />
                      Consultation Booked!
                    </>
                  ) : (
                    'Book Consultation'
                  )}
                </span>
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-400 text-center">
                Fields marked with <span className="text-red-500">*</span> are required
              </p>
            </form>
          </div>

          {/* Topics & Information */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
              <h3 className="text-lg md:text-xl font-bold text-white mb-6">What We'll Discuss</h3>
              <div className="space-y-4">
                {topics.map((topic, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mt-1">
                      <FiUser className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-gray-300">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4">Why Choose Our Consultation?</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Personalized guidance from experienced counselors</li>
                <li>• Comprehensive discussion of your study abroad options</li>
                <li>• Clear roadmap for your educational journey</li>
                <li>• Expert insights on university selection</li>
                <li>• Detailed information about application processes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Consultation
