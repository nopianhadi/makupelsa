import React from 'react';

const CompletedClientStats = ({ clients }) => {
  // Hitung statistik
  const totalCompleted = clients.length;
  const totalRevenue = clients.reduce((sum, client) => sum + (client.totalAmount || 0), 0);
  const paidClients = clients.filter(c => c.paymentStatus === 'paid').length;
  const unpaidClients = clients.filter(c => c.paymentStatus !== 'paid').length;
  
  // Hitung rata-rata per klien
  const avgRevenuePerClient = totalCompleted > 0 ? totalRevenue / totalCompleted : 0;
  
  // Breakdown by service type
  const serviceBreakdown = clients.reduce((acc, client) => {
    client.events?.forEach(event => {
      const type = event.serviceType || 'other';
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Klien Selesai */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Total Klien</span>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {paidClients} lunas, {unpaidClients} belum lunas
        </p>
      </div>

      {/* Total Pendapatan */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Total Pendapatan</span>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(totalRevenue)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Dari klien selesai
        </p>
      </div>

      {/* Rata-rata per Klien */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Rata-rata/Klien</span>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(avgRevenuePerClient)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Per klien selesai
        </p>
      </div>

      {/* Layanan Terpopuler */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Layanan Populer</span>
          <span className="text-2xl">⭐</span>
        </div>
        <div className="space-y-1">
          {Object.entries(serviceBreakdown)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-xs">
                <span className="text-foreground capitalize">{type}</span>
                <span className="font-semibold text-primary">{count}x</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedClientStats;
