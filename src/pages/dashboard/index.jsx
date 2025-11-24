import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickActionButton from '../../components/ui/QuickActionButton';
import RevenueCard from './components/RevenueCard';
import UpcomingScheduleCard from './components/UpcomingScheduleCard';
import PendingPaymentAlert from './components/PendingPaymentAlert';
import MetricCard from './components/MetricCard';
import Icon from '../../components/AppIcon';
import { useDashboardData } from '../../hooks/useDashboardData';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

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
      <main className={cn("w-full max-w-7xl mx-auto pb-24 lg:pb-6", mobileClasses.container)}>
        {/* Header Section */}
        <div className={mobileClasses.marginBottomSmall}>
          <div className="flex items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
            <div>
              <h1 className={cn("font-heading font-bold text-foreground", mobileClasses.heading1)}>
                Dashboard
              </h1>
              <p className={cn("text-muted-foreground mt-0.5", mobileClasses.textSmall)}>
                Ringkasan bisnis untuk {currentMonth}
              </p>
            </div>
            <div className={cn("hidden sm:flex items-center", mobileClasses.gapSmall)}>
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
        <div className={cn("grid", mobileClasses.grid4, mobileClasses.gap, mobileClasses.marginBottomSmall)}>
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
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", mobileClasses.gap, "mb-4 sm:mb-6")}>
          {/* Upcoming Schedule Section */}
          <div className="lg:col-span-2">
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-1", mobileClasses.cardCompact)}>
              <div className={cn("flex items-center justify-between", mobileClasses.marginBottomSmall)}>
                <div className={cn("flex items-center", mobileClasses.gapSmall)}>
                  <div className={cn("rounded-lg bg-primary/10 flex items-center justify-center", mobileClasses.iconMedium)}>
                    <Icon name="Calendar" className="w-4 h-4 sm:w-5 sm:h-5" color="var(--color-primary)" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className={cn("font-heading font-semibold text-foreground truncate", mobileClasses.heading3)}>
                      Jadwal Mendatang
                    </h2>
                    <p className={cn("text-muted-foreground", mobileClasses.textTiny)}>
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

              <div className={cn("space-y-2", mobileClasses.gapSmall)}>
                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                  upcomingSchedules.map((schedule) => (
                    <UpcomingScheduleCard
                      key={schedule?.id}
                      schedule={schedule}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Icon name="Calendar" className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-20" />
                    <p className={mobileClasses.textSmall}>Tidak ada jadwal minggu ini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Payments Section */}
          <div className="lg:col-span-1">
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-1", mobileClasses.cardCompact)}>
              <div className={cn("flex items-center", mobileClasses.gapSmall, mobileClasses.marginBottomSmall)}>
                <div className={cn("rounded-lg bg-error/10 flex items-center justify-center", mobileClasses.iconMedium)}>
                  <Icon name="AlertCircle" className="w-4 h-4 sm:w-5 sm:h-5" color="var(--color-error)" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className={cn("font-heading font-semibold text-foreground truncate", mobileClasses.heading3)}>
                    Pembayaran Tertunda
                  </h2>
                  <p className={cn("text-muted-foreground", mobileClasses.textTiny)}>
                    {pendingPaymentList?.length} pembayaran tertunda
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {pendingPaymentList && pendingPaymentList.length > 0 ? (
                  pendingPaymentList.map((payment) => (
                    <PendingPaymentAlert
                      key={payment?.id}
                      payment={payment}
                      onRemind={handleRemindPayment}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Icon name="CheckCircle" className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-20" />
                    <p className={mobileClasses.textSmall}>Semua pembayaran lunas!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-1", mobileClasses.cardCompact)}>
          <div className={cn("flex items-center", mobileClasses.gapSmall, mobileClasses.marginBottomSmall)}>
            <div className={cn("rounded-lg bg-accent/10 flex items-center justify-center", mobileClasses.iconMedium)}>
              <Icon name="BarChart3" className="w-4 h-4 sm:w-5 sm:h-5" color="var(--color-accent)" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className={cn("font-heading font-semibold text-foreground truncate", mobileClasses.heading3)}>
                Metrik Kinerja
              </h2>
              <p className={cn("text-muted-foreground", mobileClasses.textTiny)}>
                Ringkasan performa bisnis bulan ini
              </p>
            </div>
          </div>

          <div className={cn("grid", mobileClasses.grid4, mobileClasses.gap)}>
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
        <div className="sm:hidden fixed bottom-20 left-2 right-2 z-40">
          <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-6", mobileClasses.cardCompact)}>
            <div className={cn("grid grid-cols-2", mobileClasses.gapSmall)}>
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
