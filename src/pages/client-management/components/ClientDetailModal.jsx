import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import PaymentStatusIndicator from '../../../components/ui/PaymentStatusIndicator';
import InvoicePreviewModal from '../../payment-tracking/components/InvoicePreviewModal';
import { dataStore } from '../../../utils/dataStore';

const ClientDetailModal = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [clientInvoices, setClientInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    events: true,
    payments: false,
    invoices: false,
    communication: false
  });

  useEffect(() => {
    if (client?.id) {
      const allInvoices = dataStore.getInvoices() || [];
      const filtered = allInvoices.filter(inv => inv.clientId === client.id);
      setClientInvoices(filtered);
    }
  }, [client?.id]);

  // Listen for payment updates untuk real-time sync
  useEffect(() => {
    const handlePaymentUpdate = (event) => {
      console.log('🔄 Payment update detected in ClientDetailModal');
      
      // Refresh invoices
      if (client?.id) {
        const allInvoices = dataStore.getInvoices() || [];
        const filtered = allInvoices.filter(inv => inv.clientId === client.id);
        setClientInvoices(filtered);
      }
    };
    
    window.addEventListener('paymentRecorded', handlePaymentUpdate);
    return () => window.removeEventListener('paymentRecorded', handlePaymentUpdate);
  }, [client?.id]);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoicePreview(true);
  };

  if (!client) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
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

  const tabs = [
    { id: 'events', label: 'Acara', icon: 'Calendar' },
    { id: 'payments', label: 'Pembayaran', icon: 'CreditCard' },
    { id: 'invoices', label: 'Invoice', icon: 'FileText' },
    { id: 'communication', label: 'Komunikasi', icon: 'MessageSquare' }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderAccordionSection = (section, content) => {
    const isExpanded = expandedSections[section.id];
    
    return (
      <div key={section.id} className="border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-surface/50 transition-smooth"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <Icon name={section.icon} size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">{section.label}</span>
          </div>
          <Icon 
            name="ChevronDown" 
            size={18} 
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            color="var(--color-muted-foreground)"
          />
        </button>
        {isExpanded && (
          <div className="p-3 sm:p-4 pt-0 animate-in slide-in-from-top-2 duration-200">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-background overflow-hidden/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-detail-title"
    >
      <div 
        className="bg-card border border-border rounded-lg overflow-hidden w-full max-w-2xl sm:max-w-4xl max-h-[90vh] overflow-hidden elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="p-2 sm:p-3 lg:p-4 border-b border-border">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={client?.profileImage}
                  alt={client?.profileImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="client-detail-title" className="text-base sm:text-xl font-heading font-bold text-foreground break-words" title={client?.name}>
                  {client?.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground break-all">
                    <Icon name="Phone" size={14} className="flex-shrink-0" />
                    <span className="break-all">{client?.phone}</span>
                  </span>
                  {client?.email && (
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground break-all">
                      <Icon name="Mail" size={14} className="flex-shrink-0" />
                      <span className="break-all">{client?.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
              aria-label="Tutup"
              className="flex-shrink-0"
            />
          </div>
        </div>

        {/* Desktop: Tabs */}
        <div className="border-b border-border hidden sm:block">
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 border-b-2 transition-smooth
                  ${activeTab === tab?.id
                    ? 'border-primary text-primary font-medium' :'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-selected={activeTab === tab?.id}
                role="tab"
              >
                <Icon name={tab?.icon} size={18} />
                <span className="text-sm">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: Accordion */}
        <div className="sm:hidden overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderAccordionSection(
            { id: 'events', label: 'Acara', icon: 'Calendar' },
            (
              <div className="space-y-4">
                {client?.events?.map((event, index) => {
                  const serviceConfig = getServiceTypeConfig(event?.serviceType);
                  return (
                    <div key={index} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-medium ${serviceConfig?.bgColor} ${serviceConfig?.textColor}`}>
                            {serviceConfig?.label}
                          </span>
                          <PaymentStatusIndicator 
                            status={event?.paymentStatus}
                            type="badge"
                            showIcon={true}
                            amount={event?.totalAmount}
                          />
                        </div>
                        <span className="text-base sm:text-lg font-heading font-bold text-foreground font-mono">
                          {formatCurrency(event?.totalAmount)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                        <div className="flex items-start gap-2">
                          <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground break-words">
                            {formatDate(event?.eventDate)}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Icon name="Clock" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                            {event?.eventTime}
                          </span>
                        </div>
                        {event?.venue && (
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground break-words">
                              {event?.venue}
                            </span>
                          </div>
                        )}
                        {event?.packageName && (
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <Icon name="Package" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground break-words">
                              {event?.packageName}
                            </span>
                          </div>
                        )}
                      </div>
                      {event?.notes && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {event?.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {renderAccordionSection(
            { id: 'payments', label: 'Pembayaran', icon: 'CreditCard' },
            (

              <div className="space-y-4">
                {client?.paymentHistory?.map((payment, index) => (
                  <div key={index} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground mb-1 break-words">
                          {payment?.description}
                        </p>
                        <p className="text-xs text-muted-foreground break-words">
                          {formatDate(payment?.date)}
                        </p>
                      </div>
                      <span className="text-base sm:text-lg font-heading font-bold text-success font-mono flex-shrink-0">
                        {formatCurrency(payment?.amount)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                      <Icon name="CreditCard" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground break-words">
                        {payment?.method}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {renderAccordionSection(
            { id: 'invoices', label: 'Invoice', icon: 'FileText' },
            (

              <div className="space-y-4">
                {clientInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Icon name="FileText" size={24} sm:size={32} color="var(--color-muted-foreground)" />
                    </div>
                    <p className="text-base font-medium text-foreground mb-1">
                      Belum Ada Invoice
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Invoice untuk klien ini akan muncul di sini
                    </p>
                  </div>
                ) : (
                  clientInvoices.map((invoice) => (
                    <div key={invoice.id} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border hover:border-primary/50 transition-smooth cursor-pointer" onClick={() => handleViewInvoice(invoice)}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-mono text-sm font-bold text-foreground break-all">
                              {invoice.invoiceNumber}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              invoice.status === 'paid' ? 'bg-success/10 text-success' :
                              invoice.status === 'sent' ? 'bg-warning/10 text-warning' :
                              invoice.status === 'overdue' ? 'bg-error/10 text-error' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {invoice.status === 'paid' ? 'Lunas' :
                               invoice.status === 'sent' ? 'Terkirim' :
                               invoice.status === 'overdue' ? 'Jatuh Tempo' : 'Draft'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <div>
                              <span>Tanggal: </span>
                              <span className="text-foreground">{invoice.date}</span>
                            </div>
                            <div>
                              <span>Jatuh Tempo: </span>
                              <span className="text-foreground">{invoice.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-between sm:justify-end">
                          <span className="text-base sm:text-lg font-heading font-bold text-primary font-mono">
                            {formatCurrency(invoice.grandTotal || 0)}
                          </span>
                          <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" className="flex-shrink-0" />
                        </div>
                      </div>
                      {invoice.items && invoice.items.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Item:</p>
                          <div className="space-y-2">
                            {invoice.items.map((item, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs">
                                <span className="text-muted-foreground break-words">
                                  {item.description} x{item.quantity}
                                </span>
                                <span className="text-foreground font-medium flex-shrink-0">
                                  {formatCurrency(item.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )
          )}

          {renderAccordionSection(
            { id: 'communication', label: 'Komunikasi', icon: 'MessageSquare' },
            (

              <div className="space-y-4">
                {client?.communicationLog?.map((log, index) => (
                  <div key={index} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border">
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${log?.type === 'outgoing' ? 'bg-primary/10' : 'bg-secondary/10'}
                      `}>
                        <Icon 
                          name={log?.type === 'outgoing' ? 'Send' : 'MessageSquare'} 
                          size={18} 
                          color={log?.type === 'outgoing' ? 'var(--color-primary)' : 'var(--color-secondary)'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                          <span className="text-xs sm:text-sm font-medium text-foreground break-words">
                            {log?.subject}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(log?.date)}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">
                          {log?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Desktop: Tab Content */}
        <div className="hidden sm:block p-2 sm:p-3 lg:p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'events' && (
            <div className="space-y-4">
              {client?.events?.map((event, index) => {
                const serviceConfig = getServiceTypeConfig(event?.serviceType);
                return (
                  <div key={index} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-medium ${serviceConfig?.bgColor} ${serviceConfig?.textColor}`}>
                          {serviceConfig?.label}
                        </span>
                        <PaymentStatusIndicator 
                          status={event?.paymentStatus}
                          type="badge"
                          showIcon={true}
                          amount={event?.totalAmount}
                        />
                      </div>
                      <span className="text-base sm:text-lg font-heading font-bold text-foreground font-mono">
                        {formatCurrency(event?.totalAmount)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                      <div className="flex items-start gap-2">
                        <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground break-words">
                          {formatDate(event?.eventDate)}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="Clock" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                          {event?.eventTime}
                        </span>
                      </div>
                      {event?.venue && (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-muted-foreground break-words">
                            {event?.venue}
                          </span>
                        </div>
                      )}
                      {event?.packageName && (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <Icon name="Package" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-muted-foreground break-words">
                            {event?.packageName}
                          </span>
                        </div>
                      )}
                    </div>
                    {event?.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">
                          {event?.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              {client?.paymentHistory?.map((payment, index) => (
                <div key={index} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground mb-1 break-words">
                        {payment?.description}
                      </p>
                      <p className="text-xs text-muted-foreground break-words">
                        {formatDate(payment?.date)}
                      </p>
                    </div>
                    <span className="text-base sm:text-lg font-heading font-bold text-success font-mono flex-shrink-0">
                      {formatCurrency(payment?.amount)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <Icon name="CreditCard" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground break-words">
                      {payment?.method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {clientInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Icon name="FileText" size={24} sm:size={32} color="var(--color-muted-foreground)" />
                  </div>
                  <p className="text-base font-medium text-foreground mb-1">
                    Belum Ada Invoice
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Invoice untuk klien ini akan muncul di sini
                  </p>
                </div>
              ) : (
                clientInvoices.map((invoice) => (
                  <div key={invoice.id} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border hover:border-primary/50 transition-smooth cursor-pointer" onClick={() => handleViewInvoice(invoice)}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-bold text-foreground break-all">
                            {invoice.invoiceNumber}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                            invoice.status === 'paid' ? 'bg-success/10 text-success' :
                            invoice.status === 'sent' ? 'bg-warning/10 text-warning' :
                            invoice.status === 'overdue' ? 'bg-error/10 text-error' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {invoice.status === 'paid' ? 'Lunas' :
                             invoice.status === 'sent' ? 'Terkirim' :
                             invoice.status === 'overdue' ? 'Jatuh Tempo' : 'Draft'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div>
                            <span>Tanggal: </span>
                            <span className="text-foreground">{invoice.date}</span>
                          </div>
                          <div>
                            <span>Jatuh Tempo: </span>
                            <span className="text-foreground">{invoice.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-between sm:justify-end">
                        <span className="text-base sm:text-lg font-heading font-bold text-primary font-mono">
                          {formatCurrency(invoice.grandTotal || 0)}
                        </span>
                        <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" className="flex-shrink-0" />
                      </div>
                    </div>
                    {invoice.items && invoice.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Item:</p>
                        <div className="space-y-2">
                          {invoice.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs">
                              <span className="text-muted-foreground break-words">
                                {item.description} x{item.quantity}
                              </span>
                              <span className="text-foreground font-medium flex-shrink-0">
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-4">
              {client?.communicationLog?.map((log, index) => (
                <div key={index} className="bg-surface rounded-lg overflow-hidden w-full p-2 sm:p-3 lg:p-4 border w-full border-border">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${log?.type === 'outgoing' ? 'bg-primary/10' : 'bg-secondary/10'}
                    `}>
                      <Icon 
                        name={log?.type === 'outgoing' ? 'Send' : 'MessageSquare'} 
                        size={18} 
                        color={log?.type === 'outgoing' ? 'var(--color-primary)' : 'var(--color-secondary)'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <span className="text-xs sm:text-sm font-medium text-foreground break-words">
                          {log?.subject}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(log?.date)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        {log?.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showInvoicePreview && selectedInvoice && (
        <InvoicePreviewModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoicePreview(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientDetailModal;