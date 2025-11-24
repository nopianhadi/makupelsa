import React from 'react';

const CompletedProjectStats = ({ projects }) => {
  const totalCompleted = projects.length;
  const totalRevenue = projects.reduce((sum, p) => sum + (p.paid || 0), 0);
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const fullyPaid = projects.filter(p => p.paid >= p.budget).length;
  const partialPaid = projects.filter(p => p.paid > 0 && p.paid < p.budget).length;
  
  const avgRevenuePerProject = totalCompleted > 0 ? totalRevenue / totalCompleted : 0;
  
  // Breakdown by type
  const typeBreakdown = projects.reduce((acc, project) => {
    const type = project.type || 'other';
    acc[type] = (acc[type] || 0) + 1;
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
      {/* Total Proyek Selesai */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Total Proyek</span>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {fullyPaid} lunas, {partialPaid} partial
        </p>
      </div>

      {/* Total Pendapatan */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(totalRevenue)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Dari {totalCompleted} proyek
        </p>
      </div>

      {/* Rata-rata per Proyek */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Rata-rata/Proyek</span>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(avgRevenuePerProject)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Per proyek selesai
        </p>
      </div>

      {/* Tipe Terpopuler */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Tipe Populer</span>
          <span className="text-2xl">⭐</span>
        </div>
        <div className="space-y-1">
          {Object.entries(typeBreakdown)
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

export default CompletedProjectStats;
