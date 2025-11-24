import React from 'react';
import Icon from '../../../components/AppIcon';


const ExpenseList = ({ expenses, onEdit, onDelete }) => {
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

  const categoryConfig = {
    cosmetics: { 
      label: 'Kosmetik', 
      icon: 'Sparkles', 
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    salary: { 
      label: 'Gaji Asisten', 
      icon: 'Users', 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    transport: { 
      label: 'Transportasi', 
      icon: 'Car', 
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    equipment: { 
      label: 'Peralatan', 
      icon: 'Package', 
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    marketing: { 
      label: 'Marketing', 
      icon: 'Megaphone', 
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    other: { 
      label: 'Lainnya', 
      icon: 'MoreHorizontal', 
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  };

  if (expenses?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon name="Inbox" size={32} color="var(--color-muted-foreground)" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          Belum Ada Data Pengeluaran
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Catat pengeluaran bisnis Anda untuk analisis keuangan yang lebih baik
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses?.map((expense) => {
        const categoryConf = categoryConfig?.[expense?.category] || categoryConfig?.other;

        return (
          <div
            key={expense?.id}
            className="p-4 rounded-lg bg-card border border-border elevation-1 hover:elevation-3 transition-smooth"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`
                  w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0
                  ${categoryConf?.bgColor}
                `}>
                  <Icon 
                    name={categoryConf?.icon} 
                    size={20} 
                    className={categoryConf?.color}
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-heading font-semibold text-foreground mb-1">
                    {expense?.description}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                      text-xs font-medium font-caption
                      ${categoryConf?.bgColor} ${categoryConf?.color}
                    `}>
                      {categoryConf?.label}
                    </span>
                    {expense?.vendor && (
                      <span className="text-xs text-muted-foreground">
                        <Icon name="Store" size={12} className="inline mr-1" />
                        {expense?.vendor}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                  aria-label="Edit pengeluaran"
                >
                  <Icon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => onDelete(expense?.id)}
                  className="p-2 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-smooth"
                  aria-label="Hapus pengeluaran"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex flex-col">
                <span className="text-xs font-caption text-muted-foreground mb-0.5">
                  {formatDate(expense?.transactionDate)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {expense?.paymentMethod === 'transfer' && 'Transfer Bank'}
                  {expense?.paymentMethod === 'cash' && 'Tunai'}
                  {expense?.paymentMethod === 'ewallet' && 'E-Wallet'}
                  {expense?.paymentMethod === 'debit' && 'Kartu Debit'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-error">
                  {formatCurrency(expense?.amount)}
                </p>
              </div>
            </div>
            {(expense?.receiptUrl || expense?.notes) && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {expense?.receiptUrl && (
                  <a
                    href={expense?.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-smooth"
                  >
                    <Icon name="Receipt" size={12} />
                    Lihat Bukti Pembayaran
                  </a>
                )}
                {expense?.notes && (
                  <p className="text-xs text-muted-foreground">
                    <Icon name="FileText" size={12} className="inline mr-1" />
                    {expense?.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;