import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock' },
      confirmed: { label: 'Confirmed', bg: 'bg-primary/10', text: 'text-primary', icon: 'CheckCircle' },
      completed: { label: 'Selesai', bg: 'bg-success/10', text: 'text-success', icon: 'Check' },
      cancelled: { label: 'Batal', bg: 'bg-error/10', text: 'text-error', icon: 'X' }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.status);

  const getServiceColor = (type) => {
    const colors = {
      akad: 'bg-primary/10 text-primary',
      resepsi: 'bg-secondary/10 text-secondary',
      wisuda: 'bg-accent/10 text-accent',
      lamaran: 'bg-success/10 text-success',
      engagement: 'bg-warning/10 text-warning',
      photoshoot: 'bg-error/10 text-error'
    };
    return colors[type] || colors.akad;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 elevation-1 hover:elevation-3 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-heading font-bold text-foreground">
              {booking.clientName}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Phone" size={14} />
            <span>{booking.clientPhone}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(booking)}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            title="Edit"
          >
            <Icon name="Edit" size={18} color="var(--color-primary)" />
          </button>
          <button
            onClick={() => onDelete(booking.id)}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            title="Hapus"
          >
            <Icon name="Trash2" size={18} color="var(--color-error)" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${getServiceColor(booking.serviceType)}`}>
            {booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
            <Icon name={statusConfig.icon} size={12} />
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Icon name="Calendar" size={16} color="var(--color-foreground)" />
          <span>{formatDate(booking.eventDate)} - {booking.eventTime}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span className="truncate">{booking.venue}</span>
        </div>

        {booking.totalAmount > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-foreground">{formatCurrency(booking.totalAmount)}</span>
            </div>
            {booking.downPayment > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">DP:</span>
                <span className="text-success">{formatCurrency(booking.downPayment)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            className="flex-1"
            onClick={() => onStatusChange(booking.id, 'confirmed')}
          >
            Konfirmasi
          </Button>
          <Button
            variant="outline"
            size="small"
            className="flex-1 text-error border-error hover:bg-error hover:text-white"
            onClick={() => onStatusChange(booking.id, 'cancelled')}
          >
            Batalkan
          </Button>
        </div>
      )}

      {booking.status === 'confirmed' && (
        <Button
          variant="primary"
          size="small"
          className="w-full"
          onClick={() => onStatusChange(booking.id, 'completed')}
        >
          Tandai Selesai
        </Button>
      )}
    </div>
  );
};

export default BookingCard;
