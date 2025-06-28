import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing...', height = '200px' }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'color',
    'background',
    'blockquote',
    'code-block',
  ];

  return (
    <div className="rich-text-editor">
      <style>
        {`
          .rich-text-editor .quill {
            background: white;
            border-radius: 0.375rem;
            border: 1px solid #D1D5DB;
          }
          .rich-text-editor .ql-toolbar {
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
            border-bottom: 1px solid #D1D5DB;
            background: #F9FAFB;
          }
          .rich-text-editor .ql-container {
            border-bottom-left-radius: 0.375rem;
            border-bottom-right-radius: 0.375rem;
            height: ${height};
          }
          .rich-text-editor .ql-editor {
            min-height: ${height};
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          .rich-text-editor .ql-editor.ql-blank::before {
            font-style: normal;
            color: #9CA3AF;
          }
          .rich-text-editor .ql-snow.ql-toolbar button:hover,
          .rich-text-editor .ql-snow .ql-toolbar button:hover,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label:hover,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label.ql-active,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item:hover,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item:hover,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
            color: #4F46E5;
          }
          .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
            fill: #4F46E5;
          }
          .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
          .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
          .rich-text-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
          .rich-text-editor .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
            stroke: #4F46E5;
          }
        `}
      </style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor; 