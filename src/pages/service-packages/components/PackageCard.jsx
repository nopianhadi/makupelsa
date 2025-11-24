import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const PackageCard = ({ 
  packageData, 
  onEdit, 
  onDuplicate, 
  onToggleActive,
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const serviceTypeConfig = {
    akad: {
      label: 'Akad',
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    resepsi: {
      label: 'Resepsi',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/20'
    },
    wisuda: {
      label: 'Wisuda',
      color: 'accent',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      borderColor: 'border-accent/20'
    }
  };

  const config = serviceTypeConfig?.[packageData?.serviceType] || serviceTypeConfig?.akad;

  return (
    <div className={`
      bg-card border border-border rounded-lg overflow-hidden
      elevation-1 hover:elevation-3 transition-smooth
    `}>
      {/* Header */}
      <div className={`p-4 ${config?.bgColor} border-b ${config?.borderColor}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                text-xs font-medium font-caption
                ${config?.bgColor} ${config?.textColor}
              `}>
                {config?.label}
              </span>
              {!packageData?.isActive && (
                <span className="
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                  text-xs font-medium font-caption
                  bg-muted text-muted-foreground
                ">
                  Nonaktif
                </span>
              )}
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-1">
              {packageData?.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {packageData?.description}
            </p>
          </div>
          
          <button
            onClick={() => onToggleActive(packageData?.id)}
            className={`
              flex items-center justify-center w-12 h-6 rounded-full
              transition-smooth relative
              ${packageData?.isActive 
                ? 'bg-success' :'bg-muted'
              }
            `}
            aria-label={packageData?.isActive ? 'Nonaktifkan paket' : 'Aktifkan paket'}
          >
            <span className={`
              absolute w-5 h-5 bg-white rounded-full elevation-3
              transition-smooth
              ${packageData?.isActive ? 'right-0.5' : 'left-0.5'}
            `} />
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-heading font-bold text-foreground">
            {formatCurrency(packageData?.basePrice)}
          </span>
          {packageData?.originalPrice && packageData?.originalPrice > packageData?.basePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(packageData?.originalPrice)}
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{packageData?.duration}</span>
        </div>

        {/* Included Services Preview */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-caption font-semibold text-foreground uppercase tracking-wide">
            Layanan Termasuk
          </p>
          <div className="space-y-1.5">
            {packageData?.includedServices?.slice(0, isExpanded ? undefined : 3)?.map((service, index) => (
              <div key={index} className="flex items-start gap-2">
                <Icon 
                  name="CheckCircle2" 
                  size={16} 
                  color="var(--color-success)" 
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-foreground">{service}</span>
              </div>
            ))}
          </div>
          
          {packageData?.includedServices?.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              {isExpanded 
                ? 'Tampilkan Lebih Sedikit' 
                : `+${packageData?.includedServices?.length - 3} Layanan Lainnya`
              }
            </button>
          )}
        </div>

        {/* Add-ons Badge */}
        {packageData?.addOns && packageData?.addOns?.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 rounded-md bg-surface">
            <Icon name="Plus" size={14} color="var(--color-muted-foreground)" />
            <span className="text-xs text-muted-foreground">
              {packageData?.addOns?.length} Add-on Tersedia
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs font-caption text-muted-foreground mb-1">Total Booking</p>
            <p className="text-lg font-heading font-bold text-foreground">
              {packageData?.totalBookings || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-caption text-muted-foreground mb-1">Pendapatan</p>
            <p className="text-lg font-heading font-bold text-success">
              {formatCurrency(packageData?.totalRevenue || 0)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(packageData)}
            fullWidth
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            onClick={() => onDuplicate(packageData)}
            className="flex-shrink-0"
            aria-label="Duplikat paket"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={() => onDelete(packageData?.id)}
            className="flex-shrink-0 text-error hover:text-error"
            aria-label="Hapus paket"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageCard;