import React from 'react';
import Icon from '../../../components/AppIcon';
import PaymentStatusIndicator from '../../../components/ui/PaymentStatusIndicator';

const UpcomingScheduleCard = ({ schedule }) => {
  const serviceTypeConfig = {
    akad: {
      label: 'Akad',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    resepsi: {
      label: 'Resepsi',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary'
    },
    wisuda: {
      label: 'Wisuda',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent'
    }
  };

  const config = serviceTypeConfig?.[schedule?.serviceType] || serviceTypeConfig?.akad;

  const formatTime = (timeString) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })?.format(new Date(`2000-01-01T${timeString}`));
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })?.format(new Date(dateString));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden p-4 elevation-1 hover:elevation-3 transition-smooth">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-heading font-semibold text-foreground mb-1 break-words">
            {schedule?.clientName}
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium font-caption flex-shrink-0 ${config?.bgColor} ${config?.textColor}`}>
              {config?.label}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
              <Icon name="Clock" size={12} className="flex-shrink-0" />
              {formatTime(schedule?.time)}
            </span>
          </div>
        </div>
        <PaymentStatusIndicator 
          status={schedule?.paymentStatus}
          type="badge"
          showIcon={false}
          className="flex-shrink-0"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
          <Icon name="Calendar" size={14} className="flex-shrink-0 mt-0.5" />
          <span className="break-words">{formatDate(schedule?.date)}</span>
        </div>
        {schedule?.location && (
          <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} className="flex-shrink-0 mt-0.5" />
            <span className="break-words">{schedule?.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingScheduleCard;