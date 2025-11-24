import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';

const ClientKPI = () => {
  const [kpiData, setKpiData] = useState({
    totalClients: 0,
    newClientsThisMonth: 0,
    retentionRate: 0,
    averageOrderValue: 0,
    topClients: [],
    clientsByService: [],
    monthlyGrowth: []
  });

  useEffect(() => {
    // Mock KPI data
    const mockKPI = {
      totalClients: 156,
      newClientsThisMonth: 24,
      retentionRate: 68,
      averageOrderValue: 3500000,
      topClients: [
        { name: "Siti Nurhaliza", totalSpent: 15000000, orders: 5 },
        { name: "Dewi Lestari", totalSpent: 12000000, orders: 4 },
        { name: "Ayu Kartika", totalSpent: 10000000, orders: 3 }
      ],
      clientsByService: [
        { service: "Akad", count: 45, percentage: 35 },
        { service: "Resepsi", count: 58, percentage: 45 },
        { service: "Wisuda", count: 26, percentage: 20 }
      ],
      monthlyGrowth: [
        { month: "Jul", clients: 12 },
        { month: "Agu", clients: 18 },
        { month: "Sep", clients: 22 },
        { month: "Okt", clients: 20 },
        { month: "Nov", clients: 24 }
      ]
    };
    setKpiData(mockKPI);
  }, []);

  return (
    <>
      <Helmet>
        <title>KPI Klien - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                KPI Klien
              </h1>
              <p className="text-sm text-muted-foreground">
                Analisis performa dan metrik klien bisnis Anda
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open('/testimonials/public', '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                <Icon name="MessageSquare" size={18} />
                <span className="hidden sm:inline">Lihat Testimoni</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Klien</span>
                <Icon name="Users" size={20} color="var(--color-primary)" />
              </div>
              <div className="text-3xl font-bold text-foreground">{kpiData.totalClients}</div>
              <div className="text-xs text-success mt-1">↑ +{kpiData.newClientsThisMonth} bulan ini</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Klien Baru</span>
                <Icon name="UserPlus" size={20} color="var(--color-accent)" />
              </div>
              <div className="text-3xl font-bold text-foreground">{kpiData.newClientsThisMonth}</div>
              <div className="text-xs text-muted-foreground mt-1">Bulan ini</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Retention Rate</span>
                <Icon name="TrendingUp" size={20} color="var(--color-success)" />
              </div>
              <div className="text-3xl font-bold text-foreground">{kpiData.retentionRate}%</div>
              <div className="text-xs text-success mt-1">↑ +5% dari bulan lalu</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Order Value</span>
                <Icon name="Wallet" size={20} color="var(--color-warning)" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                Rp {(kpiData.averageOrderValue / 1000000).toFixed(1)}jt
              </div>
              <div className="text-xs text-muted-foreground mt-1">Per transaksi</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Clients */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Award" size={20} color="var(--color-primary)" />
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
                      <div className="font-semibold text-foreground">
                        Rp {(client.totalSpent / 1000000).toFixed(1)}jt
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clients by Service */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="PieChart" size={20} color="var(--color-accent)" />
                Klien per Layanan
              </h3>
              <div className="space-y-4">
                {kpiData.clientsByService.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.service}</span>
                      <span className="text-sm text-muted-foreground">{item.count} klien ({item.percentage}%)</span>
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
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="BarChart3" size={20} color="var(--color-success)" />
              Pertumbuhan Klien Bulanan
            </h3>
            <div className="flex items-end justify-between gap-4 h-48">
              {kpiData.monthlyGrowth.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-medium text-foreground">{item.clients}</div>
                  <div 
                    className="w-full bg-primary rounded-t-lg transition-all"
                    style={{ height: `${(item.clients / 30) * 100}%` }}
                  />
                  <div className="text-xs text-muted-foreground">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ClientKPI;
