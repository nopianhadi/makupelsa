import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

const KPIPage = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Analytics State
  const [kpiData, setKpiData] = useState({
    totalClients: 0,
    newClientsThisMonth: 0,
    retentionRate: 0,
    averageOrderValue: 0,
    topClients: [],
    clientsByService: [],
    monthlyGrowth: []
  });

  // Management State
  const [kpis, setKpis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    target: '',
    unit: '',
    category: 'client',
    period: 'monthly'
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Calculate Analytics KPI
  const calculateKPI = () => {
    const clients = dataStore.getClients();
    const invoices = dataStore.getInvoices();
    const projects = dataStore.getProjects();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newClientsThisMonth = clients.filter(c => {
      const dateStr = c.registrationDate || c.createdAt;
      if (!dateStr) return false;
      const createdDate = new Date(dateStr);
      if (isNaN(createdDate.getTime())) return false;
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;

    const clientProjectCounts = {};
    projects.forEach(p => {
      if (p.clientId) {
        clientProjectCounts[p.clientId] = (clientProjectCounts[p.clientId] || 0) + 1;
      }
    });
    const repeatClients = Object.values(clientProjectCounts).filter(count => count > 1).length;
    const retentionRate = clients.length > 0 ? Math.round((repeatClients / clients.length) * 100) : 0;

    const clientRevenue = {};
    invoices.forEach(inv => {
      if (inv.clientId && inv.status === 'paid') {
        clientRevenue[inv.clientId] = (clientRevenue[inv.clientId] || 0) + (inv.grandTotal || 0);
      }
    });

    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const averageOrderValue = paidInvoices.length > 0 ? Math.round(totalRevenue / paidInvoices.length) : 0;

    const topClients = Object.entries(clientRevenue)
      .map(([clientId, totalSpent]) => {
        const client = clients.find(c => c.id === clientId || c.id === parseInt(clientId) || String(c.id) === String(clientId));
        const orders = invoices.filter(inv => 
          (inv.clientId === clientId || String(inv.clientId) === String(clientId)) && 
          inv.status === 'paid'
        ).length;
        return {
          name: client ? client.name : 'Unknown Client',
          totalSpent,
          orders
        };
      })
      .filter(c => c.orders > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const serviceCount = {};
    projects.forEach(p => {
      const serviceType = p.type || p.serviceType || 'other';
      serviceCount[serviceType] = (serviceCount[serviceType] || 0) + 1;
    });
    const totalProjects = projects.length;
    const clientsByService = Object.entries(serviceCount).map(([service, count]) => ({
      service: service.charAt(0).toUpperCase() + service.slice(1),
      count,
      percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0
    }));

    const monthlyData = {};
    clients.forEach(c => {
      const dateStr = c.registrationDate || c.createdAt;
      if (!dateStr) return;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const last5Months = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      last5Months.push({
        month: monthNames[d.getMonth()],
        clients: monthlyData[key] || 0
      });
    }

    setKpiData({
      totalClients: clients.length,
      newClientsThisMonth,
      retentionRate,
      averageOrderValue,
      topClients,
      clientsByService,
      monthlyGrowth: last5Months
    });
  };

  // Load Management KPIs
  const loadKPIs = () => {
    const stored = localStorage.getItem('kpi_data');
    if (stored) {
      setKpis(JSON.parse(stored));
    } else {
      const defaultKPIs = [
        { id: 1, title: 'Total Klien', value: 156, target: 200, unit: 'klien', category: 'client', period: 'monthly', createdAt: new Date().toISOString() },
        { id: 2, title: 'Klien Baru', value: 24, target: 30, unit: 'klien', category: 'client', period: 'monthly', createdAt: new Date().toISOString() },
        { id: 3, title: 'Retention Rate', value: 68, target: 75, unit: '%', category: 'client', period: 'monthly', createdAt: new Date().toISOString() }
      ];
      setKpis(defaultKPIs);
      localStorage.setItem('kpi_data', JSON.stringify(defaultKPIs));
    }
  };

  // Save Management KPIs
  const saveKPIs = (data) => {
    localStorage.setItem('kpi_data', JSON.stringify(data));
  };

  // Management KPI Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingKpi) {
      const updated = kpis.map(kpi => 
        kpi.id === editingKpi.id 
          ? { ...formData, id: editingKpi.id, updatedAt: new Date().toISOString() }
          : kpi
      );
      setKpis(updated);
      saveKPIs(updated);
    } else {
      const newKpi = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      const updated = [...kpis, newKpi];
      setKpis(updated);
      saveKPIs(updated);
    }
    
    resetForm();
  };

  const handleEdit = (kpi) => {
    setEditingKpi(kpi);
    setFormData({
      title: kpi.title,
      value: kpi.value,
      target: kpi.target,
      unit: kpi.unit,
      category: kpi.category,
      period: kpi.period
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus KPI ini?')) {
      const updated = kpis.filter(kpi => kpi.id !== id);
      setKpis(updated);
      saveKPIs(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      value: '',
      target: '',
      unit: '',
      category: 'client',
      period: 'monthly'
    });
    setEditingKpi(null);
    setIsModalOpen(false);
  };

  const getProgress = (value, target) => {
    return Math.min((value / target) * 100, 100);
  };

  // Testimonials Functions
  const loadTestimonials = () => {
    const stored = dataStore.getTestimonials();
    setTestimonials(stored);
  };

  const handleApprove = (id) => {
    dataStore.updateTestimonial(id, { status: 'approved', approvedAt: new Date().toISOString() });
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: 'approved', approvedAt: new Date().toISOString() } : t
    ));
  };

  const handleReject = (id) => {
    dataStore.updateTestimonial(id, { status: 'rejected' });
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: 'rejected' } : t
    ));
  };

  const handleDeleteTestimonial = (id) => {
    if (confirm('Yakin ingin menghapus testimoni ini?')) {
      dataStore.deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const filteredTestimonials = (filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.status === filter)).filter(t => {
      if (searchQuery) {
        return t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.message?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-destructive/10 text-destructive'
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            name={i < rating ? "Star" : "Star"} 
            size={16} 
            color={i < rating ? "var(--color-warning)" : "var(--color-muted)"}
            fill={i < rating ? "var(--color-warning)" : "none"}
          />
        ))}
      </div>
    );
  };

  const handleCopyLink = () => {
    const publicFormUrl = `${window.location.origin}/testimonial/public`;
    navigator.clipboard.writeText(publicFormUrl).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Gagal menyalin link');
    });
  };

  useEffect(() => {
    calculateKPI();
    loadKPIs();
    loadTestimonials();

    const handleDataUpdate = () => {
      calculateKPI();
    };

    const handleTestimonialChange = () => {
      loadTestimonials();
    };

    window.addEventListener('clientAdded', handleDataUpdate);
    window.addEventListener('clientUpdated', handleDataUpdate);
    window.addEventListener('clientDeleted', handleDataUpdate);
    window.addEventListener('projectAdded', handleDataUpdate);
    window.addEventListener('projectUpdated', handleDataUpdate);
    window.addEventListener('projectDeleted', handleDataUpdate);
    window.addEventListener('testimonialAdded', handleTestimonialChange);
    window.addEventListener('testimonialUpdated', handleTestimonialChange);
    window.addEventListener('testimonialDeleted', handleTestimonialChange);

    return () => {
      window.removeEventListener('clientAdded', handleDataUpdate);
      window.removeEventListener('clientUpdated', handleDataUpdate);
      window.removeEventListener('clientDeleted', handleDataUpdate);
      window.removeEventListener('projectAdded', handleDataUpdate);
      window.removeEventListener('projectUpdated', handleDataUpdate);
      window.removeEventListener('projectDeleted', handleDataUpdate);
      window.removeEventListener('testimonialAdded', handleTestimonialChange);
      window.removeEventListener('testimonialUpdated', handleTestimonialChange);
      window.removeEventListener('testimonialDeleted', handleTestimonialChange);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>KPI Bisnis - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className={cn("w-full max-w-full-xl mx-auto px-2 sm:px-4 lg: py-4 sm:py-6", mobileClasses.card)}>
          <div className={cn("mb-4 sm: flex items-center justify-between", mobileClasses.marginBottom)}>
            <div>
              <h1 className={cn("text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-heading font-bold text-foreground mb-2", mobileClasses.heading1)}>
                KPI Bisnis
              </h1>
              <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                Analisis performa dan manajemen Key Performance Indicators
              </p>
            </div>
            {activeTab === 'management' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Plus" size={20} sm:size={20} />
                <span className="hidden sm:inline">Tambah KPI</span>
              </button>
            )}
            {activeTab === 'testimonials' && (
              <div className="relative">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                  title="Salin link form testimoni publik"
                >
                  <Icon name="Link" size={18} />
                  <span className="hidden sm:inline">Copy Link Form</span>
                  <span className="sm:hidden">Copy Link</span>
                </button>
                {showCopySuccess && (
                  <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-success text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
                    ✓ Link berhasil disalin!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className={cn("flex gap-2 border-b border-border mb-4 sm: overflow-x-auto pb-0", mobileClasses.marginBottom)}>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`
                px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-smooth relative whitespace-nowrap
                ${activeTab === 'analytics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <Icon name="BarChart3" size={16} className="inline mr-2" />
              Analytics KPI
              {activeTab === 'analytics' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`
                px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-smooth relative whitespace-nowrap
                ${activeTab === 'management' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <Icon name="Settings" size={16} className="inline mr-2" />
              Manajemen KPI
              {activeTab === 'management' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`
                px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-smooth relative whitespace-nowrap
                ${activeTab === 'testimonials' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <Icon name="MessageSquare" size={16} className="inline mr-2" />
              Testimoni
              {activeTab === 'testimonials' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 pb-6">
              {/* KPI Cards */}
              <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ga", mobileClasses.cardCompact)}>
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Total Klien</span>
                    <Icon name="Users" size={20} sm:size={20} color="var(--color-primary)" />
                  </div>
                  <div className={cn("text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>{kpiData.totalClients}</div>
                  <div className="text-xs text-success mt-1">↑ +{kpiData.newClientsThisMonth} bulan ini</div>
                </div>

                <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Klien Baru</span>
                    <Icon name="UserPlus" size={20} sm:size={20} color="var(--color-accent)" />
                  </div>
                  <div className={cn("text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>{kpiData.newClientsThisMonth}</div>
                  <div className="text-xs text-muted-foreground mt-1">Bulan ini</div>
                </div>

                <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Retention Rate</span>
                    <Icon name="TrendingUp" size={20} sm:size={20} color="var(--color-success)" />
                  </div>
                  <div className={cn("text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>{kpiData.retentionRate}%</div>
                  <div className="text-xs text-success mt-1">↑ +5% dari bulan lalu</div>
                </div>

                <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Avg Order Value</span>
                    <Icon name="Wallet" size={20} sm:size={20} color="var(--color-warning)" />
                  </div>
                  <div className={cn("text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>
                    Rp {(kpiData.averageOrderValue / 1000000).toFixed(1)}jt
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Per transaksi</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 gap-3 sm:p-4 lg:", mobileClasses.card)}>
                {/* Top Clients */}
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                  <h3 className={cn("font-semibold text-foreground  flex items-center gap-2", mobileClasses.marginBottomSmall)}>
                    <Icon name="Award" size={20} sm:size={20} color="var(--color-primary)" />
                    Top Klien
                  </h3>
                  <div className="space-y-3">
                    {kpiData.topClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className={cn("flex items-center ", mobileClasses.gapSmall)}>
                          <div className={cn(" rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary", mobileClasses.iconSmall)}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{client.name}</div>
                            <div className="text-xs text-muted-foreground">{client.orders} pesanan</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground truncate">
                            Rp {(client.totalSpent / 1000000).toFixed(1)}jt
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clients by Service */}
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                  <h3 className={cn("font-semibold text-foreground  flex items-center gap-2", mobileClasses.marginBottomSmall)}>
                    <Icon name="PieChart" size={20} sm:size={20} color="var(--color-accent)" />
                    Klien per Layanan
                  </h3>
                  <div className="space-y-4">
                    {kpiData.clientsByService.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-foreground">{item.service}</span>
                          <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">{item.count} klien ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Growth Chart */}
              <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                <h3 className={cn("font-semibold text-foreground  flex items-center gap-2", mobileClasses.marginBottomSmall)}>
                  <Icon name="BarChart3" size={20} sm:size={20} color="var(--color-success)" />
                  Pertumbuhan Klien Bulanan
                </h3>
                <div className={cn("flex items-end justify-between ga h-48", mobileClasses.cardCompact)}>
                  {kpiData.monthlyGrowth.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs sm:text-sm font-medium text-foreground">{item.clients}</div>
                      <div 
                        className="w-full bg-primary rounded-t-lg transition-all"
                        style={{ height: `${(item.clients / 30) * 100}%` }}
                      />
                      <div className="text-xs text-muted-foreground">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Management Tab */}
          {activeTab === 'management' && (
            <div className="pb-6">
              {/* KPI Grid */}
              <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ga", mobileClasses.cardCompact)}>
                {kpis.map((kpi) => (
                  <div key={kpi.id} className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg: hover:shadow-lg transition-shadow", mobileClasses.card)}>
                    <div className={cn("flex items-start justify-between ", mobileClasses.marginBottomSmall)}>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{kpi.title}</h3>
                        <span className="text-xs text-muted-foreground capitalize">{kpi.category} • {kpi.period}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(kpi)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Icon name="Edit2" size={16} color="var(--color-primary)" />
                        </button>
                        <button
                          onClick={() => handleDelete(kpi.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Icon name="Trash2" size={16} color="var(--color-destructive)" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={cn("text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>{kpi.value}</span>
                        <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">{kpi.unit}</span>
                      </div>
                      <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                        Target: {kpi.target} {kpi.unit}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {getProgress(kpi.value, kpi.target).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            getProgress(kpi.value, kpi.target) >= 100 ? 'bg-success' : 
                            getProgress(kpi.value, kpi.target) >= 75 ? 'bg-primary' : 'bg-warning'
                          }`}
                          style={{ width: `${getProgress(kpi.value, kpi.target)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {kpis.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="BarChart3" size={48} color="var(--color-muted-foreground)" className={cn("mx-auto ", mobileClasses.marginBottomSmall)} />
                  <p className="text-muted-foreground">Belum ada KPI. Tambahkan KPI pertama Anda!</p>
                </div>
              )}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 pb-6">
              {/* Stats */}
              <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-2 sm:gap-3 lg:ga mb-3 sm:mb-4 sm:mb-4 sm:mb-6", mobileClasses.cardCompact)}>
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
                  <div className={cn(" font-bold text-foreground", mobileClasses.heading2)}>{testimonials.length}</div>
                  <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Total Testimoni</div>
                </div>
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
                  <div className={cn(" font-bold text-warning", mobileClasses.heading2)}>
                    {testimonials.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Menunggu Review</div>
                </div>
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
                  <div className={cn(" font-bold text-success", mobileClasses.heading2)}>
                    {testimonials.filter(t => t.status === 'approved').length}
                  </div>
                  <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Disetujui</div>
                </div>
                <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
                  <div className={cn(" font-bold text-foreground", mobileClasses.heading2)}>
                    {testimonials.length > 0 
                      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Rating Rata-rata</div>
                </div>
              </div>

              {/* Filter */}
              <div className={cn("flex gap-2 mb-4 sm: overflow-x-auto", mobileClasses.marginBottom)}>
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      filter === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border hover:bg-muted'
                    }`}
                  >
                    {status === 'all' ? 'Semua' : 
                     status === 'pending' ? 'Menunggu' :
                     status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </button>
                ))}
              </div>

              {/* Testimonials List */}
              <div className="space-y-4">
                {filteredTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                    <div className={cn("flex items-start justify-between ", mobileClasses.marginBottomSmall)}>
                      <div className="flex-1">
                        <div className={cn("flex items-center  mb-2", mobileClasses.gapSmall)}>
                          <h3 className="font-semibold text-foreground truncate">{testimonial.name}</h3>
                          {getStatusBadge(testimonial.status)}
                        </div>
                        <div className={cn("flex items-center ga text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground", mobileClasses.cardCompact)}>
                          <span>{testimonial.email}</span>
                          <span>•</span>
                          <span>{new Date(testimonial.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {testimonial.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(testimonial.id)}
                              className="p-2 hover:bg-success/10 rounded-lg transition-colors"
                              title="Setujui"
                            >
                              <Icon name="Check" size={20} sm:size={20} color="var(--color-success)" />
                            </button>
                            <button
                              onClick={() => handleReject(testimonial.id)}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              title="Tolak"
                            >
                              <Icon name="X" size={20} sm:size={20} color="var(--color-destructive)" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Icon name="Trash2" size={20} sm:size={20} color="var(--color-destructive)" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      {renderStars(testimonial.rating)}
                    </div>

                    <p className="text-foreground mb-3">{testimonial.message}</p>

                    {testimonial.service && (
                      <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                        Layanan: <span className="font-medium">{testimonial.service}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredTestimonials.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="MessageSquare" size={48} color="var(--color-muted-foreground)" className={cn("mx-auto ", mobileClasses.marginBottomSmall)} />
                  <p className="text-muted-foreground">
                    {filter === 'all' 
                      ? 'Belum ada testimoni' 
                      : `Tidak ada testimoni dengan status ${filter}`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Modal Form */}
          {isModalOpen && (
            <div className={cn("fixed inset-0 bg-black/50 flex items-center justify-center z-50 ", mobileClasses.cardCompact)}>
              <div className={cn("bg-card border border-border rounded-lg overflow-hidden max-w-md w-full p-3 sm:p-4 lg:", mobileClasses.card)}>
                <div className={cn("flex items-center justify-between ", mobileClasses.marginBottomSmall)}>
                  <h2 className={cn(" font-bold text-foreground", mobileClasses.heading3)}>
                    {editingKpi ? 'Edit KPI' : 'Tambah KPI Baru'}
                  </h2>
                  <button onClick={resetForm} className="p-1 hover:bg-muted rounded">
                    <Icon name="X" size={20} sm:size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                      Judul KPI
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 ga", mobileClasses.cardCompact)}>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                        Nilai Saat Ini
                      </label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                        Target
                      </label>
                      <input
                        type="number"
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="contoh: klien, %, Rp"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="client">Client</option>
                      <option value="financial">Financial</option>
                      <option value="operational">Operational</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                      Periode
                    </label>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className={cn("flex  pt-4", mobileClasses.gapSmall)}>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {editingKpi ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default KPIPage;
