import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  const defaultModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ],
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
