import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';

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

  useEffect(() => {
    calculateKPI();
    loadKPIs();

    const handleDataUpdate = () => {
      calculateKPI();
    };

    window.addEventListener('clientAdded', handleDataUpdate);
    window.addEventListener('clientUpdated', handleDataUpdate);
    window.addEventListener('clientDeleted', handleDataUpdate);
    window.addEventListener('projectAdded', handleDataUpdate);
    window.addEventListener('projectUpdated', handleDataUpdate);
    window.addEventListener('projectDeleted', handleDataUpdate);

    return () => {
      window.removeEventListener('clientAdded', handleDataUpdate);
      window.removeEventListener('clientUpdated', handleDataUpdate);
      window.removeEventListener('clientDeleted', handleDataUpdate);
      window.removeEventListener('projectAdded', handleDataUpdate);
      window.removeEventListener('projectUpdated', handleDataUpdate);
      window.removeEventListener('projectDeleted', handleDataUpdate);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>KPI Bisnis - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="w-full max-w-full-xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
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
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border mb-4 sm:mb-6 overflow-x-auto pb-0">
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
          </div>

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 pb-6">
              {/* KPI Cards */}
              <div className="grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Total Klien</span>
                    <Icon name="Users" size={20} sm:size={20} color="var(--color-primary)" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{kpiData.totalClients}</div>
                  <div className="text-xs text-success mt-1">↑ +{kpiData.newClientsThisMonth} bulan ini</div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Klien Baru</span>
                    <Icon name="UserPlus" size={20} sm:size={20} color="var(--color-accent)" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{kpiData.newClientsThisMonth}</div>
                  <div className="text-xs text-muted-foreground mt-1">Bulan ini</div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Retention Rate</span>
                    <Icon name="TrendingUp" size={20} sm:size={20} color="var(--color-success)" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{kpiData.retentionRate}%</div>
                  <div className="text-xs text-success mt-1">↑ +5% dari bulan lalu</div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Avg Order Value</span>
                    <Icon name="Wallet" size={20} sm:size={20} color="var(--color-warning)" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    Rp {(kpiData.averageOrderValue / 1000000).toFixed(1)}jt
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Per transaksi</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols- w-full 1 sm:grid-cols-2 gap-3 sm:p-4 lg:p-6">
                {/* Top Clients */}
                <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Award" size={20} sm:size={20} color="var(--color-primary)" />
                    Top Klien
                  </h3>
                  <div className="space-y-3">
                    {kpiData.topClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
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
                <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
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
              <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="BarChart3" size={20} sm:size={20} color="var(--color-success)" />
                  Pertumbuhan Klien Bulanan
                </h3>
                <div className="flex items-end justify-between gap-4 h-48">
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
              <div className="grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
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
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{kpi.value}</span>
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
                  <Icon name="BarChart3" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum ada KPI. Tambahkan KPI pertama Anda!</p>
                </div>
              )}
            </div>
          )}

          {/* Modal Form */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-lg overflow-hidden max-w-md w-full p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
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

                  <div className="grid grid-cols- w-full 1 sm:grid-cols-2 gap-4">
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

                  <div className="flex gap-3 pt-4">
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
