import React from 'react';
import Icon from '../AppIcon';

const PaymentStatusIndicator = ({ 
  status, 
  amount, 
  type = 'badge',
  showIcon = true,
  className = ''
}) => {
  const statusConfig = {
    paid: {
      label: 'Lunas',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20',
      icon: 'CheckCircle2'
    },
    partial: {
      label: 'DP Dibayar',
      color: 'warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/20',
      icon: 'Clock'
    },
    pending: {
      label: 'Menunggu',
      color: 'muted',
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      borderColor: 'border-border',
      icon: 'AlertCircle'
    },
    overdue: {
      label: 'Terlambat',
      color: 'error',
      bgColor: 'bg-error/10',
      textColor: 'text-error',
      borderColor: 'border-error/20',
      icon: 'XCircle'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.pending;

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  if (type === 'badge') {
    return (
      <span 
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
          border ${config?.borderColor} ${config?.bgColor} ${config?.textColor}
          text-xs font-medium font-caption
          ${className}
        `}
        role="status"
        aria-label={`Status pembayaran: ${config?.label}`}
      >
        {showIcon && (
          <Icon 
            name={config?.icon} 
            size={14} 
            strokeWidth={2.5}
          />
        )}
        <span>{config?.label}</span>
        {amount && (
          <span className="font-mono font-semibold">
            {formatCurrency(amount)}
          </span>
        )}
      </span>
    );
  }

  if (type === 'card') {
    return (
      <div 
        className={`
          flex items-center justify-between p-3 rounded-lg
          border ${config?.borderColor} ${config?.bgColor}
          ${className}
        `}
        role="status"
        aria-label={`Status pembayaran: ${config?.label}`}
      >
        <div className="flex items-center gap-2">
          {showIcon && (
            <div className={`
              w-8 h-8 rounded-md flex items-center justify-center
              ${config?.bgColor} ${config?.textColor}
            `}>
              <Icon 
                name={config?.icon} 
                size={18} 
                strokeWidth={2.5}
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${config?.textColor}`}>
              {config?.label}
            </span>
            {amount && (
              <span className={`text-xs font-mono font-semibold ${config?.textColor}`}>
                {formatCurrency(amount)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentStatusIndicator;