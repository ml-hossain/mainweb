import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiImage, FiX, FiLoader } from 'react-icons/fi';

/**
 * ImageUpload Component
 * 
 * This component automatically detects changes to the VITE_IMGBB_API_KEY environment variable.
 * When you change the API key in the .env file:
 * 1. Vite will automatically reload the environment variables
 * 2. The component will detect the change through import.meta.env.VITE_IMGBB_API_KEY
 * 3. The upload functionality will use the new API key immediately
 * 4. The UI will update to show the current status
 * 
 * No manual restart is needed - just change the .env file and the component adapts automatically.
 */
const ImageUpload = ({ onImageUpload, placeholder = "Upload Image", className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState('checking');
  const fileInputRef = useRef(null);

  // Monitor API key availability
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (apiKey) {
        setApiKeyStatus('available');
        console.log('ImgBB API key detected:', apiKey.substring(0, 8) + '...');
      } else {
        setApiKeyStatus('missing');
        console.warn('ImgBB API key not found in environment variables');
      }
    };
    
    checkApiKey();
    
    // Check periodically in case the environment variables change
    const interval = setInterval(checkApiKey, 5000);
    return () => clearInterval(interval);
  }, []);

  // Test function to validate API key
  const validateApiKey = () => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      console.error('ImgBB API key not found in environment variables');
      setApiKeyStatus('missing');
      return false;
    }
    console.log('Using ImgBB API key:', apiKey.substring(0, 8) + '...');
    setApiKeyStatus('available');
    return true;
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // Get the current API key from environment
    const currentApiKey = import.meta.env.VITE_IMGBB_API_KEY;
    
    if (!currentApiKey) {
      throw new Error('ImgBB API key not configured. Please check your environment variables.');
    }

    console.log('Starting upload with API key:', currentApiKey.substring(0, 8) + '...');

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${currentApiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
      }
      
      console.log('Upload successful:', data.data.url);
      return data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.message.includes('Content Security Policy')) {
        throw new Error('Image upload blocked by security policy. Please contact administrator.');
      }
      throw new Error(error.message || 'Failed to upload image');
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate API key first
    if (!validateApiKey()) {
      alert('Image upload service is not configured. Please contact administrator.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, GIF, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToImgBB(file);
      onImageUpload(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading || apiKeyStatus !== 'available') return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (uploading || apiKeyStatus !== 'available') return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    if (!uploading && apiKeyStatus === 'available') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          flex items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 min-h-[48px]
          ${dragActive 
            ? 'border-purple-400 bg-purple-50' 
            : apiKeyStatus === 'missing'
              ? 'border-red-300 bg-red-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !uploading && apiKeyStatus === 'available') {
            e.preventDefault();
            openFileDialog();
          }
        }}
        aria-label={
          uploading ? 'Uploading image...' : 
          apiKeyStatus === 'missing' ? 'Upload service not available' : 
          'Upload image'
        }
      >
        {uploading ? (
          <div className="flex items-center space-x-2 text-purple-600">
            <FiLoader className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : apiKeyStatus === 'missing' ? (
          <div className="flex items-center space-x-2 text-red-500">
            <FiX className="w-4 h-4" />
            <span className="text-sm font-medium">Service Not Available</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-600">
            <FiUpload className="w-4 h-4" />
            <span className="text-sm font-medium">{placeholder}</span>
          </div>
        )}
      </div>
      
      <div className="mt-1 text-xs text-gray-500 text-center">
        PNG, JPG, GIF up to 5MB • Drag & drop or click to browse
        {apiKeyStatus === 'missing' && (
          <div className="text-red-500 mt-1">⚠️ Upload service not configured</div>
        )}
        {apiKeyStatus === 'available' && (
          <div className="text-green-500 mt-1">✅ Upload service ready</div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
