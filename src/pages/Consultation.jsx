import React, { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen } from 'react-icons/fi'
import Footer from '../components/Footer'
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
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free Consultation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book your free consultation with our expert counselors and take the first step towards your international education journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Consultation Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What to Expect</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Personalized Assessment</h3>
                  <p className="text-gray-600">Our counselors will assess your academic background, career goals, and preferences to recommend the best options.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">University Recommendations</h3>
                  <p className="text-gray-600">Get tailored university and program suggestions based on your profile and interests.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Country & Program Guidance</h3>
                  <p className="text-gray-600">Learn about different countries, their education systems, and program requirements.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Timeline Planning</h3>
                  <p className="text-gray-600">Get a detailed timeline for your application process, including important deadlines.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Consultation Details</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Duration: 45-60 minutes</li>
                <li>• Mode: In-person or Online</li>
                <li>• Cost: Completely Free</li>
                <li>• Follow-up: Detailed report provided</li>
                <li>• Expert: Experienced counselor assigned</li>
              </ul>
            </div>
          </div>

          {/* Consultation Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Free Consultation</h2>
            
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${submitMessage.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Education Level *
                </label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <label htmlFor="interestedCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Interested Country/Region
                </label>
                <select
                  id="interestedCountry"
                  name="interestedCountry"
                  value={formData.interestedCountry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select preferred destination</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="australia">Australia</option>
                  <option value="germany">Germany</option>
                  <option value="france">France</option>
                  <option value="netherlands">Netherlands</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredMode" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Consultation Mode *
                </label>
                <select
                  id="preferredMode"
                  name="preferredMode"
                  value={formData.preferredMode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select consultation mode</option>
                  <option value="online">Online (Video Call)</option>
                  <option value="in-person">In-Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time Slot
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us about your goals, preferred programs, or any specific questions you have..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                {isSubmitting ? 'Submitting...' : 'Book Free Consultation'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                * Required fields. We'll contact you within 24 hours to confirm your consultation.
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Consultation
