import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterBar = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    { value: 'cosmetics', label: 'Kosmetik' },
    { value: 'salary', label: 'Gaji Asisten' },
    { value: 'transport', label: 'Transportasi' },
    { value: 'equipment', label: 'Peralatan' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Lainnya' }
  ];

  const serviceTypeOptions = [
    { value: '', label: 'Semua Layanan' },
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'Semua Metode' },
    { value: 'transfer', label: 'Transfer Bank' },
    { value: 'cash', label: 'Tunai' },
    { value: 'ewallet', label: 'E-Wallet' },
    { value: 'debit', label: 'Kartu Debit' }
  ];

  const handleClearFilters = () => {
    onFilterChange({
      dateFrom: '',
      dateTo: '',
      category: '',
      serviceType: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const hasActiveFilters = Object.values(activeFilters)?.some(value => value !== '');

  return (
    <div className="p-4 rounded-lg bg-card border border-border elevation-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="SlidersHorizontal" size={18} color="var(--color-primary)" />
          <h3 className="text-sm font-heading font-semibold text-foreground">
            Filter Data
          </h3>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Hapus Filter
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth lg:hidden"
            aria-label={isExpanded ? 'Tutup filter' : 'Buka filter'}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={18} />
          </button>
        </div>
      </div>
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Dari Tanggal"
            type="date"
            value={activeFilters?.dateFrom}
            onChange={(e) => onFilterChange({ ...activeFilters, dateFrom: e?.target?.value })}
          />
          <Input
            label="Sampai Tanggal"
            type="date"
            value={activeFilters?.dateTo}
            onChange={(e) => onFilterChange({ ...activeFilters, dateTo: e?.target?.value })}
          />
          <Select
            label="Metode Pembayaran"
            options={paymentMethodOptions}
            value={activeFilters?.paymentMethod}
            onChange={(value) => onFilterChange({ ...activeFilters, paymentMethod: value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Kategori Pengeluaran"
            options={categoryOptions}
            value={activeFilters?.category}
            onChange={(value) => onFilterChange({ ...activeFilters, category: value })}
          />
          <Select
            label="Jenis Layanan"
            options={serviceTypeOptions}
            value={activeFilters?.serviceType}
            onChange={(value) => onFilterChange({ ...activeFilters, serviceType: value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min. Jumlah"
              type="number"
              placeholder="0"
              value={activeFilters?.minAmount}
              onChange={(e) => onFilterChange({ ...activeFilters, minAmount: e?.target?.value })}
            />
            <Input
              label="Maks. Jumlah"
              type="number"
              placeholder="0"
              value={activeFilters?.maxAmount}
              onChange={(e) => onFilterChange({ ...activeFilters, maxAmount: e?.target?.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;