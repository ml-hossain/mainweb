import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  File,
  Play,
  Pause,
  Volume2,
  Maximize
} from 'lucide-react';

const PageContent = ({ content = '', editable = false, onChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // File upload handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        file: file
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-12 h-12" />;
    if (type.startsWith('video/')) return <Video className="w-12 h-12" />;
    if (type.includes('pdf')) return <FileText className="w-12 h-12" />;
    return <File className="w-12 h-12" />;
  };

  // Video player controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Render different content types
  const renderContent = () => {
    if (!content) return null;

    // Sample content with all features
    const sampleContent = `
      <h1 class="content-h1">Welcome to Our Educational Platform</h1>
      
      <p class="content-paragraph">
        This is a comprehensive platform designed to help you with your 
        <strong class="content-bold">educational journey</strong>. We provide 
        <em class="content-italic">high-quality content</em> and 
        <span class="highlight-text highlight-yellow">expert guidance</span> 
        to ensure your success.
      </p>

      <h2 class="content-h2">Key Features</h2>
      
      <ul class="content-ul">
        <li class="content-li">
          <span class="highlight-text highlight-green">Comprehensive Study Materials</span>
        </li>
        <li class="content-li">Expert Tutoring Sessions</li>
        <li class="content-li">
          <span class="highlight-text highlight-blue">Interactive Learning Tools</span>
        </li>
        <li class="content-li">Progress Tracking</li>
      </ul>

      <h3 class="content-h3">Course Offerings</h3>
      
      <ol class="content-ol">
        <li class="content-li">Computer Science & Engineering</li>
        <li class="content-li">Business Administration</li>
        <li class="content-li">Medical Studies</li>
        <li class="content-li">Arts & Literature</li>
      </ol>

      <blockquote class="content-blockquote">
        Education is the most powerful weapon which you can use to change the world.
        <cite class="block mt-2 text-sm">- Nelson Mandela</cite>
      </blockquote>

      <h4 class="content-h4">Important Links</h4>
      
      <p class="content-paragraph">
        Visit our <a href="#" class="content-link">admission portal</a> to get started.
        You can also check our <a href="#" class="content-link">scholarship programs</a>
        and <a href="#" class="content-link">student testimonials</a>.
      </p>

      <p class="content-paragraph">
        Need help? Contact our 
        <span class="highlight-text highlight-orange">24/7 support team</span>
        or visit our 
        <span class="highlight-text highlight-purple">help center</span>.
      </p>
    `;

    return (
      <div 
        className="content-renderer"
        dangerouslySetInnerHTML={{ __html: content || sampleContent }}
      />
    );
  };

  // Sample table data
  const sampleTableData = {
    headers: ['Program', 'Duration', 'Tuition Fee', 'Start Date', 'Eligibility'],
    rows: [
      ['Computer Science', '4 Years', '$25,000/year', 'September 2024', 'High School Diploma'],
      ['Business Admin', '3 Years', '$22,000/year', 'January 2024', 'High School Diploma'],
      ['Medical Studies', '6 Years', '$35,000/year', 'September 2024', 'Science Background'],
      ['Engineering', '4 Years', '$28,000/year', 'September 2024', 'Math & Physics'],
      ['Arts & Literature', '3 Years', '$18,000/year', 'January 2024', 'High School Diploma']
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* File Upload Section */}
      <div className="file-upload-section">
        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Upload Files</h3>
        
        <div 
          className="upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="upload-icon" />
          <p className="upload-text">Click to upload files</p>
          <p className="upload-subtext">
            Support for images, videos, documents (PDF, DOC, JSON, etc.)
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.json,.txt,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3 className="uploaded-files-title">Uploaded Files</h3>
          <div className="files-grid">
            {uploadedFiles.map(file => (
              <div key={file.id} className="file-item">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="file-preview-image"
                  />
                ) : (
                  <div className="file-icon">
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                <div className="file-info">
                  <p className="file-name" title={file.name}>{file.name}</p>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                </div>
                
                <div className="file-actions">
                  <button 
                    onClick={() => downloadFile(file)}
                    className="file-download"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="file-remove"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Sample Table */}
      <div className="mb-8">
        <h3 className="content-h3">Academic Programs</h3>
        <div className="overflow-x-auto">
          <table className="content-table">
            <thead className="content-thead">
              <tr>
                {sampleTableData.headers.map((header, index) => (
                  <th key={index} className="content-th">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="content-tbody">
              {sampleTableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="content-tr">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="content-td">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Embed Section */}
      <div className="mb-8">
        <h3 className="content-h3">Featured Video</h3>
        
        {/* YouTube Embed Example */}
        <div className="video-embed-container mb-6">
          <div className="video-wrapper">
            <iframe
              className="video-iframe"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Local Video Player Example */}
        {uploadedFiles.find(f => f.type.startsWith('video/')) && (
          <div className="video-embed-container">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                className="video-player"
                src={uploadedFiles.find(f => f.type.startsWith('video/'))?.url}
                poster="/placeholder-video.jpg"
              />
              
              <div className="video-controls">
                <button 
                  onClick={togglePlay}
                  className="video-control-btn"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                
                <button className="video-control-btn">
                  <Volume2 className="w-4 h-4" />
                </button>
                
                <button className="video-control-btn">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Image Gallery */}
      {uploadedFiles.filter(f => f.type.startsWith('image/')).length > 0 && (
        <div className="mb-8">
          <h3 className="content-h3">Image Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles
              .filter(f => f.type.startsWith('image/'))
              .map(file => (
                <img
                  key={file.id}
                  src={file.url}
                  alt={file.name}
                  className="content-image w-full h-48 object-cover"
                />
              ))}
          </div>
        </div>
      )}

      {/* Text Highlighting Examples */}
      <div className="mb-8">
        <h3 className="content-h3">Text Highlighting Examples</h3>
        <p className="content-paragraph">
          Here are examples of different text highlights: 
          <span className="highlight-text highlight-yellow">Yellow highlight</span>, 
          <span className="highlight-text highlight-green">Green highlight</span>, 
          <span className="highlight-text highlight-blue">Blue highlight</span>, 
          <span className="highlight-text highlight-red">Red highlight</span>, 
          <span className="highlight-text highlight-purple">Purple highlight</span>, and 
          <span className="highlight-text highlight-orange">Orange highlight</span>.
        </p>
      </div>
    </div>
  );
};

export default PageContent;
