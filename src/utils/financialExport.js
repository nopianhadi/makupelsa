/**
 * Utility functions untuk export data keuangan
 */

/**
 * Format currency untuk Indonesia
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Convert financial data ke CSV format
 */
export const convertToCSV = (incomes, expenses) => {
  const headers = [
    'Tanggal',
    'Tipe',
    'Deskripsi',
    'Kategori/Layanan',
    'Jumlah',
    'Metode Pembayaran',
    'Catatan'
  ];

  const rows = [];

  // Add income rows
  incomes.forEach(income => {
    rows.push([
      income.transactionDate || '',
      'Pemasukan',
      income.clientName || '',
      income.serviceType || '',
      income.amount || 0,
      income.paymentMethod || '',
      income.notes || ''
    ]);
  });

  // Add expense rows
  expenses.forEach(expense => {
    rows.push([
      expense.transactionDate || '',
      'Pengeluaran',
      expense.description || '',
      expense.category || '',
      -Math.abs(expense.amount || 0), // Negative for expenses
      expense.paymentMethod || '',
      expense.notes || ''
    ]);
  });

  // Sort by date
  rows.sort((a, b) => new Date(b[0]) - new Date(a[0]));

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
export const downloadCSV = (csvContent, filename = 'laporan-keuangan.csv') => {
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
 * Export financial data dengan filter
 */
export const downloadFinancialCSV = (incomes, expenses, filterOptions = {}) => {
  const csvContent = convertToCSV(incomes, expenses);
  const timestamp = new Date().toISOString().split('T')[0];
  
  let filename = `laporan-keuangan-${timestamp}`;
  if (filterOptions.dateFrom && filterOptions.dateTo) {
    filename = `laporan-keuangan-${filterOptions.dateFrom}-to-${filterOptions.dateTo}`;
  }
  filename += '.csv';
  
  downloadCSV(csvContent, filename);
  
  return {
    success: true,
    count: incomes.length + expenses.length,
    filename
  };
};

/**
 * Generate detailed financial report
 */
export const generateFinancialReport = (incomes, expenses, stats) => {
  let reportText = '═══════════════════════════════════════════════\n';
  reportText += '          LAPORAN KEUANGAN LENGKAP\n';
  reportText += '═══════════════════════════════════════════════\n\n';
  reportText += `Tanggal Laporan: ${new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}\n\n`;
  
  reportText += '───────────────────────────────────────────────\n';
  reportText += '  RINGKASAN KEUANGAN\n';
  reportText += '───────────────────────────────────────────────\n\n';
  reportText += `Total Pemasukan    : ${formatCurrency(stats.totalIncome)}\n`;
  reportText += `Total Pengeluaran  : ${formatCurrency(stats.totalExpense)}\n`;
  reportText += `Laba Bersih        : ${formatCurrency(stats.netProfit)}\n`;
  reportText += `Margin Keuntungan  : ${stats.profitMargin}%\n`;
  reportText += `Total Transaksi    : ${stats.transactionCount}\n\n`;
  
  reportText += '───────────────────────────────────────────────\n';
  reportText += '  BREAKDOWN PEMASUKAN PER LAYANAN\n';
  reportText += '───────────────────────────────────────────────\n\n';
  
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
  
  Object.entries(stats.incomeByService)
    .sort((a, b) => b[1] - a[1])
    .forEach(([service, amount]) => {
      const percentage = ((amount / stats.totalIncome) * 100).toFixed(1);
      const label = serviceLabels[service] || service;
      reportText += `${label.padEnd(20)} : ${formatCurrency(amount).padStart(20)} (${percentage}%)\n`;
    });
  
  reportText += '\n───────────────────────────────────────────────\n';
  reportText += '  BREAKDOWN PENGELUARAN PER KATEGORI\n';
  reportText += '───────────────────────────────────────────────\n\n';
  
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
  
  Object.entries(stats.expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, amount]) => {
      const percentage = ((amount / stats.totalExpense) * 100).toFixed(1);
      const label = categoryLabels[category] || category;
      reportText += `${label.padEnd(20)} : ${formatCurrency(amount).padStart(20)} (${percentage}%)\n`;
    });
  
  reportText += '\n───────────────────────────────────────────────\n';
  reportText += '  BREAKDOWN METODE PEMBAYARAN\n';
  reportText += '───────────────────────────────────────────────\n\n';
  
  const methodLabels = {
    cash: 'Tunai',
    transfer: 'Transfer Bank',
    debit: 'Kartu Debit',
    credit: 'Kartu Kredit',
    ewallet: 'E-Wallet',
    qris: 'QRIS'
  };
  
  Object.entries(stats.incomeByMethod)
    .sort((a, b) => b[1] - a[1])
    .forEach(([method, amount]) => {
      const percentage = ((amount / stats.totalIncome) * 100).toFixed(1);
      const label = methodLabels[method] || method;
      reportText += `${label.padEnd(20)} : ${formatCurrency(amount).padStart(20)} (${percentage}%)\n`;
    });
  
  reportText += '\n───────────────────────────────────────────────\n';
  reportText += '  DETAIL TRANSAKSI PEMASUKAN\n';
  reportText += '───────────────────────────────────────────────\n\n';
  
  incomes
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .forEach((income, index) => {
      reportText += `${index + 1}. ${income.transactionDate} - ${income.clientName}\n`;
      reportText += `   Layanan: ${serviceLabels[income.serviceType] || income.serviceType}\n`;
      reportText += `   Jumlah: ${formatCurrency(income.amount)}\n`;
      reportText += `   Metode: ${methodLabels[income.paymentMethod] || income.paymentMethod}\n`;
      if (income.notes) {
        reportText += `   Catatan: ${income.notes}\n`;
      }
      reportText += '\n';
    });
  
  reportText += '───────────────────────────────────────────────\n';
  reportText += '  DETAIL TRANSAKSI PENGELUARAN\n';
  reportText += '───────────────────────────────────────────────\n\n';
  
  expenses
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .forEach((expense, index) => {
      reportText += `${index + 1}. ${expense.transactionDate} - ${expense.description}\n`;
      reportText += `   Kategori: ${categoryLabels[expense.category] || expense.category}\n`;
      reportText += `   Jumlah: ${formatCurrency(expense.amount)}\n`;
      reportText += `   Metode: ${methodLabels[expense.paymentMethod] || expense.paymentMethod}\n`;
      if (expense.vendor) {
        reportText += `   Vendor: ${expense.vendor}\n`;
      }
      if (expense.notes) {
        reportText += `   Catatan: ${expense.notes}\n`;
      }
      reportText += '\n';
    });
  
  reportText += '═══════════════════════════════════════════════\n';
  reportText += '           AKHIR LAPORAN\n';
  reportText += '═══════════════════════════════════════════════\n';

  return reportText;
};

