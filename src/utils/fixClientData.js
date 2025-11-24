/**
 * Utility untuk memperbaiki data klien yang bermasalah
 * Membuat invoice untuk payment history dan menyinkronkan status
 */

// Generate invoice number
function generateInvoiceNumber(clientId, index) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(clientId).padStart(3, '0')}-${String(index + 1).padStart(2, '0')}`;
}

// Perbaikan untuk setiap klien
const clientFixes = {
  1: { // Siti Nurhaliza
    name: "Siti Nurhaliza",
    invoices: [
      {
        amount: 1500000,
        description: 'DP Paket Akad',
        dueDate: '2025-12-01',
        status: 'paid',
        paidDate: '2025-11-01',
        linkedPaymentDate: '2025-11-01'
      },
      {
        amount: 1000000,
        description: 'Pelunasan Paket Akad',
        dueDate: '2025-12-10',
        status: 'pending'
      }
    ]
  },
  2: { // Dewi Lestari
    name: "Dewi Lestari",
    invoices: [
      {
        amount: 2000000,
        description: 'DP Paket Resepsi',
        dueDate: '2025-11-01',
        status: 'paid',
        paidDate: '2025-10-15',
        linkedPaymentDate: '2025-10-15'
      },
      {
        amount: 2000000,
        description: 'Pelunasan Paket Resepsi',
        dueDate: '2025-11-20',
        status: 'paid',
        paidDate: '2025-11-10',
        linkedPaymentDate: '2025-11-10'
      }
    ]
  },
  4: { // Ayu Kartika
    name: "Ayu Kartika",
    invoices: [
      {
        amount: 3000000,
        description: 'DP 50% Paket Luxury',
        dueDate: '2025-12-01',
        status: 'paid',
        paidDate: '2025-11-20',
        linkedPaymentDate: '2025-11-20'
      },
      {
        amount: 3000000,
        description: 'Pelunasan Paket Luxury',
        dueDate: '2026-01-05',
        status: 'pending'
      }
    ]
  },
  5: { // Maya Anggraini
    name: "Maya Anggraini",
    invoices: [
      {
        amount: 1000000,
        description: 'DP Paket Akad',
        dueDate: '2025-11-01',
        status: 'paid',
        paidDate: '2025-10-20',
        linkedPaymentDate: '2025-10-20'
      },
      {
        amount: 1500000,
        description: 'Pelunasan Paket Akad',
        dueDate: '2025-11-20',
        status: 'overdue'
      }
    ],
    updatePaymentStatus: 'overdue'
  },
  6: { // Putri Maharani
    name: "Putri Maharani",
    invoices: [
      {
        amount: 1500000,
        description: 'Pembayaran Lunas Paket Wisuda',
        dueDate: '2025-11-30',
        status: 'paid',
        paidDate: '2025-11-15',
        linkedPaymentDate: '2025-11-15'
      }
    ]
  }
};

/**
 * Memperbaiki data klien dengan membuat invoice dan update status
 */
export function fixClientData() {
  console.log('🔧 Memulai perbaikan data klien...');
  
  try {
    // Ambil data dari localStorage
    const clientsData = localStorage.getItem('mua_clients');
    const invoicesData = localStorage.getItem('mua_invoices');
    
    if (!clientsData) {
      console.error('❌ Data klien tidak ditemukan');
      return { success: false, message: 'Data klien tidak ditemukan' };
    }
    
    let clients = JSON.parse(clientsData);
    let invoices = invoicesData ? JSON.parse(invoicesData) : [];
    
    let invoiceIdCounter = invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1;
    let totalInvoicesCreated = 0;
    let totalClientsFixed = 0;
    
    // Proses setiap klien yang perlu diperbaiki
    Object.keys(clientFixes).forEach(clientIdStr => {
      const clientId = parseInt(clientIdStr);
      const fix = clientFixes[clientId];
      
      const clientIndex = clients.findIndex(c => c.id === clientId);
      if (clientIndex === -1) {
        console.warn(`⚠️  Klien tidak ditemukan: ${fix.name}`);
        return;
      }
      
      const client = clients[clientIndex];
      console.log(`\n📝 Memperbaiki: ${client.name}`);
      
      // Buat invoice untuk klien ini
      fix.invoices.forEach((invoiceData, index) => {
        const newInvoice = {
          id: invoiceIdCounter++,
          invoiceNumber: generateInvoiceNumber(clientId, invoices.length + index),
          clientId: client.id,
          clientName: client.name,
          amount: invoiceData.amount,
          description: invoiceData.description,
          issueDate: invoiceData.paidDate || new Date().toISOString().split('T')[0],
          dueDate: invoiceData.dueDate,
          status: invoiceData.status,
          paidDate: invoiceData.paidDate || null,
          paymentMethod: invoiceData.status === 'paid' ? 'Transfer Bank' : null,
          notes: `Auto-generated untuk ${invoiceData.description}`
        };
        
        invoices.push(newInvoice);
        totalInvoicesCreated++;
        console.log(`  ✅ Invoice dibuat: ${newInvoice.invoiceNumber} - Rp ${invoiceData.amount.toLocaleString('id-ID')}`);
        
        // Link dengan payment history
        if (invoiceData.linkedPaymentDate && client.paymentHistory) {
          const paymentIndex = client.paymentHistory.findIndex(p => p.date === invoiceData.linkedPaymentDate);
          if (paymentIndex !== -1) {
            client.paymentHistory[paymentIndex].invoiceId = newInvoice.id;
            client.paymentHistory[paymentIndex].invoiceNumber = newInvoice.invoiceNumber;
            console.log(`     🔗 Terhubung dengan pembayaran tanggal ${invoiceData.linkedPaymentDate}`);
          }
        }
      });
      
      // Update status pembayaran jika diperlukan
      if (fix.updatePaymentStatus) {
        const oldStatus = client.paymentStatus;
        client.paymentStatus = fix.updatePaymentStatus;
        console.log(`  ✅ Status pembayaran diupdate: ${oldStatus} → ${fix.updatePaymentStatus}`);
      }
      
      clients[clientIndex] = client;
      totalClientsFixed++;
    });
    
    // Simpan kembali ke localStorage
    localStorage.setItem('mua_clients', JSON.stringify(clients));
    localStorage.setItem('mua_invoices', JSON.stringify(invoices));
    
    console.log('\n✨ Perbaikan selesai!');
    console.log(`📊 Total klien diperbaiki: ${totalClientsFixed}`);
    console.log(`📊 Total invoice dibuat: ${totalInvoicesCreated}`);
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
    
    return {
      success: true,
      message: `Berhasil memperbaiki ${totalClientsFixed} klien dan membuat ${totalInvoicesCreated} invoice`,
      clientsFixed: totalClientsFixed,
      invoicesCreated: totalInvoicesCreated
    };
    
  } catch (error) {
    console.error('❌ Error saat memperbaiki data:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Cek apakah perbaikan sudah dilakukan
 */
export function isDataFixed() {
  try {
    const invoicesData = localStorage.getItem('mua_invoices');
    if (!invoicesData) return false;
    
    const invoices = JSON.parse(invoicesData);
    
    // Cek apakah sudah ada invoice untuk klien yang bermasalah
    const hasInvoiceForClient1 = invoices.some(inv => inv.clientId === 1);
    const hasInvoiceForClient2 = invoices.some(inv => inv.clientId === 2);
    const hasInvoiceForClient4 = invoices.some(inv => inv.clientId === 4);
    const hasInvoiceForClient5 = invoices.some(inv => inv.clientId === 5);
    const hasInvoiceForClient6 = invoices.some(inv => inv.clientId === 6);
    
    return hasInvoiceForClient1 && hasInvoiceForClient2 && hasInvoiceForClient4 && 
           hasInvoiceForClient5 && hasInvoiceForClient6;
  } catch (error) {
    return false;
  }
}

export default { fixClientData, isDataFixed };
