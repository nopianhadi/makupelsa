/**
 * Script untuk mengaplikasikan perbaikan data klien ke dataStore
 * Membaca dari client-data-fixes.json dan update data di localStorage
 */

const fs = require('fs');
const path = require('path');

// Baca file perbaikan
const fixesPath = path.join(__dirname, 'client-data-fixes.json');

if (!fs.existsSync(fixesPath)) {
  console.error('❌ File client-data-fixes.json tidak ditemukan!');
  console.log('   Jalankan dulu: node fix-client-data-errors.js');
  process.exit(1);
}

const fixes = JSON.parse(fs.readFileSync(fixesPath, 'utf8'));

console.log('🔧 Mengaplikasikan perbaikan data...\n');

// Generate kode JavaScript untuk update data
const updateCode = `
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
  
  const fixes = ${JSON.stringify(fixes, null, 2)};
  
  let invoiceIdCounter = invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1;
  
  fixes.forEach(fix => {
    console.log(\`\\n📝 Memperbaiki: \${fix.clientName}\`);
    
    const clientIndex = clients.findIndex(c => c.id === fix.clientId);
    if (clientIndex === -1) {
      console.warn(\`  ⚠️  Klien tidak ditemukan: \${fix.clientName}\`);
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
          notes: \`Auto-generated untuk \${action.description}\`
        };
        
        invoices.push(newInvoice);
        console.log(\`  ✅ Invoice dibuat: \${action.invoiceNumber} - Rp \${action.amount.toLocaleString('id-ID')}\`);
        
        // Link dengan payment history jika ada
        if (action.linkedPayment && client.paymentHistory) {
          const paymentIndex = client.paymentHistory.findIndex(p => p.date === action.linkedPayment);
          if (paymentIndex !== -1) {
            client.paymentHistory[paymentIndex].invoiceId = newInvoice.id;
            client.paymentHistory[paymentIndex].invoiceNumber = action.invoiceNumber;
            console.log(\`     🔗 Terhubung dengan pembayaran tanggal \${action.linkedPayment}\`);
          }
        }
      } else if (action.type === 'update_payment_status') {
        // Update status pembayaran
        client.paymentStatus = action.to;
        console.log(\`  ✅ Status pembayaran diupdate: \${action.from} → \${action.to}\`);
      }
    });
    
    clients[clientIndex] = client;
  });
  
  // Simpan kembali ke localStorage
  localStorage.setItem('mua_clients', JSON.stringify(clients));
  localStorage.setItem('mua_invoices', JSON.stringify(invoices));
  
  console.log('\\n✨ Perbaikan selesai!');
  console.log(\`📊 Total invoice dibuat: \${invoiceIdCounter - (invoices.length - fixes.reduce((sum, f) => sum + f.actions.filter(a => a.type === 'create_invoice').length, 0))}\`);
  console.log('🔄 Silakan refresh halaman untuk melihat perubahan');
  
  // Trigger storage event untuk update UI
  window.dispatchEvent(new Event('storage'));
  
  return {
    success: true,
    clientsUpdated: fixes.length,
    invoicesCreated: invoiceIdCounter - (invoices.length - fixes.reduce((sum, f) => sum + f.actions.filter(a => a.type === 'create_invoice').length, 0))
  };
})();
`;

// Simpan kode update
const updateScriptPath = path.join(__dirname, 'apply-fixes-browser.js');
fs.writeFileSync(updateScriptPath, updateCode);

console.log('✅ Script perbaikan berhasil dibuat!\n');
console.log('📄 File yang dibuat:');
console.log('   - apply-fixes-browser.js (untuk dijalankan di browser)\n');

console.log('🎯 Cara menggunakan:\n');
console.log('Opsi 1 - Via Browser Console:');
console.log('1. Buka aplikasi di browser');
console.log('2. Buka Developer Tools (F12)');
console.log('3. Buka tab Console');
console.log('4. Copy-paste isi file apply-fixes-browser.js');
console.log('5. Tekan Enter');
console.log('6. Refresh halaman\n');

console.log('Opsi 2 - Via Script Injection:');
console.log('1. Tambahkan script ke index.html sementara');
console.log('2. Refresh halaman');
console.log('3. Hapus script setelah selesai\n');

// Tampilkan preview kode
console.log('📋 Preview kode (50 baris pertama):');
console.log('─'.repeat(60));
console.log(updateCode.split('\n').slice(0, 50).join('\n'));
console.log('─'.repeat(60));
console.log('\n✨ Perbaikan siap diaplikasikan!');
