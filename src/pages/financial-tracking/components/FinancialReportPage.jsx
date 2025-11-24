import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { exportFinancialReport, downloadFinancialCSV } from '../../../utils/financialExport';

const FinancialReportPage = ({ incomes = [], expenses = [] }) => {
  const [reportFilters, setReportFilters] = useState({
    dateFrom: '',
    dateTo: '',
    groupBy: 'month' // month, week, day
  });

  // Calculate filtered data
  const filteredData = useMemo(() => {
    let filteredIncomes = [...incomes];
    let filteredExpenses = [...expenses];

    if (reportFilters.dateFrom) {
      const fromDate = new Date(reportFilters.dateFrom);
      filteredIncomes = filteredIncomes.filter(item => 
        new Date(item.transactionDate) >= fromDate
      );
      filteredExpenses = filteredExpenses.filter(item => 
        new Date(item.transactionDate) >= fromDate
      );
    }

    if (reportFilters.dateTo) {
      const toDate = new Date(reportFilters.dateTo);
      filteredIncomes = filteredIncomes.filter(item => 
        new Date(item.transactionDate) <= toDate
      );
      filteredExpenses = filteredExpenses.filter(item => 
        new Date(item.transactionDate) <= toDate
      );
    }

    return { incomes: filteredIncomes, expenses: filteredExpenses };
  }, [incomes, expenses, reportFilters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = filteredData.incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = filteredData.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

    // Income by service type
    const incomeByService = filteredData.incomes.reduce((acc, item) => {
      const service = item.serviceType || 'other';
      acc[service] = (acc[service] || 0) + item.amount;
      return acc;
    }, {});

    // Expense by category
    const expenseByCategory = filteredData.expenses.reduce((acc, item) => {
      const category = item.category || 'other';
      acc[category] = (acc[category] || 0) + item.amount;
      return acc;
    }, {});

    // Income by payment method
    const incomeByMethod = filteredData.incomes.reduce((acc, item) => {
      const method = item.paymentMethod || 'other';
      acc[method] = (acc[method] || 0) + item.amount;
      return acc;
    }, {});

    return {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin,
      incomeByService,
      expenseByCategory,
      incomeByMethod,
      transactionCount: filteredData.incomes.length + filteredData.expenses.length
    };
  }, [filteredData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleExportCSV = () => {
    try {
      downloadFinancialCSV(filteredData.incomes, filteredData.expenses, reportFilters);
      alert('Laporan CSV berhasil diunduh!');
    } catch (error) {
      alert('Gagal mengunduh laporan: ' + error.message);
    }
  };

  const handleExportReport = () => {
    try {
      exportFinancialReport(filteredData.incomes, filteredData.expenses, stats);
      alert('Laporan lengkap berhasil diunduh!');
    } catch (error) {
      alert('Gagal mengunduh laporan: ' + error.message);
    }
  };

  const categoryLabels = {
    cosmetics: 'Kosmetik',
    equipment: 'Peralatan',
    salary: 'Gaji',
    transport: 'Transportasi',
    marketing: 'Marketing',
    rent: 'Sewa Tempat',
    utilities: 'Utilitas',
    other: 'Lainnya'
  };

  const serviceLabels = {
    akad: 'Akad Nikah',
    resepsi: 'Resepsi',
    prewedding: 'Prewedding',
    engagement: 'Lamaran',
    wisuda: 'Wisuda',
    party: 'Party',
    photoshoot: 'Photoshoot',
    other: 'Lainnya'
  };

  const methodLabels = {
    cash: 'Tunai',
    transfer: 'Transfer Bank',
    debit: 'Kartu Debit',
    credit: 'Kartu Kredit',
    ewallet: 'E-Wallet',
    qris: 'QRIS'
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Laporan Keuangan
            </h2>
            <p className="text-sm text-muted-foreground">
              Analisis lengkap pemasukan dan pengeluaran bisnis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-smooth text-sm font-medium"
            >
              <Icon name="FileSpreadsheet" size={16} className="inline mr-2" />
              Export CSV
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth text-sm font-medium"
            >
              <Icon name="Download" size={16} className="inline mr-2" />
              Download Laporan
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={reportFilters.dateFrom}
              onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={reportFilters.dateTo}
              onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Kelompokkan
            </label>
            <select
              value={reportFilters.groupBy}
              onChange={(e) => setReportFilters({ ...reportFilters, groupBy: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="day">Per Hari</option>
              <option value="week">Per Minggu</option>
              <option value="month">Per Bulan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Pemasukan</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(stats.totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredData.incomes.length} transaksi
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Pengeluaran</span>
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(stats.totalExpense)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredData.expenses.length} transaksi
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Laba Bersih</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(stats.netProfit)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Margin: {stats.profitMargin}%
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Transaksi</span>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.transactionCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pemasukan & Pengeluaran
          </p>
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Breakdown Pemasukan per Layanan
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.incomeByService)
            .sort((a, b) => b[1] - a[1])
            .map(([service, amount]) => {
              const percentage = ((amount / stats.totalIncome) * 100).toFixed(1);
              return (
                <div key={service} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {serviceLabels[service] || service}
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingDown" size={20} />
          Breakdown Pengeluaran per Kategori
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.expenseByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => {
              const percentage = ((amount / stats.totalExpense) * 100).toFixed(1);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {categoryLabels[category] || category}
                    </span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="CreditCard" size={20} />
          Breakdown Metode Pembayaran
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.incomeByMethod)
            .sort((a, b) => b[1] - a[1])
            .map(([method, amount]) => {
              const percentage = ((amount / stats.totalIncome) * 100).toFixed(1);
              return (
                <div key={method} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {methodLabels[method] || method}
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(amount)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {percentage}% dari total
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FinancialReportPage;
