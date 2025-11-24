import React from 'react';
import Icon from '../../../components/AppIcon';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FinancialReportView = ({ reportData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const COLORS = {
    income: 'var(--color-success)',
    expense: 'var(--color-error)',
    profit: 'var(--color-primary)',
    cosmetics: 'var(--color-secondary)',
    salary: 'var(--color-primary)',
    transport: 'var(--color-accent)',
    equipment: 'var(--color-warning)',
    marketing: 'var(--color-success)',
    other: 'var(--color-muted-foreground)'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 elevation-6">
          <p className="text-xs font-caption text-muted-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs font-mono font-semibold" style={{ color: entry?.color }}>
              {entry?.name}: {formatCurrency(entry?.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Monthly Trend Chart */}
      <div className="p-4 rounded-lg bg-card border border-border elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading font-semibold text-foreground">
            Tren Keuangan Bulanan
          </h3>
          <Icon name="TrendingUp" size={18} color="var(--color-primary)" />
        </div>
        <div className="w-full h-64" aria-label="Grafik tren keuangan bulanan">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData?.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000)?.toFixed(1)}jt`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                name="Pemasukan"
                stroke={COLORS?.income} 
                strokeWidth={2}
                dot={{ fill: COLORS?.income, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                name="Pengeluaran"
                stroke={COLORS?.expense} 
                strokeWidth={2}
                dot={{ fill: COLORS?.expense, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="Keuntungan"
                stroke={COLORS?.profit} 
                strokeWidth={2}
                dot={{ fill: COLORS?.profit, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Income vs Expense Comparison */}
      <div className="p-4 rounded-lg bg-card border border-border elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading font-semibold text-foreground">
            Perbandingan Pemasukan & Pengeluaran
          </h3>
          <Icon name="BarChart3" size={18} color="var(--color-primary)" />
        </div>
        <div className="w-full h-64" aria-label="Grafik perbandingan pemasukan dan pengeluaran">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData?.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000)?.toFixed(1)}jt`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="income" 
                name="Pemasukan"
                fill={COLORS?.income} 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="expense" 
                name="Pengeluaran"
                fill={COLORS?.expense} 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Expense Breakdown */}
      <div className="p-4 rounded-lg bg-card border border-border elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading font-semibold text-foreground">
            Rincian Pengeluaran per Kategori
          </h3>
          <Icon name="PieChart" size={18} color="var(--color-primary)" />
        </div>
        <div className="w-full h-64" aria-label="Grafik rincian pengeluaran per kategori">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reportData?.expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData?.expenseBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[entry?.category] || COLORS?.other} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {reportData?.expenseBreakdown?.map((item) => (
            <div key={item?.category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS?.[item?.category] || COLORS?.other }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {item?.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-success" />
            <span className="text-xs font-caption text-success">Total Pemasukan</span>
          </div>
          <p className="text-xl font-mono font-bold text-success">
            {formatCurrency(reportData?.totalIncome)}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-error/10 border border-error/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingDown" size={18} className="text-error" />
            <span className="text-xs font-caption text-error">Total Pengeluaran</span>
          </div>
          <p className="text-xl font-mono font-bold text-error">
            {formatCurrency(reportData?.totalExpense)}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wallet" size={18} className="text-primary" />
            <span className="text-xs font-caption text-primary">Keuntungan Bersih</span>
          </div>
          <p className="text-xl font-mono font-bold text-primary">
            {formatCurrency(reportData?.netProfit)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportView;