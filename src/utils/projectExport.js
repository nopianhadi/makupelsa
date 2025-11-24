/**
 * Utility functions untuk export data proyek
 */

/**
 * Convert project data ke CSV format
 */
export const exportToCSV = (projects) => {
  if (!projects || projects.length === 0) {
    throw new Error('Tidak ada data untuk di-export');
  }

  // Header CSV
  const headers = [
    'ID',
    'Judul Proyek',
    'Klien',
    'Tipe',
    'Status',
    'Tanggal',
    'Lokasi',
    'Budget',
    'Terbayar',
    'Sisa',
    'Progress %',
    'Tim',
    'Layanan',
    'Tanggal Dibuat',
    'Tanggal Selesai'
  ];

  // Convert data ke rows
  const rows = projects.map(project => {
    const remaining = (project.budget || 0) - (project.paid || 0);
    const progress = project.budget > 0 ? Math.round((project.paid / project.budget) * 100) : 0;
    
    return [
      project.id || '',
      project.title || '',
      project.client || '',
      project.type || '',
      project.status || '',
      project.date || '',
      project.location || '',
      project.budget || 0,
      project.paid || 0,
      remaining,
      progress,
      (project.team || []).join('; '),
      (project.services || []).join('; '),
      project.createdAt || '',
      project.completedAt || ''
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
export const downloadCSV = (csvContent, filename = 'proyek.csv') => {
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
 * Export proyek selesai dengan filter
 */
export const exportCompletedProjects = (projects, filterOptions = {}) => {
  const { startDate, endDate, type, paymentStatus } = filterOptions;
  
  let filtered = [...projects];

  // Filter by date range
  if (startDate || endDate) {
    filtered = filtered.filter(project => {
      const completedDate = new Date(project.completedAt || project.date);
      
      if (startDate && completedDate < new Date(startDate)) return false;
      if (endDate && completedDate > new Date(endDate)) return false;
      
      return true;
    });
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter(project => project.type === type);
  }

  // Filter by payment status
  if (paymentStatus === 'paid') {
    filtered = filtered.filter(project => project.paid >= project.budget);
  } else if (paymentStatus === 'partial') {
    filtered = filtered.filter(project => project.paid > 0 && project.paid < project.budget);
  }

  const csvContent = exportToCSV(filtered);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `proyek-selesai-${timestamp}.csv`;
  
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
export const generateProjectReport = (projects) => {
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + (p.paid || 0), 0);
  const avgBudgetPerProject = totalProjects > 0 ? totalBudget / totalProjects : 0;
  const avgPaidPerProject = totalProjects > 0 ? totalPaid / totalProjects : 0;
  const fullyPaid = projects.filter(p => p.paid >= p.budget).length;
  const partialPaid = projects.filter(p => p.paid > 0 && p.paid < p.budget).length;

  // Type breakdown
  const typeBreakdown = projects.reduce((acc, project) => {
    const type = project.type || 'other';
    if (!acc[type]) {
      acc[type] = { count: 0, budget: 0, paid: 0 };
    }
    acc[type].count += 1;
    acc[type].budget += (project.budget || 0);
    acc[type].paid += (project.paid || 0);
    return acc;
  }, {});

  // Monthly breakdown
  const monthlyBreakdown = projects.reduce((acc, project) => {
    const date = new Date(project.completedAt || project.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { count: 0, budget: 0, paid: 0 };
    }
    acc[monthKey].count += 1;
    acc[monthKey].budget += (project.budget || 0);
    acc[monthKey].paid += (project.paid || 0);
    return acc;
  }, {});

  return {
    summary: {
      totalProjects,
      totalBudget,
      totalPaid,
      avgBudgetPerProject,
      avgPaidPerProject,
      fullyPaid,
      partialPaid,
      paymentCompletionRate: totalProjects > 0 ? (fullyPaid / totalProjects) * 100 : 0
    },
    typeBreakdown,
    monthlyBreakdown
  };
};

/**
 * Export summary report as text
 */
export const exportProjectReport = (projects) => {
  const report = generateProjectReport(projects);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  let reportText = '=== LAPORAN PROYEK SELESAI ===\n\n';
  reportText += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
  
  reportText += '--- RINGKASAN ---\n';
  reportText += `Total Proyek: ${report.summary.totalProjects}\n`;
  reportText += `Total Budget: ${formatCurrency(report.summary.totalBudget)}\n`;
  reportText += `Total Terbayar: ${formatCurrency(report.summary.totalPaid)}\n`;
  reportText += `Rata-rata Budget: ${formatCurrency(report.summary.avgBudgetPerProject)}\n`;
  reportText += `Rata-rata Terbayar: ${formatCurrency(report.summary.avgPaidPerProject)}\n`;
  reportText += `Proyek Lunas: ${report.summary.fullyPaid} (${report.summary.paymentCompletionRate.toFixed(1)}%)\n`;
  reportText += `Proyek Partial: ${report.summary.partialPaid}\n\n`;
  
  reportText += '--- BREAKDOWN TIPE PROYEK ---\n';
  Object.entries(report.typeBreakdown).forEach(([type, data]) => {
    reportText += `${type.toUpperCase()}: ${data.count}x - Budget: ${formatCurrency(data.budget)} - Paid: ${formatCurrency(data.paid)}\n`;
  });
  
  reportText += '\n--- BREAKDOWN BULANAN ---\n';
  Object.entries(report.monthlyBreakdown)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([month, data]) => {
      reportText += `${month}: ${data.count} proyek - Budget: ${formatCurrency(data.budget)} - Paid: ${formatCurrency(data.paid)}\n`;
    });

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-proyek-${timestamp}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return report;
};
