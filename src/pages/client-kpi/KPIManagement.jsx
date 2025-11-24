import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';

const KPIManagement = () => {
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

  useEffect(() => {
    loadKPIs();
  }, []);

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

  const saveKPIs = (data) => {
    localStorage.setItem('kpi_data', JSON.stringify(data));
  };

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

  return (
    <>
      <Helmet>
        <title>Manajemen KPI - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                Manajemen KPI
              </h1>
              <p className="text-sm text-muted-foreground">
                Kelola Key Performance Indicators bisnis Anda
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Plus" size={20} />
              <span className="hidden sm:inline">Tambah KPI</span>
            </button>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="bg-card border border-border rounded-lg overflow-hidden p-6 hover:shadow-lg transition-shadow">
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
                    <span className="text-3xl font-bold text-foreground">{kpi.value}</span>
                    <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
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
        </main>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {editingKpi ? 'Edit KPI' : 'Tambah KPI Baru'}
                </h2>
                <button onClick={resetForm} className="p-1 hover:bg-muted rounded">
                  <Icon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
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
                    <label className="block text-sm font-medium text-foreground mb-1">
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
                  <label className="block text-sm font-medium text-foreground mb-1">
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
                  <label className="block text-sm font-medium text-foreground mb-1">
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
                  <label className="block text-sm font-medium text-foreground mb-1">
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
      </div>
    </>
  );
};

export default KPIManagement;
