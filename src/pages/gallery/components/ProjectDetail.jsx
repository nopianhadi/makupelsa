import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectDetail = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  // Safe images handling
  const images = React.useMemo(() => {
    if (!project.images || !Array.isArray(project.images)) return [];
    return project.images.map(img => {
      if (typeof img === 'string') return { url: img, caption: '' };
      if (img && typeof img === 'object' && img.url) return img;
      return { url: '', caption: '' };
    }).filter(img => img.url);
  }, [project.images]);

  const currentImage = images[currentImageIndex] || { url: '', caption: '' };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            {project.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-smooth"
          >
            <Icon name="X" size={24} color="white" />
          </button>
        </div>

        <div className="bg-card rounded-2xl overflow-hidden">
          {images.length > 0 ? (
            <>
              <div className="relative bg-black aspect-video">
                <img
                  src={currentImage?.url}
                  alt={currentImage?.caption || `Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImage Error%3C/text%3E%3C/svg%3E';
                  }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-smooth"
                    >
                      <Icon name="ChevronLeft" size={24} color="white" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-smooth"
                    >
                      <Icon name="ChevronRight" size={24} color="white" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-smooth ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {currentImage?.caption && (
                <div className="px-6 py-3 bg-muted">
                  <p className="text-sm text-foreground">{currentImage.caption}</p>
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center">
                <Icon name="Image" size={48} color="var(--color-muted-foreground)" />
                <p className="mt-2 text-muted-foreground">Tidak ada gambar</p>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {project.clientName && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Klien</p>
                  <p className="text-sm font-medium text-foreground">{project.clientName}</p>
                </div>
              )}
              
              {project.date && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(project.date)}</p>
                </div>
              )}
              
              {project.location && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lokasi</p>
                  <p className="text-sm font-medium text-foreground">{project.location}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                <p className="text-sm font-medium text-foreground capitalize">{project.category}</p>
              </div>
            </div>

            {project.description && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Deskripsi</p>
                <p className="text-sm text-foreground">{project.description}</p>
              </div>
            )}

            {images.length > 1 && (
              <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-3">Semua Foto ({images.length})</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
