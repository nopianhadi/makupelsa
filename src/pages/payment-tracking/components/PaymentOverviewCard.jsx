import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentOverviewCard = ({ title, amount, count, icon, variant = 'default', trend }) => {
  const variantStyles = {
    default: {
      bg: 'bg-card',
      border: 'border-border',
      iconBg: 'bg-muted',
      iconColor: 'var(--color-muted-foreground)'
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/20',
      iconBg: 'bg-success/20',
      iconColor: 'var(--color-success)'
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      iconBg: 'bg-warning/20',
      iconColor: 'var(--color-warning)'
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error/20',
      iconBg: 'bg-error/20',
      iconColor: 'var(--color-error)'
    }
  };

  const style = variantStyles?.[variant];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  return (
    <div 
      className={`
        p-4 rounded-xl border ${style?.border} ${style?.bg}
        elevation-1 hover:elevation-3 transition-smooth
      `}
      role="article"
      aria-label={`${title}: ${formatCurrency(amount)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-caption text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-heading font-bold text-foreground mb-1 font-mono">
            {formatCurrency(amount)}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {count} Klien
            </span>
            {trend && (
              <span className={`
                flex items-center gap-1 text-xs font-medium
                ${trend?.type === 'up' ? 'text-success' : 'text-error'}
              `}>
                <Icon 
                  name={trend?.type === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                  strokeWidth={2.5}
                />
                {trend?.value}%
              </span>
            )}
          </div>
        </div>
        <div className={`
          w-12 h-12 rounded-xl ${style?.iconBg}
          flex items-center justify-center flex-shrink-0
        `}>
          <Icon 
            name={icon} 
            size={24} 
            color={style?.iconColor}
            strokeWidth={2.5}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentOverviewCard;