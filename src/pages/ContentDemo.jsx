import React, { useState } from 'react';
import PageContent from '../components/PageContent';
import ContentRenderer from '../components/ContentRenderer';
import QuillEditor from '../components/QuillEditor';

const ContentDemo = () => {
  const [content, setContent] = useState(`
    <h1>Welcome to MA Education Content Management System</h1>
    
    <p>This is a comprehensive content management system that supports all the features you requested:</p>
    
    <h2>Text Formatting Features</h2>
    
    <p>We support <strong>bold text</strong>, <em>italic text</em>, <u>underlined text</u>, and various <a href="https://example.com">styled links</a>.</p>
    
    <h3>Numbered and Bulleted Lists</h3>
    
    <h4>Ordered List (Numbers):</h4>
    <ol>
      <li>First important point about university admissions</li>
      <li>Second crucial step in the application process</li>
      <li>Third essential requirement for students</li>
      <li>Fourth and final consideration</li>
    </ol>
    
    <h4>Unordered List (Bullets):</h4>
    <ul>
      <li>Document preparation services</li>
      <li>Visa processing assistance</li>
      <li>Interview preparation guidance</li>
      <li>Pre-departure orientation</li>
    </ul>
    
    <h2>Table with Alternating Colors</h2>
    
    <table>
      <thead>
        <tr>
          <th>University Name</th>
          <th>Country</th>
          <th>Ranking</th>
          <th>Tuition Fee</th>
          <th>Application Deadline</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Harvard University</td>
          <td>United States</td>
          <td>1</td>
          <td>$54,000</td>
          <td>January 1, 2024</td>
        </tr>
        <tr>
          <td>University of Oxford</td>
          <td>United Kingdom</td>
          <td>2</td>
          <td>£28,000</td>
          <td>October 15, 2023</td>
        </tr>
        <tr>
          <td>ETH Zurich</td>
          <td>Switzerland</td>
          <td>3</td>
          <td>CHF 1,500</td>
          <td>December 15, 2023</td>
        </tr>
        <tr>
          <td>University of Toronto</td>
          <td>Canada</td>
          <td>4</td>
          <td>CAD 45,000</td>
          <td>February 1, 2024</td>
        </tr>
        <tr>
          <td>University of Melbourne</td>
          <td>Australia</td>
          <td>5</td>
          <td>AUD 40,000</td>
          <td>March 30, 2024</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Blockquote Example</h2>
    
    <blockquote>
      Education is the most powerful weapon which you can use to change the world. Our mission at MA Education is to make global education accessible to every aspiring student, regardless of their background or circumstances.
    </blockquote>
    
    <h3>Image Handling</h3>
    
    <p>Images are automatically resized to fit the content area while maintaining their aspect ratio. They include hover effects and are fully responsive for mobile devices.</p>
    
    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="University Campus" />
    
    <h3>Highlighted Text Examples</h3>
    
    <p>You can highlight important information like <span class="highlight-text bg-yellow-200 text-yellow-900">application deadlines</span>, <span class="highlight-text bg-green-200 text-green-900">scholarship opportunities</span>, or <span class="highlight-text bg-blue-200 text-blue-900">visa requirements</span>.</p>
    
    <h2>File Upload and Management</h2>
    
    <p>The system supports uploading various file types including:</p>
    <ul>
      <li>Images (JPG, PNG, GIF, WebP)</li>
      <li>Documents (PDF, DOC, DOCX, TXT)</li>
      <li>Data files (JSON, CSV, XML)</li>
      <li>Videos (MP4, WebM, MOV)</li>
    </ul>
    
    <h2>Responsive Design Features</h2>
    
    <p>All content is fully responsive and adapts to different screen sizes:</p>
    <ul>
      <li><strong>Desktop:</strong> Full-width layout with optimal spacing</li>
      <li><strong>Tablet:</strong> Adjusted font sizes and component layouts</li>
      <li><strong>Mobile:</strong> Stacked layout with touch-friendly elements</li>
    </ul>
    
    <h2>Video Embedding</h2>
    
    <p>The system supports both YouTube embeds and direct video file uploads with custom controls. Videos maintain proper aspect ratios and include responsive design for mobile devices.</p>
  `);

  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Content Management Demo
              </h1>
              <p className="text-secondary-600">
                Showcasing all content styling features with rich formatting, file uploads, and responsive design
              </p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                editMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {editMode ? 'View Mode' : 'Edit Mode'}
            </button>
          </div>

          {/* Content */}
          {editMode ? (
            <div className="space-y-6">
              <div className="bg-secondary-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-secondary-800 mb-4">
                  Rich Text Editor
                </h2>
                <QuillEditor
                  value={content}
                  onChange={setContent}
                  className="min-h-[400px]"
                />
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-primary-800 mb-4">
                  Preview with File Upload
                </h2>
                <ContentRenderer
                  content={content}
                  editable={true}
                  onContentChange={setContent}
                />
              </div>
            </div>
          ) : (
            <ContentRenderer content={content} />
          )}

          {/* Enhanced PageContent Component Demo */}
          <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                🚀 Enhanced Page Content System
              </h2>
              <p className="text-purple-700 text-lg max-w-3xl mx-auto">
                Experience our new comprehensive content system with advanced file handling, 
                responsive design, and professional styling.
              </p>
            </div>
            
            <PageContent 
              content={content}
              editable={true}
              onChange={setContent}
            />
          </div>

          {/* Features Overview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Rich Text Formatting</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Multiple header levels (H1-H6)</li>
                <li>• Bold, italic, underline styling</li>
                <li>• Colored and highlighted text</li>
                <li>• Custom link styles</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Lists & Tables</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Numbered and bulleted lists</li>
                <li>• Tables with alternating row colors</li>
                <li>• Hover effects on table rows</li>
                <li>• Responsive table design</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Media & Files</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Image upload and resizing</li>
                <li>• Video embedding (YouTube & direct)</li>
                <li>• File upload with previews</li>
                <li>• JSON and document support</li>
              </ul>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              How to Use This Content System
            </h3>
            <div className="text-yellow-700 space-y-2">
              <p><strong>Edit Mode:</strong> Use the rich text editor to create and format content with the full toolbar.</p>
              <p><strong>File Upload:</strong> In edit mode, drag and drop files or click the upload area to add images, videos, and documents.</p>
              <p><strong>Responsive:</strong> All content automatically adapts to different screen sizes for optimal viewing.</p>
              <p><strong>Tables:</strong> Create tables that automatically get alternating row colors and hover effects.</p>
              <p><strong>Videos:</strong> Embed YouTube videos or upload video files with custom controls.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDemo;
