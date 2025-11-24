import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PackageTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'template_akad_basic',
      name: 'Paket Akad Basic',
      serviceType: 'akad',
      description: 'Paket makeup akad nikah dengan layanan standar untuk pengantin yang menginginkan tampilan natural dan elegan',
      duration: '2-3 jam',
      basePrice: 1500000,
      includedServices: [
        'Makeup pengantin natural',
        'Hairdo sederhana',
        'Paes adat (opsional)',
        'Touch up 1x',
        'Konsultasi makeup'
      ],
      addOns: [
        { name: 'Makeup keluarga', price: 300000 },
        { name: 'Hairdo tambahan', price: 200000 }
      ]
    },
    {
      id: 'template_akad_premium',
      name: 'Paket Akad Premium',
      serviceType: 'akad',
      description: 'Paket makeup akad nikah premium dengan layanan lengkap dan produk high-end untuk tampilan sempurna',
      duration: '3-4 jam',
      basePrice: 3000000,
      originalPrice: 3500000,
      includedServices: [
        'Makeup pengantin premium',
        'Hairdo kompleks',
        'Paes adat lengkap',
        'Touch up unlimited',
        'Konsultasi makeup detail',
        'Trial makeup 1x',
        'Makeup keluarga 2 orang'
      ],
      addOns: [
        { name: 'Makeup keluarga tambahan', price: 250000 },
        { name: 'Dokumentasi makeup', price: 500000 }
      ]
    },
    {
      id: 'template_resepsi_basic',
      name: 'Paket Resepsi Basic',
      serviceType: 'resepsi',
      description: 'Paket makeup resepsi pernikahan dengan layanan standar untuk acara resepsi yang meriah',
      duration: '3-4 jam',
      basePrice: 2000000,
      includedServices: [
        'Makeup pengantin glamour',
        'Hairdo resepsi',
        'Ganti makeup 1x',
        'Touch up 2x',
        'Konsultasi tema'
      ],
      addOns: [
        { name: 'Ganti makeup tambahan', price: 500000 },
        { name: 'Makeup bridesmaid', price: 400000 }
      ]
    },
    {
      id: 'template_resepsi_premium',
      name: 'Paket Resepsi Premium',
      serviceType: 'resepsi',
      description: 'Paket makeup resepsi premium dengan multiple looks dan layanan VIP untuk acara resepsi mewah',
      duration: '5-6 jam',
      basePrice: 4500000,
      originalPrice: 5000000,
      includedServices: [
        'Makeup pengantin premium',
        'Hairdo kompleks resepsi',
        'Ganti makeup 2x',
        'Touch up unlimited',
        'Konsultasi tema detail',
        'Trial makeup 2x',
        'Makeup keluarga 3 orang',
        'Asisten makeup'
      ],
      addOns: [
        { name: 'Ganti makeup tambahan', price: 400000 },
        { name: 'Makeup bridesmaid per orang', price: 350000 }
      ]
    },
    {
      id: 'template_wisuda_basic',
      name: 'Paket Wisuda Basic',
      serviceType: 'wisuda',
      description: 'Paket makeup wisuda dengan tampilan fresh dan natural untuk momen kelulusan yang berkesan',
      duration: '1-2 jam',
      basePrice: 500000,
      includedServices: [
        'Makeup wisuda natural',
        'Hairdo simple',
        'Touch up 1x',
        'Konsultasi warna'
      ],
      addOns: [
        { name: 'Hairdo kompleks', price: 150000 },
        { name: 'False lashes premium', price: 100000 }
      ]
    },
    {
      id: 'template_wisuda_premium',
      name: 'Paket Wisuda Premium',
      serviceType: 'wisuda',
      description: 'Paket makeup wisuda premium dengan tampilan flawless dan tahan lama untuk sesi foto profesional',
      duration: '2-3 jam',
      basePrice: 800000,
      originalPrice: 1000000,
      includedServices: [
        'Makeup wisuda premium',
        'Hairdo kompleks',
        'Touch up 2x',
        'Konsultasi lengkap',
        'False lashes premium',
        'Setting spray professional'
      ],
      addOns: [
        { name: 'Makeup keluarga', price: 300000 },
        { name: 'Dokumentasi makeup', price: 400000 }
      ]
    }
  ];

  const serviceTypeConfig = {
    akad: {
      label: 'Akad',
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      icon: 'Heart'
    },
    resepsi: {
      label: 'Resepsi',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      icon: 'Sparkles'
    },
    wisuda: {
      label: 'Wisuda',
      color: 'accent',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      icon: 'GraduationCap'
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Sparkles" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-heading font-bold text-foreground">
          Template Paket
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => {
          const config = serviceTypeConfig?.[template?.serviceType];
          
          return (
            <div
              key={template?.id}
              className="bg-card border border-border rounded-lg overflow-hidden elevation-1 hover:elevation-3 transition-smooth"
            >
              <div className={`p-4 ${config?.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={config?.icon} size={18} color={`var(--color-${config?.color})`} />
                  <span className={`text-xs font-medium font-caption ${config?.textColor}`}>
                    {config?.label}
                  </span>
                </div>
                <h4 className="text-base font-heading font-bold text-foreground mb-1">
                  {template?.name}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template?.description}
                </p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-heading font-bold text-foreground">
                    {formatCurrency(template?.basePrice)}
                  </span>
                  {template?.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(template?.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>{template?.duration}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-caption font-semibold text-foreground uppercase tracking-wide">
                    Termasuk
                  </p>
                  {template?.includedServices?.slice(0, 3)?.map((service, index) => (
                    <div key={index} className="flex items-start gap-1.5">
                      <Icon name="Check" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-foreground">{service}</span>
                    </div>
                  ))}
                  {template?.includedServices?.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{template?.includedServices?.length - 3} layanan lainnya
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => onSelectTemplate(template)}
                  fullWidth
                >
                  Gunakan Template
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackageTemplates;