import React from 'react';
import Icon from '../../../components/AppIcon';

const RevenueCard = ({ title, amount, trend, trendValue, icon, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    accent: 'bg-accent/10 text-accent border-accent/20'
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
    <div className="bg-card border border-border rounded-lg p-6 elevation-1 hover:elevation-3 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-caption text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-heading font-bold text-foreground">
            {formatCurrency(amount)}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${variantStyles?.[variant]}`}>
          <Icon name={icon} size={24} strokeWidth={2.5} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
            strokeWidth={2.5}
          />
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trendValue}%
          </span>
          <span className="text-xs text-muted-foreground">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
};

export default RevenueCard;