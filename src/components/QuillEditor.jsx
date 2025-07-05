import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiUploadCloud, FiDownload, FiTable, FiCode, FiEdit3, FiEye, FiSave, FiImage, FiVideo, FiFileText, FiLayers } from 'react-icons/fi';

// Import additional Quill modules for enhanced functionality
import 'quill/dist/quill.snow.css';

// Advanced text formatting blots
const Inline = Quill.import('blots/inline');
const Block = Quill.import('blots/block');

// Custom highlight blot with multiple colors
class HighlightBlot extends Inline {
  static blotName = 'highlight';
  static tagName = 'mark';
  static className = 'ql-highlight';
  
  static create(value) {
    let node = super.create();
    if (typeof value === 'string') {
      node.setAttribute('data-color', value);
      node.style.backgroundColor = value;
    }
    return node;
  }
  
  static formats(node) {
    return node.getAttribute('data-color') || node.style.backgroundColor;
  }
  
  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
    } else {
      this.domNode.setAttribute('data-color', value);
      this.domNode.style.backgroundColor = value;
    }
  }
}

// Custom callout/alert boxes
class CalloutBlot extends Block {
  static blotName = 'callout';
  static tagName = 'div';
  static className = 'ql-callout';
  
  static create(value) {
    let node = super.create();
    node.setAttribute('data-type', value || 'info');
    node.className = `ql-callout ql-callout-${value || 'info'}`;
    return node;
  }
  
  static formats(node) {
    return node.getAttribute('data-type');
  }
}

// Custom spoiler/collapsible content
class SpoilerBlot extends Block {
  static blotName = 'spoiler';
  static tagName = 'details';
  static className = 'ql-spoiler';
  
  static create(value) {
    let node = super.create();
    let summary = document.createElement('summary');
    summary.textContent = value || 'Click to reveal';
    node.appendChild(summary);
    return node;
  }
}

// Register custom blots
Quill.register(HighlightBlot);
Quill.register(CalloutBlot);
Quill.register(SpoilerBlot);

// Custom table functionality
class TableHandler {
  constructor(quill) {
    this.quill = quill;
  }

  insertTable(rows = 3, cols = 3) {
    const range = this.quill.getSelection(true);
    if (range) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">\n';
      
      for (let i = 0; i < rows; i++) {
        tableHTML += '  <tr>\n';
        for (let j = 0; j < cols; j++) {
          const cellStyle = 'border: 1px solid #ddd; padding: 8px; text-align: left;';
          const headerStyle = i === 0 ? ' background-color: #f5f5f5; font-weight: bold;' : '';
          tableHTML += `    <td style="${cellStyle}${headerStyle}">Cell ${i + 1},${j + 1}</td>\n`;
        }
        tableHTML += '  </tr>\n';
      }
      
      tableHTML += '</table>';
      
      this.quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      this.quill.setSelection(range.index + tableHTML.length);
    }
  }
}

