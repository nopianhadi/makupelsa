import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

import Select from './Select';

const ClientSearchFilter = ({ 
  onSearch, 
  onFilter,
  placeholder = 'Cari klien...',
  showFilters = true,
  className = ''
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: '',
    paymentStatus: '',
    dateRange: ''
  });
  const filterRef = useRef(null);
  const debounceTimer = useRef(null);

  const serviceTypeOptions = [
    { value: '', label: 'Semua Layanan' },
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' }
  ];

  const paymentStatusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'paid', label: 'Lunas' },
    { value: 'partial', label: 'DP Dibayar' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'overdue', label: 'Terlambat' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Semua Tanggal' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'custom', label: 'Pilih Tanggal' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef?.current && !filterRef?.current?.contains(event?.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchValue(value);

    if (debounceTimer?.current) {
      clearTimeout(debounceTimer?.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    setFilters(newFilters);

    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      serviceType: '',
      paymentStatus: '',
      dateRange: ''
    };
    setFilters(clearedFilters);
    if (onFilter) {
      onFilter(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="
              w-full pl-10 pr-10 py-2.5 rounded-md
              bg-surface border border-border
              text-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              transition-smooth
            "
            aria-label="Cari klien"
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-muted-foreground hover:text-foreground
                transition-smooth
              "
              aria-label="Hapus pencarian"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {showFilters && (
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-md
              border transition-smooth
              ${hasActiveFilters 
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
            aria-label="Filter"
            aria-expanded={isFilterOpen}
          >
            <Icon name="SlidersHorizontal" size={18} strokeWidth={2} />
            <span className="text-sm font-medium hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="
                w-2 h-2 rounded-full bg-primary
                animate-pulse
              " />
            )}
          </button>
        )}
      </div>
      {isFilterOpen && showFilters && (
        <div 
          ref={filterRef}
          className="
            absolute top-full right-0 mt-2 w-full sm:w-80
            bg-card border border-border rounded-lg
            elevation-6 z-50
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Filter Klien
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="
                    text-xs text-primary hover:text-primary/80
                    font-medium transition-smooth
                  "
                >
                  Hapus Semua
                </button>
              )}
            </div>

            <Select
              label="Jenis Layanan"
              options={serviceTypeOptions}
              value={filters?.serviceType}
              onChange={(value) => handleFilterChange('serviceType', value)}
              className="mb-0"
            />

            <Select
              label="Status Pembayaran"
              options={paymentStatusOptions}
              value={filters?.paymentStatus}
              onChange={(value) => handleFilterChange('paymentStatus', value)}
              className="mb-0"
            />

            <Select
              label="Rentang Tanggal"
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              className="mb-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSearchFilter;