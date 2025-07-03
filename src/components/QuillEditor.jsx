import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, className = '', modules, theme = 'snow', ...props }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    // Suppress the findDOMNode deprecation warning by catching it
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        args[0].includes('findDOMNode')
      ) {
        // Suppress the warning
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const defaultModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules || defaultModules}
        {...props}
      />
    </div>
  );
};

export default QuillEditor;
