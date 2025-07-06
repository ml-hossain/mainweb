import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiUser, FiMapPin, FiCalendar, FiAward } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import URLWithUpload from '../../components/URLWithUpload';
import AdminLayout from '../components/AdminLayout';

const SuccessStories = ({ onLogout, user }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    university: '',
    course: '',
    country: '',
    year: '',
    image_url: '',
    testimonial: '',
    rating: 5,
    scholarship_amount: ''
  });

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching success stories:', error);
        alert('Error fetching success stories');
      } else {
        setStories(data || []);
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
      alert('Error fetching success stories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStory) {
        // Update existing story
        const { error } = await supabase
          .from('success_stories')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStory.id);

        if (error) throw error;
        alert('Success story updated successfully!');
      } else {
        // Create new story
        const { error } = await supabase
          .from('success_stories')
          .insert([formData]);

        if (error) throw error;
        alert('Success story created successfully!');
      }

      resetForm();
      fetchSuccessStories();
    } catch (error) {
      console.error('Error saving success story:', error);
      alert('Error saving success story: ' + error.message);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      university: story.university,
      course: story.course,
      country: story.country,
      year: story.year,
      image_url: story.image_url || '',
      testimonial: story.testimonial,
      rating: story.rating,
      scholarship_amount: story.scholarship_amount || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;

    try {
      const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Success story deleted successfully!');
      fetchSuccessStories();
    } catch (error) {
      console.error('Error deleting success story:', error);
      alert('Error deleting success story: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      university: '',
      course: '',
      country: '',
      year: '',
      image_url: '',
      testimonial: '',
      rating: 5,
      scholarship_amount: ''
    });
    setEditingStory(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading success stories...</div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Success Story
          </button>
        </div>

      {/* Success Stories Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University *
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course/Program *
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 2023"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Image
              </label>
              <URLWithUpload
                value={formData.image_url}
                onChange={(value) => setFormData(prev => ({ ...prev, image_url: value }))}
                placeholder="Student photo URL"
                uploadLabel="Upload Photo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scholarship Amount
              </label>
              <input
                type="text"
                name="scholarship_amount"
                value={formData.scholarship_amount}
                onChange={handleInputChange}
                placeholder="e.g., $15,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Testimonial *
              </label>
              <textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editingStory ? 'Update Story' : 'Create Story'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Stories List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Success Stories ({stories.length})</h2>
        </div>
        
        {stories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No success stories yet. Add your first success story to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {stories.map((story) => (
              <div key={story.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FiUser className="w-4 h-4 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                      <div className="flex items-center ml-4">
                        {[...Array(story.rating)].map((_, i) => (
                          <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({story.rating}/5)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="font-medium text-blue-600">{story.university}</span>
                      <span className="mx-2">•</span>
                      <span>{story.course}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      <span>{story.country}</span>
                      <FiCalendar className="w-4 h-4 ml-4 mr-1" />
                      <span>{story.year}</span>
                      {story.scholarship_amount && (
                        <>
                          <FiAward className="w-4 h-4 ml-4 mr-1 text-green-600" />
                          <span className="text-green-600 font-medium">{story.scholarship_amount}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-700 italic">"{story.testimonial}"</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(story)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
};

export default SuccessStories;
