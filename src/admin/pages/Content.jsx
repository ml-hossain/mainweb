import React, { useState } from 'react'
import { 
  FiHome,
  FiBarChart2,
  FiInfo,
  FiUser,
  FiEdit2,
  FiSave,
  FiX,
  FiImage,
  FiType,
  FiHash
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Content = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('hero')
  const [editingField, setEditingField] = useState(null)
  
  const [contentData, setContentData] = useState({
    hero: {
      badge: '#1 Education Consultancy',
      title: 'Your Gateway to Global Education',
      subtitle: 'Transform your educational dreams into reality with expert guidance, personalized support, and proven success strategies.',
      backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      ctaPrimary: 'Start Your Journey',
      ctaSecondary: 'Explore Services'
    },
    statistics: {
      studentsPlaced: { value: 2500, label: 'Students Placed', description: 'Successful Placements' },
      universities: { value: 150, label: 'Partner Universities', description: 'Top Ranked Globally' },
      experience: { value: 12, label: 'Years Experience', description: 'Trusted Expertise' },
      successRate: { value: 98.5, label: 'Success Rate', description: 'Application Approval' }
    },
    about: {
      title: 'About MA Education',
      subtitle: 'Your trusted partner in achieving global education dreams with personalized guidance and expert support.',
      mission: 'To empower students with the knowledge, guidance, and support needed to pursue quality education abroad and achieve their academic and career aspirations.',
      vision: 'To be the leading education consultancy that transforms dreams into reality by connecting students with world-class educational opportunities.',
      whyChooseUs: [
        'Expert Guidance: Experienced counselors with deep knowledge of international education',
        'Personalized Support: Tailored solutions for each student\'s unique needs and goals',
        'Comprehensive Services: From university selection to visa approval and beyond',
        'Proven Track Record: High success rate in university admissions and visa approvals',
        'End-to-End Service: From university selection to visa approval and beyond'
      ]
    },
    ceo: {
      name: 'Dr. Ahmad Rahman',
      title: 'Founder & Chief Executive Officer',
      education: 'PhD in Education',
      experience: '15+ Years',
      successRate: '98%',
      universities: '25+',
      countries: '15+',
      credentials: ['PhD in Education', 'Certified Immigration Consultant', 'ICEF Agent', '15+ Awards'],
      message: 'Education is the most powerful weapon you can use to change the world. I\'m dedicated to helping students unlock their potential through quality international education.',
      achievements: [
        'Successfully placed 2,500+ students globally',
        'Established partnerships with 150+ universities',
        'Achieved 98.5% visa approval success rate',
        'Recognized education consultant of the year 2023'
      ],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    }
  })

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: FiHome },
    { id: 'statistics', label: 'Statistics', icon: FiBarChart2 },
    { id: 'about', label: 'About Page', icon: FiInfo },
    { id: 'ceo', label: 'CEO Section', icon: FiUser }
  ]

  const handleFieldEdit = (section, field, value) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleStatEdit = (statKey, field, value) => {
    setContentData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [statKey]: {
          ...prev.statistics[statKey],
          [field]: value
        }
      }
    }))
  }

  const handleArrayEdit = (section, field, index, value) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => i === index ? value : item)
      }
    }))
  }

  const EditableField = ({ value, onSave, type = 'text', placeholder, className = '' }) => {
    const [editValue, setEditValue] = useState(value)
    const [isEditing, setIsEditing] = useState(false)

    const handleSave = () => {
      onSave(editValue)
      setIsEditing(false)
    }

    const handleCancel = () => {
      setEditValue(value)
      setIsEditing(false)
    }

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          {type === 'textarea' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
            />
          )}
          <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-md">
            <FiSave className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )
    }

    return (
      <div className={`group flex items-center justify-between ${className}`}>
        <span className="flex-1">{value}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-opacity"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
      </div>
    )
  }

  const renderHeroSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
          <EditableField
            value={contentData.hero.badge}
            onSave={(value) => handleFieldEdit('hero', 'badge', value)}
            placeholder="Enter badge text"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
          <EditableField
            value={contentData.hero.title}
            onSave={(value) => handleFieldEdit('hero', 'title', value)}
            placeholder="Enter main title"
            className="text-lg font-medium"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <EditableField
            value={contentData.hero.subtitle}
            onSave={(value) => handleFieldEdit('hero', 'subtitle', value)}
            type="textarea"
            placeholder="Enter subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
          <EditableField
            value={contentData.hero.backgroundImage}
            onSave={(value) => handleFieldEdit('hero', 'backgroundImage', value)}
            placeholder="Enter image URL"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Button</label>
            <EditableField
              value={contentData.hero.ctaPrimary}
              onSave={(value) => handleFieldEdit('hero', 'ctaPrimary', value)}
              placeholder="Primary button text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Button</label>
            <EditableField
              value={contentData.hero.ctaSecondary}
              onSave={(value) => handleFieldEdit('hero', 'ctaSecondary', value)}
              placeholder="Secondary button text"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStatisticsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(contentData.statistics).map(([key, stat]) => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <EditableField
                  value={stat.value.toString()}
                  onSave={(value) => handleStatEdit(key, 'value', parseFloat(value) || 0)}
                  type="number"
                  placeholder="Enter value"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <EditableField
                  value={stat.label}
                  onSave={(value) => handleStatEdit(key, 'label', value)}
                  placeholder="Enter label"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <EditableField
                  value={stat.description}
                  onSave={(value) => handleStatEdit(key, 'description', value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAboutSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">About Page</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
          <EditableField
            value={contentData.about.title}
            onSave={(value) => handleFieldEdit('about', 'title', value)}
            placeholder="Enter page title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <EditableField
            value={contentData.about.subtitle}
            onSave={(value) => handleFieldEdit('about', 'subtitle', value)}
            type="textarea"
            placeholder="Enter subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
          <EditableField
            value={contentData.about.mission}
            onSave={(value) => handleFieldEdit('about', 'mission', value)}
            type="textarea"
            placeholder="Enter mission statement"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
          <EditableField
            value={contentData.about.vision}
            onSave={(value) => handleFieldEdit('about', 'vision', value)}
            type="textarea"
            placeholder="Enter vision statement"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Why Choose Us Points</label>
          <div className="space-y-2">
            {contentData.about.whyChooseUs.map((point, index) => (
              <EditableField
                key={index}
                value={point}
                onSave={(value) => handleArrayEdit('about', 'whyChooseUs', index, value)}
                type="textarea"
                placeholder="Enter point"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderCeoSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">CEO Section</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <EditableField
              value={contentData.ceo.name}
              onSave={(value) => handleFieldEdit('ceo', 'name', value)}
              placeholder="Enter CEO name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <EditableField
              value={contentData.ceo.title}
              onSave={(value) => handleFieldEdit('ceo', 'title', value)}
              placeholder="Enter CEO title"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
            <EditableField
              value={contentData.ceo.education}
              onSave={(value) => handleFieldEdit('ceo', 'education', value)}
              placeholder="Enter education"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <EditableField
              value={contentData.ceo.experience}
              onSave={(value) => handleFieldEdit('ceo', 'experience', value)}
              placeholder="Enter experience"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
          <EditableField
            value={contentData.ceo.image}
            onSave={(value) => handleFieldEdit('ceo', 'image', value)}
            placeholder="Enter image URL"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message</label>
          <EditableField
            value={contentData.ceo.message}
            onSave={(value) => handleFieldEdit('ceo', 'message', value)}
            type="textarea"
            placeholder="Enter personal message"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Credentials</label>
          <div className="space-y-2">
            {contentData.ceo.credentials.map((credential, index) => (
              <EditableField
                key={index}
                value={credential}
                onSave={(value) => handleArrayEdit('ceo', 'credentials', index, value)}
                placeholder="Enter credential"
              />
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
          <div className="space-y-2">
            {contentData.ceo.achievements.map((achievement, index) => (
              <EditableField
                key={index}
                value={achievement}
                onSave={(value) => handleArrayEdit('ceo', 'achievements', index, value)}
                type="textarea"
                placeholder="Enter achievement"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hero': return renderHeroSection()
      case 'statistics': return renderStatisticsSection()
      case 'about': return renderAboutSection()
      case 'ceo': return renderCeoSection()
      default: return renderHeroSection()
    }
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage website content, text, and media</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiImage className="w-4 h-4 mr-2" />
              Media Library
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiSave className="w-4 h-4 mr-2" />
              Save All Changes
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Content Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-3" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Content
