import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FiUsers,
  FiGlobe,
  FiAward,
  FiArrowRight,
  FiCheck,
  FiTarget,
  FiStar
} from 'react-icons/fi'

const About = () => {
  const stats = [
    { number: 10, suffix: '+', label: 'Years Experience', icon: FiTarget },
    { number: 2000, suffix: '+', label: 'Students Placed', icon: FiUsers },
    { number: 500, suffix: '+', label: 'Partner Universities', icon: FiGlobe },
    { number: 95, suffix: '%', label: 'Success Rate', icon: FiStar }
  ]

  return (
    <div className="min-h-screen bg-black">
      
      {/* Hero Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About MA Education
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your trusted partner in international education, helping students achieve their dreams of studying abroad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/consultation"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Free Consultation
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/services"
                className="border border-gray-600 hover:border-blue-600 text-gray-300 hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Our Story */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
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
          
          {/* Why Choose Us */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-3">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Expert Guidance</h3>
                  <p className="text-gray-300">Experienced counselors with deep knowledge of international education</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1 mr-3">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Personalized Support</h3>
                  <p className="text-gray-300">Tailored solutions for each student's unique needs and goals</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1 mr-3">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">End-to-End Service</h3>
                  <p className="text-gray-300">From university selection to visa approval and beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiTarget className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300">
              To empower students with the knowledge, guidance, and support needed to pursue 
              quality education abroad and achieve their academic and career aspirations.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiStar className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300">
              To be the leading education consultancy that transforms dreams into reality by 
              connecting students with world-class educational opportunities globally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
