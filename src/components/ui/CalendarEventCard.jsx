import React from 'react';
import Icon from '../AppIcon';
import PaymentStatusIndicator from './PaymentStatusIndicator';

const CalendarEventCard = ({ 
  clientName,
  serviceType,
  time,
  paymentStatus,
  amount,
  location,
  notes,
  variant = 'default',
  onClick,
  className = ''
}) => {
  const serviceTypeConfig = {
    akad: {
      label: 'Akad',
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    resepsi: {
      label: 'Resepsi',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/20'
    },
    wisuda: {
      label: 'Wisuda',
      color: 'accent',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      borderColor: 'border-accent/20'
    }
  };

  const config = serviceTypeConfig?.[serviceType] || serviceTypeConfig?.akad;

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })?.format(new Date(`2000-01-01T${timeString}`));
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`
          w-full text-left p-2 rounded-md
          border ${config?.borderColor} ${config?.bgColor}
          hover:elevation-3 transition-smooth
          ${className}
        `}
        aria-label={`Event: ${clientName} - ${config?.label}`}
      >
        <div className="flex items-start gap-2">
          <div className={`
            w-1 h-full rounded-full ${config?.textColor}
            bg-current
          `} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground break-words line-clamp-1">
              {clientName}
            </p>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span className={`text-[10px] font-caption ${config?.textColor} flex-shrink-0`}>
                {config?.label}
              </span>
              {time && (
                <>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatTime(time)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-lg bg-card border border-border
        elevation-1 hover:elevation-3 transition-smooth
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      role={onClick ? 'button' : 'article'}
      aria-label={`Event: ${clientName} - ${config?.label}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-heading font-semibold text-foreground break-words">
            {clientName}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-md
              text-xs font-medium font-caption flex-shrink-0
              ${config?.bgColor} ${config?.textColor}
            `}>
              {config?.label}
            </span>
            {time && (
              <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                <Icon name="Clock" size={12} className="flex-shrink-0" />
                {formatTime(time)}
              </span>
            )}
          </div>
        </div>
        {paymentStatus && (
          <PaymentStatusIndicator 
            status={paymentStatus}
            type="badge"
            showIcon={false}
            amount={amount}
            className="flex-shrink-0"
          />
        )}
      </div>
      {location && (
        <div className="flex items-start gap-1.5 mb-2">
          <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground break-words">
            {location}
          </p>
        </div>
      )}
      {notes && (
        <div className="flex items-start gap-1.5 mb-2">
          <Icon name="FileText" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground break-words line-clamp-2">
            {notes}
          </p>
        </div>
      )}
      {amount && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
          <span className="text-xs font-caption text-muted-foreground">
            Total Pembayaran
          </span>
          <span className="text-xs sm:text-sm font-mono font-semibold text-foreground break-all">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })?.format(amount)}
          </span>
        </div>
      )}
    </div>
  );
};

export default CalendarEventCard;