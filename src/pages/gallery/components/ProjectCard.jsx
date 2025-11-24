import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectCard = ({ project, onEdit, onDelete, onCopyLink, onViewDetail }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getCategoryColor = (category) => {
    const colors = {
      wedding: 'bg-secondary/10 text-secondary',
      engagement: 'bg-primary/10 text-primary',
      graduation: 'bg-accent/10 text-accent',
      photoshoot: 'bg-success/10 text-success',
      event: 'bg-warning/10 text-warning',
      other: 'bg-muted text-muted-foreground'
    };
    return colors[category] || colors.other;
  };

  // Placeholder SVG untuk gambar yang tidak ada
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';

  // Safe image access
  const getCoverImage = () => {
    if (!project.images || !Array.isArray(project.images) || project.images.length === 0) {
      return placeholderImage;
    }
    const firstImage = project.images[0];
    if (typeof firstImage === 'string') return firstImage;
    if (firstImage && typeof firstImage === 'object' && firstImage.url) return firstImage.url;
    return placeholderImage;
  };

  const coverImage = getCoverImage();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden elevation-1 hover:elevation-3 transition-smooth">
      <div 
        className="relative h-48 cursor-pointer group"
        onClick={onViewDetail}
      >
        <img
          src={coverImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage Error%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-heading font-bold text-lg line-clamp-1">
            {project.title}
          </h3>
          {project.clientName && (
            <p className="text-white/80 text-sm mt-1">
              {project.clientName}
            </p>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(project.category)}`}>
            {project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : 'Other'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          {project.date && (
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(project.date)}</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={14} />
              <span>{project.location}</span>
            </div>
          )}
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="Image" size={14} />
            <span>{project.images?.length || 0} foto</span>
          </div>

          <div className="flex gap-1">
            {project.isPublic && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyLink(project);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-smooth"
                title="Copy Link"
              >
                <Icon name="Link" size={18} color="var(--color-success)" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
              title="Edit"
            >
              <Icon name="Edit" size={18} color="var(--color-primary)" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
              title="Hapus"
            >
              <Icon name="Trash2" size={18} color="var(--color-error)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
