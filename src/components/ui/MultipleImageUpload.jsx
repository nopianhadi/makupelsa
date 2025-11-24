import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';

/**
 * MultipleImageUpload Component
 * Komponen untuk upload multiple gambar dengan preview grid
 */
const MultipleImageUpload = ({ 
  images = [], // Array of { url: base64, caption: '' }
  onChange, 
  maxImages = 10,
  maxSize = 5, // MB
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Ensure images is always an array with correct format
  const safeImages = React.useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.map(img => {
      if (typeof img === 'string') {
        return { url: img, caption: '' };
      }
      if (img && typeof img === 'object' && img.url) {
        return img;
      }
      return { url: '', caption: '' };
    }).filter(img => img.url);
  }, [images]);

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
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return false;
    }

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

    if (safeImages.length + files.length > maxImages) {
      setError(`Maksimal ${maxImages} gambar`);
      return;
    }

    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        try {
          const base64 = await fileToBase64(files[i]);
          newImages.push({ url: base64, caption: '' });
        } catch (err) {
          console.error('Error converting file to base64:', err);
          setError('Gagal memproses gambar');
        }
      }
    }

    if (newImages.length > 0) {
      onChange([...safeImages, ...newImages]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    if (safeImages.length + files.length > maxImages) {
      setError(`Maksimal ${maxImages} gambar`);
      return;
    }

    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        try {
          const base64 = await fileToBase64(files[i]);
          newImages.push({ url: base64, caption: '' });
        } catch (err) {
          console.error('Error converting file to base64:', err);
          setError('Gagal memproses gambar');
        }
      }
    }

    if (newImages.length > 0) {
      onChange([...safeImages, ...newImages]);
    }
  };

  // Handle remove image
  const handleRemove = (index) => {
    const updated = safeImages.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Handle caption change
  const handleCaptionChange = (index, caption) => {
    const updated = safeImages.map((img, i) => 
      i === index ? { ...img, caption } : img
    );
    onChange(updated);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Gambar Gallery ({safeImages.length}/{maxImages})
      </label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all mb-4 ${
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
        onClick={() => !disabled && safeImages.length < maxImages && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled || safeImages.length >= maxImages}
          className="hidden"
        />

        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Upload" size={24} color="var(--color-primary)" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragging ? 'Lepaskan file di sini' : 'Klik atau drag & drop gambar'}
          </p>
          <p className="text-xs text-muted-foreground">
            Format: JPG, PNG, GIF (Max {maxSize}MB per file)
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-error flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}

      {/* Image Grid */}
      {safeImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {safeImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Icon name="X" size={14} />
                  </button>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <span className="text-xs text-white font-medium">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Caption Input */}
              <input
                type="text"
                value={image.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                placeholder="Caption (opsional)"
                disabled={disabled}
                className="mt-2 w-full px-2 py-1.5 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
