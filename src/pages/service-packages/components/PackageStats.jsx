import React from 'react';
import Icon from '../../../components/AppIcon';

const PackageStats = ({ packages }) => {
  const calculateStats = () => {
    const totalPackages = packages?.length;
    const activePackages = packages?.filter(p => p?.isActive)?.length;
    const totalBookings = packages?.reduce((sum, p) => sum + (p?.totalBookings || 0), 0);
    const totalRevenue = packages?.reduce((sum, p) => sum + (p?.totalRevenue || 0), 0);
    const averagePrice = packages?.length > 0 
      ? packages?.reduce((sum, p) => sum + p?.basePrice, 0) / packages?.length 
      : 0;

    return {
      totalPackages,
      activePackages,
      totalBookings,
      totalRevenue,
      averagePrice
    };
  };

  const stats = calculateStats();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const statCards = [
    {
      label: 'Total Paket',
      value: stats?.totalPackages,
      icon: 'Package',
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      label: 'Paket Aktif',
      value: stats?.activePackages,
      icon: 'CheckCircle2',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success'
    },
    {
      label: 'Total Booking',
      value: stats?.totalBookings,
      icon: 'Calendar',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary'
    },
    {
      label: 'Total Pendapatan',
      value: formatCurrency(stats?.totalRevenue),
      icon: 'TrendingUp',
      color: 'accent',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      isLarge: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className={`
            bg-card border border-border rounded-lg p-4
            elevation-1 hover:elevation-3 transition-smooth
            ${stat?.isLarge ? 'col-span-2 lg:col-span-1' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`
              w-10 h-10 rounded-md flex items-center justify-center
              ${stat?.bgColor}
            `}>
              <Icon 
                name={stat?.icon} 
                size={20} 
                color={`var(--color-${stat?.color})`}
                strokeWidth={2.5}
              />
            </div>
          </div>
          
          <p className="text-xs font-caption text-muted-foreground mb-1">
            {stat?.label}
          </p>
          <p className={`
            text-2xl font-heading font-bold ${stat?.textColor}
            ${stat?.isLarge ? 'text-xl sm:text-2xl' : ''}
          `}>
            {stat?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PackageStats;