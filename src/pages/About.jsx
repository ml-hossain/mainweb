import React from 'react'
import { FiCheck, FiTarget, FiStar } from 'react-icons/fi'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Service Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <FiStar className="mr-2 h-4 w-4" />
            About MA Education
          </span>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
            About MA Education
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Your trusted partner in achieving global education dreams with personalized guidance and expert support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-300 mb-4">
              Founded with a mission to make international education accessible to every student, 
              MA Education has been guiding students toward their academic goals for over a decade.
            </p>
            <p className="text-gray-300 mb-4">
              We understand that studying abroad is more than just getting admission - it's about 
              finding the right fit for your academic, personal, and career aspirations.
            </p>
            <p className="text-gray-300">
              With our expert team and comprehensive services, we've helped over 2000+ students 
              achieve their dreams of studying at top universities worldwide.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Why Choose Us?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1">
                  <FiCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Expert Guidance</h4>
                  <p className="text-gray-300 text-sm">Experienced counselors with deep knowledge of international education</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1">
                  <FiCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Personalized Support</h4>
                  <p className="text-gray-300 text-sm">Tailored solutions for each student's unique needs and goals</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1">
                  <FiCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">End-to-End Service</h4>
                  <p className="text-gray-300 text-sm">From university selection to visa approval and beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Our Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiTarget className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300">
                To empower students with the knowledge, guidance, and support needed to pursue 
                quality education abroad and achieve their academic and career aspirations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiStar className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300">
                To be the leading education consultancy that transforms dreams into reality by 
                connecting students with world-class educational opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
