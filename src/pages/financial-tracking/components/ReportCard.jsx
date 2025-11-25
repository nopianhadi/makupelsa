import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { mobileClasses, cn } from '../../../utils/mobileOptimization';

const ReportCard = ({ incomes = [], expenses = [], onViewReport }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate report summary
  const reportSummary = useMemo(() => {
    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

    // Count transactions
    const totalTransactions = incomes.length + expenses.length;
    const incomeTransactions = incomes.length;
    const expenseTransactions = expenses.length;

    // Get top expense category
    const expenseByCategory = {};
    expenses.forEach(expense => {
      const category = expense.category || 'other';
      expenseByCategory[category] = (expenseByCategory[category] || 0) + expense.amount;
    });

    const topExpenseCategory = Object.entries(expenseByCategory)
      .sort((a, b) => b[1] - a[1])[0];

    // Get top income service
    const incomeByService = {};
    incomes.forEach(income => {
      const service = income.serviceType || 'other';
      incomeByService[service] = (incomeByService[service] || 0) + income.amount;
    });

    const topIncomeService = Object.entries(incomeByService)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin,
      totalTransactions,
      incomeTransactions,
      expenseTransactions,
      topExpenseCategory: topExpenseCategory ? {
        name: topExpenseCategory[0],
        amount: topExpenseCategory[1]
      } : null,
      topIncomeService: topIncomeService ? {
        name: topIncomeService[0],
        amount: topIncomeService[1]
      } : null,
      isProfit: netProfit >= 0
    };
  }, [incomes, expenses]);

  const categoryLabels = {
    cosmetics: 'Kosmetik',
    salary: 'Gaji Asisten',
    transport: 'Transportasi',
    equipment: 'Peralatan',
    marketing: 'Marketing',
    other: 'Lainnya'
  };

  const serviceLabels = {
    akad: 'Akad',
    resepsi: 'Resepsi',
    wisuda: 'Wisuda',
    other: 'Lainnya'
  };

  return (
    <div className={cn("mb-6", mobileClasses.marginBottom)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="BarChart3" size={18} color="var(--color-accent)" strokeWidth={2.5} />
        </div>
        <h3 className={cn("font-heading font-semibold text-foreground", mobileClasses.heading3)}>
          Ringkasan Laporan
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Profit Summary Card */}
        <div className="p-4 rounded-lg bg-card border border-border elevation-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              reportSummary.isProfit ? "bg-success/10" : "bg-error/10"
            )}>
              <Icon 
                name={reportSummary.isProfit ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={reportSummary.isProfit ? "text-success" : "text-error"}
                strokeWidth={2.5}
              />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Laba Bersih</p>
          </div>
          <p className={cn(
            "text-xl font-bold font-mono mb-1",
            reportSummary.isProfit ? "text-success" : "text-error"
          )}>
            {formatCurrency(reportSummary.netProfit)}
          </p>
          <p className="text-xs text-muted-foreground">
            Margin: <span className="font-semibold">{reportSummary.profitMargin}%</span>
          </p>
        </div>

        {/* Transactions Summary Card */}
        <div className="p-4 rounded-lg bg-card border border-border elevation-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Activity" size={16} color="var(--color-primary)" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Total Transaksi</p>
          </div>
          <p className="text-xl font-bold font-mono text-foreground mb-2">
            {reportSummary.totalTransactions}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-success flex items-center gap-1">
              <Icon name="ArrowDown" size={12} />
              {reportSummary.incomeTransactions}
            </span>
            <span className="text-error flex items-center gap-1">
              <Icon name="ArrowUp" size={12} />
              {reportSummary.expenseTransactions}
            </span>
          </div>
        </div>

        {/* Top Categories Card */}
        <div className="p-4 rounded-lg bg-card border border-border elevation-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
              <Icon name="Star" size={16} color="var(--color-warning)" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Kategori Teratas</p>
          </div>
          
          {reportSummary.topIncomeService && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground mb-1">Pemasukan Terbesar:</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {serviceLabels[reportSummary.topIncomeService.name] || reportSummary.topIncomeService.name}
                </span>
                <span className="text-xs font-bold text-success">
                  {formatCurrency(reportSummary.topIncomeService.amount)}
                </span>
              </div>
            </div>
          )}

          {reportSummary.topExpenseCategory && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Pengeluaran Terbesar:</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {categoryLabels[reportSummary.topExpenseCategory.name] || reportSummary.topExpenseCategory.name}
                </span>
                <span className="text-xs font-bold text-error">
                  {formatCurrency(reportSummary.topExpenseCategory.amount)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Pemasukan</p>
            <p className="text-sm font-bold text-success">
              {formatCurrency(reportSummary.totalIncome)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Pengeluaran</p>
            <p className="text-sm font-bold text-error">
              {formatCurrency(reportSummary.totalExpense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Rata-rata Pemasukan</p>
            <p className="text-sm font-bold text-foreground">
              {reportSummary.incomeTransactions > 0 
                ? formatCurrency(reportSummary.totalIncome / reportSummary.incomeTransactions)
                : 'Rp 0'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Rata-rata Pengeluaran</p>
            <p className="text-sm font-bold text-foreground">
              {reportSummary.expenseTransactions > 0 
                ? formatCurrency(reportSummary.totalExpense / reportSummary.expenseTransactions)
                : 'Rp 0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