/**
 * Export detailed financial report as text file
 */
export const exportFinancialReport = (incomes, expenses, stats) => {
  const reportText = generateFinancialReport(incomes, expenses, stats);
  
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-keuangan-lengkap-${timestamp}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    success: true,
    filename: `laporan-keuangan-lengkap-${timestamp}.txt`
  };
};

/**
 * Export filtered income data
 */
export const exportIncomeCSV = (incomes, filterOptions = {}) => {
  const headers = [
    'Tanggal',
    'Nama Klien',
    'Jenis Layanan',
    'Tipe Pembayaran',
    'Jumlah',
    'Metode Pembayaran',
    'Catatan'
  ];

  const rows = incomes.map(income => [
    income.transactionDate || '',
    income.clientName || '',
    income.serviceType || '',
    income.paymentType || '',
    income.amount || 0,
    income.paymentMethod || '',
    income.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `pemasukan-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
  
  return {
    success: true,
    count: incomes.length,
    filename
  };
};

/**
 * Export filtered expense data
 */
export const exportExpenseCSV = (expenses, filterOptions = {}) => {
  const headers = [
    'Tanggal',
    'Kategori',
    'Deskripsi',
    'Jumlah',
    'Vendor',
    'Metode Pembayaran',
    'Catatan'
  ];

  const rows = expenses.map(expense => [
    expense.transactionDate || '',
    expense.category || '',
    expense.description || '',
    expense.amount || 0,
    expense.vendor || '',
    expense.paymentMethod || '',
    expense.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `pengeluaran-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
  
  return {
    success: true,
    count: expenses.length,
    filename
  };
};
