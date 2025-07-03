import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import QuillEditor from '../../components/QuillEditor';
import { FiLoader, FiSave, FiArrowLeft } from 'react-icons/fi';
import slugify from 'slugify';

const UniversityEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    setUniversity(prev => ({ ...prev, [name]: value }));
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

  const handlePageContentChange = (value) => {
    setUniversity(prev => ({ ...prev, page_content: value }));
  };

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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/universities')}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Universities
          </button>
        <h1 className="text-2xl font-bold text-gray-800">{!id ? 'Add New University' : 'Edit University'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
              <input type="text" name="name" id="name" value={university?.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="form-group">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" name="location" id="location" value={university?.location || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>
        
        <div className="form-group mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea name="description" id="description" value={university?.description || ''} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
                <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input type="text" name="logo_url" id="logo_url" value={university?.logo_url || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="form-group">
                <label htmlFor="banner_url" className="block text-sm font-medium text-gray-700 mb-1">Banner URL</label>
                <input type="text" name="banner_url" id="banner_url" value={university?.banner_url || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        <div className="form-group mb-6">
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">Official Website URL</label>
          <input 
            type="url" 
            name="website_url" 
            id="website_url" 
            value={university?.website_url || ''} 
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>

        {/* Enhanced University Information for Card Auto-Generation */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">University Details (For Auto-Generated Cards)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select 
                name="country" 
                id="country" 
                value={university?.content?.country || ''} 
                onChange={(e) => handleContentFieldChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            
            <div className="form-group">
              <label htmlFor="university_type" className="block text-sm font-medium text-gray-700 mb-1">University Type</label>
              <select 
                name="university_type" 
                id="university_type" 
                value={university?.content?.university_type || ''} 
                onChange={(e) => handleContentFieldChange('university_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                <option value="public">Public University</option>
                <option value="semi-government">Semi-Government</option>
                <option value="private">Private University</option>
                <option value="international">International/Foreign Private</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="ranking" className="block text-sm font-medium text-gray-700 mb-1">University Ranking</label>
              <input 
                type="text" 
                name="ranking" 
                id="ranking" 
                value={university?.content?.ranking || ''} 
                onChange={(e) => handleContentFieldChange('ranking', e.target.value)}
                placeholder="e.g., 150"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="ranking_type" className="block text-sm font-medium text-gray-700 mb-1">Ranking Type</label>
              <select 
                name="ranking_type" 
                id="ranking_type" 
                value={university?.content?.ranking_type || 'QS Ranking'} 
                onChange={(e) => handleContentFieldChange('ranking_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="QS Ranking">QS Ranking</option>
                <option value="Country Ranking">Country Ranking</option>
                <option value="Times Higher Education">Times Higher Education</option>
                <option value="Academic Ranking">Academic Ranking</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="initial_payment" className="block text-sm font-medium text-gray-700 mb-1">Initial Payment</label>
              <input 
                type="text" 
                name="initial_payment" 
                id="initial_payment" 
                value={university?.content?.initial_payment || ''} 
                onChange={(e) => handleContentFieldChange('initial_payment', e.target.value)}
                placeholder="e.g., $5,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Course Duration</label>
              <input 
                type="text" 
                name="duration" 
                id="duration" 
                value={university?.content?.duration || ''} 
                onChange={(e) => handleContentFieldChange('duration', e.target.value)}
                placeholder="e.g., 3-4 years"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="language_requirements" className="block text-sm font-medium text-gray-700 mb-1">Language Requirements</label>
              <input 
                type="text" 
                name="language_requirements" 
                id="language_requirements" 
                value={university?.content?.language_requirements?.join(', ') || ''} 
                onChange={(e) => handleArrayFieldChange('language_requirements', e.target.value)}
                placeholder="e.g., IELTS 6.5, TOEFL 90"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas</p>
            </div>
          </div>
          
          <div className="form-group mb-6">
            <label htmlFor="popular_courses" className="block text-sm font-medium text-gray-700 mb-1">Popular Courses/Subjects</label>
            <textarea 
              name="popular_courses" 
              id="popular_courses" 
              value={university?.content?.popular_courses?.join(', ') || ''} 
              onChange={(e) => handleArrayFieldChange('popular_courses', e.target.value)}
              rows="3"
              placeholder="e.g., Computer Science, Business Administration, Engineering, Medicine"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Separate multiple courses with commas. Only first 2 will show on cards.</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="programs" className="block text-sm font-medium text-gray-700 mb-1">All Available Programs</label>
            <textarea 
              name="programs" 
              id="programs" 
              value={university?.content?.programs?.join(', ') || ''} 
              onChange={(e) => handleArrayFieldChange('programs', e.target.value)}
              rows="4"
              placeholder="e.g., Bachelor of Science, Master of Business Administration, PhD in Engineering"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Separate multiple programs with commas</p>
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">University Page Content</label>
          <QuillEditor 
            value={university?.page_content || ''} 
            onChange={handlePageContentChange} 
            className="bg-white"
          />
        </div>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {saving ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UniversityEditor; 