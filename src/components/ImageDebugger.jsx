import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ImageDebugger = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('id, name, logo_url, banner_url')
          .limit(5);
        
        if (error) throw error;
        setUniversities(data || []);
        console.log('Universities data:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Image Debug Info</h3>
      {universities.map(uni => (
        <div key={uni.id} className="mb-4 p-3 bg-white rounded border">
          <h4 className="font-semibold">{uni.name}</h4>
          <p><strong>Logo URL:</strong> {uni.logo_url || 'Not set'}</p>
          <p><strong>Banner URL:</strong> {uni.banner_url || 'Not set'}</p>
          
          {uni.logo_url && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Logo Preview:</p>
              <img 
                src={uni.logo_url} 
                alt="Logo" 
                className="w-20 h-20 object-cover border rounded"
                onError={(e) => {
                  console.error('Failed to load logo:', uni.logo_url);
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Logo loaded successfully:', uni.logo_url)}
              />
            </div>
          )}
          
          {uni.banner_url && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Banner Preview:</p>
              <img 
                src={uni.banner_url} 
                alt="Banner" 
                className="w-32 h-20 object-cover border rounded"
                onError={(e) => {
                  console.error('Failed to load banner:', uni.banner_url);
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Banner loaded successfully:', uni.banner_url)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageDebugger;
