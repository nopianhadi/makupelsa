import React from 'react';
import Icon from '../../../components/AppIcon';


const IncomeList = ({ incomes, onEdit, onDelete }) => {
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
      month: 'short',
      year: 'numeric'
    })?.format(new Date(dateString));
  };

  const serviceTypeConfig = {
    akad: { label: 'Akad', color: 'text-primary', bgColor: 'bg-primary/10' },
    resepsi: { label: 'Resepsi', color: 'text-secondary', bgColor: 'bg-secondary/10' },
    wisuda: { label: 'Wisuda', color: 'text-accent', bgColor: 'bg-accent/10' }
  };

  const paymentTypeConfig = {
    dp: { label: 'DP', icon: 'Clock' },
    full: { label: 'Pelunasan', icon: 'CheckCircle2' },
    cash: { label: 'Tunai', icon: 'Banknote' }
  };

  if (incomes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon name="Inbox" size={32} color="var(--color-muted-foreground)" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          Belum Ada Data Pemasukan
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Mulai catat pemasukan dari pembayaran klien untuk melacak keuangan bisnis Anda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incomes?.map((income) => {
        const serviceConfig = serviceTypeConfig?.[income?.serviceType] || serviceTypeConfig?.akad;
        const paymentConfig = paymentTypeConfig?.[income?.paymentType] || paymentTypeConfig?.cash;

        return (
          <div
            key={income?.id}
            className="p-4 rounded-lg bg-card border border-border elevation-1 hover:elevation-3 transition-smooth"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-heading font-semibold text-foreground mb-1 truncate">
                  {income?.clientName}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                    text-xs font-medium font-caption
                    ${serviceConfig?.bgColor} ${serviceConfig?.color}
                  `}>
                    {serviceConfig?.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name={paymentConfig?.icon} size={12} />
                    {paymentConfig?.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(income)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                  aria-label="Edit pemasukan"
                >
                  <Icon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => onDelete(income?.id)}
                  className="p-2 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-smooth"
                  aria-label="Hapus pemasukan"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex flex-col">
                <span className="text-xs font-caption text-muted-foreground mb-0.5">
                  {formatDate(income?.transactionDate)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {income?.paymentMethod === 'transfer' && 'Transfer Bank'}
                  {income?.paymentMethod === 'cash' && 'Tunai'}
                  {income?.paymentMethod === 'ewallet' && 'E-Wallet'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-success">
                  {formatCurrency(income?.amount)}
                </p>
              </div>
            </div>
            {income?.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <Icon name="FileText" size={12} className="inline mr-1" />
                  {income?.notes}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default IncomeList;