import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MultipleImageUpload from '../../../components/ui/MultipleImageUpload';
import { compressImageArray } from '../../../utils/imageCompression';

const ProjectForm = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    clientName: project?.clientName || '',
    category: project?.category || 'wedding',
    date: project?.date || '',
    location: project?.location || '',
    description: project?.description || '',
    images: project?.images || [],
    isPublic: project?.isPublic ?? true
  });
  const [isCompressing, setIsCompressing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Compress images before saving
    if (formData.images && formData.images.length > 0) {
      setIsCompressing(true);
      try {
        const compressedImages = await compressImageArray(formData.images, 1200, 0.7);
        onSave({ ...formData, images: compressedImages });
      } catch (error) {
        console.error('Error compressing images:', error);
        alert('Gagal mengkompresi gambar. Coba dengan gambar yang lebih kecil.');
      } finally {
        setIsCompressing(false);
      }
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImagesChange = (images) => {
    setFormData({
      ...formData,
      images: images
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {project ? 'Edit Project' : 'Project Baru'}
          </h2>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Judul Project *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Wedding Siti & Budi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nama Klien
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="wedding">Wedding</option>
                <option value="engagement">Engagement</option>
                <option value="graduation">Graduation</option>
                <option value="photoshoot">Photoshoot</option>
                <option value="event">Event</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Ceritakan tentang project ini..."
            />
          </div>

          <MultipleImageUpload
            images={formData.images}
            onChange={handleImagesChange}
            maxImages={20}
            maxSize={5}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="isPublic" className="text-sm text-foreground">
              Izinkan akses publik (project bisa dilihat siapa saja via link)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isCompressing}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={isCompressing}>
              {isCompressing ? 'Mengkompresi gambar...' : 'Simpan Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
