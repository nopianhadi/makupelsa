import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FinancialFilterCards = ({ onFilterApply, activeFilters = {} }) => {
  const [filters, setFilters] = useState({
    dateFrom: activeFilters.dateFrom || '',
    dateTo: activeFilters.dateTo || '',
    category: activeFilters.category || '',
    serviceType: activeFilters.serviceType || '',
    paymentMethod: activeFilters.paymentMethod || '',
    minAmount: activeFilters.minAmount || '',
    maxAmount: activeFilters.maxAmount || ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterApply(filters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      category: '',
      serviceType: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(resetFilters);
    onFilterApply(resetFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border hover:bg-muted transition-smooth"
      >
        <Icon name="Filter" size={18} />
        <span className="text-sm font-medium">Filter Keuangan</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {activeFilterCount}
          </span>
        )}
        <Icon name={showFilters ? "ChevronUp" : "ChevronDown"} size={16} />
      </button>

      {/* Filter Cards */}
      {showFilters && (
        <div className="mt-4 p-4 rounded-lg bg-card border border-border space-y-4">
          {/* Date Range Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Icon name="Calendar" size={14} className="inline mr-1" />
                Dari Tanggal
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Icon name="Calendar" size={14} className="inline mr-1" />
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category & Service Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Icon name="Tag" size={14} className="inline mr-1" />
                Kategori Pengeluaran
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Semua Kategori</option>
                <option value="cosmetics">Kosmetik</option>
                <option value="equipment">Peralatan</option>
                <option value="salary">Gaji</option>
                <option value="transport">Transportasi</option>
                <option value="marketing">Marketing</option>
                <option value="rent">Sewa Tempat</option>
                <option value="utilities">Utilitas</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Icon name="Briefcase" size={14} className="inline mr-1" />
                Jenis Layanan
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Semua Layanan</option>
                <option value="akad">Akad Nikah</option>
                <option value="resepsi">Resepsi</option>
                <option value="prewedding">Prewedding</option>
                <option value="engagement">Lamaran</option>
                <option value="wisuda">Wisuda</option>
                <option value="party">Party</option>
                <option value="photoshoot">Photoshoot</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Icon name="CreditCard" size={14} className="inline mr-1" />
              Metode Pembayaran
            </label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Metode</option>
              <option value="cash">Tunai</option>
              <option value="transfer">Transfer Bank</option>
              <option value="debit">Kartu Debit</option>
              <option value="credit">Kartu Kredit</option>
              <option value="ewallet">E-Wallet</option>
              <option value="qris">QRIS</option>
            </select>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Icon name="DollarSign" size={14} className="inline mr-1" />
                Jumlah Minimum
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Icon name="DollarSign" size={14} className="inline mr-1" />
                Jumlah Maksimum
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                placeholder="Tidak terbatas"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth"
            >
              <Icon name="Check" size={16} className="inline mr-2" />
              Terapkan Filter
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={16} className="inline mr-2" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialFilterCards;
