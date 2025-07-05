import React, { useState } from 'react';
import { FiLink, FiUpload, FiImage, FiX } from 'react-icons/fi';
import ImageUpload from './ImageUpload';

const URLWithUpload = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = "Enter URL or upload image",
  className = "",
  uploadPlaceholder = "Upload Image"
}) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleImageUpload = (imageUrl) => {
    // Create a synthetic event to match the expected format
    const syntheticEvent = {
      target: {
        name: name,
        value: imageUrl
      }
    };
    onChange(syntheticEvent);
    setShowUpload(false);
  };

  const handleURLChange = (e) => {
    onChange(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 transition-colors px-2 py-1 rounded-md hover:bg-purple-50"
        >
          {showUpload ? <FiX className="w-3 h-3" /> : <FiUpload className="w-3 h-3" />}
          <span className="hidden sm:inline">{showUpload ? 'Cancel' : 'Upload'}</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {/* URL Input */}
        <div className="relative">
          <FiLink className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="url"
            name={name}
            id={name}
            value={value || ''}
            onChange={handleURLChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            placeholder={placeholder}
          />
        </div>
        
        {/* Upload Option */}
        {showUpload && (
          <div className="animate-fadeIn">
            <ImageUpload
              onImageUpload={handleImageUpload}
              placeholder={uploadPlaceholder}
              className="w-full"
            />
          </div>
        )}
      </div>
      
      {/* Preview if URL exists */}
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-24 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
              // Show a placeholder or error message
              const errorDiv = document.createElement('div');
              errorDiv.className = 'w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-sm';
              errorDiv.textContent = 'Failed to load image';
              e.target.parentNode.appendChild(errorDiv);
            }}
            onLoad={(e) => {
              e.target.style.display = 'block';
              // Remove any error placeholders
              const errorDiv = e.target.parentNode.querySelector('div');
              if (errorDiv && errorDiv.textContent === 'Failed to load image') {
                errorDiv.remove();
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default URLWithUpload;
