import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import {
  FormGroup,
  FormField,
  Input,
  Button,
  FormActions,
} from '../../components/Form';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (
            name
          )
        `)
        .order('title', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
        <Button variant="primary">Add New Service</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {service.title}
                  </h3>
                  {service.service_categories && (
                    <p className="mt-1 text-sm text-gray-500">
                      {service.service_categories.name}
                    </p>
                  )}
                </div>
                {service.icon && (
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-xl text-indigo-600">
                      {service.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 line-clamp-3">
                  {service.description}
                </p>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <Link
          to="/admin/services/categories"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <p className="text-gray-600">Manage service categories and classifications</p>
        </Link>

        <Link
          to="/admin/services/pricing"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Pricing</h2>
          <p className="text-gray-600">Set and update service pricing</p>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Services; 