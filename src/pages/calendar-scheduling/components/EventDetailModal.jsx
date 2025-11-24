import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PaymentStatusIndicator from '../../../components/ui/PaymentStatusIndicator';

const EventDetailModal = ({ isOpen, onClose, event, onEdit, onDelete }) => {
  if (!isOpen || !event) return null;

  const serviceTypeConfig = {
    akad: { label: 'Akad', color: 'primary' },
    resepsi: { label: 'Resepsi', color: 'secondary' },
    wisuda: { label: 'Wisuda', color: 'accent' }
  };

  const config = serviceTypeConfig?.[event?.serviceType] || serviceTypeConfig?.akad;

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })?.format(new Date(dateString));
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border elevation-12 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-heading font-bold text-foreground">
            Detail Jadwal
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center
              text-muted-foreground hover:text-foreground hover:bg-muted
              transition-smooth"
            aria-label="Tutup"
          >
            <Icon name="X" size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              {event?.clientName}
            </h3>
            <span className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
              text-sm font-medium
              bg-${config?.color}/10 text-${config?.color}
            `}>
              {config?.label}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Calendar" size={20} color="var(--color-primary)" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-caption text-muted-foreground mb-1">
                  Tanggal & Waktu
                </p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(event?.date)}
                </p>
                <p className="text-sm font-mono text-foreground">
                  {event?.time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={20} color="var(--color-secondary)" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-caption text-muted-foreground mb-1">
                  Lokasi
                </p>
                <p className="text-sm font-medium text-foreground">
                  {event?.location}
                </p>
              </div>
            </div>

            {event?.notes && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="FileText" size={20} color="var(--color-accent)" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-caption text-muted-foreground mb-1">
                    Catatan
                  </p>
                  <p className="text-sm text-foreground">
                    {event?.notes}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-caption text-muted-foreground">
                  Total Pembayaran
                </span>
                <span className="text-lg font-mono font-bold text-foreground">
                  {formatCurrency(event?.amount)}
                </span>
              </div>
              <PaymentStatusIndicator
                status={event?.paymentStatus}
                type="card"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Edit"
              iconPosition="left"
              onClick={() => {
                onEdit(event);
                onClose();
              }}
              fullWidth
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => {
                onDelete(event?.id);
                onClose();
              }}
              fullWidth
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;