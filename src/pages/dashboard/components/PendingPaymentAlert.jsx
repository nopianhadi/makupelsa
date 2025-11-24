import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingPaymentAlert = ({ payment, onRemind }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysOverdue = calculateDaysOverdue(payment?.dueDate);

  return (
    <div className="bg-error/5 border border-error/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
          <Icon name="AlertCircle" size={20} color="var(--color-error)" strokeWidth={2.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className="text-sm font-heading font-semibold text-foreground mb-0.5">
                {payment?.clientName}
              </h4>
              <p className="text-xs text-muted-foreground">
                Terlambat {daysOverdue} hari
              </p>
            </div>
            <span className="text-sm font-mono font-semibold text-error whitespace-nowrap">
              {formatCurrency(payment?.amount)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => onRemind(payment?.id)}
            >
              Kirim Pengingat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPaymentAlert;