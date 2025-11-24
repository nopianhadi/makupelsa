import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PublicPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }

    // Load packages from localStorage
    const savedPackages = localStorage.getItem('service_packages');
    let loadedPackages = [];
    
    if (savedPackages) {
      try {
        const parsed = JSON.parse(savedPackages);
        loadedPackages = parsed.filter(pkg => pkg.isActive);
      } catch (e) {
        console.error('Error parsing packages:', e);
      }
    }
    
    // If no packages in localStorage, use mock data
    if (loadedPackages.length === 0) {
      loadedPackages = [
        {
          id: 'pkg_001',
          name: 'Paket Akad Nikah Premium',
          serviceType: 'akad',
          description: 'Paket makeup akad nikah lengkap dengan hairdo dan paes adat untuk pengantin yang menginginkan tampilan elegan dan natural',
          duration: '3-4 jam',
          basePrice: 2500000,
          originalPrice: 3000000,
          includedServices: [
            'Makeup pengantin natural & elegan',
            'Hairdo pengantin dengan aksesoris',
            'Paes adat Jawa/Sunda',
            'Touch up makeup 2x',
            'Konsultasi makeup pre-wedding',
            'Trial makeup 1x'
          ],
          addOns: [
            { name: 'Makeup keluarga per orang', price: 300000 },
            { name: 'Hairdo tambahan', price: 200000 }
          ],
          isActive: true
        },
        {
          id: 'pkg_002',
          name: 'Paket Resepsi Glamour',
          serviceType: 'resepsi',
          description: 'Paket makeup resepsi dengan tampilan glamour dan mewah',
          duration: '5-6 jam',
          basePrice: 4000000,
          originalPrice: 4500000,
          includedServices: [
            'Makeup pengantin glamour',
            'Hairdo kompleks dengan sanggul modern',
            'Ganti makeup 1x',
            'Touch up unlimited',
            'Trial makeup 2x'
          ],
          isActive: true
        },
        {
          id: 'pkg_003',
          name: 'Paket Wisuda Fresh & Natural',
          serviceType: 'wisuda',
          description: 'Paket makeup wisuda dengan tampilan fresh dan natural',
          duration: '1.5-2 jam',
          basePrice: 600000,
          originalPrice: 750000,
          includedServices: [
            'Makeup wisuda natural & fresh',
            'Hairdo simple & rapi',
            'Touch up 1x',
            'False lashes natural'
          ],
          isActive: true
        }
      ];
    }
    
    setPackages(loadedPackages);
  }, []);

  const serviceTypeLabels = {
    akad: 'Akad',
    resepsi: 'Resepsi',
    wisuda: 'Wisuda',
    lamaran: 'Lamaran',
    engagement: 'Engagement',
    photoshoot: 'Photoshoot'
  };

  const filteredPackages = filterType 
    ? packages.filter(pkg => pkg.serviceType === filterType)
    : packages;

  const serviceTypes = [...new Set(packages.map(pkg => pkg.serviceType))];

  const handleBookNow = (pkg) => {
    navigate('/booking/public', { 
      state: { 
        selectedPackage: pkg,
        serviceType: pkg.serviceType 
      } 
    });
  };

  return (
    <>
      <Helmet>
        <title>Paket Layanan - {profileData?.name || 'MUA Finance Manager'}</title>
        <meta name="description" content="Lihat paket layanan makeup yang tersedia dan lakukan booking" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {profileData?.logoUrl && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <img 
                    src={profileData.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
                  {profileData?.name || 'Paket Layanan Kami'}
                </h1>
                <p className="text-muted-foreground mb-3">
                  Pilih paket yang sesuai dengan kebutuhan Anda
                </p>
                {profileData?.contact && (
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-sm">
                    <a 
                      href={`https://wa.me/${profileData.contact.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-success hover:text-success/80 transition-smooth"
                    >
                      <Icon name="Phone" size={16} />
                      <span>{profileData.contact}</span>
                    </a>
                    {profileData.instagram && (
                      <a 
                        href={`https://instagram.com/${profileData.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth"
                      >
                        <Icon name="Instagram" size={16} />
                        <span>{profileData.instagram}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('')}
              className={`px-4 py-2 rounded-xl font-medium transition-smooth ${
                filterType === '' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              Semua Paket
            </button>
            {serviceTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl font-medium transition-smooth ${
                  filterType === type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                {serviceTypeLabels[type] || type}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Icon name="Package" size={40} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Belum Ada Paket Tersedia
              </h3>
              <p className="text-muted-foreground">
                Silakan hubungi kami untuk informasi lebih lanjut
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-smooth"
                >
                  {/* Package Header */}
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 border-b border-border">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                        {serviceTypeLabels[pkg.serviceType] || pkg.serviceType}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.basePrice && (
                        <span className="px-3 py-1 bg-success/20 text-success text-xs font-medium rounded-full">
                          Hemat {Math.round((1 - pkg.basePrice / pkg.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Package Body */}
                  <div className="p-6">
                    {/* Duration */}
                    {pkg.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Icon name="Clock" size={16} />
                        <span>Durasi: {pkg.duration}</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {pkg.originalPrice && pkg.originalPrice > pkg.basePrice && (
                        <p className="text-sm text-muted-foreground line-through mb-1">
                          {new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR',
                            minimumFractionDigits: 0 
                          }).format(pkg.originalPrice)}
                        </p>
                      )}
                      <p className="text-3xl font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(pkg.basePrice)}
                      </p>
                    </div>

                    {/* Included Services */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                        Termasuk:
                      </h4>
                      <ul className="space-y-2">
                        {pkg.includedServices?.slice(0, 4).map((service, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Icon name="Check" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
                            <span>{service}</span>
                          </li>
                        ))}
                        {pkg.includedServices?.length > 4 && (
                          <li className="text-sm text-primary font-medium">
                            +{pkg.includedServices.length - 4} layanan lainnya
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Add-ons */}
                    {pkg.addOns && pkg.addOns.length > 0 && (
                      <div className="mb-6 p-3 bg-muted/50 rounded-xl">
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Icon name="Plus" size={14} />
                          Tambahan Opsional:
                        </h4>
                        <ul className="space-y-1">
                          {pkg.addOns.slice(0, 2).map((addon, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex justify-between">
                              <span>{addon.name}</span>
                              <span className="font-medium">
                                +{new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR',
                                  minimumFractionDigits: 0 
                                }).format(addon.price)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      variant="primary"
                      className="w-full"
                      iconName="Calendar"
                      iconPosition="left"
                      onClick={() => handleBookNow(pkg)}
                    >
                      Booking Sekarang
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Punya pertanyaan? Hubungi kami untuk konsultasi gratis
            </p>
            {profileData?.contact && (
              <a
                href={`https://wa.me/${profileData.contact.replace(/^0/, '62')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                  Chat WhatsApp
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicPackages;