// Custom file upload handler for Quill
class FileUploadHandler {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.fileInput = null;
    this.setupFileUpload();
  }

  setupFileUpload() {
    // Create file input element
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.json,.csv,.txt';
    this.fileInput.multiple = true;
    this.fileInput.style.display = 'none';
    document.body.appendChild(this.fileInput);

    // Handle file selection
    this.fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      await this.handleFiles(files);
      e.target.value = ''; // Reset input
    });

    // Set up toolbar button handler with delay to ensure toolbar is ready
    setTimeout(() => {
      this.setupToolbarButton();
    }, 100);
  }

  setupToolbarButton() {
    const uploadBtn = document.querySelector('.ql-file-upload');
    if (uploadBtn && !uploadBtn.hasAttribute('data-file-handler')) {
      uploadBtn.setAttribute('data-file-handler', 'true');
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.fileInput.click();
      });
    }
  }

  async handleFiles(files) {
    for (const file of files) {
      if (!this.isValidFileType(file)) {
        alert(`File ${file.name} is not supported. Please upload JSON, CSV, or TXT files only.`);
        continue;
      }

      try {
        const content = await this.readFile(file);
        this.insertFileContent(file, content);
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Error reading file ${file.name}`);
      }
    }
  }

  isValidFileType(file) {
    const validTypes = ['application/json', 'text/csv', 'text/plain'];
    const validExtensions = ['.json', '.csv', '.txt'];
    return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  insertFileContent(file, content) {
    const range = this.quill.getSelection(true);
    const position = range ? range.index : this.quill.getLength();

    let formattedContent = '';
    let fileName = file.name;
    
    if (file.name.toLowerCase().endsWith('.json')) {
      try {
        const jsonData = JSON.parse(content);
        formattedContent = `\n\n📄 ${fileName}\n${JSON.stringify(jsonData, null, 2)}\n\n`;
      } catch (e) {
        formattedContent = `\n\n📄 ${fileName} (Invalid JSON)\n${content}\n\n`;
      }
    } else if (file.name.toLowerCase().endsWith('.csv')) {
      formattedContent = `\n\n📊 ${fileName}\n${content}\n\n`;
    } else {
      formattedContent = `\n\n📝 ${fileName}\n${content}\n\n`;
    }

    // Insert as plain text to avoid formatting issues
    this.quill.insertText(position, formattedContent);
    this.quill.setSelection(position + formattedContent.length);
    
    // Show success message
    console.log(`File ${fileName} uploaded successfully`);
  }
}

// Register the custom module
Quill.register('modules/fileUpload', FileUploadHandler);

const QuillEditor = ({ value, onChange, className = '', modules, theme = 'snow', ...props }) => {
  const quillRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [editorValue, setEditorValue] = useState(value || '');

  // Memoize the change handler to prevent unnecessary re-renders
  const handleChange = useCallback((content, delta, source, editor) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content, delta, source, editor);
    }
  }, [onChange]);

  // Update editor value when prop changes
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value || '');
    }
  }, [value]);

  useEffect(() => {
    // Global warning suppression for ReactQuill deprecation warnings
    const suppressWarnings = () => {
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      
      // List of warning patterns to suppress
      const suppressPatterns = [
        'findDOMNode is deprecated',
        'DOMNodeInserted',
        'mutation event',
        'Support for this event type has been removed',
        'Listener added for a \'DOMNodeInserted\' mutation event'
      ];
      
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string' && suppressPatterns.some(pattern => message.includes(pattern))) {
          return; // Suppress the warning
        }
        originalConsoleError.apply(console, args);
      };
      
      console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string' && suppressPatterns.some(pattern => message.includes(pattern))) {
          return; // Suppress the warning
        }
        originalConsoleWarn.apply(console, args);
      };
      
      return () => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
      };
    };

    const restoreConsole = suppressWarnings();
    
    // Mark as ready after component mount
    const timer = setTimeout(() => setIsReady(true), 50);

    return () => {
      restoreConsole();
      clearTimeout(timer);
    };
  }, []);

  // Add custom toolbar button for file upload
  useEffect(() => {
    if (isReady && quillRef.current) {
      const quill = quillRef.current.getEditor();
      
      // Add custom button styles if not already added
      if (!document.querySelector('#quill-file-upload-styles')) {
        const style = document.createElement('style');
        style.id = 'quill-file-upload-styles';
        style.textContent = `
          /* Advanced Blog Editor Styles */
          .ql-toolbar {
            border: 1px solid #e5e7eb !important;
            border-bottom: none !important;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
            padding: 12px 16px !important;
            border-radius: 12px 12px 0 0 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04) !important;
          }
          
          .ql-container {
            border: 1px solid #e5e7eb !important;
            border-top: none !important;
            border-radius: 0 0 12px 12px !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 16px !important;
            line-height: 1.6 !important;
            min-height: 400px !important;
            max-height: 60vh !important;
            overflow-y: auto !important;
          }
          
          .ql-editor {
            padding: 24px !important;
            color: #1f2937 !important;
            background: #ffffff !important;
            border-radius: 0 0 12px 12px !important;
            max-height: calc(60vh - 100px) !important;
            overflow-y: auto !important;
          }
          
          .ql-editor:focus {
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          /* Enhanced Toolbar Buttons */
          .ql-toolbar .ql-formats {
            margin-right: 16px !important;
          }
          
          .ql-toolbar button {
            border-radius: 6px !important;
            margin: 0 2px !important;
            padding: 6px !important;
            transition: all 0.2s ease !important;
          }
          
          .ql-toolbar button:hover {
            background: rgba(59, 130, 246, 0.1) !important;
            color: #3b82f6 !important;
          }
          
          .ql-toolbar button.ql-active {
            background: #3b82f6 !important;
            color: white !important;
          }
          
          /* File Upload Button */
          .ql-file-upload {
            width: 32px !important;
            height: 32px !important;
            border: none !important;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
            cursor: pointer !important;
            padding: 6px !important;
            border-radius: 8px !important;
            position: relative !important;
            transition: all 0.3s ease !important;
          }
          
          .ql-file-upload:before {
            content: "📁" !important;
            font-size: 16px !important;
            display: block !important;
            color: white !important;
          }
          
          .ql-file-upload:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
            background: linear-gradient(135deg, #5b5bf6 0%, #7c3aed 100%) !important;
          }
          
          /* Typography Enhancements */
          .ql-editor h1 {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            line-height: 1.2 !important;
            margin: 1.5rem 0 1rem 0 !important;
            color: #111827 !important;
          }
          
          .ql-editor h2 {
            font-size: 2rem !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
            margin: 1.25rem 0 0.75rem 0 !important;
            color: #1f2937 !important;
          }
          
          .ql-editor h3 {
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            line-height: 1.4 !important;
            margin: 1rem 0 0.5rem 0 !important;
            color: #374151 !important;
          }
          
          .ql-editor p {
            margin: 0.75rem 0 !important;
            color: #4b5563 !important;
          }
          
          .ql-editor blockquote {
            border-left: 4px solid #3b82f6 !important;
            background: #f8fafc !important;
            padding: 16px 20px !important;
            margin: 20px 0 !important;
            border-radius: 0 8px 8px 0 !important;
            font-style: italic !important;
            color: #475569 !important;
          }
          
          .ql-editor pre {
            background: #1e293b !important;
            color: #e2e8f0 !important;
            padding: 20px !important;
            border-radius: 8px !important;
            margin: 16px 0 !important;
            overflow-x: auto !important;
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace !important;
          }
          
          .ql-editor code {
            background: #f1f5f9 !important;
            color: #e11d48 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace !important;
            font-size: 0.875em !important;
          }
          
          /* Custom Highlights */
          .ql-editor mark,
          .ql-editor .ql-highlight {
            background: #fef3c7 !important;
            color: #92400e !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
          }
          
          /* Lists */
          .ql-editor ul,
          .ql-editor ol {
            margin: 12px 0 !important;
            padding-left: 24px !important;
          }
          
          .ql-editor li {
            margin: 6px 0 !important;
            color: #4b5563 !important;
          }
          
          /* Tables */
          .ql-editor table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 20px 0 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }
          
          .ql-editor td,
          .ql-editor th {
            border: 1px solid #e5e7eb !important;
            padding: 12px 16px !important;
            text-align: left !important;
          }
          
          .ql-editor th {
            background: #f8fafc !important;
            font-weight: 600 !important;
            color: #374151 !important;
          }
          
          .ql-editor td {
            background: #ffffff !important;
          }
          
          /* Links */
          .ql-editor a {
            color: #3b82f6 !important;
            text-decoration: none !important;
            border-bottom: 1px solid transparent !important;
            transition: all 0.2s ease !important;
          }
          
          .ql-editor a:hover {
            border-bottom-color: #3b82f6 !important;
          }
          
          /* Images */
          .ql-editor img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 8px !important;
            margin: 16px 0 !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
          }
          
          /* Placeholder */
          .ql-editor.ql-blank::before {
            color: #9ca3af !important;
            font-style: italic !important;
            font-size: 16px !important;
            left: 24px !important;
            right: 24px !important;
          }
          
          /* Focus States */
          .ql-toolbar button:focus {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .ql-toolbar {
              padding: 8px 12px !important;
            }
            
            .ql-editor {
              padding: 16px !important;
              font-size: 15px !important;
            }
            
            .ql-toolbar .ql-formats {
              margin-right: 8px !important;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Ensure the file upload module is properly initialized
      setTimeout(() => {
        const fileUploadModule = quill.getModule('fileUpload');
        if (fileUploadModule) {
          fileUploadModule.setupToolbarButton();
        }
      }, 200);
    }
  }, [isReady]);

  const defaultModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={editorValue}
        onChange={handleChange}
        modules={modules || defaultModules}
        placeholder="Enter detailed university information..."
        {...props}
      />
    </div>
  );
};

export default QuillEditor;
