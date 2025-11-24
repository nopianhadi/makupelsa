/**
 * Image Compression Utility
 * Mengkompresi gambar untuk mengurangi ukuran file
 */

export const compressImage = (base64String, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64String;
  });
};

export const getBase64Size = (base64String) => {
  if (!base64String) return 0;
  
  // Remove data URL prefix
  const base64 = base64String.split(',')[1] || base64String;
  
  // Calculate size in bytes
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return (base64.length * 3) / 4 - padding;
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const compressImageArray = async (images, maxWidth = 1200, quality = 0.8) => {
  const compressed = [];
  
  for (const image of images) {
    try {
      if (typeof image === 'string') {
        const compressedImage = await compressImage(image, maxWidth, quality);
        compressed.push(compressedImage);
      } else if (image && typeof image === 'object' && image.url) {
        const compressedUrl = await compressImage(image.url, maxWidth, quality);
        compressed.push({ ...image, url: compressedUrl });
      } else {
        compressed.push(image);
      }
    } catch (error) {
      console.error('Error compressing image:', error);
      compressed.push(image); // Keep original if compression fails
    }
  }
  
  return compressed;
};
