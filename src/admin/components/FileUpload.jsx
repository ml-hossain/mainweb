import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { uploadFile, isImageFile, formatFileSize, createFilePreview } from '../../lib/storage';

function FileUpload({
  onUpload,
  onError,
  bucket,
  path = '',
  maxSize = 5242880, // 5MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
  multiple = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      for (const file of acceptedFiles) {
        // Create preview for images
        if (isImageFile(file)) {
          const previewUrl = await createFilePreview(file);
          setPreview(previewUrl);
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 100);

        const { path: filePath, error } = await uploadFile(file, bucket, path);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (error) {
          onError?.(error);
          return;
        }

        onUpload?.(filePath);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      onError?.(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [bucket, path, onUpload, onError]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple,
  });

  const renderPreview = () => {
    if (!preview) return null;

    return (
      <div className="mt-2 relative">
        <img
          src={preview}
          alt="Upload preview"
          className="w-20 h-20 object-cover rounded-lg"
        />
        <button
          onClick={() => setPreview(null)}
          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
        >
          <XMarkIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (uploading) {
      return (
        <div className="text-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Uploading... {uploadProgress}%</p>
        </div>
      );
    }

    if (isDragReject) {
      return (
        <div className="text-center">
          <XMarkIcon className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-2 text-sm text-red-500">
            File type not supported
          </p>
        </div>
      );
    }

    return (
      <div className="text-center">
        {isDragActive ? (
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 animate-bounce" />
        ) : (
          accept['image/*'] ? (
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          ) : (
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          )
        )}
        <p className="mt-2 text-sm text-gray-500">
          {isDragActive
            ? 'Drop the files here...'
            : `Drag 'n' drop ${multiple ? 'files' : 'a file'}, or click to select`}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {accept['image/*']
            ? 'PNG, JPG, GIF up to 5MB'
            : `Max size: ${formatFileSize(maxSize)}`}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : isDragReject
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="text-center">
          <input {...getInputProps()} />
          {renderContent()}
        </div>
      </div>

      {renderPreview()}

      {fileRejections.length > 0 && (
        <ul className="mt-2 text-sm text-red-500">
          {fileRejections.map(({ file, errors }) => (
            <li key={file.path}>
              {errors.map((error) => (
                <p key={error.code}>{error.message}</p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUpload; 