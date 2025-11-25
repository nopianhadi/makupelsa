import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { mobileClasses, cn } from '../../../utils/mobileOptimization';

const CashflowCard = ({ incomes = [], expenses = [] }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate cashflow data
  const cashflowData = useMemo(() => {
    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const netCashflow = totalIncome - totalExpense;
    const cashflowRatio = totalIncome > 0 ? ((netCashflow / totalIncome) * 100).toFixed(1) : 0;

    // Get current month data
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = incomes.filter(item => {
      const date = new Date(item.transactionDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, item) => sum + (item.amount || 0), 0);

    const monthlyExpense = expenses.filter(item => {
      const date = new Date(item.transactionDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, item) => sum + (item.amount || 0), 0);

    const monthlyNetCashflow = monthlyIncome - monthlyExpense;

    return {
      totalIncome,
      totalExpense,
      netCashflow,
      cashflowRatio,
      monthlyIncome,
      monthlyExpense,
      monthlyNetCashflow,
      isPositive: netCashflow >= 0,
      monthlyIsPositive: monthlyNetCashflow >= 0
    };
  }, [incomes, expenses]);

  return (
    <div className={cn("mb-6", mobileClasses.marginBottom)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="TrendingUp" size={18} color="var(--color-primary)" strokeWidth={2.5} />
        </div>
        <h3 className={cn("font-heading font-semibold text-foreground", mobileClasses.heading3)}>
          Arus Kas (Cashflow)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Cashflow Card */}
        <div className="p-4 rounded-lg bg-card border border-border elevation-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Arus Kas</p>
              <p className={cn(
                "text-2xl font-bold font-mono",
                cashflowData.isPositive ? "text-success" : "text-error"
              )}>
                {formatCurrency(cashflowData.netCashflow)}
              </p>
            </div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              cashflowData.isPositive ? "bg-success/10" : "bg-error/10"
            )}>
              <Icon 
                name={cashflowData.isPositive ? "TrendingUp" : "TrendingDown"} 
                size={20} 
                className={cashflowData.isPositive ? "text-success" : "text-error"}
                strokeWidth={2.5}
              />
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="ArrowDownCircle" size={12} className="text-success" />
                Pemasukan
              </span>
              <span className="text-xs font-semibold text-success">
                {formatCurrency(cashflowData.totalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="ArrowUpCircle" size={12} className="text-error" />
                Pengeluaran
              </span>
              <span className="text-xs font-semibold text-error">
                {formatCurrency(cashflowData.totalExpense)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-medium text-foreground">Rasio Cashflow</span>
              <span className={cn(
                "text-xs font-bold",
                cashflowData.isPositive ? "text-success" : "text-error"
              )}>
                {cashflowData.cashflowRatio}%
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Cashflow Card */}
        <div className="p-4 rounded-lg bg-card border border-border elevation-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Arus Kas Bulan Ini</p>
              <p className={cn(
                "text-2xl font-bold font-mono",
                cashflowData.monthlyIsPositive ? "text-success" : "text-error"
              )}>
                {formatCurrency(cashflowData.monthlyNetCashflow)}
              </p>
            </div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              cashflowData.monthlyIsPositive ? "bg-success/10" : "bg-error/10"
            )}>
              <Icon 
                name="Calendar" 
                size={20} 
                className={cashflowData.monthlyIsPositive ? "text-success" : "text-error"}
                strokeWidth={2.5}
              />
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="ArrowDownCircle" size={12} className="text-success" />
                Pemasukan
              </span>
              <span className="text-xs font-semibold text-success">
                {formatCurrency(cashflowData.monthlyIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="ArrowUpCircle" size={12} className="text-error" />
                Pengeluaran
              </span>
              <span className="text-xs font-semibold text-error">
                {formatCurrency(cashflowData.monthlyExpense)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-medium text-foreground">Status</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                cashflowData.monthlyIsPositive 
                  ? "bg-success/10 text-success" 
                  : "bg-error/10 text-error"
              )}>
                {cashflowData.monthlyIsPositive ? "Surplus" : "Defisit"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashflowCard;
