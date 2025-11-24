
// Perbaikan Data Klien - Auto-generated
// Jalankan kode ini di browser console atau tambahkan ke aplikasi

(function() {
  console.log('🔧 Memulai perbaikan data klien...');
  
  // Ambil data klien dari localStorage
  const clientsData = localStorage.getItem('mua_clients');
  if (!clientsData) {
    console.error('❌ Data klien tidak ditemukan di localStorage');
    return;
  }
  
  let clients = JSON.parse(clientsData);
  console.log('📋 Data klien dimuat:', clients.length, 'klien');
  
  // Ambil atau inisialisasi data invoice
  let invoicesData = localStorage.getItem('mua_invoices');
  let invoices = invoicesData ? JSON.parse(invoicesData) : [];
  console.log('📋 Data invoice dimuat:', invoices.length, 'invoice');
  
  const fixes = [
  {
    "clientId": 1,
    "clientName": "Siti Nurhaliza",
    "actions": [
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-001-01",
        "amount": 1500000,
        "description": "DP Paket Akad",
        "dueDate": "2025-12-01",
        "status": "paid",
        "paidDate": "2025-11-01",
        "linkedPayment": "2025-11-01"
      },
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-001-02",
        "amount": 1000000,
        "description": "Pelunasan Paket Akad",
        "dueDate": "2025-12-10",
        "status": "pending"
      }
    ]
  },
  {
    "clientId": 2,
    "clientName": "Dewi Lestari",
    "actions": [
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-002-01",
        "amount": 2000000,
        "description": "DP Paket Resepsi",
        "dueDate": "2025-11-01",
        "status": "paid",
        "paidDate": "2025-10-15",
        "linkedPayment": "2025-10-15"
      },
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-002-02",
        "amount": 2000000,
        "description": "Pelunasan Paket Resepsi",
        "dueDate": "2025-11-20",
        "status": "paid",
        "paidDate": "2025-11-10",
        "linkedPayment": "2025-11-10"
      }
    ]
  },
  {
    "clientId": 4,
    "clientName": "Ayu Kartika",
    "actions": [
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-004-01",
        "amount": 3000000,
        "description": "DP 50% Paket Luxury",
        "dueDate": "2025-12-01",
        "status": "paid",
        "paidDate": "2025-11-20",
        "linkedPayment": "2025-11-20"
      },
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-004-02",
        "amount": 3000000,
        "description": "Pelunasan Paket Luxury",
        "dueDate": "2026-01-05",
        "status": "pending"
      }
    ]
  },
  {
    "clientId": 5,
    "clientName": "Maya Anggraini",
    "actions": [
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-005-01",
        "amount": 1000000,
        "description": "DP Paket Akad",
        "dueDate": "2025-11-01",
        "status": "paid",
        "paidDate": "2025-10-20",
        "linkedPayment": "2025-10-20"
      },
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-005-02",
        "amount": 1500000,
        "description": "Pelunasan Paket Akad",
        "dueDate": "2025-11-20",
        "status": "overdue"
      },
      {
        "type": "update_payment_status",
        "from": "partial",
        "to": "overdue",
        "reason": "Invoice pelunasan sudah jatuh tempo"
      }
    ]
  },
  {
    "clientId": 6,
    "clientName": "Putri Maharani",
    "actions": [
      {
        "type": "create_invoice",
        "invoiceNumber": "INV-202511-006-01",
        "amount": 1500000,
        "description": "Pembayaran Lunas Paket Wisuda",
        "dueDate": "2025-11-30",
        "status": "paid",
        "paidDate": "2025-11-15",
        "linkedPayment": "2025-11-15"
      }
    ]
  }
];
  
  let invoiceIdCounter = invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1;
  
  fixes.forEach(fix => {
    console.log(`\n📝 Memperbaiki: ${fix.clientName}`);
    
    const clientIndex = clients.findIndex(c => c.id === fix.clientId);
    if (clientIndex === -1) {
      console.warn(`  ⚠️  Klien tidak ditemukan: ${fix.clientName}`);
      return;
    }
    
    const client = clients[clientIndex];
    
    fix.actions.forEach(action => {
      if (action.type === 'create_invoice') {
        // Buat invoice baru
        const newInvoice = {
          id: invoiceIdCounter++,
          invoiceNumber: action.invoiceNumber,
          clientId: client.id,
          clientName: client.name,
          amount: action.amount,
          description: action.description,
          issueDate: action.paidDate || new Date().toISOString().split('T')[0],
          dueDate: action.dueDate,
          status: action.status,
          paidDate: action.paidDate || null,
          paymentMethod: action.status === 'paid' ? 'Transfer Bank' : null,
          notes: `Auto-generated untuk ${action.description}`
        };
        
        invoices.push(newInvoice);
        console.log(`  ✅ Invoice dibuat: ${action.invoiceNumber} - Rp ${action.amount.toLocaleString('id-ID')}`);
        
        // Link dengan payment history jika ada
        if (action.linkedPayment && client.paymentHistory) {
          const paymentIndex = client.paymentHistory.findIndex(p => p.date === action.linkedPayment);
          if (paymentIndex !== -1) {
            client.paymentHistory[paymentIndex].invoiceId = newInvoice.id;
            client.paymentHistory[paymentIndex].invoiceNumber = action.invoiceNumber;
            console.log(`     🔗 Terhubung dengan pembayaran tanggal ${action.linkedPayment}`);
          }
        }
      } else if (action.type === 'update_payment_status') {
        // Update status pembayaran
        client.paymentStatus = action.to;
        console.log(`  ✅ Status pembayaran diupdate: ${action.from} → ${action.to}`);
      }
    });
    
    clients[clientIndex] = client;
  });
  
  // Simpan kembali ke localStorage
  localStorage.setItem('mua_clients', JSON.stringify(clients));
  localStorage.setItem('mua_invoices', JSON.stringify(invoices));
  
  console.log('\n✨ Perbaikan selesai!');
  console.log(`📊 Total invoice dibuat: ${invoiceIdCounter - (invoices.length - fixes.reduce((sum, f) => sum + f.actions.filter(a => a.type === 'create_invoice').length, 0))}`);
  console.log('🔄 Silakan refresh halaman untuk melihat perubahan');
  
  // Trigger storage event untuk update UI
  window.dispatchEvent(new Event('storage'));
  
  return {
    success: true,
    clientsUpdated: fixes.length,
    invoicesCreated: invoiceIdCounter - (invoices.length - fixes.reduce((sum, f) => sum + f.actions.filter(a => a.type === 'create_invoice').length, 0))
  };
})();
