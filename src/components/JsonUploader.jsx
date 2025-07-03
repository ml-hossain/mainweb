import React, { useState, useRef } from 'react';
import { Upload, File, Download, Eye, X, CheckCircle, AlertCircle } from 'lucide-react';

const JsonUploader = ({ onJsonLoad, className = '' }) => {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setIsValid(false);

    if (!file.name.toLowerCase().endsWith('.json')) {
      setError('Please select a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsed = JSON.parse(content);
        setJsonData(parsed);
        setIsValid(true);
        if (onJsonLoad) {
          onJsonLoad(parsed, file.name);
        }
      } catch (err) {
        setError('Invalid JSON format: ' + err.message);
        setJsonData(null);
        setIsValid(false);
      }
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setJsonData(null);
    setFileName('');
    setError('');
    setIsValid(false);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadJsonTemplate = () => {
    const template = {
      "example_data": {
        "name": "Sample University",
        "country": "Example Country",
        "ranking": 1,
        "programs": [
          {
            "name": "Computer Science",
            "duration": "4 years",
            "tuition": "$50,000"
          }
        ]
      },
      "instructions": "Replace this template with your actual data"
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderJsonPreview = (data, depth = 0) => {
    if (depth > 2) return <span className="text-gray-500">...</span>;

    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return (
          <div className="ml-4">
            <span className="text-blue-600">[</span>
            {data.slice(0, 3).map((item, index) => (
              <div key={index} className="ml-2">
                {renderJsonPreview(item, depth + 1)}
                {index < Math.min(data.length - 1, 2) && <span className="text-gray-500">,</span>}
              </div>
            ))}
            {data.length > 3 && <div className="ml-2 text-gray-500">... {data.length - 3} more items</div>}
            <span className="text-blue-600">]</span>
          </div>
        );
      } else {
        return (
          <div className="ml-4">
            <span className="text-blue-600">{'{'}</span>
            {Object.entries(data).slice(0, 3).map(([key, value], index, arr) => (
              <div key={key} className="ml-2">
                <span className="text-purple-600">"{key}"</span>: {renderJsonPreview(value, depth + 1)}
                {index < Math.min(arr.length - 1, 2) && <span className="text-gray-500">,</span>}
              </div>
            ))}
            {Object.keys(data).length > 3 && (
              <div className="ml-2 text-gray-500">... {Object.keys(data).length - 3} more properties</div>
            )}
            <span className="text-blue-600">{'}'}</span>
          </div>
        );
      }
    } else if (typeof data === 'string') {
      return <span className="text-green-600">"{data}"</span>;
    } else if (typeof data === 'number') {
      return <span className="text-orange-600">{data}</span>;
    } else if (typeof data === 'boolean') {
      return <span className="text-red-600">{data.toString()}</span>;
    } else if (data === null) {
      return <span className="text-gray-500">null</span>;
    }
    return <span>{String(data)}</span>;
  };

  return (
    <div className={`json-uploader ${className}`}>
      {/* Upload Area */}
      <div className="mb-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
            isValid 
              ? 'border-green-300 bg-green-50 hover:border-green-400'
              : error 
                ? 'border-red-300 bg-red-50 hover:border-red-400'
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-3">
            {isValid ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : error ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isValid ? 'JSON file loaded successfully!' : 'Upload JSON File'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Click to browse or drag and drop your JSON file here
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* File Info */}
      {fileName && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">{fileName}</p>
                <p className="text-sm text-gray-500">
                  {isValid ? 'Valid JSON format' : 'Processing...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isValid && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Toggle Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={clearFile}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Remove File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Preview */}
      {showPreview && jsonData && (
        <div className="mb-4 p-4 bg-gray-900 text-white rounded-lg overflow-auto max-h-64">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">JSON Preview</h4>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="font-mono text-sm">
            {renderJsonPreview(jsonData)}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={downloadJsonTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Download Template</span>
        </button>
        
        {isValid && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default JsonUploader;
