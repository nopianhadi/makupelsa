import { dataStore } from './dataStore';
import { 
  validatePaymentConsistency, 
  updateClientPaymentStatus,
  getClientTotalPaid,
  getClientRemainingAmount
} from './paymentSync';
import { fixClientData } from './fixClientData';

/**
 * Validasi konsistensi data klien
 */
export const validateClientData = (clientId) => {
  const clients = dataStore.getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client) {
    return {
      isValid: false,
      errors: ['Klien tidak ditemukan'],
      warnings: []
    };
  }

  const errors = [];
  const warnings = [];

  if (!client.name || client.name.trim() === '') {
    errors.push('Nama klien harus diisi');
  }

  if (!client.phone && !client.email) {
    warnings.push('Klien tidak memiliki kontak (telepon atau email)');
  }

  if (!client.totalAmount || client.totalAmount <= 0) {
    warnings.push('Total amount tidak diset');
  }

  if (client.paymentHistory && client.paymentHistory.length > 0) {
    const totalPaid = getClientTotalPaid(clientId);
    const calculatedTotal = client.paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    if (Math.abs(totalPaid - calculatedTotal) > 0.01) {
      errors.push('Inkonsistensi dalam total pembayaran');
    }

    // Cek apakah ada payment history tanpa invoice
    const invoices = dataStore.getInvoices();
    const clientInvoices = invoices.filter(inv => inv.clientId === clientId);
    
    client.paymentHistory.forEach(payment => {
      if (!payment.invoiceId && !payment.invoiceNumber) {
        const matchingInvoice = clientInvoices.find(inv => 
          inv.paidDate === payment.date && 
          Math.abs(inv.amount - payment.amount) < 0.01
        );
        
        if (!matchingInvoice) {
          errors.push('Ada payment history tapi tidak ada invoice yang sesuai');
        }
      }
    });
  }

  const paymentValidation = validatePaymentConsistency(clientId);
  if (!paymentValidation.isValid) {
    errors.push(...paymentValidation.errors);
  }

  if (client.events && client.events.length > 0) {
    client.events.forEach((event, index) => {
      if (!event.eventDate) {
        warnings.push(`Event ${index + 1} tidak memiliki tanggal`);
      }
      if (!event.serviceType) {
        warnings.push(`Event ${index + 1} tidak memiliki jenis layanan`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: client
  };
};

/**
 * Validasi konsistensi data proyek
 */
export const validateProjectData = (projectId) => {
  const projects = dataStore.getProjects();
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return {
      isValid: false,
      errors: ['Proyek tidak ditemukan'],
      warnings: []
    };
  }

  const errors = [];
  const warnings = [];

  if (!project.title || project.title.trim() === '') {
    errors.push('Judul proyek harus diisi');
  }

  if (!project.client || project.client.trim() === '') {
    warnings.push('Proyek tidak memiliki klien');
  }

  if (!project.date) {
    warnings.push('Proyek tidak memiliki tanggal');
  }

  if (!project.budget || project.budget <= 0) {
    warnings.push('Budget proyek tidak diset');
  }

  if (project.budget && project.paid) {
    if (project.paid > project.budget) {
      errors.push('Jumlah yang dibayar melebihi budget');
    }
  }

  const clients = dataStore.getClients();
  const matchingClient = clients.find(c => 
    c.name === project.client || c.id === project.clientId
  );
  
  if (matchingClient) {
    if (!project.clientId) {
      warnings.push('Proyek tidak memiliki clientId meskipun klien ditemukan');
    }
    
    if (project.budget && matchingClient.totalAmount && 
        Math.abs(project.budget - matchingClient.totalAmount) > 0.01) {
      warnings.push('Budget proyek tidak sesuai dengan total amount klien');
    }
  } else {
    warnings.push('Klien proyek tidak ditemukan di database');
  }

  if (project.assistants && project.assistants.length > 0) {
    const teamMembers = dataStore.getTeamMembers();
    project.assistants.forEach((assistant, index) => {
      const member = teamMembers.find(m => m.id === assistant.id);
      if (!member) {
        warnings.push(`Asisten ${index + 1} tidak ditemukan di database tim`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: project
  };
};

/**
 * Validasi konsistensi data invoice
 */
export const validateInvoiceData = (invoiceId) => {
  const invoices = dataStore.getInvoices();
  const invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) {
    return {
      isValid: false,
      errors: ['Invoice tidak ditemukan'],
      warnings: []
    };
  }

  const errors = [];
  const warnings = [];

  if (!invoice.invoiceNumber) {
    errors.push('Nomor invoice harus diisi');
  }

  if (!invoice.client || invoice.client.trim() === '') {
    errors.push('Invoice harus memiliki klien');
  }

  if (!invoice.date) {
    errors.push('Invoice harus memiliki tanggal');
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.push('Invoice harus memiliki minimal 1 item');
  }

  const calculatedSubtotal = (invoice.items || []).reduce((sum, item) => {
    return sum + ((item.amount || 0) * (item.quantity || 1));
  }, 0);

  const expectedGrandTotal = calculatedSubtotal + (invoice.tax || 0) - (invoice.discount || 0);
  
  if (Math.abs(invoice.grandTotal - expectedGrandTotal) > 0.01) {
    errors.push('Grand total tidak sesuai dengan perhitungan');
  }

  if (invoice.clientId) {
    const clients = dataStore.getClients();
    const client = clients.find(c => c.id === invoice.clientId);
    if (!client) {
      warnings.push('Klien invoice tidak ditemukan di database');
    } else if (client.name !== invoice.client) {
      warnings.push('Nama klien di invoice tidak sesuai dengan database');
    }
  } else {
    warnings.push('Invoice tidak memiliki clientId');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: invoice
  };
};

/**
 * Validasi seluruh database
 */
export const validateAllData = () => {
  const clients = dataStore.getClients();
  const projects = dataStore.getProjects();
  const invoices = dataStore.getInvoices();
  const teamMembers = dataStore.getTeamMembers();

  const results = {
    clients: {
      total: clients.length,
      valid: 0,
      errors: [],
      warnings: []
    },
    projects: {
      total: projects.length,
      valid: 0,
      errors: [],
      warnings: []
    },
    invoices: {
      total: invoices.length,
      valid: 0,
      errors: [],
      warnings: []
    },
    summary: {
      totalErrors: 0,
      totalWarnings: 0,
      isValid: true
    }
  };

  clients.forEach(client => {
    const validation = validateClientData(client.id);
    if (validation.isValid) {
      results.clients.valid++;
    } else {
      results.clients.errors.push({
        id: client.id,
        name: client.name,
        errors: validation.errors
      });
    }
    if (validation.warnings.length > 0) {
      results.clients.warnings.push({
        id: client.id,
        name: client.name,
        warnings: validation.warnings
      });
    }
  });

  projects.forEach(project => {
    const validation = validateProjectData(project.id);
    if (validation.isValid) {
      results.projects.valid++;
    } else {
      results.projects.errors.push({
        id: project.id,
        title: project.title,
        errors: validation.errors
      });
    }
    if (validation.warnings.length > 0) {
      results.projects.warnings.push({
        id: project.id,
        title: project.title,
        warnings: validation.warnings
      });
    }
  });

  invoices.forEach(invoice => {
    const validation = validateInvoiceData(invoice.id);
    if (validation.isValid) {
      results.invoices.valid++;
    } else {
      results.invoices.errors.push({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        errors: validation.errors
      });
    }
    if (validation.warnings.length > 0) {
      results.invoices.warnings.push({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        warnings: validation.warnings
      });
    }
  });

  results.summary.totalErrors = 
    results.clients.errors.length + 
    results.projects.errors.length + 
    results.invoices.errors.length;
  
  results.summary.totalWarnings = 
    results.clients.warnings.length + 
    results.projects.warnings.length + 
    results.invoices.warnings.length;
  
  results.summary.isValid = results.summary.totalErrors === 0;

  return results;
};

/**
 * Perbaiki semua data yang tidak konsisten
 */
export const autoFixAllData = () => {
  const clients = dataStore.getClients();
  const projects = dataStore.getProjects();
  const invoices = dataStore.getInvoices();

  let fixedCount = 0;

  // Jalankan perbaikan khusus untuk data klien yang bermasalah
  // (payment history tanpa invoice)
  try {
    const clientFixResult = fixClientData();
    if (clientFixResult.success) {
      fixedCount += clientFixResult.invoicesCreated || 0;
      console.log('✅ Perbaikan data klien berhasil:', clientFixResult.message);
    }
  } catch (error) {
    console.error('⚠️ Error saat memperbaiki data klien:', error);
  }

  clients.forEach(client => {
    const validation = validateClientData(client.id);
    if (!validation.isValid) {
      updateClientPaymentStatus(client.id);
      fixedCount++;
    }
  });

  projects.forEach(project => {
    const validation = validateProjectData(project.id);
    if (!validation.isValid || validation.warnings.some(w => w.includes('clientId'))) {
      const clients = dataStore.getClients();
      const matchingClient = clients.find(c => c.name === project.client);
      
      if (matchingClient && !project.clientId) {
        dataStore.updateProject(project.id, { clientId: matchingClient.id });
        fixedCount++;
      }
      
      if (matchingClient && project.budget && !matchingClient.totalAmount) {
        dataStore.updateClient(matchingClient.id, { totalAmount: project.budget });
        fixedCount++;
      }
    }
  });

  invoices.forEach(invoice => {
    const validation = validateInvoiceData(invoice.id);
    if (!validation.isValid) {
      const clients = dataStore.getClients();
      const matchingClient = clients.find(c => c.name === invoice.client);
      
      if (matchingClient && !invoice.clientId) {
        dataStore.updateInvoice(invoice.id, { clientId: matchingClient.id });
        fixedCount++;
      }
    }
  });

  return {
    success: true,
    fixedCount,
    message: `Berhasil memperbaiki ${fixedCount} data yang tidak konsisten`
  };
};

/**
 * Cek duplikasi data
 */
export const checkDuplicates = () => {
  const clients = dataStore.getClients();
  const invoices = dataStore.getInvoices();
  
  const duplicates = {
    clients: [],
    invoices: []
  };

  const clientNames = new Map();
  clients.forEach(client => {
    const key = client.name.toLowerCase().trim();
    if (clientNames.has(key)) {
      duplicates.clients.push({
        name: client.name,
        ids: [clientNames.get(key), client.id]
      });
    } else {
      clientNames.set(key, client.id);
    }
  });

  const invoiceNumbers = new Map();
  invoices.forEach(invoice => {
    if (invoice.invoiceNumber) {
      const key = invoice.invoiceNumber.toLowerCase().trim();
      if (invoiceNumbers.has(key)) {
        duplicates.invoices.push({
          invoiceNumber: invoice.invoiceNumber,
          ids: [invoiceNumbers.get(key), invoice.id]
        });
      } else {
        invoiceNumbers.set(key, invoice.id);
      }
    }
  });

  return {
    hasDuplicates: duplicates.clients.length > 0 || duplicates.invoices.length > 0,
    duplicates
  };
};

export default {
  validateClientData,
  validateProjectData,
  validateInvoiceData,
  validateAllData,
  autoFixAllData,
  checkDuplicates
};
