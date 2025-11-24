import React from 'react';

const CompletedPaymentStats = ({ invoices }) => {
  const totalCompleted = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const avgPerInvoice = totalCompleted > 0 ? totalRevenue / totalCompleted : 0;
  
  // Breakdown by payment method
  const methodBreakdown = invoices.reduce((acc, invoice) => {
    const method = invoice.paymentMethod || 'Transfer Bank';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  // Breakdown by service type
  const serviceBreakdown = invoices.reduce((acc, invoice) => {
    const service = invoice.serviceType || 'other';
    acc[service] = (acc[service] || 0) + 1;
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
      {/* Total Invoice Lunas */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Total Invoice</span>
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Invoice lunas
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
          Dari invoice lunas
        </p>
      </div>

      {/* Rata-rata per Invoice */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Rata-rata/Invoice</span>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(avgPerInvoice)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Per invoice
        </p>
      </div>

      {/* Metode Populer */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Metode Populer</span>
          <span className="text-2xl">💳</span>
        </div>
        <div className="space-y-1">
          {Object.entries(methodBreakdown)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([method, count]) => (
              <div key={method} className="flex items-center justify-between text-xs">
                <span className="text-foreground truncate">{method}</span>
                <span className="font-semibold text-primary">{count}x</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedPaymentStats;
