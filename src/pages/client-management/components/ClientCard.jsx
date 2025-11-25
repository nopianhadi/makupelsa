import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PaymentStatusIndicator from '../../../components/ui/PaymentStatusIndicator';

const ClientCard = ({ client, onEdit, onAddService, onSendReminder, onViewInvoices, onShareLink, onDelete, onClick, isCompleted }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    event: true,
    payment: false,
    actions: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })?.format(new Date(dateString));
  };

  // Cek apakah klien baru selesai (dalam 7 hari terakhir)
  const isRecentlyCompleted = () => {
    if (!isCompleted || !client?.events || client.events.length === 0) return false;
    
    const lastEventDate = new Date(Math.max(...client.events.map(e => new Date(e.eventDate))));
    const today = new Date();
    const daysDiff = Math.floor((today - lastEventDate) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 7 && daysDiff >= 0;
  };

  const getServiceTypeConfig = (type) => {
    const configs = {
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
    return configs?.[type] || configs?.akad;
  };

  const upcomingEvent = client?.events?.[0];
  const serviceConfig = upcomingEvent ? getServiceTypeConfig(upcomingEvent?.serviceType) : null;

  return (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6 elevation-1 w-full hover:elevation-3 transition-smooth cursor-pointer ${
        isCompleted ? 'border-muted' : 'border-border'
      }`}
      onClick={onClick}
      role="article"
      aria-label={`Klien ${client?.name}`}
    >
      {/* Badge Baru Selesai */}
      {isRecentlyCompleted() && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <span className="text-green-600 dark:text-green-400">✨</span>
          <span className="text-xs font-medium text-green-700 dark:text-green-300">
            Baru Selesai - Jangan lupa follow up!
          </span>
        </div>
      )}

      <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 flex-col sm:flex-row">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={client?.profileImage}
              alt={client?.profileImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {client?.isActive && !isCompleted && (
            <span 
              className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-card rounded-full"
              aria-label="Klien aktif"
            />
          )}
          {isCompleted && (
            <span 
              className="absolute bottom-0 right-0 w-4 h-4 bg-muted border-2 border-card rounded-full flex items-center justify-center"
              aria-label="Klien selesai"
            >
              <span className="text-[8px]">✓</span>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-heading font-semibold text-foreground break-words flex-1" title={client?.name}>
              {client?.name}
            </h3>
            {client?.totalEvents > 1 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium whitespace-nowrap flex-shrink-0">
                <Icon name="Calendar" size={12} className="flex-shrink-0" />
                {client?.totalEvents} Acara
              </span>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
            <Icon name="Phone" size={14} className="flex-shrink-0 mt-0.5" />
            <span className="font-mono break-all">{client?.phone}</span>
          </div>

          {client?.location && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
              <Icon name="MapPin" size={14} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">{client?.location}</span>
            </div>
          )}
        </div>
      </div>
      {/* Desktop: Full View */}
      <div className="hidden sm:block">
        {upcomingEvent && (
          <div className="bg-surface rounded-lg overflow-hidden p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-caption text-muted-foreground">
                {isCompleted ? 'Event Terakhir' : 'Acara Mendatang'}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${serviceConfig?.bgColor} ${serviceConfig?.textColor}`}>
                {serviceConfig?.label}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <Icon name="Calendar" size={14} color="var(--color-foreground)" className="flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-foreground break-words">
                {formatDate(upcomingEvent?.eventDate)}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <Icon name="Clock" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                {upcomingEvent?.eventTime}
              </span>
            </div>

            {upcomingEvent?.venue && (
              <div className="flex items-start gap-2">
                <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground break-words">
                  {upcomingEvent?.venue}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
          <div className="flex flex-col">
            <span className="text-xs font-caption text-muted-foreground mb-1">
              Total Pembayaran
            </span>
            <span className="text-lg font-heading font-bold text-foreground font-mono">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })?.format(client?.totalAmount)}
            </span>
          </div>
          <PaymentStatusIndicator 
            status={client?.paymentStatus}
            type="badge"
            showIcon={true}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(client);
            }}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={(e) => {
              e?.stopPropagation();
              onAddService(client);
            }}
            className="flex-1"
          >
            Tambah Layanan
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Bell"
            onClick={(e) => {
              e?.stopPropagation();
              onSendReminder(client);
            }}
            aria-label="Kirim pengingat"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(client.id);
            }}
            aria-label="Hapus klien"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
            onClick={(e) => {
              e?.stopPropagation();
              onViewInvoices(client);
            }}
            className="flex-1"
          >
            Lihat Invoice
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Share2"
            onClick={(e) => {
              e?.stopPropagation();
              onShareLink(client);
            }}
            aria-label="Share link portal"
          />
        </div>
      </div>

      {/* Mobile: Accordion View */}
      <div className="sm:hidden space-y-2">
        {/* Acara Section */}
        {upcomingEvent && (
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('event');
              }}
              className="w-full flex items-center justify-between p-3 bg-surface/50 hover:bg-surface transition-smooth"
            >
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} color="var(--color-primary)" />
                <span className="text-sm font-medium text-foreground">
                  {isCompleted ? 'Event Terakhir' : 'Acara'}
                </span>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${expandedSections.event ? 'rotate-180' : ''}`}
                color="var(--color-muted-foreground)"
              />
            </button>
            {expandedSections.event && (
              <div className="p-3 pt-0 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${serviceConfig?.bgColor} ${serviceConfig?.textColor}`}>
                    {serviceConfig?.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Icon name="Calendar" size={14} color="var(--color-foreground)" className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-foreground break-words">
                      {formatDate(upcomingEvent?.eventDate)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="Clock" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                      {upcomingEvent?.eventTime}
                    </span>
                  </div>
                  {upcomingEvent?.venue && (
                    <div className="flex items-start gap-2">
                      <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground break-words">
                        {upcomingEvent?.venue}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pembayaran Section */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSection('payment');
            }}
            className="w-full flex items-center justify-between p-3 bg-surface/50 hover:bg-surface transition-smooth"
          >
            <div className="flex items-center gap-2">
              <Icon name="CreditCard" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">Pembayaran</span>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-200 ${expandedSections.payment ? 'rotate-180' : ''}`}
              color="var(--color-muted-foreground)"
            />
          </button>
          {expandedSections.payment && (
            <div className="p-3 pt-0 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-xs font-caption text-muted-foreground mb-1">
                    Total Pembayaran
                  </span>
                  <span className="text-lg font-heading font-bold text-foreground font-mono">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })?.format(client?.totalAmount)}
                  </span>
                </div>
                <PaymentStatusIndicator 
                  status={client?.paymentStatus}
                  type="badge"
                  showIcon={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSection('actions');
            }}
            className="w-full flex items-center justify-between p-3 bg-surface/50 hover:bg-surface transition-smooth"
          >
            <div className="flex items-center gap-2">
              <Icon name="Settings" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">Aksi</span>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-200 ${expandedSections.actions ? 'rotate-180' : ''}`}
              color="var(--color-muted-foreground)"
            />
          </button>
          {expandedSections.actions && (
            <div className="p-3 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onEdit(client);
                  }}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onAddService(client);
                  }}
                  className="flex-1"
                >
                  Tambah
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onViewInvoices(client);
                  }}
                  className="flex-1"
                >
                  Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Bell"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onSendReminder(client);
                  }}
                  className="flex-1"
                >
                  Reminder
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  iconName="Share2"
                  iconPosition="left"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onShareLink(client);
                  }}
                  className="flex-1"
                >
                  Share Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onDelete(client.id);
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Hapus
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;