import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';

/**
 * ImageUpload Component
 * Komponen untuk upload gambar dengan preview
 * Mendukung drag & drop dan file selection
 */
const ImageUpload = ({ 
  value = '', 
  onChange, 
  label = 'Upload Gambar',
  accept = 'image/*',
  maxSize = 5, // MB
  className = '',
  showPreview = true,
  multiple = false,
  disabled = false
}) => {
  const [preview, setPreview] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Validate file
  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`Ukuran file maksimal ${maxSize}MB`);
      return false;
    }

    setError('');
    return true;
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      const validFiles = [];
      for (let i = 0; i < files.length; i++) {
        if (validateFile(files[i])) {
          const base64 = await fileToBase64(files[i]);
          validFiles.push(base64);
        }
      }
      if (validFiles.length > 0) {
        onChange(validFiles);
        setPreview(validFiles[0]); // Show first image as preview
      }
    } else {
      const file = files[0];
      if (validateFile(file)) {
        const base64 = await fileToBase64(file);
        setPreview(base64);
        onChange(base64);
      }
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      const validFiles = [];
      for (let i = 0; i < files.length; i++) {
        if (validateFile(files[i])) {
          const base64 = await fileToBase64(files[i]);
          validFiles.push(base64);
        }
      }
      if (validFiles.length > 0) {
        onChange(validFiles);
        setPreview(validFiles[0]);
      }
    } else {
      const file = files[0];
      if (validateFile(file)) {
        const base64 = await fileToBase64(file);
        setPreview(base64);
        onChange(base64);
      }
    }
  };

  // Handle remove image
  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-error bg-error/5'
            : 'border-border bg-surface hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {showPreview && preview ? (
          <div className="relative p-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-6 right-6 p-2 bg-error text-white rounded-full hover:bg-error/90 transition-colors shadow-lg"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Upload" size={32} color="var(--color-primary)" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {isDragging ? 'Lepaskan file di sini' : 'Klik atau drag & drop gambar'}
            </p>
            <p className="text-xs text-muted-foreground">
              Format: JPG, PNG, GIF (Max {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
