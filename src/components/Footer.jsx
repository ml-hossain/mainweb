import React from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight, FiGlobe } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800 text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Main Footer Content */}
      <div className="relative pt-16 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  EduGlobal Malaysia
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm mb-6">
                  Your trusted partner for international education in Malaysia. We help students achieve their dreams of studying abroad with expert guidance and personalized support.
                </p>
                
                {/* Social Media Links */}
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <FiFacebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <FiTwitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <FiInstagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link to="/success-stories" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Our Services</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/services/university-selection" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    University Selection
                  </Link>
                </li>
                <li>
                  <Link to="/services/application-assistance" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Application Assistance
                  </Link>
                </li>
                <li>
                  <Link to="/services/visa-processing" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Visa Processing
                  </Link>
                </li>
                <li>
                  <Link to="/services/scholarship-guidance" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Scholarship Guidance
                  </Link>
                </li>
                <li>
                  <Link to="/services/test-preparation" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                    <FiArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Test Preparation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>123 Education Boulevard,</p>
                    <p>Kuala Lumpur 50450,</p>
                    <p>Malaysia</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiPhone className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>+60 3-1234 5678</p>
                    <p>+60 12-345 6789</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiMail className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>info@eduglobal.my</p>
                    <p>support@eduglobal.my</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiGlobe className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>www.eduglobal.my</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 EduGlobal Malaysia. All rights reserved.
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Cookie Policy
                </Link>
                <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
