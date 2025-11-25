import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { dataStore } from '../../../utils/dataStore';
import { getAssistantPaymentSummary } from '../../../utils/paymentSync';

const AssistantDetailModal = ({ assistant, onClose }) => {
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    payments: false,
    projects: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }
  useEffect(() => {
    if (assistant) {
      const summary = getAssistantPaymentSummary(assistant.id);
      setPaymentSummary(summary);ka
    }
  }, [assistant]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleMarkAsPaid = (paymentId) => {
    const payment = dataStore.getPayments().find(p => p.id === paymentId);
    if (payment) {
      dataStore.updatePayment(paymentId, { status: 'paid' });
      const updated = getAssistantPaymentSummary(assistant.id);
      setPaymentSummary(updated);
    }
  };

  if (!paymentSummary) return null;

  return (
    <div 
      className="fixed inset-0 bg-background overflow-hidden/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-3 sm:p-6 z-10">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {assistant.avatar ? (
                  <img src={assistant.avatar} alt={assistant.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Icon name="User" size={32} color="var(--color-primary)" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-heading font-bold text-foreground break-words">
                  {assistant.name}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                  {assistant.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
              className="flex-shrink-0"
            />
          </div>

          {/* Desktop: Tabs */}
          <div className="hidden sm:flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground'
              }`}
            >
              Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeTab === 'payments'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground'
              }`}
            >
              Riwayat Pembayaran
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeTab === 'projects'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground'
              }`}
            >
              Proyek
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 sm:p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Pendapatan</span>
                    <Icon name="TrendingUp" size={20} color="var(--color-success)" className="flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-success break-words">
                    {formatCurrency(paymentSummary.totalEarned)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paymentSummary.paidPayments} pembayaran lunas
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Belum Dibayar</span>
                    <Icon name="Clock" size={20} color="var(--color-warning)" className="flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-warning break-words">
                    {formatCurrency(paymentSummary.totalUnpaid)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paymentSummary.unpaidPayments} pembayaran pending
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Proyek</span>
                    <Icon name="Briefcase" size={20} color="var(--color-primary)" className="flex-shrink-0" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {paymentSummary.projects.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Proyek terlibat
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-lg bg-surface border border-border">
                <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-4">
                  Informasi Asisten
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-xs sm:text-sm text-foreground font-medium break-all">{assistant.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Telepon</p>
                    <p className="text-xs sm:text-sm text-foreground font-medium break-all">{assistant.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} color="var(--color-warning)" className="flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground font-medium">
                        {assistant.rating || '0.0'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Proyek Selesai</p>
                    <p className="text-xs sm:text-sm text-foreground font-medium">{assistant.completedJobs || 0}</p>
                  </div>
                  {assistant.specialties && assistant.specialties.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">Keahlian</p>
                      <div className="flex flex-wrap gap-2">
                        {assistant.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Riwayat Pembayaran
                </h3>
                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    Lunas: {paymentSummary.paidPayments}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                    Pending: {paymentSummary.unpaidPayments}
                  </div>
                </div>
              </div>

              {paymentSummary.paymentHistory.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="Wallet" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum ada riwayat pembayaran</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentSummary.paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-3 sm:p-4 rounded-lg bg-surface border border-border hover:shadow-md transition-smooth"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-xs sm:text-sm font-medium text-foreground break-words">
                              {payment.description}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                payment.status === 'paid'
                                  ? 'bg-success/10 text-success'
                                  : 'bg-warning/10 text-warning'
                              }`}
                            >
                              {payment.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {formatDate(payment.date)}
                          </p>
                          {payment.projectId && (
                            <p className="text-xs text-muted-foreground break-all">
                              Proyek ID: {payment.projectId}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <p className="text-base sm:text-lg font-bold text-foreground">
                            {formatCurrency(payment.amount)}
                          </p>
                          {payment.status !== 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsPaid(payment.id)}
                              iconName="Check"
                              iconPosition="left"
                            >
                              Tandai Lunas
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                Proyek yang Terlibat
              </h3>

              {paymentSummary.projects.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="Briefcase" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum terlibat dalam proyek apapun</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentSummary.projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 sm:p-4 rounded-lg bg-surface border border-border hover:shadow-md transition-smooth"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-foreground mb-1 break-words">
                            {project.title}
                          </h4>
                          <p className="text-xs text-muted-foreground break-words">
                            {project.client}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            project.status === 'completed'
                              ? 'bg-success/10 text-success'
                              : project.status === 'in-progress'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {project.status === 'completed' ? 'Selesai' : 
                           project.status === 'in-progress' ? 'Berlangsung' : 
                           'Upcoming'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Calendar" size={14} className="flex-shrink-0" />
                          <span className="break-words">{formatDate(project.date)}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          {formatCurrency(project.budget)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantDetailModal;
