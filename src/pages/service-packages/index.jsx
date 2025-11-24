import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import QuickActionButton from '../../components/ui/QuickActionButton';
import PackageCard from './components/PackageCard';
import PackageFormModal from './components/PackageFormModal';
import PackageTemplates from './components/PackageTemplates';
import PackageStats from './components/PackageStats';

const ServicePackages = () => {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    const mockPackages = [
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
          { name: 'Hairdo tambahan', price: 200000 },
          { name: 'Dokumentasi proses makeup', price: 500000 }
        ],
        travelFee: 200000,
        groupDiscount: 10,
        locationPricing: true,
        isActive: true,
        totalBookings: 24,
        totalRevenue: 60000000
      },
      {
        id: 'pkg_002',
        name: 'Paket Resepsi Glamour',
        serviceType: 'resepsi',
        description: 'Paket makeup resepsi dengan tampilan glamour dan mewah, termasuk ganti makeup untuk acara resepsi yang meriah',
        duration: '5-6 jam',
        basePrice: 4000000,
        originalPrice: 4500000,
        includedServices: [
          'Makeup pengantin glamour',
          'Hairdo kompleks dengan sanggul modern',
          'Ganti makeup 1x (dari akad ke resepsi)',
          'Touch up unlimited',
          'Konsultasi tema & warna',
          'Trial makeup 2x',
          'Makeup keluarga 2 orang'
        ],
        addOns: [
          { name: 'Ganti makeup tambahan', price: 500000 },
          { name: 'Makeup bridesmaid per orang', price: 400000 },
          { name: 'Asisten makeup tambahan', price: 800000 }
        ],
        travelFee: 300000,
        groupDiscount: 15,
        locationPricing: true,
        isActive: true,
        totalBookings: 18,
        totalRevenue: 72000000
      },
      {
        id: 'pkg_003',
        name: 'Paket Wisuda Fresh & Natural',
        serviceType: 'wisuda',
        description: 'Paket makeup wisuda dengan tampilan fresh dan natural yang tahan lama untuk momen kelulusan yang berkesan',
        duration: '1.5-2 jam',
        basePrice: 600000,
        originalPrice: 750000,
        includedServices: [
          'Makeup wisuda natural & fresh',
          'Hairdo simple & rapi',
          'Touch up 1x',
          'Konsultasi warna makeup',
          'False lashes natural'
        ],
        addOns: [
          { name: 'Hairdo kompleks', price: 150000 },
          { name: 'Makeup keluarga', price: 300000 },
          { name: 'False lashes premium', price: 100000 }
        ],
        travelFee: 100000,
        groupDiscount: 20,
        locationPricing: false,
        isActive: true,
        totalBookings: 45,
        totalRevenue: 27000000
      },
      {
        id: 'pkg_004',
        name: 'Paket Akad Simple',
        serviceType: 'akad',
        description: 'Paket makeup akad nikah dengan layanan standar untuk pengantin yang menginginkan tampilan simple namun tetap cantik',
        duration: '2-3 jam',
        basePrice: 1500000,
        includedServices: [
          'Makeup pengantin natural',
          'Hairdo sederhana',
          'Paes adat basic',
          'Touch up 1x',
          'Konsultasi makeup'
        ],
        addOns: [
          { name: 'Makeup keluarga', price: 250000 },
          { name: 'Trial makeup', price: 300000 }
        ],
        travelFee: 150000,
        groupDiscount: 5,
        locationPricing: false,
        isActive: true,
        totalBookings: 32,
        totalRevenue: 48000000
      },
      {
        id: 'pkg_005',
        name: 'Paket Resepsi Basic',
        serviceType: 'resepsi',
        description: 'Paket makeup resepsi dengan layanan standar untuk acara resepsi yang sederhana namun tetap elegan',
        duration: '3-4 jam',
        basePrice: 2000000,
        includedServices: [
          'Makeup pengantin resepsi',
          'Hairdo resepsi',
          'Touch up 2x',
          'Konsultasi tema'
        ],
        addOns: [
          { name: 'Ganti makeup', price: 400000 },
          { name: 'Makeup bridesmaid', price: 350000 }
        ],
        travelFee: 200000,
        groupDiscount: 10,
        locationPricing: false,
        isActive: false,
        totalBookings: 12,
        totalRevenue: 24000000
      },
      {
        id: 'pkg_006',
        name: 'Paket Wisuda Premium',
        serviceType: 'wisuda',
        description: 'Paket makeup wisuda premium dengan tampilan flawless dan tahan lama untuk sesi foto profesional',
        duration: '2-3 jam',
        basePrice: 900000,
        originalPrice: 1100000,
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
        ],
        travelFee: 150000,
        groupDiscount: 15,
        locationPricing: false,
        isActive: true,
        totalBookings: 28,
        totalRevenue: 25200000
      }
    ];

    setPackages(mockPackages);
  }, []);

  const handleCreatePackage = () => {
    setEditingPackage(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditPackage = (packageData) => {
    setEditingPackage(packageData);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicatePackage = (packageData) => {
    const duplicatedPackage = {
      ...packageData,
      id: `pkg_${Date.now()}`,
      name: `${packageData?.name} (Salinan)`,
      totalBookings: 0,
      totalRevenue: 0
    };
    setPackages(prev => [...prev, duplicatedPackage]);
  };

  const handleToggleActive = (packageId) => {
    setPackages(prev => prev?.map(pkg => 
      pkg?.id === packageId 
        ? { ...pkg, isActive: !pkg?.isActive }
        : pkg
    ));
  };

  const handleDeletePackage = (packageId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      setPackages(prev => prev?.filter(pkg => pkg?.id !== packageId));
    }
  };

  const handleSavePackage = (packageData) => {
    if (modalMode === 'edit') {
      setPackages(prev => prev?.map(pkg => 
        pkg?.id === packageData?.id ? packageData : pkg
      ));
    } else {
      setPackages(prev => [...prev, packageData]);
    }
  };

  const handleSelectTemplate = (template) => {
    setEditingPackage(template);
    setModalMode('create');
    setIsModalOpen(true);
    setShowTemplates(false);
  };

  const filterTypeOptions = [
    { value: '', label: 'Semua Jenis' },
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' }
  ];

  const filterStatusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'price_high', label: 'Harga Tertinggi' },
    { value: 'price_low', label: 'Harga Terendah' },
    { value: 'popular', label: 'Terpopuler' }
  ];

  const getFilteredAndSortedPackages = () => {
    let filtered = [...packages];

    if (filterType) {
      filtered = filtered?.filter(pkg => pkg?.serviceType === filterType);
    }

    if (filterStatus === 'active') {
      filtered = filtered?.filter(pkg => pkg?.isActive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered?.filter(pkg => !pkg?.isActive);
    }

    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b?.id?.localeCompare(a?.id);
        case 'oldest':
          return a?.id?.localeCompare(b?.id);
        case 'price_high':
          return b?.basePrice - a?.basePrice;
        case 'price_low':
          return a?.basePrice - b?.basePrice;
        case 'popular':
          return (b?.totalBookings || 0) - (a?.totalBookings || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredPackages = getFilteredAndSortedPackages();

  return (
    <>
      <Helmet>
        <title>Paket Layanan - MUA Finance Manager</title>
        <meta name="description" content="Kelola paket layanan makeup untuk Akad, Resepsi, dan Wisuda dengan harga dan detail lengkap" />
      </Helmet>
      <div className="min-h-screen bg-background">

        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Package" size={24} color="var(--color-primary)" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  Paket Layanan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola paket layanan makeup Anda
                </p>
              </div>
            </div>
          </div>

          {/* Public Link Info Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Share2" size={24} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-heading font-semibold text-foreground mb-1">
                  Bagikan Paket Layanan ke Klien
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Klien dapat melihat semua paket layanan dan langsung melakukan booking melalui link publik
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={`${window.location.origin}/packages/public`}
                      readOnly
                      className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background/50 text-foreground text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/packages/public`);
                        alert('Link berhasil disalin!');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-md transition-smooth"
                      title="Salin link"
                    >
                      <Icon name="Copy" size={16} color="var(--color-primary)" />
                    </button>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="ExternalLink"
                    iconPosition="left"
                    onClick={() => window.open('/packages/public', '_blank')}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <PackageStats packages={packages} />

          {/* Actions & Filters */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <QuickActionButton
                label="Buat Paket Baru"
                icon="Plus"
                variant="primary"
                onClick={handleCreatePackage}
              />
              <Button
                variant="outline"
                iconName="Sparkles"
                iconPosition="left"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                {showTemplates ? 'Sembunyikan Template' : 'Lihat Template'}
              </Button>
              <Button
                variant="outline"
                iconName="Link"
                iconPosition="left"
                onClick={() => {
                  const publicLink = `${window.location.origin}/packages/public`;
                  navigator.clipboard.writeText(publicLink);
                  alert('Link paket publik berhasil disalin!\n\nBagikan link ini kepada klien agar mereka bisa melihat dan memilih paket layanan.');
                }}
              >
                Copy Link Publik
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                options={filterTypeOptions}
                value={filterType}
                onChange={setFilterType}
                placeholder="Filter Jenis"
              />
              <Select
                options={filterStatusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Filter Status"
              />
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Urutkan"
              />
            </div>
          </div>

          {/* Templates Section */}
          {showTemplates && (
            <div className="mt-6 p-6 bg-surface rounded-lg border border-border">
              <PackageTemplates onSelectTemplate={handleSelectTemplate} />
            </div>
          )}

          {/* Packages Grid */}
          <div className="mt-6">
            {filteredPackages?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Package" size={32} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  Belum Ada Paket
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mulai dengan membuat paket layanan pertama Anda
                </p>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleCreatePackage}
                >
                  Buat Paket Pertama
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages?.map((packageData) => (
                  <PackageCard
                    key={packageData?.id}
                    packageData={packageData}
                    onEdit={handleEditPackage}
                    onDuplicate={handleDuplicatePackage}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeletePackage}
                  />
                ))}
              </div>
            )}
          </div>
        </main>


        <PackageFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPackage(null);
          }}
          onSave={handleSavePackage}
          editingPackage={editingPackage}
          mode={modalMode}
        />
      </div>
    </>
  );
};

export default ServicePackages;