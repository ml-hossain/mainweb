import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  FiStar, 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiAward,
  FiGlobe,
  FiArrowRight,
  FiTrendingUp,
  FiHeart,
  FiTarget
} from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const SuccessStories = () => {
  const headerRef = useRef(null)
  const contentRef = useRef(null)
  const statsRef = useRef(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch success stories from database
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const { data, error } = await supabase
          .from('success_stories')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching success stories:', error)
        } else {
          setStories(data || [])
        }
      } catch (error) {
        console.error('Error fetching success stories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuccessStories()
  }, [])

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

  const stats = [
    { number: 98, suffix: '%', label: 'Success Rate', icon: FiStar },
    { number: 2000, suffix: '+', label: 'Students Placed', icon: FiUser },
    { number: 50, suffix: '+', label: 'Universities', icon: FiGlobe },
    { number: 15, suffix: '+', label: 'Countries', icon: FiMapPin }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div ref={headerRef} className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-8 shadow-2xl">
              <FiAward className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-black bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent mb-6">
              Success Stories
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Real students, real achievements. Discover how we've helped thousands reach their dream universities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Your Journey
              </button>
              <button className="border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-300 px-8 py-4 rounded-2xl font-bold transition-all duration-300">
                Watch Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-800 mb-2">
                  <span className="stat-number">{stat.number}</span>{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading success stories...</div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">No success stories yet.</div>
            <p className="text-gray-300 mt-2">Check back soon for inspiring student achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <div key={story.id || index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Student Image */}
                <div className="flex items-center mb-6">
                  <img 
                    src={story.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-blue-100"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-800">{story.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {story.country}
                      <FiCalendar className="w-4 h-4 ml-3 mr-1" />
                      {story.year}
                    </div>
                  </div>
                </div>

                {/* University Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-blue-600 mb-2">{story.university}</h4>
                  <p className="text-gray-600">{story.course}</p>
                </div>

                {/* Scholarship Badge - Only show if scholarship amount exists */}
                {story.scholarship_amount && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-6">
                    <div className="flex items-center">
                      <FiAward className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-bold">{story.scholarship_amount}</span>
                      <span className="text-green-700 ml-1">Scholarship</span>
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                  "{story.testimonial}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center">
                  {[...Array(story.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">({story.rating || 5}/5)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiHeart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
            Your Success Story Starts Here
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
            Join thousands of successful students who achieved their dreams with our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group shadow-xl"
            >
              Start Free Consultation
              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all duration-300"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessStories
