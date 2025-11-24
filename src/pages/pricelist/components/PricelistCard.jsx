import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricelistCard = ({ pricelist, onEdit, onDelete, onCopyLink }) => {
  const images = pricelist.images || (pricelist.image ? [pricelist.image] : []);
  
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-smooth">
      <div className="relative aspect-[4/3] bg-muted">
        {images.length > 0 ? (
          <>
            <img
              src={images[0]}
              alt={pricelist.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-1">
                <Icon name="Image" size={12} />
                <span>{images.length} foto</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="DollarSign" size={48} color="var(--color-muted-foreground)" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
          {pricelist.title}
        </h3>
        
        {pricelist.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {pricelist.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>{new Date(pricelist.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Link"
            onClick={() => onCopyLink(pricelist)}
            className="flex-1"
          >
            Salin Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            onClick={() => onEdit(pricelist)}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Trash2"
            onClick={() => onDelete(pricelist.id)}
            className="text-destructive hover:text-destructive"
          />
        </div>
      </div>
    </div>
  );
};

export default PricelistCard;
