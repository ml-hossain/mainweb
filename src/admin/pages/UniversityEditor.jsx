import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import QuillEditor from '../../components/QuillEditor';
import ErrorBoundary from '../../components/ErrorBoundary';
import CompactFileUpload from '../../components/CompactFileUpload';
import URLWithUpload from '../../components/URLWithUpload';
import AdminLayout from '../components/AdminLayout';
import AdvancedSEOTool from '../../components/AdvancedSEOTool';
import { FiLoader, FiSave, FiArrowLeft, FiGlobe, FiMapPin, FiStar, FiDollarSign, FiClock, FiBookOpen, FiX, FiPlus, FiUpload } from 'react-icons/fi';
import slugify from 'slugify';

const UniversityEditor = ({ onLogout, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // State for tag inputs
  const [popularCoursesInput, setPopularCoursesInput] = useState('');
  const [programsInput, setProgramsInput] = useState('');
  
  
  
  
  
  
  
  
  
  

  const generateSlug = (name) => {
    return slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  };

  const fetchUniversity = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Failed to fetch university data.');
      }
      setUniversity(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUniversity();
    } else {
      setUniversity({
        name: '',
        location: '',
        description: '',
        banner_url: '',
        logo_url: '',
        website_url: '',
        content: {
          country: '',
          university_type: '',
          ranking: '',
          ranking_type: 'QS Ranking',
          initial_payment: '',
          duration: '',
          language_requirements: [],
          popular_courses: [],
          programs: []
        }
      });
      setLoading(false);
    }
  }, [id, fetchUniversity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedUniversity = { ...university, [name]: value };
    setUniversity(updatedUniversity);
    
  };

  const handleContentFieldChange = (field, value) => {
    setUniversity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (field, value) => {
    // Convert comma-separated string to array
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    handleContentFieldChange(field, arrayValue);
  };

  // Enhanced tag input handler
  const handleTagInput = (field, inputValue, setInputValue) => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      const currentArray = university?.content?.[field] || [];
      if (!currentArray.includes(trimmedValue)) {
        handleContentFieldChange(field, [...currentArray, trimmedValue]);
      }
      setInputValue('');
    }
  };

  const removeTag = (field, index) => {
    const currentArray = university?.content?.[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleContentFieldChange(field, newArray);
  };

  const handleKeyPress = (e, field, inputValue, setInputValue) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      handleTagInput(field, inputValue, setInputValue);
    }
  };

  const handlePageContentChange = (value) => {
    setUniversity(prev => ({ ...prev, page_content: value }))
  }

  const handleFileContentParsed = (htmlContent) => {
    setUniversity(prev => ({ ...prev, page_content: htmlContent }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!university.name) {
      setError('University name is required.')
      return
    }

    setSaving(true)
    setError('')

    const slug = generateSlug(university.name)

    // Prepare the data with both individual fields and content object
    const universityData = {
      name: university.name,
      location: university.location,
      description: university.description,
      logo_url: university.logo_url,
      banner_url: university.banner_url,
      website_url: university.website_url,
      slug: slug,
      
      // Map structured content to individual database fields
      country: university.content?.country,
      initial_payment: university.content?.initial_payment,
      course_duration: university.content?.duration,
      popular_courses: university.content?.popular_courses,
      language_requirement: university.content?.language_requirements?.join(', '),
      subjects: university.content?.programs,
      ranking_type: university.content?.ranking_type,
      ranking_value: university.content?.ranking,
      
      // Store structured content as JSONB for card generation
      content: university.content,
      
      // Store page content separately if needed
      page_content: university.page_content
    }

    try {
      let response
      if (!id) {
        // Create new university
        const { data: insertedData, error: insertError } = await supabase
          .from('universities')
          .insert([universityData])
          .select()
          .single()
        if(insertError) throw insertError
        response = { data: insertedData, error: insertError }
      } else {
        // Update existing university
        const { data: updatedData, error: updateError } = await supabase
          .from('universities')
          .update(universityData)
          .eq('id', id)
          .select()
          .single()
        if(updateError) throw updateError
        response = { data: updatedData, error: updateError }
      }
      
      const { error } = response

      if (error) {
        throw error
      }
      
      setSaving(false)
      navigate('/admin/universities')

    } catch (err) {
      setError('Failed to save university. Please try again.')
      console.error('Save error:', err)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  if (error && !university) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="flex flex-col xl:flex-row gap-6 min-h-full">
        {/* Main content - Reduced width to accommodate wider sidebar */}
        <div className="flex-1 min-w-0 xl:max-w-5xl">
          <div className="max-w-none mx-auto">
        {/* Redesigned Header Section - More Compact */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side - Back Button and Title */}
            <div className="flex flex-col">
              <button
                onClick={() => navigate('/admin/universities')}
                className="flex items-center text-blue-100 hover:text-white text-sm font-medium mb-3 transition-colors duration-200 self-start group"
              >
                <FiArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Universities
              </button>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {!id ? 'Add New University' : 'Edit University'}
              </h1>
              <p className="text-blue-100 text-base font-medium">
                {!id ? 'Create a new university profile with detailed information' : 'Update university information and settings'}
              </p>
            </div>
            
            {/* Right Side - Status Badge */}
            <div className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 self-start lg:self-center">
              <FiGlobe className="w-5 h-5 mr-2" />
              <span className="font-semibold">Global Education</span>
            </div>
          </div>
        </div>
        
        {/* Main Content - Closer to sidebar with equal weight sections */}
        <div className="max-w-none mx-auto">
          {/* Form Container */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                {/* Two-Column Layout for Equal Weight Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  
                  {/* Basic Information Section - Left Column */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                        <FiGlobe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                        <p className="text-gray-600">Essential university details and branding</p>
                      </div>
                    </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">University Name *</label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={university?.name || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="Enter university name"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700">Location</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="location" 
                        id="location" 
                        value={university?.location || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Short Description</label>
                  <textarea 
                    name="description" 
                    id="description" 
                    value={university?.description || ''} 
                    onChange={handleInputChange} 
                    rows="3" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                    placeholder="Brief description of the university"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <URLWithUpload
                    label="Logo URL"
                    name="logo_url"
                    value={university?.logo_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    uploadPlaceholder="Upload Logo"
                  />
                  
                  <URLWithUpload
                    label="Banner URL"
                    name="banner_url"
                    value={university?.banner_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/banner.jpg"
                    uploadPlaceholder="Upload Banner"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="website_url" className="block text-sm font-semibold text-gray-700">Official Website URL</label>
                  <input 
                    type="url" 
                    name="website_url" 
                    id="website_url" 
                    value={university?.website_url || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    placeholder="https://university-website.edu"
                  />
                </div>
              </div>
                  
                  {/* University Details Section - Right Column */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                        <FiStar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">University Details</h2>
                        <p className="text-gray-600">Academic information and specifications</p>
                      </div>
                    </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-1">
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select 
                        name="country" 
                        id="country" 
                        value={university?.content?.country || ''} 
                        onChange={(e) => handleContentFieldChange('country', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                      >
                        <option value="">Select Country</option>
                        <option value="canada">Canada</option>
                        <option value="malaysia">Malaysia</option>
                        <option value="usa">USA</option>
                        <option value="uk">United Kingdom</option>
                        <option value="australia">Australia</option>
                        <option value="germany">Germany</option>
                        <option value="sweden">Sweden</option>
                        <option value="netherlands">Netherlands</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="university_type" className="block text-sm font-semibold text-gray-700">University Type</label>
                    <div className="relative">
                      <FiStar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select 
                        name="university_type" 
                        id="university_type" 
                        value={university?.content?.university_type || ''} 
                        onChange={(e) => handleContentFieldChange('university_type', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                      >
                        <option value="">Select Type</option>
                        <option value="public">Public University</option>
                        <option value="semi-government">Semi-Government</option>
                        <option value="private">Private University</option>
                        <option value="international">International/Foreign Private</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="ranking" className="block text-sm font-semibold text-gray-700">University Ranking</label>
                    <div className="relative">
                      <FiStar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="ranking" 
                        id="ranking" 
                        value={university?.content?.ranking || ''} 
                        onChange={(e) => handleContentFieldChange('ranking', e.target.value)}
                        placeholder="e.g., 150"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <label htmlFor="ranking_type" className="block text-sm font-semibold text-gray-700">Ranking Type</label>
                    <select 
                      name="ranking_type" 
                      id="ranking_type" 
                      value={university?.content?.ranking_type || 'QS Ranking'} 
                      onChange={(e) => handleContentFieldChange('ranking_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="QS Ranking">QS Ranking</option>
                      <option value="Country Ranking">Country Ranking</option>
                      <option value="Times Higher Education">Times Higher Education</option>
                      <option value="Academic Ranking">Academic Ranking</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="initial_payment" className="block text-sm font-semibold text-gray-700">Initial Payment</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="initial_payment" 
                        id="initial_payment" 
                        value={university?.content?.initial_payment || ''} 
                        onChange={(e) => handleContentFieldChange('initial_payment', e.target.value)}
                        placeholder="e.g., $5,000"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">Course Duration</label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="duration" 
                        id="duration" 
                        value={university?.content?.duration || ''} 
                        onChange={(e) => handleContentFieldChange('duration', e.target.value)}
                        placeholder="e.g., 3-4 years"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="language_requirements" className="block text-sm font-semibold text-gray-700">Language Requirements</label>
                    <input 
                      type="text" 
                      name="language_requirements" 
                      id="language_requirements" 
                      value={university?.content?.language_requirements?.join(', ') || ''} 
                      onChange={(e) => handleArrayFieldChange('language_requirements', e.target.value)}
                      placeholder="e.g., IELTS 6.5, TOEFL 90"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas</p>
                  </div>
                </div>
                
                <div className="space-y-1 mb-6">
                  <label htmlFor="popular_courses" className="block text-sm font-semibold text-gray-700">Popular Courses/Subjects</label>
                  
                  {/* Display current tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(university?.content?.popular_courses || []).map((course, index) => (
                      <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
                        <span>{course}</span>
                        <button
                          type="button"
                          onClick={() => removeTag('popular_courses', index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Input for new tags */}
                  <div className="flex">
                    <input
                      type="text"
                      value={popularCoursesInput}
                      onChange={(e) => setPopularCoursesInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'popular_courses', popularCoursesInput, setPopularCoursesInput)}
                      placeholder="Type a course name and press Enter, Space, or Comma to add"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleTagInput('popular_courses', popularCoursesInput, setPopularCoursesInput)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Type and press Enter, Space, or Comma to add courses. Only first 2 will show on cards.</p>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="programs" className="block text-sm font-semibold text-gray-700">All Available Programs</label>
                  
                  {/* Display current tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(university?.content?.programs || []).map((program, index) => (
                      <div key={index} className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
                        <span>{program}</span>
                        <button
                          type="button"
                          onClick={() => removeTag('programs', index)}
                          className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Input for new tags */}
                  <div className="flex">
                    <input
                      type="text"
                      value={programsInput}
                      onChange={(e) => setProgramsInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'programs', programsInput, setProgramsInput)}
                      placeholder="Type a program name and press Enter, Space, or Comma to add"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleTagInput('programs', programsInput, setProgramsInput)}
                      className="px-4 py-3 bg-green-600 text-white rounded-r-2xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Type and press Enter, Space, or Comma to add programs.</p>
                </div>
              </div>
                
                </div> {/* Close the two-column grid */}

              {/* Content Editor Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                    <FiBookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">University Content</h2>
                    <p className="text-gray-600">Write detailed content for this university page or upload from file</p>
                  </div>
                </div>
                
                {/* Content Editor */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiBookOpen className="w-5 h-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Content Editor</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <CompactFileUpload 
                          onContentParsed={handleFileContentParsed} 
                          currentContent={university?.page_content || ''}
                        />
                        {/* Video import icon can go here if needed */}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Write content using the rich text editor or import from JSON/CSV file</p>
                  </div>
                  <div className="max-h-[60vh] overflow-hidden">
                    <ErrorBoundary>
                      <QuillEditor 
                        value={university?.page_content || ''} 
                        onChange={handlePageContentChange} 
                        className="rounded-b-2xl h-full"
                        style={{ maxHeight: '60vh' }}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {saving ? <FiLoader className="animate-spin mr-2 h-5 w-5" /> : <FiSave className="mr-2 h-5 w-5" />}
                  <span className="text-lg">{saving ? 'Saving...' : 'Save University'}</span>
                </button>
              </div>
                </form>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
        
        {/* SEO Tool - Wider sidebar with more weight */}
        <div className="w-full xl:w-[30rem] 2xl:w-[32rem] xl:min-w-0">
          <div className="sticky top-6">
            <AdvancedSEOTool
              context="university"
              fields={{ 
                title: true, 
                shortDescription: true, 
                mainContent: true 
              }}
              generateFor={['shortDescription', 'mainContent']}
              onContentGenerated={(content) => {
                console.log('Generated university content:', content);
                // Apply generated content to the form
                if (content.title) {
                  handleInputChange({target: {name: 'name', value: content.title}});
                }
                if (content.shortDescription) {
                  handleInputChange({target: {name: 'description', value: content.shortDescription}});
                }
                if (content.content || content.longDescription) {
                  handlePageContentChange(content.content || content.longDescription);
                }
              }}
              onTitleUpdate={(title) => handleInputChange({target: {name: 'name', value: title}})}
              onDescriptionUpdate={(desc) => handleInputChange({target: {name: 'description', value: desc}})}
              onContentUpdate={handlePageContentChange}
              initialData={{
                title: university?.name || '',
                shortDescription: university?.description || '',
                content: university?.page_content || ''
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UniversityEditor; 