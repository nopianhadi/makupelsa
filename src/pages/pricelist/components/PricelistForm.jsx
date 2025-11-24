import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { compressImage } from '../../../utils/imageCompression';

const PricelistForm = ({ pricelist, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: pricelist?.title || '',
    description: pricelist?.description || '',
    whatsappNumber: pricelist?.whatsappNumber || '6281234567890',
    images: pricelist?.images || []
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding these files would exceed limit
    if (formData.images.length + files.length > 20) {
      alert('Maksimal 20 gambar per pricelist');
      return;
    }

    setIsUploading(true);
    try {
      const newImages = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} bukan gambar, dilewati`);
          continue;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} terlalu besar (>5MB), dilewati`);
          continue;
        }

        // Convert file to base64
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Compress image with higher compression for pricelist
        const compressed = await compressImage(base64, 800, 0.6);
        newImages.push(compressed);
      }
      
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImages] 
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar. Coba dengan gambar yang lebih kecil.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Judul harus diisi');
      return;
    }

    if (formData.images.length === 0) {
      alert('Minimal 1 gambar pricelist harus diupload');
      return;
    }

    // Check total size before saving
    const totalSize = formData.images.reduce((acc, img) => {
      const base64 = img.split(',')[1] || img;
      return acc + base64.length;
    }, 0);

    const totalSizeMB = (totalSize * 0.75) / (1024 * 1024); // Approximate MB

    if (totalSizeMB > 3) {
      alert(`Total ukuran gambar terlalu besar (${totalSizeMB.toFixed(1)}MB). Kurangi jumlah gambar atau gunakan gambar dengan ukuran lebih kecil.`);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {pricelist ? 'Edit Pricelist' : 'Tambah Pricelist'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Judul Pricelist *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Paket Wedding 2025"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat tentang pricelist ini..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nomor WhatsApp (untuk kontak)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="6281234567890"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: 62xxx (tanpa +, tanpa spasi, tanpa tanda hubung)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Gambar Pricelist * (Maksimal 20 gambar)
            </label>

            {(() => {
              if (formData.images.length === 0) return null;
              
              const totalSize = formData.images.reduce((acc, img) => {
                const base64 = img.split(',')[1] || img;
                return acc + base64.length;
              }, 0);
              const totalSizeMB = (totalSize * 0.75) / (1024 * 1024);
              
              return (
                <div className={`mb-3 p-2 rounded-lg text-xs flex items-center gap-2 ${
                  totalSizeMB > 2.5 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={totalSizeMB > 2.5 ? 'AlertTriangle' : 'Info'} size={14} />
                  <span>Total ukuran: {totalSizeMB.toFixed(2)}MB / 3MB max</span>
                </div>
              );
            })()}
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3 max-h-96 overflow-y-auto p-2 border border-border rounded-xl">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-border bg-muted"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-md bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-smooth opacity-0 group-hover:opacity-100"
                    >
                      <Icon name="X" size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.images.length < 20 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-smooth"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Icon name="Upload" size={24} color="var(--color-muted-foreground)" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {isUploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  PNG, JPG, JPEG • {formData.images.length}/20 gambar
                </p>
                <p className="text-xs text-warning">
                  ⚠️ Gambar akan dikompres ke 800px, quality 60%
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Mengupload...' : pricelist ? 'Simpan Perubahan' : 'Tambah Pricelist'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricelistForm;
