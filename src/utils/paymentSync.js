// Utility untuk sinkronisasi data pembayaran antar halaman
import { dataStore } from './dataStore';
import { nanoid } from 'nanoid';

/**
 * Sinkronisasi data pembayaran dari invoice ke data keuangan
 */
export const syncInvoicesToIncomes = () => {
  const invoices = dataStore.getInvoices() || [];
  
  return invoices
    .filter(inv => inv.status === 'paid')
    .map(inv => ({
      id: inv.id,
      clientName: inv.client || 'Klien',
      clientId: inv.clientId,
      serviceType: inv.items?.[0]?.serviceType || 'other',
      paymentType: 'full',
      amount: inv.grandTotal || 0,
      paymentMethod: inv.paymentMethod || 'transfer',
      transactionDate: inv.date,
      notes: inv.notes || '',
      invoiceNumber: inv.invoiceNumber
    }));
};

/**
 * Sinkronisasi pembayaran klien dengan invoice
 */
export const syncClientPaymentsToInvoices = (clientId) => {
  const client = dataStore.getClients().find(c => c.id === clientId);
  if (!client) return;

  const invoices = getClientInvoices(clientId);
  const paymentHistory = client.paymentHistory || [];

  paymentHistory.forEach(payment => {
    const matchingInvoice = invoices.find(inv => 
      inv.invoiceNumber === payment.invoiceNumber || 
      inv.id === payment.invoiceId
    );

    if (!matchingInvoice && payment.amount > 0) {
      const newInvoice = {
        invoiceNumber: payment.invoiceNumber || `INV-${Date.now()}-${nanoid(4)}`,
        clientId: clientId,
        client: client.name,
        date: payment.date,
        dueDate: payment.date,
        status: 'paid',
        paymentMethod: payment.method || 'transfer',
        items: [{
          description: payment.description || 'Pembayaran',
          quantity: 1,
          amount: payment.amount,
          serviceType: client.events?.[0]?.serviceType || 'other'
        }],
        subtotal: payment.amount,
        tax: 0,
        discount: 0,
        grandTotal: payment.amount,
        notes: payment.notes || '',
        createdAt: payment.date
      };
      dataStore.addInvoice(newInvoice);
    }
  });
};

/**
 * Dapatkan total pembayaran untuk klien tertentu
 */
export const getClientTotalPaid = (clientId) => {
  const clients = dataStore.getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client || !client.paymentHistory) return 0;
  
  return client.paymentHistory.reduce((sum, payment) => sum + (payment.amount || 0), 0);
};

/**
 * Dapatkan sisa pembayaran untuk klien tertentu
 */
export const getClientRemainingAmount = (clientId) => {
  const clients = dataStore.getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client) return 0;
  
  const totalAmount = client.totalAmount || 0;
  const totalPaid = getClientTotalPaid(clientId);
  
  return Math.max(0, totalAmount - totalPaid);
};

/**
 * Update status pembayaran klien berdasarkan payment history
 */
export const updateClientPaymentStatus = (clientId) => {
  const clients = dataStore.getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client) return null;
  
  const totalPaid = getClientTotalPaid(clientId);
  const totalAmount = client.totalAmount || 0;
  
  let newStatus = 'pending';
  if (totalPaid >= totalAmount) {
    newStatus = 'paid';
  } else if (totalPaid > 0) {
    newStatus = 'partial';
  }
  
  if (client.paymentStatus !== newStatus) {
    dataStore.updateClient(clientId, { paymentStatus: newStatus });
  }
  
  return newStatus;
};

/**
 * Dapatkan semua invoice untuk klien tertentu
 */
export const getClientInvoices = (clientId) => {
  const invoices = dataStore.getInvoices() || [];
  return invoices.filter(inv => inv.clientId === clientId);
};

/**
 * Dapatkan ringkasan pembayaran untuk klien
 */
export const getClientPaymentSummary = (clientId) => {
  const clients = dataStore.getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client) return null;
  
  const totalAmount = client.totalAmount || 0;
  const totalPaid = getClientTotalPaid(clientId);
  const remainingAmount = getClientRemainingAmount(clientId);
  const invoices = getClientInvoices(clientId);
  
  return {
    clientId,
    clientName: client.name,
    totalAmount,
    totalPaid,
    remainingAmount,
    paymentStatus: client.paymentStatus,
    paymentHistory: client.paymentHistory || [],
    invoices,
    invoiceCount: invoices.length,
    lastPaymentDate: client.paymentHistory?.length > 0 
      ? client.paymentHistory[client.paymentHistory.length - 1].date 
      : null
  };
};

