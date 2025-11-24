import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickActionButton from '../../components/ui/QuickActionButton';
import RevenueCard from './components/RevenueCard';
import UpcomingScheduleCard from './components/UpcomingScheduleCard';
import PendingPaymentAlert from './components/PendingPaymentAlert';
import MetricCard from './components/MetricCard';
import Icon from '../../components/AppIcon';
import { useDashboardData } from '../../hooks/useDashboardData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentMonth] = useState(new Date()?.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }));
  
  const {
    loading,
    revenueData,
    upcomingSchedules,
    pendingPaymentList,
    metrics: dashboardMetrics
  } = useDashboardData();

  const metrics = [
    {
      title: "Total Klien Bulan Ini",
      value: dashboardMetrics.totalClientsThisMonth.toString(),
      subtitle: "klien baru",
      icon: "Users",
      trend: "up",
      trendValue: "15"
    },
    {
      title: "Jadwal Minggu Ini",
      value: dashboardMetrics.schedulesThisWeek.toString(),
      subtitle: "acara mendatang",
      icon: "Calendar",
      trend: "up",
      trendValue: "8"
    },
    {
      title: "Rata-rata Pendapatan",
      value: `Rp ${(dashboardMetrics.avgRevenuePerClient / 1000000).toFixed(1)} Jt`,
      subtitle: "per klien",
      icon: "TrendingUp",
      trend: "up",
      trendValue: "12"
    },
    {
      title: "Tingkat Pembayaran",
      value: `${dashboardMetrics.paymentRate}%`,
      subtitle: "klien lunas",
      icon: "CheckCircle2",
      trend: "up",
      trendValue: "5"
    }
  ];

  const handleRemindPayment = (paymentId) => {
    console.log('Sending payment reminder for:', paymentId);
  };

  const handleAddClient = () => {
    navigate('/app/client-management');
  };

  const handleRecordExpense = () => {
    navigate('/app/financial-tracking');
  };

  const handleViewCalendar = () => {
    navigate('/app/calendar-scheduling');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full max-w-full-xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-4 sm:py-6 pb-24 lg:pb-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-xs sm:text-xs sm:text-sm text-muted-foreground mt-1">
                Ringkasan bisnis untuk {currentMonth}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <QuickActionButton
                label="Tambah Klien"
                icon="UserPlus"
                variant="primary"
                onClick={handleAddClient}
              />
              <QuickActionButton
                label="Catat Pengeluaran"
                icon="Receipt"
                variant="outline"
                onClick={handleRecordExpense}
              />
            </div>
          </div>
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 w-full">
          <RevenueCard
            title="Total Pendapatan"
            amount={revenueData?.totalIncome}
            trend="up"
            trendValue="23"
            icon="Wallet"
            variant="default"
          />
          <RevenueCard
            title="Pembayaran Tertunda"
            amount={revenueData?.pendingPayments}
            trend="down"
            trendValue="8"
            icon="Clock"
            variant="warning"
          />
          <RevenueCard
            title="Total Pengeluaran"
            amount={revenueData?.totalExpenses}
            trend="up"
            trendValue="12"
            icon="Receipt"
            variant="accent"
          />
          <RevenueCard
            title="Pendapatan Bersih"
            amount={revenueData?.netRevenue}
            trend="up"
            trendValue="28"
            icon="TrendingUp"
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 w-full">
          {/* Upcoming Schedule Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6 elevation-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Calendar" size={20} color="var(--color-primary)" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-semibold text-foreground truncate">
                      Jadwal Mendatang
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {upcomingSchedules?.length} acara minggu ini
                    </p>
                  </div>
                </div>
                <QuickActionButton
                  label="Lihat Kalender"
                  icon="Calendar"
                  variant="outline"
                  size="small"
                  onClick={handleViewCalendar}
                />
              </div>

              <div className="space-y-3">
                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                  upcomingSchedules.map((schedule) => (
                    <UpcomingScheduleCard
                      key={schedule?.id}
                      schedule={schedule}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Calendar" size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Tidak ada jadwal minggu ini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Payments Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6 elevation-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} color="var(--color-error)" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-foreground truncate">
                    Pembayaran Tertunda
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {pendingPaymentList?.length} pembayaran tertunda
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {pendingPaymentList && pendingPaymentList.length > 0 ? (
                  pendingPaymentList.map((payment) => (
                    <PendingPaymentAlert
                      key={payment?.id}
                      payment={payment}
                      onRemind={handleRemindPayment}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="CheckCircle" size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Semua pembayaran lunas!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-6 elevation-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="BarChart3" size={20} color="var(--color-accent)" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground truncate">
                Metrik Kinerja
              </h2>
              <p className="text-xs text-muted-foreground">
                Ringkasan performa bisnis bulan ini
              </p>
            </div>
          </div>

          <div className="grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full">
            {metrics?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                subtitle={metric?.subtitle}
                icon={metric?.icon}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
              />
            ))}
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="sm:hidden fixed bottom-20 left-4 right-4 z-40">
          <div className="bg-card border border-border rounded-lg overflow-hidden p-4 elevation-6">
            <div className="grid grid-cols- w-full 1 sm:grid-cols-2 gap-2">
              <QuickActionButton
                label="Tambah Klien"
                icon="UserPlus"
                variant="primary"
                size="small"
                onClick={handleAddClient}
                className="w-full"
              />
              <QuickActionButton
                label="Catat Pengeluaran"
                icon="Receipt"
                variant="outline"
                size="small"
                onClick={handleRecordExpense}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
