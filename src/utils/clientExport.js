/**
 * Utility functions untuk export data klien selesai
 */

/**
 * Convert klien data ke CSV format
 */
export const exportToCSV = (clients) => {
  if (!clients || clients.length === 0) {
    throw new Error('Tidak ada data untuk di-export');
  }

  // Header CSV
  const headers = [
    'Nama',
    'Telepon',
    'Email',
    'Lokasi',
    'Jenis Layanan',
    'Tanggal Event',
    'Venue',
    'Total Amount',
    'Status Pembayaran',
    'Total Dibayar',
    'Sisa Pembayaran',
    'Tanggal Selesai'
  ];

  // Convert data ke rows
  const rows = clients.flatMap(client => {
    return client.events.map(event => {
      const totalPaid = client.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const remaining = (client.totalAmount || 0) - totalPaid;
      
      return [
        client.name || '',
        client.phone || '',
        client.email || '',
        client.location || '',
        event.serviceType || '',
        event.eventDate || '',
        event.venue || '',
        client.totalAmount || 0,
        client.paymentStatus || '',
        totalPaid,
        remaining,
        event.eventDate || ''
      ];
    });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'klien-selesai.csv') => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export klien selesai dengan filter
 */
export const exportCompletedClients = (clients, filterOptions = {}) => {
  const { startDate, endDate, serviceType, paymentStatus } = filterOptions;
  
  let filtered = [...clients];

  // Filter by date range
  if (startDate || endDate) {
    filtered = filtered.filter(client => {
      const lastEventDate = new Date(Math.max(...client.events.map(e => new Date(e.eventDate))));
      
      if (startDate && lastEventDate < new Date(startDate)) return false;
      if (endDate && lastEventDate > new Date(endDate)) return false;
      
      return true;
    });
  }

  // Filter by service type
  if (serviceType) {
    filtered = filtered.filter(client => 
      client.events.some(e => e.serviceType === serviceType)
    );
  }

  // Filter by payment status
  if (paymentStatus) {
    filtered = filtered.filter(client => client.paymentStatus === paymentStatus);
  }

  const csvContent = exportToCSV(filtered);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `klien-selesai-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
  
  return {
    success: true,
    count: filtered.length,
    filename
  };
};

/**
 * Generate summary report
 */
export const generateSummaryReport = (clients) => {
  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  const paidClients = clients.filter(c => c.paymentStatus === 'paid').length;
  const unpaidRevenue = clients
    .filter(c => c.paymentStatus !== 'paid')
    .reduce((sum, c) => {
      const totalPaid = c.paymentHistory?.reduce((s, p) => s + p.amount, 0) || 0;
      return sum + ((c.totalAmount || 0) - totalPaid);
    }, 0);

  // Service breakdown
  const serviceBreakdown = clients.reduce((acc, client) => {
    client.events?.forEach(event => {
      const type = event.serviceType || 'other';
      if (!acc[type]) {
        acc[type] = { count: 0, revenue: 0 };
      }
      acc[type].count += 1;
      acc[type].revenue += (client.totalAmount || 0) / client.events.length;
    });
    return acc;
  }, {});

  // Monthly breakdown
  const monthlyBreakdown = clients.reduce((acc, client) => {
    client.events?.forEach(event => {
      const date = new Date(event.eventDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0, revenue: 0 };
      }
      acc[monthKey].count += 1;
      acc[monthKey].revenue += (client.totalAmount || 0) / client.events.length;
    });
    return acc;
  }, {});

  return {
    summary: {
      totalClients,
      totalRevenue,
      paidClients,
      unpaidClients: totalClients - paidClients,
      unpaidRevenue,
      averageRevenuePerClient: totalClients > 0 ? totalRevenue / totalClients : 0,
      paymentCompletionRate: totalClients > 0 ? (paidClients / totalClients) * 100 : 0
    },
    serviceBreakdown,
    monthlyBreakdown
  };
};

/**
 * Export summary report as text
 */
export const exportSummaryReport = (clients) => {
  const report = generateSummaryReport(clients);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  let reportText = '=== LAPORAN KLIEN SELESAI ===\n\n';
  reportText += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
  
  reportText += '--- RINGKASAN ---\n';
  reportText += `Total Klien: ${report.summary.totalClients}\n`;
  reportText += `Total Pendapatan: ${formatCurrency(report.summary.totalRevenue)}\n`;
  reportText += `Rata-rata per Klien: ${formatCurrency(report.summary.averageRevenuePerClient)}\n`;
  reportText += `Klien Lunas: ${report.summary.paidClients} (${report.summary.paymentCompletionRate.toFixed(1)}%)\n`;
  reportText += `Klien Belum Lunas: ${report.summary.unpaidClients}\n`;
  reportText += `Piutang: ${formatCurrency(report.summary.unpaidRevenue)}\n\n`;
  
  reportText += '--- BREAKDOWN LAYANAN ---\n';
  Object.entries(report.serviceBreakdown).forEach(([type, data]) => {
    reportText += `${type.toUpperCase()}: ${data.count}x - ${formatCurrency(data.revenue)}\n`;
  });
  
  reportText += '\n--- BREAKDOWN BULANAN ---\n';
  Object.entries(report.monthlyBreakdown)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([month, data]) => {
      reportText += `${month}: ${data.count} klien - ${formatCurrency(data.revenue)}\n`;
    });

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-klien-${timestamp}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return report;
};
