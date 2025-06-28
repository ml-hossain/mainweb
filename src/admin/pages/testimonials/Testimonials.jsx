import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  FormGroup,
  FormField,
  Input,
  Button,
  FormActions,
} from '../../components/Form';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
        <Button variant="primary">Add New Testimonial</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {testimonial.name}
                  </h3>
                  {testimonial.role && (
                    <p className="mt-1 text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  )}
                </div>
                {testimonial.image_url && (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.image_url}
                    alt={testimonial.name}
                  />
                )}
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">{testimonial.content}</p>
              {testimonial.rating && (
                <div className="mt-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 15.585l-7.07 3.714 1.35-7.862L.72 7.177l7.88-1.146L10 0l2.4 6.03 7.88 1.146-5.56 5.42 1.35 7.862z"
                      />
                    </svg>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials; 