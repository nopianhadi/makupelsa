import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';

const PublicGallery = () => {
  const { publicId } = useParams();
  const [project, setProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProject = dataStore.getProjectByPublicId(publicId);
    setProject(foundProject);
    setLoading(false);
  }, [publicId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project || !project.isPublic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={40} color="var(--color-error)" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Project Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            Project yang Anda cari tidak tersedia atau telah diatur sebagai private.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-smooth"
          >
            <Icon name="Home" size={20} />
            Ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];
  const currentImage = images[currentImageIndex];

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Helmet>
        <title>{project.title} - Gallery</title>
        <meta name="description" content={project.description || `Gallery project: ${project.title}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Image" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">{project.title}</h1>
                  {project.clientName && (
                    <p className="text-sm text-muted-foreground">{project.clientName}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {images.length > 0 ? (
            <div className="mb-8">
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-4">
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

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              </div>

              {currentImage?.caption && (
                <div className="bg-card border border-border rounded-xl p-4 mb-4">
                  <p className="text-foreground">{currentImage.caption}</p>
                </div>
              )}

              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
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
              )}
            </div>
          ) : (
            <div className="bg-muted rounded-2xl aspect-video flex items-center justify-center mb-8">
              <div className="text-center">
                <Icon name="Image" size={48} color="var(--color-muted-foreground)" />
                <p className="mt-2 text-muted-foreground">Tidak ada gambar</p>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Detail Project</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.date && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tanggal</p>
                  <p className="font-medium text-foreground">{formatDate(project.date)}</p>
                </div>
              )}
              
              {project.location && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lokasi</p>
                  <p className="font-medium text-foreground">{project.location}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kategori</p>
                <p className="font-medium text-foreground capitalize">{project.category}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Foto</p>
                <p className="font-medium text-foreground">{images.length} foto</p>
              </div>
            </div>

            {project.description && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Deskripsi</p>
                <p className="text-foreground">{project.description}</p>
              </div>
            )}
          </div>
        </main>

        <footer className="bg-card border-t border-border mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Powered by MUA Finance Manager</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PublicGallery;