/**
 * Validasi konsistensi data pembayaran
 */
export const validatePaymentConsistency = (clientId) => {
  const summary = getClientPaymentSummary(clientId);
  if (!summary) return { isValid: false, errors: ['Client not found'] };
  
  const errors = [];
  
  // Cek apakah total paid sesuai dengan payment history
  const calculatedTotal = summary.paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0);
  if (Math.abs(calculatedTotal - summary.totalPaid) > 0.01) {
    errors.push('Total paid tidak sesuai dengan payment history');
  }
  
  // Cek apakah status pembayaran sesuai
  let expectedStatus = 'pending';
  if (summary.totalPaid >= summary.totalAmount) {
    expectedStatus = 'paid';
  } else if (summary.totalPaid > 0) {
    expectedStatus = 'partial';
  }
  
  if (summary.paymentStatus !== expectedStatus) {
    errors.push(`Status pembayaran tidak sesuai. Expected: ${expectedStatus}, Got: ${summary.paymentStatus}`);
  }
  
  // Cek apakah jumlah invoice sesuai dengan payment history
  const paidInvoices = summary.invoices.filter(inv => inv.status === 'paid');
  if (paidInvoices.length !== summary.paymentHistory.length) {
    errors.push('Jumlah invoice tidak sesuai dengan payment history');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    summary
  };
};

/**
 * Perbaiki inkonsistensi data pembayaran
 */
export const fixPaymentInconsistency = (clientId) => {
  const validation = validatePaymentConsistency(clientId);
  
  if (validation.isValid) {
    return { success: true, message: 'Data sudah konsisten' };
  }
  
  // Update status pembayaran
  updateClientPaymentStatus(clientId);
  
  return { 
    success: true, 
    message: 'Data berhasil diperbaiki',
    errors: validation.errors 
  };
};

/**
 * Export semua data pembayaran untuk debugging
 */
export const exportPaymentData = () => {
  const clients = dataStore.getClients();
  const invoices = dataStore.getInvoices();
  
  return {
    clients: clients.map(c => ({
      id: c.id,
      name: c.name,
      totalAmount: c.totalAmount,
      paymentStatus: c.paymentStatus,
      paymentHistory: c.paymentHistory,
      totalPaid: getClientTotalPaid(c.id),
      remainingAmount: getClientRemainingAmount(c.id)
    })),
    invoices: invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      client: inv.client,
      grandTotal: inv.grandTotal,
      status: inv.status,
      date: inv.date
    })),
    summary: {
      totalClients: clients.length,
      totalInvoices: invoices.length,
      totalRevenue: invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0)
    }
  };
};

/**
 * Sinkronisasi data proyek dengan data klien
 */
export const syncProjectWithClient = (projectId) => {
  const projects = dataStore.getProjects();
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return null;
  
  const clients = dataStore.getClients();
  const client = clients.find(c => c.name === project.client || c.id === project.clientId);
  
  if (client) {
    dataStore.updateProject(projectId, { clientId: client.id });
    
    if (project.budget && client.totalAmount !== project.budget) {
      dataStore.updateClient(client.id, { totalAmount: project.budget });
    }
    
    if (project.paid && client.paymentHistory) {
      const projectPayments = client.paymentHistory.filter(p => p.projectId === projectId);
      const totalProjectPaid = projectPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      if (totalProjectPaid !== project.paid) {
        dataStore.updateProject(projectId, { paid: totalProjectPaid });
      }
    }
  }
  
  return { project, client };
};

/**
 * Dapatkan data pembayaran asisten untuk proyek tertentu
 */
export const getAssistantPaymentsForProject = (projectId, assistantId) => {
  const payments = dataStore.getPayments() || [];
  
  return payments.filter(p => 
    p.projectId === projectId && 
    p.assistantId === assistantId
  );
};

/**
 * Hitung total pembayaran asisten
 */
export const getAssistantTotalEarnings = (assistantId) => {
  const payments = dataStore.getPayments() || [];
  
  return payments
    .filter(p => p.assistantId === assistantId && p.type === 'assistant_payment')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
};

