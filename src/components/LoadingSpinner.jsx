import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'default', light = false }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    default: 'h-12 w-12 border-2',
    large: 'h-16 w-16 border-3',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-4';

  const spinnerClasses = `
    animate-spin rounded-full
    ${sizeClasses[size]}
    ${light ? 'border-white border-t-transparent' : 'border-blue-600 border-t-transparent'}
  `;

  const bgClasses = fullScreen ? (light ? 'bg-gray-800' : 'bg-gray-50') : '';

  return (
    <div className={`${containerClasses} ${bgClasses}`}>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner; 