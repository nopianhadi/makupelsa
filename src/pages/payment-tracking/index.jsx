import React, { useState, useMemo } from 'react';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ClientSearchFilter from '../../components/ui/ClientSearchFilter';
import PaymentOverviewCard from './components/PaymentOverviewCard';
import ClientPaymentCard from './components/ClientPaymentCard';
import PaymentHistoryTimeline from './components/PaymentHistoryTimeline';
import RecordPaymentModal from './components/RecordPaymentModal';
import SendReminderModal from './components/SendReminderModal';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import Icon from '../../components/AppIcon';
import Select from '../../components/ui/Select';
import { dataStore } from '../../utils/dataStore';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

const PaymentTracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    serviceType: '',
    paymentStatus: '',
    dateRange: ''
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showSendReminder, setShowSendReminder] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [invoices, setInvoices] = useState(() => dataStore.getInvoices() || []);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overdue: true,
    pending: true,
    partial: true,
    paid: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Listen for payment and client updates
  React.useEffect(() => {
    const handlePaymentUpdate = () => {
      setInvoices(dataStore.getInvoices() || []);
      
      // Transform client data
      const storedClients = dataStore.getClients() || [];
      const transformedClients = storedClients.map(client => {
        const firstEvent = client.events?.[0] || {};
        const totalPaid = (client.paymentHistory || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalAmount = client.totalAmount || 0;
        const remainingAmount = totalAmount - totalPaid;
        
        return {
          id: client.id,
          name: client.name || 'Klien',
          avatar: client.profileImage || "https://img.rocket.new/generatedImages/rocket_gen_img_17d5da600-1763293461020.png",
          avatarAlt: client.profileImageAlt || "Client avatar",
          phone: client.phone || '',
          serviceType: firstEvent.serviceType || 'other',
          eventDate: firstEvent.eventDate || new Date().toISOString().split('T')[0],
          totalAmount: totalAmount,
          downPayment: totalPaid,
          remainingAmount: remainingAmount,
          paymentStatus: client.paymentStatus || 'pending',
          dueDate: firstEvent.eventDate || new Date().toISOString().split('T')[0],
          lastReminder: client.lastReminder || ''
        };
      });
      
      setClients(transformedClients);
    };
    
    window.addEventListener('paymentRecorded', handlePaymentUpdate);
    window.addEventListener('clientUpdated', handlePaymentUpdate);
    return () => {
      window.removeEventListener('paymentRecorded', handlePaymentUpdate);
      window.removeEventListener('clientUpdated', handlePaymentUpdate);
    };
  }, []);

  // Load clients from dataStore and transform for payment tracking
  const [clients, setClients] = useState(() => {
    const storedClients = dataStore.getClients() || [];
    if (storedClients.length > 0) {
      // Transform client data for payment tracking
      return storedClients.map(client => {
        const firstEvent = client.events?.[0] || {};
        const totalPaid = (client.paymentHistory || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalAmount = client.totalAmount || 0;
        const remainingAmount = totalAmount - totalPaid;
        
        return {
          id: client.id,
          name: client.name || 'Klien',
          avatar: client.profileImage || "https://img.rocket.new/generatedImages/rocket_gen_img_17d5da600-1763293461020.png",
          avatarAlt: client.profileImageAlt || "Client avatar",
          phone: client.phone || '',
          serviceType: firstEvent.serviceType || 'other',
          eventDate: firstEvent.eventDate || new Date().toISOString().split('T')[0],
          totalAmount: totalAmount,
          downPayment: totalPaid,
          remainingAmount: remainingAmount,
          paymentStatus: client.paymentStatus || 'pending',
          dueDate: firstEvent.eventDate || new Date().toISOString().split('T')[0],
          lastReminder: client.lastReminder || ''
        };
      });
    }
    // Fallback to mock data
    return [
    {
      id: 1,
      name: "Siti Nurhaliza",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17d5da600-1763293461020.png",
      avatarAlt: "Professional headshot of Indonesian woman with hijab and warm smile wearing elegant makeup",
      phone: "+62 812-3456-7890",
      serviceType: "akad",
      eventDate: "2025-12-15",
      totalAmount: 5000000,
      downPayment: 2000000,
      remainingAmount: 3000000,
      paymentStatus: "partial",
      dueDate: "2025-12-10",
      lastReminder: "2025-11-15"
    },
    {
      id: 2,
      name: "Dewi Kartika",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f00247aa-1763293465927.png",
      avatarAlt: "Portrait of young Indonesian woman with long black hair in traditional wedding attire",
      phone: "+62 813-4567-8901",
      serviceType: "resepsi",
      eventDate: "2025-12-05",
      totalAmount: 7500000,
      downPayment: 0,
      remainingAmount: 7500000,
      paymentStatus: "overdue",
      dueDate: "2025-11-20",
      lastReminder: "2025-11-18"
    },
    {
      id: 3,
      name: "Rina Wijaya",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ae9c563d-1763298931009.png",
      avatarAlt: "Smiling Indonesian woman with short hair wearing graduation cap and professional makeup",
      phone: "+62 814-5678-9012",
      serviceType: "wisuda",
      eventDate: "2025-12-20",
      totalAmount: 2500000,
      downPayment: 2500000,
      remainingAmount: 0,
      paymentStatus: "paid",
      dueDate: "2025-12-18"
    },
    {
      id: 4,
      name: "Maya Anggraini",
      avatar: "https://images.unsplash.com/photo-1684868264466-4c4fcf0a5b37",
      avatarAlt: "Indonesian bride with elegant makeup and traditional kebaya in soft pink tones",
      phone: "+62 815-6789-0123",
      serviceType: "akad",
      eventDate: "2025-12-25",
      totalAmount: 6000000,
      downPayment: 3000000,
      remainingAmount: 3000000,
      paymentStatus: "partial",
      dueDate: "2025-12-20"
    },
    {
      id: 5,
      name: "Putri Maharani",
      avatar: "https://images.unsplash.com/photo-1617198294641-860ddd6efd41",
      avatarAlt: "Young Indonesian woman with natural makeup and flower crown for outdoor wedding",
      phone: "+62 816-7890-1234",
      serviceType: "resepsi",
      eventDate: "2026-01-10",
      totalAmount: 8000000,
      downPayment: 0,
      remainingAmount: 8000000,
      paymentStatus: "pending",
      dueDate: "2026-01-05"
    }];
  });

  const mockPaymentHistory = [
    {
      id: 1,
      type: "payment",
      date: "2025-11-10T14:30:00",
      amount: 2000000,
      method: "transfer",
      reference: "TRF20251110143045",
      notes: "Pembayaran DP untuk layanan akad"
    },
    {
      id: 2,
      type: "reminder",
      date: "2025-11-15T10:00:00",
      notes: "Pengingat pembayaran dikirim via WhatsApp"
    },
    {
      id: 3,
      type: "payment",
      date: "2025-10-25T16:45:00",
      amount: 1500000,
      method: "cash",
      notes: "Pembayaran konsultasi dan booking"
    }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Jatuh Tempo' },
    { value: 'amount', label: 'Jumlah Tertinggi' },
    { value: 'name', label: 'Nama A-Z' },
    { value: 'recent', label: 'Terbaru' }
  ];

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    if (searchQuery) {
      result = result?.filter((client) =>
        client?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        client?.phone?.includes(searchQuery)
      );
    }

    if (filters?.serviceType) {
      result = result?.filter((client) => client?.serviceType === filters?.serviceType);
    }

    if (filters?.paymentStatus) {
      result = result?.filter((client) => client?.paymentStatus === filters?.paymentStatus);
    }

    switch (sortBy) {
      case 'dueDate':
        result?.sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date();
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date();
          return dateA - dateB;
        });
        break;
      case 'amount':
        result?.sort((a, b) => (b?.remainingAmount || 0) - (a?.remainingAmount || 0));
        break;
      case 'name':
        result?.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        break;
      case 'recent':
        result?.sort((a, b) => {
          const dateA = a.eventDate ? new Date(a.eventDate) : new Date();
          const dateB = b.eventDate ? new Date(b.eventDate) : new Date();
          return dateB - dateA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [clients, searchQuery, filters, sortBy]);

  const paymentStats = useMemo(() => {
    const pending = clients?.filter((c) => c?.paymentStatus === 'pending' || c?.paymentStatus === 'overdue');
    const partial = clients?.filter((c) => c?.paymentStatus === 'partial');
    const paid = clients?.filter((c) => c?.paymentStatus === 'paid');

    return {
      pending: {
        count: pending?.length,
        amount: pending?.reduce((sum, c) => sum + c?.remainingAmount, 0)
      },
      partial: {
        count: partial?.length,
        amount: partial?.reduce((sum, c) => sum + c?.remainingAmount, 0)
      },
      paid: {
        count: paid?.length,
        amount: paid?.reduce((sum, c) => sum + c?.totalAmount, 0)
      },
      total: {
        count: clients?.length,
        amount: clients?.reduce((sum, c) => sum + c?.remainingAmount, 0)
      }
    };
  }, [clients]);

  const handleSendReminder = (client) => {
    setSelectedClient(client);
    setShowSendReminder(true);
  };

  const handleRecordPayment = (client) => {
    setSelectedClient(client);
    setShowRecordPayment(true);
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowPaymentHistory(true);
  };

  const handleSubmitPayment = (paymentData) => {
    console.log('Payment recorded:', paymentData);
    // Refresh invoice list
    setInvoices(dataStore.getInvoices() || []);
    setShowRecordPayment(false);
    setSelectedClient(null);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoicePreview(true);
  };

  const handleSubmitReminder = (reminderData) => {
    if (reminderData?.method === 'whatsapp' && selectedClient?.phone) {
      const phone = selectedClient.phone.replace(/^0/, '62');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(reminderData.message)}`;
      window.open(url, '_blank');
    }

    console.log('Reminder sent:', reminderData);
    setShowSendReminder(false);
    setSelectedClient(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className={cn("w-full max-w-full-xl mx-auto px-2 sm:px-4 lg: py-4 sm:py-6 pb-24 lg:pb-6", mobileClasses.card)}>
        <div className={cn("mb-4 sm:", mobileClasses.marginBottom)}>
          <div className={cn("flex items-start justify-between ga mb-2", mobileClasses.cardCompact)}>
            <div>
              <h1 className={cn("text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-heading font-bold text-foreground mb-1", mobileClasses.heading1)}>
                Pelacakan Pembayaran
              </h1>
              <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                Pantau status pembayaran dan kirim pengingat kepada klien
              </p>
            </div>
            <div className="flex items-center gap-2">
              <QuickActionButton
                label="Catat Pembayaran"
                icon="Plus"
                variant="default"
                onClick={() => setShowRecordPayment(true)}
              />
            </div>
          </div>
        </div>

        <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-2 sm:gap-3 lg:ga mb-3 sm:mb-4 sm:mb-4 sm:mb-6", mobileClasses.cardCompact)}>
          <PaymentOverviewCard
            title="Total Tertunda"
            amount={paymentStats?.pending?.amount}
            count={paymentStats?.pending?.count}
            icon="AlertCircle"
            variant="error"
            trend={{ type: 'up', value: 12 }}
          />

          <PaymentOverviewCard
            title="DP Dibayar"
            amount={paymentStats?.partial?.amount}
            count={paymentStats?.partial?.count}
            icon="Clock"
            variant="warning"
          />

          <PaymentOverviewCard
            title="Lunas"
            amount={paymentStats?.paid?.amount}
            count={paymentStats?.paid?.count}
            icon="CheckCircle2"
            variant="success"
            trend={{ type: 'up', value: 8 }}
          />

          <PaymentOverviewCard
            title="Total Piutang"
            amount={paymentStats?.total?.amount}
            count={paymentStats?.total?.count}
            icon="Wallet"
            variant="default"
          />

        </div>

        <div className={cn("bg-card border border-border rounded-2xl p-4 sm:p-3 sm:p-4 lg: mb-4 sm:mb-6", mobileClasses.card)}>
          <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 lg:ga mb-3 sm:mb-4", mobileClasses.cardCompact)}>
            <h2 className={cn(" font-heading font-bold text-foreground", mobileClasses.heading4)}>
              Daftar Pembayaran Klien
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-full sm:w-48"
              />

            </div>
          </div>

          <ClientSearchFilter
            onSearch={setSearchQuery}
            onFilter={setFilters}
            placeholder="Cari klien berdasarkan nama atau nomor telepon..."
            showFilters={true}
            className={cn("", mobileClasses.marginBottomSmall)}
          />

          {filteredAndSortedClients?.length === 0 ? (
            <div className="text-center py-12">
              <div className={cn("w-16 h-16 rounded-2xl bg-muted mx-auto  flex items-center justify-center", mobileClasses.marginBottomSmall)}>
                <Icon name="Search" size={20} sm:size={32} color="var(--color-muted-foreground)" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">
                Tidak ada hasil
              </p>
              <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                Coba ubah filter atau kata kunci pencarian
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: Grid View */}
              <div className={cn("hidden sm:grid grid-cols- w-full 1 lg:grid-cols-2 ga", mobileClasses.cardCompact)}>
                {filteredAndSortedClients?.map((client) =>
                  <ClientPaymentCard
                    key={client?.id}
                    client={client}
                    onSendReminder={handleSendReminder}
                    onRecordPayment={handleRecordPayment}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </div>

              {/* Mobile: Accordion by Status */}
              <div className="sm:hidden space-y-2">
                {/* Overdue */}
                {filteredAndSortedClients.filter(c => c.paymentStatus === 'overdue').length > 0 && (
                  <div className="border border-error/30 rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('overdue')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="AlertCircle" size={18} color="var(--color-error)" />
                        <span className="text-sm font-medium text-foreground">Jatuh Tempo</span>
                        <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-bold">
                          {filteredAndSortedClients.filter(c => c.paymentStatus === 'overdue').length}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.overdue ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.overdue && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {filteredAndSortedClients.filter(c => c.paymentStatus === 'overdue').map(client => (
                          <ClientPaymentCard
                            key={client.id}
                            client={client}
                            onSendReminder={handleSendReminder}
                            onRecordPayment={handleRecordPayment}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pending */}
                {filteredAndSortedClients.filter(c => c.paymentStatus === 'pending').length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('pending')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={18} color="var(--color-warning)" />
                        <span className="text-sm font-medium text-foreground">Pending</span>
                        <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold">
                          {filteredAndSortedClients.filter(c => c.paymentStatus === 'pending').length}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.pending ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.pending && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {filteredAndSortedClients.filter(c => c.paymentStatus === 'pending').map(client => (
                          <ClientPaymentCard
                            key={client.id}
                            client={client}
                            onSendReminder={handleSendReminder}
                            onRecordPayment={handleRecordPayment}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Partial */}
                {filteredAndSortedClients.filter(c => c.paymentStatus === 'partial').length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('partial')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="DollarSign" size={18} color="var(--color-primary)" />
                        <span className="text-sm font-medium text-foreground">DP Dibayar</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {filteredAndSortedClients.filter(c => c.paymentStatus === 'partial').length}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.partial ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.partial && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {filteredAndSortedClients.filter(c => c.paymentStatus === 'partial').map(client => (
                          <ClientPaymentCard
                            key={client.id}
                            client={client}
                            onSendReminder={handleSendReminder}
                            onRecordPayment={handleRecordPayment}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Paid */}
                {filteredAndSortedClients.filter(c => c.paymentStatus === 'paid').length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('paid')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={18} color="var(--color-success)" />
                        <span className="text-sm font-medium text-foreground">Lunas</span>
                        <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">
                          {filteredAndSortedClients.filter(c => c.paymentStatus === 'paid').length}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.paid ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.paid && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {filteredAndSortedClients.filter(c => c.paymentStatus === 'paid').map(client => (
                          <ClientPaymentCard
                            key={client.id}
                            client={client}
                            onSendReminder={handleSendReminder}
                            onRecordPayment={handleRecordPayment}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {invoices.length > 0 && (
          <div className={cn("bg-card border border-border rounded-2xl p-4 sm:p-3 sm:p-4 lg:", mobileClasses.card)}>
            <div className={cn("flex items-center justify-between ", mobileClasses.marginBottomSmall)}>
              <h2 className={cn(" font-heading font-bold text-foreground", mobileClasses.heading4)}>
                Daftar Invoice
              </h2>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={cn("flex flex-col sm:flex-row sm:items-center justify-between  p-3 rounded-xl border border-border bg-muted/40 hover:border-primary/50 transition-smooth cursor-pointer", mobileClasses.gapSmall)}
                  onClick={() => handleViewInvoice(invoice)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {invoice.invoiceNumber}
                      </span>
                      {invoice.client && (
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                          {invoice.client}
                        </span>
                      )}
                      {invoice.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          invoice.status === 'paid' ? 'bg-success/10 text-success' :
                          invoice.status === 'sent' ? 'bg-warning/10 text-warning' :
                          invoice.status === 'overdue' ? 'bg-error/10 text-error' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {invoice.status === 'paid' ? 'Lunas' :
                           invoice.status === 'sent' ? 'Terkirim' :
                           invoice.status === 'overdue' ? 'Jatuh Tempo' : 'Draft'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tanggal: {invoice.date}  Jatuh tempo: {invoice.dueDate}
                    </p>
                  </div>

                  <div className={cn("flex items-center justify-between sm:justify-end  w-full sm:w-auto", mobileClasses.gapSmall)}>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                          invoice.grandTotal || 0
                        )}
                      </p>
                    </div>
                    <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPaymentHistory && selectedClient &&
          <div className={cn("bg-card border border-border rounded-2xl p-4 sm:p-3 sm:p-4 lg:", mobileClasses.card)}>
            <div className={cn("flex items-center justify-between ", mobileClasses.marginBottomSmall)}>
              <h2 className={cn(" font-heading font-bold text-foreground", mobileClasses.heading4)}>
                Riwayat Pembayaran - {selectedClient?.name}
              </h2>
              <button
                onClick={() => {
                  setShowPaymentHistory(false);
                  setSelectedClient(null);
                }}
                className={cn("rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth", mobileClasses.iconSmall)}
                aria-label="Tutup">
                <Icon name="X" size={20} strokeWidth={2.5} />
              </button>
            </div>
            <PaymentHistoryTimeline payments={mockPaymentHistory} />
          </div>
        }
      </main>

      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <QuickActionButton
          label="Catat"
          icon="Plus"
          variant="primary"
          size="large"
          onClick={() => setShowRecordPayment(true)}
        />

      </div>
      {showRecordPayment && (
        <RecordPaymentModal
          client={selectedClient}
          onClose={() => {
            setShowRecordPayment(false);
            setSelectedClient(null);
          }}
          onSubmit={handleSubmitPayment}
        />
      )}
      {showSendReminder && selectedClient &&
        <SendReminderModal
          client={selectedClient}
          onClose={() => {
            setShowSendReminder(false);
            setSelectedClient(null);
          }}
          onSubmit={handleSubmitReminder}
        />
      }
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

export default PaymentTracking;