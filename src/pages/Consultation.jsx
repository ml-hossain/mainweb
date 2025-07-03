import React, { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen, FiStar, FiClock, FiVideo, FiCheck, FiArrowRight } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const Consultation = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    interestedCountry: '',
    preferredMode: '',
    preferredTime: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

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
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.education || !formData.preferredMode) {
        setSubmitMessage('Please fill in all required fields.')
        setIsSubmitting(false)
        return
      }

      // Prepare data for Supabase
      const consultationData = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        preferred_destination: formData.interestedCountry || null,
        study_level: formData.education,
        consultation_type: formData.preferredMode,
        preferred_date: null,
        message: formData.message ? 
          `${formData.message}${formData.preferredTime ? `\n\nPreferred Time: ${formData.preferredTime}` : ''}` : 
          (formData.preferredTime ? `Preferred Time: ${formData.preferredTime}` : null),
        status: 'pending'
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('consultations')
        .insert([consultationData])

      if (error) {
        throw error
      }

      // Success
      setSubmitMessage('Thank you! Your consultation request has been submitted successfully. We will contact you within 24 hours.')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        education: '',
        interestedCountry: '',
        preferredMode: '',
        preferredTime: '',
        message: ''
      })

    } catch (error) {
      console.error('Error submitting consultation:', error)
      setSubmitMessage('Sorry, there was an error submitting your request. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-8">
            <FiCalendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Free <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Consultation</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Book your free consultation with our expert counselors and take the first step towards your international education journey.
          </p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <FiClock className="w-5 h-5" />
              <span>45-60 min</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiVideo className="w-5 h-5" />
              <span>Online/In-person</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiStar className="w-5 h-5" />
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Consultation Information */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8">What to Expect</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personalized Assessment</h3>
                  <p className="text-gray-300">Our counselors will assess your academic background, career goals, and preferences to recommend the best options.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">University Recommendations</h3>
                  <p className="text-gray-300">Get tailored university and program suggestions based on your profile and interests.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Country & Program Guidance</h3>
                  <p className="text-gray-300">Learn about different countries, their education systems, and program requirements.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Timeline Planning</h3>
                  <p className="text-gray-300">Get a detailed timeline for your application process, including important deadlines.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiStar className="w-5 h-5 mr-2 text-yellow-400" />
                Consultation Highlights
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-3 text-green-400" />
                  Duration: 45-60 minutes
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-3 text-green-400" />
                  Mode: In-person or Online
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-3 text-green-400" />
                  Cost: Completely Free
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-3 text-green-400" />
                  Follow-up: Detailed report provided
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-3 text-green-400" />
                  Expert: Experienced counselor assigned
                </li>
              </ul>
            </div>
          </div>

          {/* Consultation Booking Form */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mb-4">
                <FiCalendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Book Your Free Consultation</h2>
              <p className="text-gray-400">Get expert guidance tailored to your goals</p>
            </div>
            
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-xl ${submitMessage.includes('successfully') ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-red-600/20 text-red-400 border border-red-600/30'}`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-white mb-2">
                  Current Education Level *
                </label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select your education level</option>
                  <option value="high-school">High School</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD/Doctorate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="interestedCountry" className="block text-sm font-medium text-white mb-2">
                  Interested Country/Region
                </label>
                <select
                  id="interestedCountry"
                  name="interestedCountry"
                  value={formData.interestedCountry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select preferred destination</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="australia">Australia</option>
                  <option value="malaysia">Malaysia</option>
                  <option value="germany">Germany</option>
                  <option value="france">France</option>
                  <option value="netherlands">Netherlands</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredMode" className="block text-sm font-medium text-white mb-2">
                  Preferred Consultation Mode *
                </label>
                <select
                  id="preferredMode"
                  name="preferredMode"
                  value={formData.preferredMode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select consultation mode</option>
                  <option value="online">Online (Video Call)</option>
                  <option value="in-person">In-Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-white mb-2">
                  Preferred Time Slot
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Tell us about your goals, preferred programs, or any specific questions you have..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Book Free Consultation'}</span>
                {!isSubmitting && <FiArrowRight className="w-5 h-5" />}
              </button>

              <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-300">
                  <FiCheck className="w-4 h-4 inline mr-2 text-green-400" />
                  * Required fields. We'll contact you within 24 hours to confirm your consultation.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Consultation
