import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';
import RichTextEditor from '../../components/RichTextEditor';
import FileUpload from '../../components/FileUpload';
import Modal, { ConfirmationModal } from '../../components/Modal';
import {
  FormGroup,
  FormField,
  Input,
  TextArea,
  Checkbox,
  Button,
  ButtonGroup,
  FormActions,
  Badge
} from '../../components/Form';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Universities = () => {
  const { isAdmin } = useAdmin();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    location: '',
    featured: false,
    content: {}
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { user } = await supabase.auth.getUser();
      const universityData = {
        ...formData,
        updated_by: user.id
      };

      if (selectedUniversity) {
        const { error } = await supabase
          .from('universities')
          .update(universityData)
          .eq('id', selectedUniversity.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('universities')
          .insert([{ ...universityData, created_by: user.id }]);
        if (error) throw error;
      }

      setShowAddModal(false);
      setSelectedUniversity(null);
      setFormData({
        name: '',
        description: '',
        logo_url: '',
        website_url: '',
        location: '',
        featured: false,
        content: {}
      });
      fetchUniversities();
    } catch (error) {
      console.error('Error saving university:', error);
    }
  }

  async function handleDelete() {
    if (!selectedUniversity) return;

    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', selectedUniversity.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedUniversity(null);
      fetchUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  }

  function handleEdit(university) {
    setSelectedUniversity(university);
    setFormData({
      name: university.name,
      description: university.description || '',
      logo_url: university.logo_url || '',
      website_url: university.website_url || '',
      location: university.location || '',
      featured: university.featured || false,
      content: university.content || {}
    });
    setShowAddModal(true);
  }

  const handleLogoUpload = (url) => {
    setFormData(prev => ({
      ...prev,
      logo_url: url
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Universities</h1>
          <Button
          variant="primary"
            onClick={() => {
              setSelectedUniversity(null);
              setFormData({
                name: '',
                description: '',
                logo_url: '',
                website_url: '',
                location: '',
                featured: false,
                content: {}
              });
              setShowAddModal(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add University
          </Button>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 mb-4 flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search universities..."
          />
        </div>

        <Button
          variant="secondary"
          onClick={fetchUniversities}
        >
          <ArrowPathIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Universities List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredUniversities.map((university) => (
          <div
            key={university.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
                        <div className="flex items-center">
                          {university.logo_url ? (
                            <img
                              src={university.logo_url}
                              alt={university.name}
                    className="h-12 w-12 object-contain"
                            />
                          ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">
                      {university.name.charAt(0)}
                    </span>
                            </div>
                          )}
                          <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {university.name}
                  </h3>
                  <p className="text-sm text-gray-500">{university.location}</p>
                          </div>
                        </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 line-clamp-3">
                  {university.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(university)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedUniversity(university);
                                setShowDeleteModal(true);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedUniversity(null);
        }}
        title={selectedUniversity ? 'Edit University' : 'Add New University'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup>
            <FormField label="University Name" required>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </FormField>

            <FormField label="Logo">
              <FileUpload
                bucket="universities"
                path="logos/"
                onUpload={handleLogoUpload}
                onError={(error) => console.error('Upload error:', error)}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
              />
              {formData.logo_url && (
                <div className="mt-2">
                  <img
                    src={formData.logo_url}
                    alt="University logo"
                    className="h-20 w-20 object-contain"
                  />
                </div>
              )}
            </FormField>

            <FormField label="Website URL">
              <Input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </FormField>

            <FormField label="Location">
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </FormField>

            <FormField>
              <Checkbox
                label="Featured University"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
            </FormField>

            <FormField label="Detailed Content">
              <RichTextEditor
                value={formData.content.details || ''}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, details: value }
                  })
                }
              />
            </FormField>
          </FormGroup>

          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setSelectedUniversity(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedUniversity ? 'Save Changes' : 'Add University'}
            </Button>
          </FormActions>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUniversity(null);
        }}
        onConfirm={handleDelete}
        title="Delete University"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete {selectedUniversity?.name}? This action cannot be undone.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default Universities;