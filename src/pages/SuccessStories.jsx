import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiStar, FiMapPin, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const SuccessStories = () => {
  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const storiesRef = useRef(null)

  const stats = [
    { number: '2000+', label: 'Students Placed', icon: FiUser },
    { number: '95%', label: 'Success Rate', icon: FiStar },
    { number: '50+', label: 'Universities', icon: FiMapPin },
    { number: '15+', label: 'Countries', icon: FiMapPin }
  ]

  const stories = [
    {
      name: 'Priya Sharma',
      university: 'Harvard University',
      course: 'MS in Computer Science',
      country: 'USA',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      testimonial: 'MA Education made my dream of studying at Harvard a reality. Their guidance was invaluable throughout the application process.',
      rating: 5,
      scholarship: '$20,000'
    },
    {
      name: 'Arjun Patel',
      university: 'University of Toronto',
      course: 'MBA',
      country: 'Canada',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      testimonial: 'The visa process seemed daunting, but MA Education handled everything perfectly. Now I\'m living my dream in Toronto!',
      rating: 5,
      scholarship: '$15,000'
    },
    {
      name: 'Sarah Johnson',
      university: 'University of Melbourne',
      course: 'Master of Engineering',
      country: 'Australia',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      testimonial: 'From university selection to scholarship applications, MA Education was with me every step. Couldn\'t have done it without them!',
      rating: 5,
      scholarship: '$12,000'
    },
    {
      name: 'Rahul Gupta',
      university: 'University of Oxford',
      course: 'MSc in Data Science',
      country: 'UK',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      testimonial: 'Oxford was always a dream, and MA Education made it possible. Their expert guidance was the key to my success.',
      rating: 5,
      scholarship: '$18,000'
    },
    {
      name: 'Meera Singh',
      university: 'ETH Zurich',
      course: 'MS in Mechanical Engineering',
      country: 'Switzerland',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      testimonial: 'The personalized approach and attention to detail from MA Education was exceptional. Now studying at one of the world\'s best universities!',
      rating: 5,
      scholarship: '$25,000'
    },
    {
      name: 'David Kim',
      university: 'National University of Singapore',
      course: 'MBA',
      country: 'Singapore',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      testimonial: 'MA Education\'s network and expertise in Asian universities helped me secure admission to NUS with a scholarship.',
      rating: 5,
      scholarship: '$22,000'
    }
  ]

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(headerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(statsRef.current.children,
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "back.out(1.7)" 
      },
      "-=0.4"
    )
    .fromTo(storiesRef.current.children,
      { opacity: 0, y: 50, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power3.out" 
      },
      "-=0.4"
    )
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Service Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <FiStar className="mr-2 h-4 w-4" />
            Student Success Stories
          </span>
        </div>
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
            Success Stories
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover how we've helped thousands of students achieve their dreams of studying abroad at top universities worldwide.
          </p>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 text-center hover:bg-gray-800/70 transition-all duration-300">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Stories Grid */}
        <div ref={storiesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Student Image */}
              <div className="flex items-center mb-6">
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="font-heading font-bold text-white">{story.name}</h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    {story.country}
                    <FiCalendar className="w-3 h-3 ml-3 mr-1" />
                    {story.year}
                  </div>
                </div>
              </div>

              {/* University Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-emerald-400 mb-1">{story.university}</h4>
                <p className="text-gray-300 text-sm">{story.course}</p>
              </div>

              {/* Scholarship */}
              <div className="bg-emerald-500/10 rounded-lg p-4 mb-6">
                <div className="text-sm text-emerald-400 font-medium">
                  Scholarship Received: <span className="font-bold">{story.scholarship}</span>
                </div>
              </div>

              {/* Testimonial */}
              <blockquote className="text-gray-300 text-sm italic mb-6">
                "{story.testimonial}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center">
                {[...Array(story.rating)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-300">({story.rating}/5)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Your Success Story Starts Here
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful students who achieved their dreams with our guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/consultation" 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Start Your Journey
              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/services" 
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              View Our Services
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessStories
