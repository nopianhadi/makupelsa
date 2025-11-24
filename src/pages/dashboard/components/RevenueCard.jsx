import React from 'react';
import Icon from '../../../components/AppIcon';
import { mobileClasses, cn } from '../../../utils/mobileOptimization';

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
    <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-1 hover:elevation-3 transition-smooth", mobileClasses.cardCompact)}>
      <div className={cn("flex items-start justify-between", mobileClasses.marginBottomSmall)}>
        <div className="flex-1 min-w-0">
          <p className={cn("font-caption text-muted-foreground mb-0.5", mobileClasses.textSmall)}>
            {title}
          </p>
          <h3 className={cn("font-heading font-bold text-foreground truncate", mobileClasses.heading3)}>
            {formatCurrency(amount)}
          </h3>
        </div>
        <div className={cn(`rounded-lg flex items-center justify-center ${variantStyles?.[variant]}`, mobileClasses.iconMedium)}>
          <Icon name={icon} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" strokeWidth={2.5} />
        </div>
      </div>
      {trend && (
        <div className={cn("flex items-center", mobileClasses.gapTiny)}>
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            className="w-3 h-3 sm:w-4 sm:h-4"
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
            strokeWidth={2.5}
          />
          <span className={cn(`font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`, mobileClasses.textSmall)}>
            {trendValue}%
          </span>
          <span className={cn("text-muted-foreground", mobileClasses.textTiny)}>vs bulan lalu</span>
        </div>
      )}
    </div>
  );
};

export default RevenueCard;