import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiStar, FiEye, FiEyeOff, FiExternalLink, FiFileText, FiTarget, FiTrendingUp, FiSearch, FiCopy, FiDownload, FiRefreshCw, FiCheck, FiLoader, FiSettings } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const Universities = ({ onLogout }) => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  
  // Content Generator State
  const [contentGenerator, setContentGenerator] = useState({
    selectedKeywords: [],
    targetAudience: 'bangladeshi-students',
    contentType: 'university-guide',
    tone: 'professional',
    generatedContent: '',
    isGenerating: false,
    seoScore: 0,
    isLoadingKeywords: false
  })
  
  // Low Competition Keywords from SEO Manager (simulated data)
  const lowCompetitionKeywords = [
    { term: 'malta study visa bangladesh', volume: '8,900/month', difficulty: 'Low', competition: 0.31, growth: '+145%' },
    { term: 'poland study visa from bangladesh', volume: '11,200/month', difficulty: 'Low', competition: 0.29, growth: '+201%' },
    { term: 'turkey study visa bangladesh', volume: '13,400/month', difficulty: 'Low', competition: 0.35, growth: '+167%' },
    { term: 'finland study visa bangladesh', volume: '7,800/month', difficulty: 'Low', competition: 0.32, growth: '+156%' },
    { term: 'italy study visa bangladesh', volume: '10,300/month', difficulty: 'Low', competition: 0.36, growth: '+142%' },
    { term: 'cheap universities abroad for bangladeshi students', volume: '24,300/month', difficulty: 'Low', competition: 0.38, growth: '+195%' },
    { term: 'ai courses abroad for bangladeshi students', volume: '5,400/month', difficulty: 'Low', competition: 0.42, growth: '+289%' },
    { term: 'cybersecurity degree abroad from bangladesh', volume: '3,600/month', difficulty: 'Low', competition: 0.38, growth: '+198%' },
    { term: 'sustainable energy engineering abroad', volume: '2,900/month', difficulty: 'Low', competition: 0.35, growth: '+167%' },
    { term: 'blockchain technology courses abroad', volume: '2,200/month', difficulty: 'Low', competition: 0.41, growth: '+234%' },
    { term: 'জার্মানিতে ফ্রি পড়াশোনা', volume: '5,900/month', difficulty: 'Low', competition: 0.26, growth: '+234%' },
    { term: 'বিদেশী বিশ্ববিদ্যালয়ে ভর্তি', volume: '6,800/month', difficulty: 'Low', competition: 0.29, growth: '+189%' },
    { term: 'মালয়েশিয়ায় পড়াশোনার খরচ', volume: '11,400/month', difficulty: 'Low', competition: 0.31, growth: '+156%' },
    { term: 'ঢাকা থেকে বিদেশে পড়াশোনা', volume: '9,800/month', difficulty: 'Low', competition: 0.25, growth: '+123%' },
    { term: 'বিদেশে পড়াশোনা ২০২৫', volume: '13,200/month', difficulty: 'Low', competition: 0.28, growth: '+145%' }
  ]

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUniversities(data || [])
    } catch (error) {
      console.error('Error fetching universities:', error)
      alert('Error loading universities')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return

    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchUniversities()
      alert('University deleted successfully!')
    } catch (error) {
      console.error('Error deleting university:', error)
      alert('Error deleting university')
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('universities')
        .update({ featured: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchUniversities()
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Error updating featured status')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('universities')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchUniversities()
    } catch (error) {
      console.error('Error updating active status:', error)
      alert('Error updating active status')
    }
  }

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([])
      setSelectAll(false)
    } else {
      setSelected(universities.map((u) => u.id))
      setSelectAll(true)
    }
  }

  const handleBulkDelete = async () => {
    if (selected.length === 0) return
    if (!window.confirm('Are you sure you want to delete the selected universities?')) return
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .in('id', selected)
      if (error) throw error
      fetchUniversities()
      setSelected([])
      setSelectAll(false)
      alert('Selected universities deleted successfully!')
    } catch (error) {
      console.error('Error deleting universities:', error)
      alert('Error deleting universities')
    }
  }

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  // Content Generation Functions
  const generateContent = async () => {
    if (contentGenerator.selectedKeywords.length === 0) {
      alert('Please select at least one keyword to generate content.')
      return
    }
    
    setContentGenerator(prev => ({ ...prev, isGenerating: true }))
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedContent = await generateOptimizedContent(
        contentGenerator.selectedKeywords,
        contentGenerator.targetAudience,
        contentGenerator.contentType,
        contentGenerator.tone
      )
      
      setContentGenerator(prev => ({
        ...prev,
        generatedContent: generatedContent.content,
        seoScore: generatedContent.seoScore,
        isGenerating: false
      }))
    } catch (error) {
      console.error('Error generating content:', error)
      setContentGenerator(prev => ({ ...prev, isGenerating: false }))
      alert('Failed to generate content. Please try again.')
    }
  }
  
  const generateOptimizedContent = async (keywords, audience, contentType, tone) => {
    const primaryKeyword = keywords[0]
    const secondaryKeywords = keywords.slice(1, 4)
    
    const contentTemplates = {
      'university-guide': {
        title: `Complete Guide to ${primaryKeyword.term} - Everything You Need to Know`,
        content: generateUniversityGuideContent(primaryKeyword, secondaryKeywords, audience, tone)
      },
      'blog-post': {
        title: `${primaryKeyword.term}: A Comprehensive Guide for ${audience === 'bangladeshi-students' ? 'Bangladeshi Students' : 'International Students'}`,
        content: generateBlogPostContent(primaryKeyword, secondaryKeywords, audience, tone)
      },
      'landing-page': {
        title: `${primaryKeyword.term} - Expert Guidance | MA Education`,
        content: generateLandingPageContent(primaryKeyword, secondaryKeywords, audience, tone)
      },
      'comparison': {
        title: `${primaryKeyword.term} vs Other Options - Which is Best?`,
        content: generateComparisonContent(primaryKeyword, secondaryKeywords, audience, tone)
      }
    }
    
    const template = contentTemplates[contentType] || contentTemplates['university-guide']
    
    return {
      content: template.content,
      seoScore: calculateSEOScore(template.content, keywords)
    }
  }
  
  const generateUniversityGuideContent = (primary, secondary, audience, tone) => {
    const isEnglish = /^[a-zA-Z\s]+$/.test(primary.term)
    const country = primary.term.includes('malta') ? 'Malta' :
                   primary.term.includes('poland') ? 'Poland' :
                   primary.term.includes('turkey') ? 'Turkey' :
                   primary.term.includes('finland') ? 'Finland' :
                   primary.term.includes('italy') ? 'Italy' :
                   primary.term.includes('germany') ? 'Germany' :
                   'abroad'
    
    if (!isEnglish) {
      // Generate Bengali content
      return `<h1>${primary.term} - সম্পূর্ণ গাইড ২০২৫</h1>

<p><strong>${primary.term}</strong> নিয়ে আপনার মনে অনেক প্রশ্ন থাকতে পারে। এই বিস্তারিত গাইডে আমরা আপনাকে সবকিছু জানাবো যা আপনার জানা প্রয়োজন।</p>

<h2>কেন ${primary.term} বেছে নেবেন?</h2>
<p>বাংলাদেশী শিক্ষার্থীদের জন্য ${primary.term} একটি চমৎকার সুযোগ। এখানে কেন:</p>
<ul>
  <li>কম খরচে উচ্চমানের শিক্ষা</li>
  <li>আন্তর্জাতিকভাবে স্বীকৃত ডিগ্রি</li>
  <li>স্কলারশিপের সুবিধা</li>
  <li>পার্ট-টাইম কাজের সুযোগ</li>
</ul>

<h2>${primary.term} এর জন্য প্রয়োজনীয় কাগজপত্র</h2>
<p>${primary.term} এর জন্য আবেদন করতে নিম্নলিখিত কাগজপত্র প্রয়োজন:</p>
<ul>
  <li>শিক্ষাগত সনদ ও ট্রান্সক্রিপ্ট</li>
  <li>IELTS/TOEFL স্কোর</li>
  <li>পাসপোর্ট</li>
  <li>আর্থিক সক্ষমতার প্রমাণ</li>
  <li>SOP (Statement of Purpose)</li>
</ul>

<h2>MA Education এর সাথে ${primary.term} এর জন্য আবেদন করুন</h2>
<p>MA Education বাংলাদেশের অগ্রণী শিক্ষা পরামর্শদাতা প্রতিষ্ঠান। আমাদের অভিজ্ঞ টিম আপনাকে ${primary.term} এর জন্য সম্পূর্ণ সহায়তা প্রদান করবে।</p>

<h3>আমাদের সেবাসমূহ:</h3>
<ul>
  <li>বিনামূল্যে পরামর্শ</li>
  <li>আবেদন প্রক্রিয়ায় সহায়তা</li>
  <li>ভিসা প্রসেসিং সাপোর্ট</li>
  <li>প্রি-ডিপার্চার ব্রিফিং</li>
</ul>

<p><strong>আজই যোগাযোগ করুন MA Education এর সাথে এবং ${primary.term} এর স্বপ্ন পূরণ করুন!</strong></p>`
    }
    
    return `<h1>${primary.term.charAt(0).toUpperCase() + primary.term.slice(1)} - Complete Guide 2025</h1>

<p>Are you a Bangladeshi student looking for information about <strong>${primary.term}</strong>? This comprehensive guide covers everything you need to know about studying in ${country} and obtaining your student visa.</p>

<h2>Why Choose ${country} for Your Higher Education?</h2>
<p>${country} has become an increasingly popular destination for Bangladeshi students seeking quality education abroad. Here's why ${primary.term} is an excellent choice:</p>
<ul>
  <li>Affordable tuition fees and living costs</li>
  <li>Internationally recognized degrees</li>
  <li>Excellent scholarship opportunities</li>
  <li>Part-time work opportunities for students</li>
  <li>Post-study work visa options</li>
  <li>Safe and welcoming environment for international students</li>
</ul>

<h2>Eligibility Requirements for ${primary.term}</h2>
<p>To be eligible for <strong>${primary.term}</strong>, you must meet the following requirements:</p>
<h3>Academic Requirements</h3>
<ul>
  <li>Completed secondary education (for undergraduate programs)</li>
  <li>Bachelor's degree (for postgraduate programs)</li>
  <li>Minimum GPA requirements as specified by the university</li>
</ul>

<h3>English Language Proficiency</h3>
<ul>
  <li>IELTS: Minimum 6.0-6.5 overall</li>
  <li>TOEFL: Minimum 80-90 (internet-based)</li>
  <li>PTE Academic: Minimum 58-65</li>
</ul>

<h2>Application Process for ${primary.term}</h2>
<p>Following the correct application process is crucial for a successful <strong>${primary.term}</strong> application. Here's a step-by-step guide:</p>

<ol>
  <li><strong>Choose Your Program:</strong> Research and select suitable universities and programs in ${country}</li>
  <li><strong>Prepare Documents:</strong> Gather all required academic transcripts, certificates, and supporting documents</li>
  <li><strong>English Test:</strong> Take IELTS, TOEFL, or PTE Academic test</li>
  <li><strong>Submit Application:</strong> Apply to your chosen universities</li>
  <li><strong>Receive Offer Letter:</strong> Wait for admission decision</li>
  <li><strong>Visa Application:</strong> Apply for ${primary.term} once you receive your offer letter</li>
</ol>

<h2>Documents Required for ${primary.term}</h2>
<p>To apply for <strong>${primary.term}</strong>, you'll need the following documents:</p>
<ul>
  <li>Valid passport</li>
  <li>Offer letter from a recognized university in ${country}</li>
  <li>Academic transcripts and certificates</li>
  <li>English language proficiency test results</li>
  <li>Statement of Purpose (SOP)</li>
  <li>Proof of financial support</li>
  <li>Medical certificate</li>
  <li>Police clearance certificate</li>
</ul>

<h2>Cost of Studying in ${country}</h2>
<p>Understanding the costs involved is essential when planning for <strong>${primary.term}</strong>. Here's a breakdown:</p>
<h3>Tuition Fees</h3>
<ul>
  <li>Undergraduate programs: €3,000 - €15,000 per year</li>
  <li>Postgraduate programs: €4,000 - €20,000 per year</li>
</ul>

<h3>Living Expenses</h3>
<ul>
  <li>Accommodation: €300 - €800 per month</li>
  <li>Food and dining: €200 - €400 per month</li>
  <li>Transportation: €50 - €100 per month</li>
  <li>Miscellaneous expenses: €100 - €200 per month</li>
</ul>

<h2>Scholarships for Bangladeshi Students</h2>
<p>There are numerous scholarship opportunities available for Bangladeshi students pursuing <strong>${primary.term}</strong>:</p>
<ul>
  <li>Government scholarships</li>
  <li>University-specific scholarships</li>
  <li>Merit-based scholarships</li>
  <li>Need-based financial aid</li>
</ul>

<h2>Why Choose MA Education for ${primary.term}?</h2>
<p>Navigating the <strong>${primary.term}</strong> process can be complex, but with MA Education's expert guidance, you can achieve your dreams of studying in ${country}.</p>

<h3>Our Services Include:</h3>
<ul>
  <li><strong>Free Consultation:</strong> Personalized guidance on university selection and career planning</li>
  <li><strong>Application Assistance:</strong> Complete support throughout the university application process</li>
  <li><strong>Visa Support:</strong> Expert assistance with ${primary.term} application and documentation</li>
  <li><strong>Test Preparation:</strong> IELTS and other English proficiency test preparation</li>
  <li><strong>Pre-departure Support:</strong> Comprehensive briefing before you travel</li>
  <li><strong>Post-arrival Assistance:</strong> Ongoing support throughout your studies</li>
</ul>

<h2>Conclusion</h2>
<p><strong>${primary.term}</strong> offers excellent opportunities for Bangladeshi students to pursue quality education in ${country}. With proper planning, documentation, and expert guidance from MA Education, you can successfully navigate the application process and achieve your academic goals.</p>

<p><strong>Ready to start your journey? Contact MA Education today for a free consultation and take the first step towards your ${primary.term} success!</strong></p>`
  }
  
  const generateBlogPostContent = (primary, secondary, audience, tone) => {
    return `<h1>${primary.term}: Your Ultimate Guide to Success</h1>

<p>Discover everything you need to know about <strong>${primary.term}</strong> and how it can transform your educational journey.</p>

<h2>What You Need to Know About ${primary.term}</h2>
<p>This comprehensive guide will help you understand the ins and outs of ${primary.term} and provide you with actionable steps to achieve your goals.</p>

<h2>Key Benefits and Opportunities</h2>
<p>Explore the numerous advantages and opportunities that ${primary.term} can offer to ambitious students like you.</p>

<h2>Get Expert Guidance from MA Education</h2>
<p>MA Education provides comprehensive support and guidance to help you succeed with ${primary.term}. Contact us today for personalized assistance.</p>`
  }
  
  const generateLandingPageContent = (primary, secondary, audience, tone) => {
    return `<h1>${primary.term} - Expert Guidance & Support | MA Education</h1>

<p>Transform your educational dreams into reality with our expert guidance on <strong>${primary.term}</strong>. MA Education has helped thousands of students achieve their goals.</p>

<h2>Why Choose MA Education for ${primary.term}?</h2>
<ul>
  <li>Expert consultants with years of experience</li>
  <li>Personalized guidance tailored to your needs</li>
  <li>Comprehensive support throughout the process</li>
  <li>Proven track record of success</li>
</ul>

<h2>Get Started Today</h2>
<p>Ready to begin your journey with ${primary.term}? Contact MA Education now for a free consultation and take the first step towards your success.</p>`
  }
  
  const generateComparisonContent = (primary, secondary, audience, tone) => {
    return `<h1>${primary.term} vs Other Study Abroad Options - Complete Comparison</h1>

<p>Choosing the right study destination is crucial for your future. This detailed comparison will help you understand why <strong>${primary.term}</strong> might be the perfect choice for you.</p>

<h2>Advantages of ${primary.term}</h2>
<p>Discover the unique benefits and opportunities that set ${primary.term} apart from other study abroad options.</p>

<h2>Cost Comparison</h2>
<p>Understand the financial implications and find out how ${primary.term} compares to other destinations in terms of affordability.</p>

<h2>Make an Informed Decision with MA Education</h2>
<p>Our expert consultants can help you compare all your options and choose the best path for your educational journey. Contact MA Education for personalized guidance.</p>`
  }
  
  const calculateSEOScore = (content, keywords) => {
    let score = 0
    const textContent = content.replace(/<[^>]*>/g, ' ').toLowerCase()
    const wordCount = textContent.split(' ').length
    
    // Content length (25 points)
    if (wordCount >= 800) score += 25
    else if (wordCount >= 500) score += 20
    else if (wordCount >= 300) score += 15
    else if (wordCount >= 200) score += 10
    
    // Keyword presence (25 points)
    keywords.forEach(keyword => {
      if (textContent.includes(keyword.term.toLowerCase())) {
        score += 5
      }
    })
    
    // Heading structure (20 points)
    const h1Count = (content.match(/<h1>/g) || []).length
    const h2Count = (content.match(/<h2>/g) || []).length
    const h3Count = (content.match(/<h3>/g) || []).length
    
    if (h1Count === 1) score += 10
    if (h2Count >= 3) score += 10
    
    // Lists and formatting (15 points)
    const listCount = (content.match(/<(ul|ol)>/g) || []).length
    if (listCount >= 2) score += 15
    else if (listCount >= 1) score += 10
    
    // Call-to-action (15 points)
    if (content.toLowerCase().includes('contact') || content.toLowerCase().includes('যোগাযোগ')) score += 15
    
    return Math.min(100, score)
  }
  
  const toggleKeywordSelection = (keyword) => {
    setContentGenerator(prev => {
      const isSelected = prev.selectedKeywords.some(k => k.term === keyword.term)
      return {
        ...prev,
        selectedKeywords: isSelected
          ? prev.selectedKeywords.filter(k => k.term !== keyword.term)
          : [...prev.selectedKeywords, keyword]
      }
    })
  }
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Content copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }
  
  const tabs = [
    { id: 'list', label: 'Universities List', icon: FiGlobe },
    { id: 'generator', label: 'Content Generator', icon: FiFileText }
  ]

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universities & Content</h1>
            <p className="text-gray-600">Manage universities and generate SEO-optimized content</p>
          </div>
          {activeTab === 'list' && (
            <div className="flex gap-2 items-center">
              <button
                onClick={handleBulkDelete}
                disabled={selected.length === 0}
                className={`inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
              <Link
                to="/admin/universities/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add University
              </Link>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' ? (
          <div className="space-y-6">
            {/* Universities Grid */}
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-2"
                id="selectAllCheckbox"
              />
              <label htmlFor="selectAllCheckbox" className="text-sm text-gray-700">Select All</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <div key={university.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow relative">
                  <input
                    type="checkbox"
                    checked={selected.includes(university.id)}
                    onChange={() => handleSelect(university.id)}
                    className="absolute top-2 left-2 z-10 w-5 h-5"
                    style={{ accentColor: '#2563eb' }}
                  />
                  {university.logo_url && (
                    <div className="h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <img
                        src={university.logo_url}
                        alt={university.name}
                        className="max-h-20 max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<span class="text-gray-500 text-sm">Image not available</span>'
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-800 flex-1 break-words">{university.name}</h3>
                      <div className="flex items-center ml-2">
                        <button
                          onClick={() => toggleFeatured(university.id, university.featured)}
                          className={`p-1 rounded-full ${university.featured ? 'text-yellow-500' : 'text-gray-400'}`}
                          title={university.featured ? 'Featured' : 'Not Featured'}
                        >
                          <FiStar className={`w-4 h-4 ${university.featured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleActive(university.id, university.is_active)}
                          className={`p-1 rounded-full ${university.is_active ? 'text-green-500' : 'text-red-500'}`}
                          title={university.is_active ? 'Active' : 'Inactive'}
                        >
                          {university.is_active ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{university.location}</p>
                    <div className="flex justify-end items-center mt-4 space-x-2">
                      <a
                        href={university.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors"
                        title="Visit Website"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        to={`/admin/universities/edit/${university.id}`}
                        className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors"
                        title="Edit University"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(university.id)}
                        className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors"
                        title="Delete University"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {universities.length === 0 && (
              <div className="text-center py-12">
                <FiGlobe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No universities yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first partner university.</p>
                <Link
                  to="/admin/universities/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add University
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Content Generator Tab
          <div className="space-y-8">
            {/* Content Generator Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">AI Content Generator</h2>
                  <p className="text-purple-100">Generate SEO-optimized content using low-competition keywords from SEO Manager</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FiFileText className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Keyword Selection & Settings */}
              <div className="xl:col-span-2 space-y-6">
                {/* Low Competition Keywords */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FiTarget className="w-5 h-5 mr-2 text-green-600" />
                      Low Competition Keywords
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Updated from SEO Manager</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                    {lowCompetitionKeywords.map((keyword, index) => {
                      const isSelected = contentGenerator.selectedKeywords.some(k => k.term === keyword.term)
                      return (
                        <div
                          key={index}
                          onClick={() => toggleKeywordSelection(keyword)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="text-sm font-medium text-gray-900">{keyword.term}</div>
                                {keyword.growth?.startsWith('+') && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                    <FiTrendingUp className="w-3 h-3 mr-1" />
                                    {keyword.growth}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">{keyword.volume}</span>
                                <span className="text-xs text-green-600 font-medium">{keyword.difficulty}</span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">Comp:</span>
                                  <div className="w-8 bg-gray-200 rounded h-1">
                                    <div 
                                      className="bg-green-500 h-1 rounded" 
                                      style={{ width: `${keyword.competition * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{Math.round(keyword.competition * 100)}%</span>
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="ml-3">
                                <FiCheck className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Selected: {contentGenerator.selectedKeywords.length} keywords</strong>
                      {contentGenerator.selectedKeywords.length > 0 && (
                        <span className="ml-2">- Click keywords to select/deselect for content generation</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Content Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiSettings className="w-5 h-5 mr-2 text-purple-600" />
                    Content Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                      <select
                        value={contentGenerator.targetAudience}
                        onChange={(e) => setContentGenerator(prev => ({ ...prev, targetAudience: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="bangladeshi-students">Bangladeshi Students</option>
                        <option value="international-students">International Students</option>
                        <option value="parents">Parents & Guardians</option>
                        <option value="education-agents">Education Agents</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                      <select
                        value={contentGenerator.contentType}
                        onChange={(e) => setContentGenerator(prev => ({ ...prev, contentType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="university-guide">University Guide</option>
                        <option value="blog-post">Blog Post</option>
                        <option value="landing-page">Landing Page</option>
                        <option value="comparison">Comparison Article</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                      <select
                        value={contentGenerator.tone}
                        onChange={(e) => setContentGenerator(prev => ({ ...prev, tone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="academic">Academic</option>
                        <option value="conversational">Conversational</option>
                      </select>
                    </div>
                    
                    <div>
                      <button
                        onClick={generateContent}
                        disabled={contentGenerator.isGenerating || contentGenerator.selectedKeywords.length === 0}
                        className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                          contentGenerator.isGenerating || contentGenerator.selectedKeywords.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        {contentGenerator.isGenerating ? (
                          <>
                            <FiLoader className="animate-spin w-5 h-5 mr-2" />
                            <span>Generating Content...</span>
                          </>
                        ) : (
                          <>
                            <FiFileText className="w-5 h-5 mr-2" />
                            <span>Generate Content</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generated Content */}
                {contentGenerator.generatedContent && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FiFileText className="w-5 h-5 mr-2 text-blue-600" />
                        Generated Content
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(contentGenerator.generatedContent)}
                          className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <FiCopy className="w-4 h-4 mr-1" />
                          Copy
                        </button>
                        <button className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          <FiDownload className="w-4 h-4 mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                      <div 
                        className="prose max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: contentGenerator.generatedContent }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - SEO Analysis & Stats */}
              <div className="space-y-6">
                {/* SEO Score */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Score</h3>
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{contentGenerator.seoScore}%</span>
                      </div>
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={contentGenerator.seoScore >= 80 ? '#10b981' : contentGenerator.seoScore >= 60 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - contentGenerator.seoScore / 100)}`}
                          className="transition-all duration-500"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      {contentGenerator.seoScore >= 80 ? 'Excellent SEO optimization!' :
                       contentGenerator.seoScore >= 60 ? 'Good SEO optimization' :
                       contentGenerator.seoScore > 0 ? 'Needs improvement' :
                       'Generate content to see score'}
                    </p>
                  </div>
                </div>

                {/* Selected Keywords Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiSearch className="w-5 h-5 mr-2 text-orange-600" />
                    Selected Keywords
                  </h3>
                  {contentGenerator.selectedKeywords.length > 0 ? (
                    <div className="space-y-3">
                      {contentGenerator.selectedKeywords.slice(0, 5).map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{keyword.term}</div>
                            <div className="text-xs text-gray-500">{keyword.volume}</div>
                          </div>
                          <div className="text-xs text-green-600 font-medium">{keyword.difficulty}</div>
                        </div>
                      ))}
                      {contentGenerator.selectedKeywords.length > 5 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          +{contentGenerator.selectedKeywords.length - 5} more keywords selected
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No keywords selected. Choose keywords from the list to generate content.
                    </p>
                  )}
                </div>

                {/* Content Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Content Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Word Count:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {contentGenerator.generatedContent ? 
                          contentGenerator.generatedContent.replace(/<[^>]*>/g, ' ').split(' ').length : 
                          0
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Headings:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {contentGenerator.generatedContent ? 
                          (contentGenerator.generatedContent.match(/<h[1-6]>/g) || []).length : 
                          0
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lists:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {contentGenerator.generatedContent ? 
                          (contentGenerator.generatedContent.match(/<(ul|ol)>/g) || []).length : 
                          0
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Keyword Density:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {contentGenerator.generatedContent && contentGenerator.selectedKeywords.length > 0 ? 
                          `${Math.round((contentGenerator.generatedContent.toLowerCase().split(contentGenerator.selectedKeywords[0]?.term.toLowerCase()).length - 1) / contentGenerator.generatedContent.replace(/<[^>]*>/g, ' ').split(' ').length * 100 * 100) / 100}%` : 
                          '0%'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Create New Post
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <FiTarget className="w-4 h-4 mr-2" />
                      Open SEO Manager
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <FiRefreshCw className="w-4 h-4 mr-2" />
                      Refresh Keywords
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Universities