/**
 * Dapatkan ringkasan pembayaran asisten
 */
export const getAssistantPaymentSummary = (assistantId) => {
  const teamMembers = dataStore.getTeamMembers();
  const assistant = teamMembers.find(m => m.id === assistantId);
  
  if (!assistant) return null;
  
  const payments = dataStore.getPayments() || [];
  const assistantPayments = payments.filter(p => p.assistantId === assistantId);
  
  const paidPayments = assistantPayments.filter(p => p.status === 'paid');
  const unpaidPayments = assistantPayments.filter(p => p.status !== 'paid');
  
  const totalEarned = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalUnpaid = unpaidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  
  const projects = dataStore.getProjects();
  const assistantProjects = projects.filter(p => 
    p.team && (
      p.team.includes(assistant.name) || 
      p.team.includes(assistantId) ||
      (p.assistants && p.assistants.some(a => a.id === assistantId))
    )
  );
  
  return {
    assistantId,
    assistantName: assistant.name,
    totalEarned,
    totalUnpaid,
    totalPayments: assistantPayments.length,
    paidPayments: paidPayments.length,
    unpaidPayments: unpaidPayments.length,
    projects: assistantProjects.map(p => ({
      id: p.id,
      title: p.title,
      client: p.client,
      date: p.date,
      budget: p.budget,
      status: p.status
    })),
    paymentHistory: assistantPayments.map(p => ({
      id: p.id,
      projectId: p.projectId,
      amount: p.amount,
      status: p.status,
      date: p.date,
      description: p.description
    }))
  };
};

/**
 * Tambahkan asisten ke proyek dan buat entry pembayaran
 */
export const addAssistantToProject = (projectId, assistantId, paymentAmount) => {
  const projects = dataStore.getProjects();
  const project = projects.find(p => p.id === projectId);
  const teamMembers = dataStore.getTeamMembers();
  const assistant = teamMembers.find(m => m.id === assistantId);
  
  if (!project || !assistant) return null;
  
  const currentAssistants = project.assistants || [];
  const assistantExists = currentAssistants.some(a => a.id === assistantId || a === assistantId);
  
  if (!assistantExists) {
    const updatedAssistants = [
      ...currentAssistants,
      {
        id: assistantId,
        name: assistant.name,
        role: assistant.role,
        addedAt: new Date().toISOString()
      }
    ];
    
    dataStore.updateProject(projectId, { assistants: updatedAssistants });
    
    const currentTeam = project.team || [];
    if (!currentTeam.includes(assistant.name)) {
      dataStore.updateProject(projectId, { 
        team: [...currentTeam, assistant.name] 
      });
    }
  }
  
  if (paymentAmount && paymentAmount > 0) {
    const payment = {
      projectId: projectId,
      projectTitle: project.title,
      assistantId: assistantId,
      assistantName: assistant.name,
      amount: paymentAmount,
      status: 'pending',
      type: 'assistant_payment',
      date: new Date().toISOString(),
      description: `Pembayaran untuk proyek: ${project.title}`
    };
    
    return dataStore.addPayment(payment);
  }
  
  return { project, assistant };
};

/**
 * Validasi dan sinkronisasi seluruh data
 */
export const syncAllData = () => {
  const clients = dataStore.getClients();
  const projects = dataStore.getProjects();
  const invoices = dataStore.getInvoices();
  
  const errors = [];
  const warnings = [];
  
  clients.forEach(client => {
    const validation = validatePaymentConsistency(client.id);
    if (!validation.isValid) {
      errors.push({
        type: 'client',
        id: client.id,
        name: client.name,
        errors: validation.errors
      });
      
      fixPaymentInconsistency(client.id);
    }
    
    syncClientPaymentsToInvoices(client.id);
  });
  
  projects.forEach(project => {
    const result = syncProjectWithClient(project.id);
    if (!result || !result.client) {
      warnings.push({
        type: 'project',
        id: project.id,
        title: project.title,
        message: 'Proyek tidak terhubung dengan klien'
      });
    }
  });
  
  return {
    success: true,
    errors,
    warnings,
    message: `Sinkronisasi selesai. ${errors.length} error diperbaiki, ${warnings.length} warning ditemukan.`
  };
};
