import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { FiStar, FiArrowRight, FiCheck, FiClock, FiGift, FiUsers, FiGlobe, FiAward, FiTrendingUp } from 'react-icons/fi'
import HomeUniversityCard from '../components/HomeUniversityCard'
import { supabase } from '../lib/supabase'

const Home = () => {
  const heroRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const buttonsRef = useRef(null)
  const reviewsRef = useRef(null)
  const offerCardRef = useRef(null)
  const statsectionRef = useRef(null)

  // Timer state for 30-day countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Filter toggle state
  const [showFilters, setShowFilters] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [programFilter, setProgramFilter] = useState('All Programs')
  const [budgetFilter, setBudgetFilter] = useState('All Budgets')
  const [locationFilter, setLocationFilter] = useState('All Malaysia')
  const [rankingFilter, setRankingFilter] = useState('All Rankings')

  // Dynamic content states
  const [contentSections, setContentSections] = useState({})
  const [siteSettings, setSiteSettings] = useState({})
  const [loadingContent, setLoadingContent] = useState(true)

  // University data from Supabase
  const [universities, setUniversities] = useState([])
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 6,
    totalCount: 0
  })

  // Filtered universities based on search and filters
  const filteredUniversities = universities.filter(uni => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (uni.content.programs && uni.content.programs.some(prog => prog.toLowerCase().includes(searchTerm.toLowerCase())))

    // Program filter
    const matchesProgram = programFilter === 'All Programs' ||
      (uni.content.programs && uni.content.programs.some(prog => prog === programFilter))

    // Budget filter - parse tuition fee range if available
    let budgetNumber = 0
    if (uni.content.tuition_fee_range) {
      const match = uni.content.tuition_fee_range.match(/\d+,?\d*/g)
      if (match) {
        budgetNumber = parseInt(match[0].replace(',', ''))
      }
    }
    const matchesBudget = budgetFilter === 'All Budgets' ||
      (budgetFilter === 'Under 30,000' && budgetNumber < 30000) ||
      (budgetFilter === '30,000 - 50,000' && budgetNumber >= 30000 && budgetNumber <= 50000) ||
      (budgetFilter === '50,000 - 100,000' && budgetNumber >= 50000 && budgetNumber <= 100000) ||
      (budgetFilter === 'Above 100,000' && budgetNumber > 100000)

    // Location filter
    const matchesLocation = locationFilter === 'All Malaysia' || uni.location === locationFilter

    // Ranking filter
    const matchesRanking = rankingFilter === 'All Rankings' ||
      (rankingFilter === 'Top 10' && uni.content.ranking && uni.content.ranking <= 10) ||
      (rankingFilter === 'Top 50' && uni.content.ranking && uni.content.ranking <= 50) ||
      (rankingFilter === 'Top 100' && uni.content.ranking && uni.content.ranking <= 100) ||
      (rankingFilter === 'Top 500' && uni.content.ranking && uni.content.ranking <= 500)

    return matchesSearch && matchesProgram && matchesBudget && matchesLocation && matchesRanking
  })

  // Calculate 30-day timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()

      // Get stored start date or create new one
      let startDate = localStorage.getItem('offerStartDate')
      if (!startDate) {
        startDate = now.toISOString()
        localStorage.setItem('offerStartDate', startDate)
      }

      const offerStart = new Date(startDate)
      const targetDate = new Date(offerStart.getTime() + (30 * 24 * 60 * 60 * 1000))

      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        // Reset to new 30-day cycle
        const newStartDate = now.toISOString()
        localStorage.setItem('offerStartDate', newStartDate)
        const newTargetDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
        const newDifference = newTargetDate - now

        setTimeLeft({
          days: Math.floor(newDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((newDifference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((newDifference / 1000 / 60) % 60),
          seconds: Math.floor((newDifference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch dynamic content from Supabase
  useEffect(() => {
    fetchContentData()
  }, [])

  useEffect(() => {
    fetchUniversities()
  }, [pagination.currentPage, searchTerm, programFilter, budgetFilter, locationFilter, rankingFilter])

  const fetchContentData = async () => {
    try {
      // Fetch content sections
      const { data: contentData, error: contentError } = await supabase
        .from('content_sections')
        .select('*')
        .eq('page_name', 'home')
        .eq('is_active', true)

      if (contentError) throw contentError

      // Convert array to object for easy access
      const contentObj = {}
      contentData.forEach(section => {
        contentObj[section.section_name] = section
      })
      setContentSections(contentObj)

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('is_active', true)

      if (settingsError) throw settingsError

      // Convert array to object for easy access
      const settingsObj = {}
      settingsData.forEach(setting => {
        try {
          settingsObj[setting.setting_key] = JSON.parse(setting.setting_value)
        } catch {
          settingsObj[setting.setting_key] = setting.setting_value
        }
      })
      setSiteSettings(settingsObj)

    } catch (error) {
      console.error('Error fetching content data:', error)
    } finally {
      setLoadingContent(false)
    }
  }

  const fetchUniversities = async () => {
    setLoadingUniversities(true)
    try {
      const { from, to } = {
        from: (pagination.currentPage - 1) * pagination.pageSize,
        to: pagination.currentPage * pagination.pageSize - 1
      }

      let query = supabase
        .from('universities')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('content->ranking', { ascending: true, nullsLast: true })
        .range(from, to)

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      }

      if (programFilter !== 'All Programs') {
        query = query.contains('content->programs', [programFilter])
      }

      if (locationFilter !== 'All Malaysia') {
        query = query.eq('location', locationFilter)
      }

      if (rankingFilter !== 'All Rankings') {
        const rankingMap = {
          'Top 10': 10,
          'Top 50': 50,
          'Top 100': 100,
          'Top 500': 500
        }
        if (rankingMap[rankingFilter]) {
          query = query.lte('content->ranking', rankingMap[rankingFilter])
        }
      }

      const { data, error, count } = await query

      if (error) throw error
      
      setUniversities(data || [])
      setPagination(prev => ({ ...prev, totalCount: count }))

    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoadingUniversities(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  useEffect(() => {
    // Reset any existing animations
    gsap.set([badgeRef.current, titleRef.current, subtitleRef.current, statsRef.current, buttonsRef.current, reviewsRef.current, offerCardRef.current], {
      opacity: 0,
      y: 50,
      x: 0,
      scale: 1
    })

    // Create faster, smoother sequential timeline - starts after navbar
    const tl = gsap.timeline({ delay: 0.7 }) // Start after navbar completes

    // Badge animation
    tl.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    })

      // Title animation
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")

      // Subtitle animation
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4")

      // Stats animation
      .to(statsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")

      // Buttons animation
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")

      // Reviews animation
      .to(reviewsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2")

      // Offer card animation with special effects
      .fromTo(offerCardRef.current,
        {
          opacity: 0,
          x: 100,
          y: 30,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)"
        },
        "-=0.5"
      )

    // Statistics section animation with scroll trigger
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target.children,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out"
            }
          )
          statsObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })

    if (statsectionRef.current) {
      statsObserver.observe(statsectionRef.current)
    }

    // Cleanup function
    return () => {
      tl.kill()
      statsObserver.disconnect()
    }
  }, [])

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />

        {/* Hero Content */}
        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <div className="flex-1 lg:pr-12 text-center lg:text-left">

              {/* Badge */}
              <div ref={badgeRef} className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <FiStar className="w-4 h-4 mr-2" />
                #1 Education Consultancy
              </div>

              {/* Main Headline */}
              <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Your Gateway to</span>
                <span className="block text-green-400">Global Education</span>
              </h1>

              {/* Subtitle */}
              <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {contentSections.hero?.content || 'Transform your dreams into reality with personalized guidance for studying abroad.'}
              </p>

              {/* Stats */}
              <div ref={statsRef} className="flex flex-wrap gap-8 mb-10 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">
                    {siteSettings.hero_stats?.students_placed || '2500'}+
                  </div>
                  <div className="text-green-300 text-sm">Students Placed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">
                    {siteSettings.hero_stats?.success_rate || '98'}%
                  </div>
                  <div className="text-green-300 text-sm">Success Rate</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">
                    {siteSettings.hero_stats?.university_partners || '150'}+
                  </div>
                  <div className="text-green-300 text-sm">Universities</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                <Link
                  to="/consultation"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                >
                  Start Your Journey
                  <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="relative bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Left to Right Orange Background - 50% width */}
                  <span className="absolute inset-y-0 left-0 w-1/2 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                  {/* Right to Left Orange Background - 50% width */}
                  <span className="absolute inset-y-0 right-0 w-1/2 bg-orange-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10">Explore Services</span>
                </Link>
              </div>

              {/* Reviews Preview */}
              <div ref={reviewsRef} className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-white font-semibold ml-2">4.9</span>
                  </div>
                  <p className="text-gray-300 text-sm">Trusted by 2000+ students</p>
                </div>
              </div>
            </div>

            {/* Right Side - Dark Professional Offer Card */}
            <div ref={offerCardRef} className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-gray-800 rounded-2xl p-5 shadow-2xl border border-gray-700 relative overflow-hidden">
                {/* Subtle background accents */}
                <div className="absolute top-0 right-0 w-14 h-14 bg-gray-700/40 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 bg-gray-600/40 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="relative z-10">
                  {/* Header Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-amber-500 text-gray-900 rounded-full text-xs font-bold mb-3">
                    <FiClock className="w-3 h-3 mr-1" />
                    LIMITED OFFER
                  </div>

                  {/* Timer */}
                  <div className="bg-gray-700 rounded-xl p-2 mb-3 border border-gray-600">
                    <div className="text-amber-400 text-xs mb-1 text-center">Ends In:</div>
                    <div className="grid grid-cols-4 gap-1">
                      <div className="text-center">
                        <div className="bg-gray-600 rounded-lg p-1 mb-1 border border-gray-500">
                          <div className="text-white font-bold text-lg">{timeLeft.days}</div>
                        </div>
                        <div className="text-gray-300 text-xs">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-600 rounded-lg p-1 mb-1 border border-gray-500">
                          <div className="text-white font-bold text-lg">{timeLeft.hours}</div>
                        </div>
                        <div className="text-gray-300 text-xs">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-600 rounded-lg p-1 mb-1 border border-gray-500">
                          <div className="text-white font-bold text-lg">{timeLeft.minutes}</div>
                        </div>
                        <div className="text-gray-300 text-xs">Mins</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-600 rounded-lg p-1 mb-1 border border-gray-500">
                          <div className="text-white font-bold text-lg">{timeLeft.seconds}</div>
                        </div>
                        <div className="text-gray-300 text-xs">Secs</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Offer with Free Flight */}
                  <div className="text-center mb-3">
                    <div className="text-xl font-black text-white mb-1">
                      10% DISCOUNT
                    </div>
                    <div className="bg-amber-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold inline-block mb-2">
                      🎁 FREE FLIGHT INCLUDED
                    </div>
                  </div>

                  {/* Competitive Advantages - Lighter */}
                  <div className="bg-gray-700 rounded-lg p-2 mb-3 border border-gray-600">
                    <div className="text-center mb-1">
                      <span className="text-amber-400 text-xs font-bold">🎓 WHY CHOOSE US</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-center">
                      <div className="text-gray-200">✈️ Free Flight</div>
                      <div className="text-gray-200">💰 Best Rates</div>
                      <div className="text-gray-200">📚 Expert Guidance</div>
                      <div className="text-gray-200">🎯 100% Success</div>
                    </div>
                  </div>

                  {/* Key Features - Lighter */}
                  <div className="space-y-2 mb-4">
                    {[
                      { icon: FiGift, text: 'Free Flight Ticket ₹50,000' },
                      { icon: FiCheck, text: '24/7 Student Support' },
                      { icon: FiStar, text: 'University Selection' },
                      { icon: FiArrowRight, text: 'Visa Assistance' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1.5 border border-gray-600">
                        <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                          <feature.icon className="w-3 h-3 text-gray-900" />
                        </div>
                        <span className="text-gray-200 text-xs font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/consultation"
                    className="relative w-full bg-amber-400 text-gray-900 font-black text-sm py-3 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Bottom-right to Top-left White Background - 50% diagonal */}
                    <span className="absolute inset-0 bg-white transform origin-bottom-right scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" style={{ clipPath: 'polygon(50% 100%, 100% 100%, 100% 0%)' }}></span>
                    {/* Top-left to Bottom-right White Background - 50% diagonal */}
                    <span className="absolute inset-0 bg-white transform origin-top-left scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" style={{ clipPath: 'polygon(0% 0%, 50% 0%, 0% 100%)' }}></span>
                    <span className="relative z-10 flex items-center">
                      <FiGift className="mr-2 w-4 h-4" />
                      CLAIM OFFER NOW
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beautiful Colorful Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg className="w-full h-24 transform scale-110" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="25%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#059669" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(30, 64, 175, 0.8)" />
                <stop offset="25%" stopColor="rgba(59, 130, 246, 0.8)" />
                <stop offset="50%" stopColor="rgba(16, 185, 129, 0.8)" />
                <stop offset="75%" stopColor="rgba(5, 150, 105, 0.8)" />
                <stop offset="100%" stopColor="rgba(6, 95, 70, 0.8)" />
              </linearGradient>
              <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(30, 64, 175, 0.6)" />
                <stop offset="25%" stopColor="rgba(59, 130, 246, 0.6)" />
                <stop offset="50%" stopColor="rgba(16, 185, 129, 0.6)" />
                <stop offset="75%" stopColor="rgba(5, 150, 105, 0.6)" />
                <stop offset="100%" stopColor="rgba(6, 95, 70, 0.6)" />
              </linearGradient>
            </defs>

            {/* First wave layer */}
            <path
              fill="url(#waveGradient1)"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />

            {/* Second wave layer */}
            <path
              fill="url(#waveGradient2)"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />

            {/* Third wave layer */}
            <path
              fill="url(#waveGradient3)"
              d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Statistics Section - Enhanced Beautiful Design */}
      <section ref={statsectionRef} className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-xs font-semibold mb-3">
              <FiTrendingUp className="w-3 h-3 mr-1" />
              Proven Success Record
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Transforming Dreams Into Reality
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful students who trusted us with their international education journey.
            </p>
          </div>

          {/* Statistics Grid - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Students Placed */}
            <div className="group">
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <FiUsers className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">2,500+</div>
                  <div className="text-gray-800 font-semibold text-xs mb-1">Students Placed</div>
                  <div className="text-xs text-gray-500 font-medium">Across 15+ Countries</div>
                </div>
              </div>
            </div>

            {/* Visa Success Rate */}
            <div className="group">
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <FiAward className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">98.5%</div>
                  <div className="text-gray-800 font-semibold text-xs mb-1">Visa Success Rate</div>
                  <div className="text-xs text-gray-500 font-medium">Industry Leading</div>
                </div>
              </div>
            </div>

            {/* Partner Universities */}
            <div className="group">
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <FiGlobe className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-1">150+</div>
                  <div className="text-gray-800 font-semibold text-xs mb-1">Partner Universities</div>
                  <div className="text-xs text-gray-500 font-medium">Top Ranked Globally</div>
                </div>
              </div>
            </div>

            {/* Experience Years */}
            <div className="group">
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <FiTrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">12+</div>
                  <div className="text-gray-800 font-semibold text-xs mb-1">Years Experience</div>
                  <div className="text-xs text-gray-500 font-medium">Trusted Expertise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Search Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              <FiGlobe className="w-4 h-4 mr-2" />
              Find Your Perfect University
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Top Universities in Malaysia
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Search through our extensive database of Malaysian universities and find the perfect match for your academic goals.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search universities, programs, or keywords..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center space-x-2 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                  </span>
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">Filters</span>
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">
                    <svg className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Filter Options - Show/Hide based on showFilters state */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top duration-300">
                {/* Program Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option>All Programs</option>
                    <option>Engineering</option>
                    <option>Business</option>
                    <option>Medicine</option>
                    <option>Technology</option>
                    <option>Agriculture</option>
                    <option>Music</option>
                  </select>
                </div>

                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (RM)</label>
                  <select
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option>All Budgets</option>
                    <option>Under 30,000</option>
                    <option>30,000 - 50,000</option>
                    <option>50,000 - 100,000</option>
                    <option>Above 100,000</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option>All Malaysia</option>
                    <option>Kuala Lumpur</option>
                    <option>Selangor</option>
                    <option>Penang</option>
                    <option>Johor</option>
                    <option>Sabah</option>
                    <option>Sarawak</option>
                  </select>
                </div>

                {/* Ranking Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ranking</label>
                  <select
                    value={rankingFilter}
                    onChange={(e) => setRankingFilter(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option>All Rankings</option>
                    <option>Top 10</option>
                    <option>Top 50</option>
                    <option>Top 100</option>
                    <option>Top 500</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setProgramFilter('All Programs')
                      setBudgetFilter('All Budgets')
                      setLocationFilter('All Malaysia')
                      setRankingFilter('All Rankings')
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-300 font-medium text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredUniversities.length}</span> of <span className="font-semibold">{universities.length}</span> universities
              {searchTerm && (
                <span className="ml-2">
                  for "<span className="font-semibold text-blue-600">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>

          {/* University Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingUniversities ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : filteredUniversities.length > 0 ? (
              filteredUniversities.map(uni => (
                <HomeUniversityCard key={uni.id} university={uni} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <h3 className="text-xl text-gray-800 font-semibold">No Universities Found</h3>
                <p className="text-gray-600 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalCount > pagination.pageSize && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Previous
            </button>

              {Array.from({ length: Math.ceil(pagination.totalCount / pagination.pageSize) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                    pagination.currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === Math.ceil(pagination.totalCount / pagination.pageSize)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
            </button>
          </div>
          )}
        </div>
      </section>

      {/* Ready to Begin Your Next Move Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <g fill="#1e40af" fillOpacity="0.4">
                <circle cx="30" cy="30" r="1" />
                <circle cx="15" cy="15" r="1" />
                <circle cx="45" cy="15" r="1" />
                <circle cx="15" cy="45" r="1" />
                <circle cx="45" cy="45" r="1" />
              </g>
            </g>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Section Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-800 rounded-full text-sm font-semibold mb-6 shadow-lg border border-blue-100">
              <FiAward className="w-4 h-4 mr-2" />
              Take the Next Step
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Ready to Begin Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Next Move?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Get expert guidance from our consultants and fast-track your educational journey with proven strategies.
            </p>

            {/* Features Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">24/7 Available</h3>
                <p className="text-gray-600 text-xs">Round-the-clock support whenever you need help</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FiClock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Save Time</h3>
                <p className="text-gray-600 text-xs">Streamlined application process</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FiAward className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Success Guaranteed</h3>
                <p className="text-gray-600 text-xs">Proven track record of success</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative inline-block">
              <Link
                to="/consultation"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Animated Background */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

                {/* Button Content */}
                <span className="relative z-10 flex items-center">
                  <FiGift className="w-5 h-5 mr-2" />
                  Book Free Consultation
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                100% Free Consultation
              </div>
              <div className="flex items-center">
                <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                No Hidden Charges
              </div>
              <div className="flex items-center">
                <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                Expert Guidance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Departure Section - Full Width */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Section Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6 border border-white/30">
              <FiCheck className="w-4 h-4 mr-2" />
              Pre-Departure Support
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Start Your Journey
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Prepared
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Get comprehensive pre-departure support for a smooth transition to your new academic adventure abroad.
            </p>

            {/* Features Grid - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Document Preparation</h3>
                <p className="text-white/80 text-sm">Complete checklist and document verification before departure</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiGlobe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cultural Orientation</h3>
                <p className="text-white/80 text-sm">Learn about local customs, culture, and social norms</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Airport Assistance</h3>
                <p className="text-white/80 text-sm">Dedicated support team to help you at departure and arrival</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">24/7 Support</h3>
                <p className="text-white/80 text-sm">Round-the-clock assistance during your transition period</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/services/pre-departure-orientation"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <FiArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                Get Pre-Departure Support
              </Link>
              
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300 group"
              >
                View All Services
                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-200/20 to-teal-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* CEO Photo - Left Side */}
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto max-w-md">
                {/* Main Photo Container */}
                <div className="relative">
                  <div className="aspect-[3/4] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80"
                      alt="CEO - Dr. Ahmad Rahman"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating Achievement Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-xl transform rotate-6">
                    <div className="text-center">
                      <FiAward className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs font-bold">15+ Years</div>
                      <div className="text-xs">Experience</div>
                    </div>
                  </div>

                  {/* Floating Stats Badge */}
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-xl transform -rotate-6">
                    <div className="text-center">
                      <FiUsers className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs font-bold">2500+</div>
                      <div className="text-xs">Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CEO Content - Right Side */}
            <div className="order-1 lg:order-2">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                  <FiAward className="w-4 h-4 mr-2" />
                  Meet Our CEO & Founder
                </div>

                {/* CEO Name & Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Dr. Ahmad Rahman
                </h2>
                <p className="text-lg text-blue-600 font-semibold mb-6">
                  Founder & Chief Executive Officer
                </p>

                {/* Achievements Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">25+</div>
                    <div className="text-sm text-gray-600">Partner Universities</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">15+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                </div>

                {/* Personal Message */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
                  <blockquote className="text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      "For over 15 years, I've dedicated my life to helping students achieve their dreams of studying abroad. Every success story motivates me to continue this journey."
                    </p>
                    <p className="mb-4">
                      "We don't just process applications - we transform lives. Our personalized approach ensures each student gets the attention and guidance they deserve."
                    </p>
                    <p className="text-blue-600 font-semibold">
                      "Your success is our mission, and your dreams are our responsibility."
                    </p>
                  </blockquote>

                  {/* Signature */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="w-16 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-script text-lg">AR</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">Dr. Ahmad Rahman</div>
                        <div className="text-xs text-gray-500">Founder & CEO</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    PhD in Education
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Certified Immigration Consultant
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    ICEF Agent
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    15+ Awards
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
