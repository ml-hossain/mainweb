import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import JsonUploader from './JsonUploader';

const ContentRenderer = ({ content, className = '', editable = false, onContentChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [videoStates, setVideoStates] = useState({});
  const fileInputRef = useRef(null);

  // Parse HTML content and apply custom styling
  const processContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Add custom classes to HTML elements
    let processedContent = htmlContent
      // Headers
      .replace(/<h1([^>]*)>/g, '<h1$1 class="content-h1">')
      .replace(/<h2([^>]*)>/g, '<h2$1 class="content-h2">')
      .replace(/<h3([^>]*)>/g, '<h3$1 class="content-h3">')
      .replace(/<h4([^>]*)>/g, '<h4$1 class="content-h4">')
      .replace(/<h5([^>]*)>/g, '<h5$1 class="content-h5">')
      .replace(/<h6([^>]*)>/g, '<h6$1 class="content-h6">')
      // Links
      .replace(/<a([^>]*)>/g, '<a$1 class="content-link">')
      // Bold
      .replace(/<strong([^>]*)>/g, '<strong$1 class="content-bold">')
      .replace(/<b([^>]*)>/g, '<b$1 class="content-bold">')
      // Italic
      .replace(/<em([^>]*)>/g, '<em$1 class="content-italic">')
      .replace(/<i([^>]*)>/g, '<i$1 class="content-italic">')
      // Underline
      .replace(/<u([^>]*)>/g, '<u$1 class="content-underline">')
      // Paragraphs
      .replace(/<p([^>]*)>/g, '<p$1 class="content-paragraph">')
      // Lists
      .replace(/<ul([^>]*)>/g, '<ul$1 class="content-ul">')
      .replace(/<ol([^>]*)>/g, '<ol$1 class="content-ol">')
      .replace(/<li([^>]*)>/g, '<li$1 class="content-li">')
      // Blockquotes
      .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="content-blockquote">')
      // Tables
      .replace(/<table([^>]*)>/g, '<table$1 class="content-table">')
      .replace(/<thead([^>]*)>/g, '<thead$1 class="content-thead">')
      .replace(/<tbody([^>]*)>/g, '<tbody$1 class="content-tbody">')
      .replace(/<tr([^>]*)>/g, '<tr$1 class="content-tr">')
      .replace(/<th([^>]*)>/g, '<th$1 class="content-th">')
      .replace(/<td([^>]*)>/g, '<td$1 class="content-td">')
      // Images
      .replace(/<img([^>]*)>/g, '<img$1 class="content-image">');

    return processedContent;
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const VideoEmbed = ({ src, title = "Video" }) => {
    const videoId = src;
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);

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

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const enterFullscreen = () => {
      if (videoRef.current) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      }
    };

    // Check if it's a YouTube URL
    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
    const getYouTubeId = (url) => {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    };

    if (isYouTube) {
      const youtubeId = getYouTubeId(src);
      return (
        <div className="video-embed-container">
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            ></iframe>
          </div>
        </div>
      );
    }

    return (
      <div className="video-embed-container">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video-player"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-controls">
            <button onClick={togglePlay} className="video-control-btn">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={toggleMute} className="video-control-btn">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button onClick={enterFullscreen} className="video-control-btn">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HighlightText = ({ children, color = 'yellow' }) => {
    const colorClasses = {
      yellow: 'bg-yellow-200 text-yellow-900',
      green: 'bg-green-200 text-green-900',
      blue: 'bg-blue-200 text-blue-900',
      pink: 'bg-pink-200 text-pink-900',
      purple: 'bg-purple-200 text-purple-900',
    };

    return (
      <span className={`highlight-text ${colorClasses[color] || colorClasses.yellow}`}>
        {children}
      </span>
    );
  };

  return (
    <div className={`content-renderer ${className}`}>
      {/* File Upload Section */}
      {editable && (
        <div className="file-upload-section">
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <Upload className="upload-icon" />
            <p className="upload-text">Click to upload files or drag and drop</p>
            <p className="upload-subtext">Support for images, documents, and videos</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.json"
          />
        </div>
      )}

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3 className="uploaded-files-title">Uploaded Files</h3>
          <div className="files-grid">
            {uploadedFiles.map(file => (
              <div key={file.id} className="file-item">
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="file-preview-image" />
                ) : file.type.startsWith('video/') ? (
                  <VideoEmbed src={file.url} title={file.name} />
                ) : (
                  <div className="file-icon">
                    <FileText size={24} />
                  </div>
                )}
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                  <div className="file-actions">
                    <a href={file.url} download={file.name} className="file-download">
                      <Download size={16} />
                      Download
                    </a>
                    <button onClick={() => removeFile(file.id)} className="file-remove">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ __html: processContent(content) }}
      />

      {/* Video Embed Example */}
      <div className="mt-8">
        <h3 className="content-h3">Sample Video Embeds</h3>
        <VideoEmbed 
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
          title="Sample YouTube Video" 
        />
      </div>
    </div>
  );
};

export default ContentRenderer;
