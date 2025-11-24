import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import PaymentStatusIndicator from '../../../components/ui/PaymentStatusIndicator';
import Button from '../../../components/ui/Button';

const ClientPaymentCard = ({ 
  client, 
  onSendReminder, 
  onRecordPayment, 
  onViewDetails 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })?.format(new Date(dateString));
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const serviceTypeConfig = {
    akad: { label: 'Akad', color: 'text-primary', bg: 'bg-primary/10' },
    resepsi: { label: 'Resepsi', color: 'text-secondary', bg: 'bg-secondary/10' },
    wisuda: { label: 'Wisuda', color: 'text-accent', bg: 'bg-accent/10' }
  };

  const serviceConfig = serviceTypeConfig?.[client?.serviceType] || serviceTypeConfig?.akad;
  const daysOverdue = client?.paymentStatus === 'overdue' ? getDaysOverdue(client?.dueDate) : 0;

  return (
    <div 
      className="
        bg-card border border-border rounded-xl p-4
        elevation-1 hover:elevation-3 transition-smooth
      "
      role="article"
      aria-label={`Pembayaran ${client?.name}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <Image 
              src={client?.avatar}
              alt={client?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {client?.paymentStatus === 'overdue' && (
            <div className="
              absolute -top-1 -right-1 w-5 h-5 rounded-full
              bg-error flex items-center justify-center
              border-2 border-card
            ">
              <Icon name="AlertCircle" size={12} color="white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-heading font-semibold text-foreground">
              {client?.name}
            </h3>
            <PaymentStatusIndicator 
              status={client?.paymentStatus}
              type="badge"
              showIcon={false}
              amount={client?.remainingAmount}
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-md
              text-xs font-medium font-caption
              ${serviceConfig?.bg} ${serviceConfig?.color}
            `}>
              {serviceConfig?.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(client?.eventDate)}
            </span>
          </div>

          {daysOverdue > 0 && (
            <div className="
              flex items-center gap-1.5 px-2 py-1 rounded-md
              bg-error/10 border border-error/20 mb-2
            ">
              <Icon name="Clock" size={14} color="var(--color-error)" strokeWidth={2.5} />
              <span className="text-xs font-medium text-error">
                Terlambat {daysOverdue} hari
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-caption text-muted-foreground">
            Total Pembayaran
          </span>
          <span className="text-sm font-mono font-semibold text-foreground">
            {formatCurrency(client?.totalAmount)}
          </span>
        </div>

        {client?.downPayment > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-caption text-muted-foreground">
              DP Dibayar
            </span>
            <span className="text-sm font-mono font-medium text-success">
              {formatCurrency(client?.downPayment)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-caption font-medium text-foreground">
            Sisa Pembayaran
          </span>
          <span className="text-base font-mono font-bold text-error">
            {formatCurrency(client?.remainingAmount)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Bell"
          iconPosition="left"
          onClick={() => onSendReminder(client)}
          className="flex-1"
        >
          Kirim Pengingat
        </Button>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => onRecordPayment(client)}
          className="flex-1"
        >
          Catat Pembayaran
        </Button>
      </div>
      {client?.lastReminder && (
        <div className="
          flex items-center gap-1.5 mt-3 pt-3 border-t border-border
        ">
          <Icon name="MessageSquare" size={14} color="var(--color-muted-foreground)" />
          <span className="text-xs text-muted-foreground">
            Pengingat terakhir: {formatDate(client?.lastReminder)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ClientPaymentCard;