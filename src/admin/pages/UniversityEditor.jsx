import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
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
        content: ''
      });
      setLoading(false);
    }
  }, [id, fetchUniversity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUniversity(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setUniversity(prev => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!university.name) {
      setError('University name is required.');
      return;
    }

    setSaving(true);
    setError('');

    const slug = generateSlug(university.name);

    const universityData = {
      ...university,
      slug: slug,
    };

    try {
      let response;
      if (!id) {
        // Create new university
        const { data: insertedData, error: insertError } = await supabase.from('universities').insert([universityData]).select().single();
        if(insertError) throw insertError;
        response = { data: insertedData, error: insertError };
      } else {
        // Update existing university
        const { data: updatedData, error: updateError } = await supabase.from('universities').update(universityData).eq('id', id).select().single();
        if(updateError) throw updateError;
        response = { data: updatedData, error: updateError };
      }
      
      const { error } = response;

      if (error) {
        throw error;
      }
      
      setSaving(false);
      navigate('/admin/universities');

    } catch (err) {
      setError('Failed to save university. Please try again.');
      console.error(err);
      setSaving(false);
    }
  };

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
          <label className="block text-sm font-medium text-gray-700 mb-1">University Page Content</label>
          <ReactQuill 
            theme="snow" 
            value={university?.content || ''} 
            onChange={handleContentChange} 
            className="bg-white"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
              ],
            }}
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