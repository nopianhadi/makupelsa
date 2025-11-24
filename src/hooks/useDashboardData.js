import { useState, useEffect, useMemo } from 'react';
import { dataStore } from '../utils/dataStore';
import { format, isAfter, isBefore, addDays, startOfDay } from 'date-fns';

/**
 * Custom hook untuk mengambil data dashboard dari dataStore
 * Menggabungkan data dari clients, invoices, dan projects
 */
export const useDashboardData = () => {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data dari dataStore
  const loadData = () => {
    try {
      setLoading(true);
      setClients(dataStore.getClients() || []);
      setInvoices(dataStore.getInvoices() || []);
      setProjects(dataStore.getProjects() || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen untuk perubahan data
    const handleDataChange = () => loadData();
    window.addEventListener('dataUpdated', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataUpdated', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  // Hitung total income dari invoices yang paid
  const totalIncome = useMemo(() => {
    return invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (parseFloat(inv.grandTotal) || 0), 0);
  }, [invoices]);

  // Hitung total expenses - untuk sementara dari localStorage atau default 0
  // Karena expense belum tersimpan di dataStore
  const totalExpenses = useMemo(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        const expenses = JSON.parse(savedExpenses);
        return expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
    return 0;
  }, []);

  // Hitung pending payments dari clients
  const pendingPayments = useMemo(() => {
    let total = 0;
    clients.forEach(client => {
      const totalPayment = parseFloat(client.totalPayment) || 0;
      const paidAmount = (client.paymentHistory || [])
        .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      const remaining = totalPayment - paidAmount;
      if (remaining > 0) {
        total += remaining;
      }
    });
    return total;
  }, [clients]);

  // Hitung net revenue
  const netRevenue = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  // Ambil upcoming schedules (7 hari ke depan)
  const upcomingSchedules = useMemo(() => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    const schedules = [];

    clients.forEach(client => {
      (client.events || []).forEach(event => {
        const eventDate = new Date(event.date);
        if (isAfter(eventDate, today) && isBefore(eventDate, nextWeek)) {
          // Calculate payment status
          const totalPayment = parseFloat(client.totalPayment) || 0;
          const paidAmount = (client.paymentHistory || [])
            .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
          
          let paymentStatus = 'pending';
          if (paidAmount >= totalPayment) {
            paymentStatus = 'paid';
          } else if (paidAmount > 0) {
            paymentStatus = 'partial';
          }

          schedules.push({
            id: `${client.id}-${event.id}`,
            clientId: client.id,
            clientName: client.name,
            serviceType: event.serviceType || 'other',
            date: event.date,
            time: event.time || '09:00',
            location: event.location || '-',
            paymentStatus,
            totalPayment,
            paidAmount
          });
        }
      });
    });

    return schedules.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [clients]);

  // Ambil pending payment list (pembayaran terlambat atau tertunda)
  const pendingPaymentList = useMemo(() => {
    const today = new Date();
    const list = [];

    clients.forEach(client => {
      const totalPayment = parseFloat(client.totalPayment) || 0;
      const paidAmount = (client.paymentHistory || [])
        .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      const remaining = totalPayment - paidAmount;

      if (remaining > 0) {
        // Find closest event or use current date + 7 days
        let dueDate = addDays(today, 7);
        if (client.events && client.events.length > 0) {
          const sortedEvents = [...client.events].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
          );
          const nextEvent = sortedEvents.find(e => isAfter(new Date(e.date), today));
          if (nextEvent) {
            dueDate = new Date(nextEvent.date);
          }
        }

        const serviceType = client.events?.[0]?.serviceType || 'Layanan Makeup';
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

        list.push({
          id: client.id,
          clientName: client.name,
          amount: remaining,
          dueDate: format(dueDate, 'yyyy-MM-dd'),
          serviceType,
          isOverdue: daysOverdue > 0,
          daysOverdue
        });
      }
    });

    return list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [clients]);

  // Hitung metrics
  const metrics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Total clients bulan ini
    const clientsThisMonth = clients.filter(client => {
      const createdDate = new Date(client.createdAt || client.date);
      return createdDate.getMonth() === currentMonth && 
             createdDate.getFullYear() === currentYear;
    }).length;

    // Jadwal minggu ini
    const schedulesThisWeek = upcomingSchedules.length;

    // Rata-rata pendapatan per klien
    const avgRevenuePerClient = clients.length > 0 
      ? Math.floor(totalIncome / clients.length)
      : 0;

    // Tingkat pembayaran tepat waktu
    const paidOnTimeCount = clients.filter(client => {
      const totalPayment = parseFloat(client.totalPayment) || 0;
      const paidAmount = (client.paymentHistory || [])
        .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      return paidAmount >= totalPayment;
    }).length;
    const paymentRate = clients.length > 0
      ? Math.floor((paidOnTimeCount / clients.length) * 100)
      : 0;

    return {
      totalClientsThisMonth: clientsThisMonth,
      schedulesThisWeek,
      avgRevenuePerClient,
      paymentRate
    };
  }, [clients, totalIncome, upcomingSchedules]);

  return {
    loading,
    revenueData: {
      totalIncome,
      pendingPayments,
      totalExpenses,
      netRevenue
    },
    upcomingSchedules: upcomingSchedules.slice(0, 3), // Top 3 only
    pendingPaymentList: pendingPaymentList.slice(0, 3), // Top 3 only
    metrics,
    refreshData: loadData
  };
};
