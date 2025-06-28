import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The path within the bucket (e.g., 'universities/logos/')
 * @returns {Promise<{path: string, error: Error|null}>}
 */
export async function uploadFile(file, bucket, path = '') {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { path: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { path: null, error };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} path - The full path of the file to delete
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<{error: Error|null}>}
 */
export async function deleteFile(path, bucket) {
  try {
    // Extract the file path from the public URL
    const urlPath = new URL(path);
    const filePath = urlPath.pathname.split(`/storage/v1/object/public/${bucket}/`)[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error };
  }
}

/**
 * Resize an image before upload
 * @param {File} file - The image file to resize
 * @param {number} maxWidth - Maximum width of the resized image
 * @param {number} maxHeight - Maximum height of the resized image
 * @returns {Promise<Blob>}
 */
export async function resizeImage(file, maxWidth = 1200, maxHeight = 1200) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type);
      };
    };
  });
}

/**
 * Create a preview URL for a file
 * @param {File} file - The file to create a preview for
 * @returns {Promise<string>}
 */
export function createFilePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if a file is an image
 * @param {File} file - The file to check
 * @returns {boolean}
 */
export function isImageFile(file) {
  return file.type.startsWith('image/');
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 