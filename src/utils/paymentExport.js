/**
 * Utility functions untuk export data pembayaran
 */

/**
 * Convert invoice data ke CSV format
 */
export const exportToCSV = (invoices) => {
  if (!invoices || invoices.length === 0) {
    throw new Error('Tidak ada data untuk di-export');
  }

  // Header CSV
  const headers = [
    'Invoice Number',
    'Tanggal',
    'Klien',
    'Layanan',
    'Total Amount',
    'Status',
    'Payment Method',
    'Due Date',
    'Paid Date',
    'Notes'
  ];

  // Convert data ke rows
  const rows = invoices.map(invoice => {
    return [
      invoice.invoiceNumber || '',
      invoice.date || '',
      invoice.client || '',
      invoice.serviceType || '',
      invoice.totalAmount || 0,
      invoice.status || '',
      invoice.paymentMethod || '',
      invoice.dueDate || '',
      invoice.paidDate || '',
      invoice.notes || ''
    ];
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
export const downloadCSV = (csvContent, filename = 'pembayaran.csv') => {
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
 * Export invoice dengan filter
 */
export const exportPaidInvoices = (invoices, filterOptions = {}) => {
  const { startDate, endDate, serviceType, paymentMethod } = filterOptions;
  
  let filtered = [...invoices];

  // Filter by date range
  if (startDate || endDate) {
    filtered = filtered.filter(invoice => {
      const paidDate = new Date(invoice.paidDate || invoice.date);
      
      if (startDate && paidDate < new Date(startDate)) return false;
      if (endDate && paidDate > new Date(endDate)) return false;
      
      return true;
    });
  }

  // Filter by service type
  if (serviceType) {
    filtered = filtered.filter(invoice => invoice.serviceType === serviceType);
  }

  // Filter by payment method
  if (paymentMethod) {
    filtered = filtered.filter(invoice => invoice.paymentMethod === paymentMethod);
  }

  const csvContent = exportToCSV(filtered);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `invoice-lunas-${timestamp}.csv`;
  
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
export const generatePaymentReport = (invoices) => {
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const avgPerInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  // Payment method breakdown
  const methodBreakdown = invoices.reduce((acc, invoice) => {
    const method = invoice.paymentMethod || 'other';
    if (!acc[method]) {
      acc[method] = { count: 0, revenue: 0 };
    }
    acc[method].count += 1;
    acc[method].revenue += (invoice.totalAmount || 0);
    return acc;
  }, {});

  // Service type breakdown
  const serviceBreakdown = invoices.reduce((acc, invoice) => {
    const service = invoice.serviceType || 'other';
    if (!acc[service]) {
      acc[service] = { count: 0, revenue: 0 };
    }
    acc[service].count += 1;
    acc[service].revenue += (invoice.totalAmount || 0);
    return acc;
  }, {});

  // Monthly breakdown
  const monthlyBreakdown = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.paidDate || invoice.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { count: 0, revenue: 0 };
    }
    acc[monthKey].count += 1;
    acc[monthKey].revenue += (invoice.totalAmount || 0);
    return acc;
  }, {});

  return {
    summary: {
      totalInvoices,
      totalRevenue,
      avgPerInvoice
    },
    methodBreakdown,
    serviceBreakdown,
    monthlyBreakdown
  };
};

/**
 * Export summary report as text
 */
export const exportPaymentReport = (invoices) => {
  const report = generatePaymentReport(invoices);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  let reportText = '=== LAPORAN PEMBAYARAN ===\n\n';
  reportText += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
  
  reportText += '--- RINGKASAN ---\n';
  reportText += `Total Invoice: ${report.summary.totalInvoices}\n`;
  reportText += `Total Pendapatan: ${formatCurrency(report.summary.totalRevenue)}\n`;
  reportText += `Rata-rata per Invoice: ${formatCurrency(report.summary.avgPerInvoice)}\n\n`;
  
  reportText += '--- BREAKDOWN METODE PEMBAYARAN ---\n';
  Object.entries(report.methodBreakdown).forEach(([method, data]) => {
    reportText += `${method}: ${data.count}x - ${formatCurrency(data.revenue)}\n`;
  });
  
  reportText += '\n--- BREAKDOWN LAYANAN ---\n';
  Object.entries(report.serviceBreakdown).forEach(([service, data]) => {
    reportText += `${service.toUpperCase()}: ${data.count}x - ${formatCurrency(data.revenue)}\n`;
  });
  
  reportText += '\n--- BREAKDOWN BULANAN ---\n';
  Object.entries(report.monthlyBreakdown)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([month, data]) => {
      reportText += `${month}: ${data.count} invoice - ${formatCurrency(data.revenue)}\n`;
    });

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-pembayaran-${timestamp}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return report;
};
