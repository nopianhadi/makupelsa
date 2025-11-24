import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialSummaryCards = ({ summaryData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value?.toFixed(1)}%`;
  };

  const cards = [
    {
      id: 'income',
      title: 'Total Pemasukan',
      value: summaryData?.totalIncome,
      trend: summaryData?.incomeTrend,
      icon: 'TrendingUp',
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      borderColor: 'border-success/20'
    },
    {
      id: 'expense',
      title: 'Total Pengeluaran',
      value: summaryData?.totalExpense,
      trend: summaryData?.expenseTrend,
      icon: 'TrendingDown',
      bgColor: 'bg-error/10',
      iconColor: 'text-error',
      borderColor: 'border-error/20'
    },
    {
      id: 'profit',
      title: 'Keuntungan Bersih',
      value: summaryData?.netProfit,
      trend: summaryData?.profitTrend,
      icon: 'Wallet',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    {
      id: 'margin',
      title: 'Margin Keuntungan',
      value: `${summaryData?.profitMargin}%`,
      trend: summaryData?.marginTrend,
      icon: 'Percent',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
      borderColor: 'border-accent/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards?.map((card) => (
        <div
          key={card?.id}
          className={`
            p-4 rounded-lg bg-card border ${card?.borderColor}
            elevation-1 hover:elevation-3 transition-smooth
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`
              w-10 h-10 rounded-md flex items-center justify-center
              ${card?.bgColor}
            `}>
              <Icon 
                name={card?.icon} 
                size={20} 
                className={card?.iconColor}
                strokeWidth={2.5}
              />
            </div>
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-md
              ${card?.trend >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}
            `}>
              <Icon 
                name={card?.trend >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                size={12} 
                strokeWidth={2.5}
              />
              <span className="text-xs font-mono font-semibold">
                {formatPercentage(card?.trend)}
              </span>
            </div>
          </div>
          <p className="text-xs font-caption text-muted-foreground mb-1">
            {card?.title}
          </p>
          <p className="text-xl font-heading font-bold text-foreground">
            {typeof card?.value === 'number' ? formatCurrency(card?.value) : card?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FinancialSummaryCards;