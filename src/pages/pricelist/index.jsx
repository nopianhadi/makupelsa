import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { dataStore } from '../../utils/dataStore';
import PricelistCard from './components/PricelistCard';
import PricelistForm from './components/PricelistForm';

const Pricelist = () => {
  const [pricelists, setPricelists] = useState([]);
  const [filteredPricelists, setFilteredPricelists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPricelist, setEditingPricelist] = useState(null);

  useEffect(() => {
    loadPricelists();
  }, []);

  useEffect(() => {
    filterPricelists();
  }, [pricelists, searchQuery]);

  const loadPricelists = () => {
    const allPricelists = dataStore.getPricelists();
    setPricelists(allPricelists);
  };

  const filterPricelists = () => {
    let filtered = [...pricelists];

    if (searchQuery) {
      filtered = filtered.filter(pricelist =>
        pricelist.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pricelist.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPricelists(filtered);
  };

  const handleAddPricelist = () => {
    setEditingPricelist(null);
    setShowForm(true);
  };

  const handleEditPricelist = (pricelist) => {
    setEditingPricelist(pricelist);
    setShowForm(true);
  };

  const handleDeletePricelist = (pricelistId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pricelist ini?')) {
      dataStore.deletePricelist(pricelistId);
      loadPricelists();
    }
  };

  const handleSavePricelist = (pricelistData) => {
    if (editingPricelist) {
      dataStore.updatePricelist(editingPricelist.id, pricelistData);
    } else {
      dataStore.addPricelist(pricelistData);
    }
    setShowForm(false);
    setEditingPricelist(null);
    loadPricelists();
  };

  const handleCopyLink = (pricelist) => {
    if (pricelist.publicId) {
      const link = `${window.location.origin}/pricelist/public/${pricelist.publicId}`;
      navigator.clipboard.writeText(link);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <>
      <Helmet>
        <title>Pricelist - MUA Finance Manager</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="DollarSign" size={24} color="var(--color-primary)" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  Pricelist Gallery
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola dan bagikan daftar harga layanan Anda
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 mb-6">
            {(() => {
              const storageInfo = dataStore.getStorageInfo();
              if (storageInfo.percentage > 80) {
                return (
                  <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-2">
                    <Icon name="AlertTriangle" size={18} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-warning">Penyimpanan hampir penuh ({storageInfo.percentage}%)</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Tersisa {storageInfo.availableMB}MB. Hapus pricelist lama atau gunakan gambar lebih kecil.
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari pricelist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button
                variant="default"
                size="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddPricelist}
                className="w-full sm:w-auto"
              >
                Tambah Pricelist
              </Button>
            </div>
          </div>

          {filteredPricelists.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="DollarSign" size={40} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'Tidak ada pricelist ditemukan' : 'Belum ada pricelist'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Coba ubah kata kunci pencarian'
                  : 'Mulai tambahkan daftar harga layanan Anda'}
              </p>
              {!searchQuery && (
                <Button
                  variant="default"
                  size="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddPricelist}
                >
                  Tambah Pricelist Pertama
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPricelists.map(pricelist => (
                <PricelistCard
                  key={pricelist.id}
                  pricelist={pricelist}
                  onEdit={handleEditPricelist}
                  onDelete={handleDeletePricelist}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showForm && (
        <PricelistForm
          pricelist={editingPricelist}
          onSave={handleSavePricelist}
          onClose={() => {
            setShowForm(false);
            setEditingPricelist(null);
          }}
        />
      )}
    </>
  );
};

export default Pricelist;
