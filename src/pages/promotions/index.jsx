import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import QuickActionButton from '../../components/ui/QuickActionButton';
import AddPromotionModal from './components/AddPromotionModal';
import { dataStore } from '../../utils/dataStore';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' atau 'expired'

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = () => {
    const stored = dataStore.getPromotions();
    if (stored.length === 0) {
      // Initial mock data
      const mockPromotions = [
        {
          title: "Diskon 20% Paket Akad",
          description: "Dapatkan diskon 20% untuk semua paket akad nikah",
          discountType: "percentage",
          discountValue: 20,
          code: "AKAD20",
          startDate: "2025-11-01",
          endDate: "2025-12-31",
          isActive: true,
          maxUsage: 50,
          minPurchase: 2000000,
          applicableServices: ["akad"]
        },
        {
          title: "Cashback Rp 500.000",
          description: "Cashback untuk paket resepsi di atas Rp 5 juta",
          discountType: "fixed",
          discountValue: 500000,
          code: "RESEPSI500",
          startDate: "2025-11-15",
          endDate: "2025-12-15",
          isActive: true,
          maxUsage: 30,
          minPurchase: 5000000,
          applicableServices: ["resepsi"]
        }
      ];
      mockPromotions.forEach(promo => dataStore.addPromotion(promo));
      setPromotions(dataStore.getPromotions());
    } else {
      setPromotions(stored);
    }
  };

  const handleSavePromotion = (promoData) => {
    if (editingPromo) {
      dataStore.updatePromotion(editingPromo.id, promoData);
    } else {
      dataStore.addPromotion(promoData);
    }
    loadPromotions();
    setEditingPromo(null);
  };

  const handleDeletePromotion = (id) => {
    if (confirm('Yakin ingin menghapus promo ini?')) {
      dataStore.deletePromotion(id);
      loadPromotions();
    }
  };

  const handleToggleActive = (id, currentStatus) => {
    dataStore.updatePromotion(id, { isActive: !currentStatus });
    loadPromotions();
  };

  const activePromotions = promotions.filter(p => {
    const today = new Date();
    const endDate = new Date(p.endDate);
    return p.isActive && endDate >= today;
  });

  const expiredPromotions = promotions.filter(p => {
    const today = new Date();
    const endDate = new Date(p.endDate);
    return !p.isActive || endDate < today;
  });

  return (
    <>
      <Helmet>
        <title>Manajemen Promo - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Manajemen Promo
              </h1>
              <QuickActionButton
                label="Buat Promo"
                icon="Plus"
                variant="primary"
                onClick={() => {
                  setEditingPromo(null);
                  setIsAddModalOpen(true);
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Kelola promo dan diskon untuk menarik lebih banyak klien
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-border">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                Promo Aktif ({activePromotions.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expired'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                Promo Berakhir ({expiredPromotions.length})
              </button>
            </div>
          </div>

          {/* Promo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTab === 'active' ? activePromotions : expiredPromotions).map(promo => (
              <div key={promo.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{promo.title}</h3>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  </div>
                  <Icon name="Tag" size={20} color="var(--color-primary)" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kode:</span>
                    <span className="font-mono font-semibold text-primary">{promo.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Diskon:</span>
                    <span className="font-semibold">
                      {promo.discountType === 'percentage' 
                        ? `${promo.discountValue}%` 
                        : `Rp ${promo.discountValue.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Digunakan:</span>
                    <span>{promo.usageCount} / {promo.maxUsage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Berlaku:</span>
                    <span>{new Date(promo.startDate).toLocaleDateString('id-ID')} - {new Date(promo.endDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingPromo(promo);
                      setIsAddModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleToggleActive(promo.id, promo.isActive)}
                    className="px-3 py-2 bg-amber-600 text-white rounded-md text-sm font-medium"
                  >
                    {promo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button 
                    onClick={() => handleDeletePromotion(promo.id)}
                    className="px-3 py-2 bg-error text-white rounded-md text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <AddPromotionModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingPromo(null);
          }}
          onSave={handleSavePromotion}
          editData={editingPromo}
        />
      </div>
    </>
  );
};

export default Promotions;
