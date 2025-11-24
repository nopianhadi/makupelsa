import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentHistoryTimeline = ({ payments }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDateTime = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(dateString));
  };

  const paymentMethodConfig = {
    cash: { label: 'Tunai', icon: 'Wallet', color: 'text-success' },
    transfer: { label: 'Transfer Bank', icon: 'CreditCard', color: 'text-primary' },
    qris: { label: 'QRIS', icon: 'QrCode', color: 'text-secondary' },
    ewallet: { label: 'E-Wallet', icon: 'Smartphone', color: 'text-accent' }
  };

  return (
    <div className="space-y-4">
      {payments?.map((payment, index) => {
        const methodConfig = paymentMethodConfig?.[payment?.method] || paymentMethodConfig?.cash;
        const isLast = index === payments?.length - 1;

        return (
          <div key={payment?.id} className="relative">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${payment?.type === 'payment' ? 'bg-success/10' : 'bg-muted'}
                `}>
                  <Icon 
                    name={methodConfig?.icon}
                    size={20}
                    color={payment?.type === 'payment' ? 'var(--color-success)' : 'var(--color-muted-foreground)'}
                    strokeWidth={2.5}
                  />
                </div>
                {!isLast && (
                  <div className="
                    absolute top-10 left-1/2 -translate-x-1/2
                    w-0.5 h-8 bg-border
                  " />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payment?.type === 'payment' ? 'Pembayaran Diterima' : 'Pengingat Dikirim'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateTime(payment?.date)}
                    </p>
                  </div>
                  {payment?.amount && (
                    <span className="text-base font-mono font-bold text-success">
                      {formatCurrency(payment?.amount)}
                    </span>
                  )}
                </div>

                <div className="
                  mt-2 p-3 rounded-lg bg-surface border border-border
                ">
                  <div className="space-y-2">
                    {payment?.method && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-caption text-muted-foreground">
                          Metode Pembayaran
                        </span>
                        <span className={`text-xs font-medium ${methodConfig?.color}`}>
                          {methodConfig?.label}
                        </span>
                      </div>
                    )}

                    {payment?.reference && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-caption text-muted-foreground">
                          Nomor Referensi
                        </span>
                        <span className="text-xs font-mono font-medium text-foreground">
                          {payment?.reference}
                        </span>
                      </div>
                    )}

                    {payment?.notes && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          {payment?.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentHistoryTimeline;