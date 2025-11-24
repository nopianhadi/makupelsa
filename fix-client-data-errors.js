/**
 * Script untuk memperbaiki error data klien
 * - Membuat invoice untuk payment history yang tidak memiliki invoice
 * - Menyinkronkan status pembayaran
 * - Memastikan konsistensi data
 */

const fs = require('fs');
const path = require('path');

// Fungsi untuk membaca data dari localStorage simulation
function getStoredData(key) {
  try {
    const dataPath = path.join(__dirname, 'src', 'utils', 'dataStore.js');
    const content = fs.readFileSync(dataPath, 'utf8');
    
    // Extract mock data dari file
    const clientsMatch = content.match(/const mockClients = (\[[\s\S]*?\]);/);
    if (clientsMatch && key === 'clients') {
      return eval(clientsMatch[1]);
    }
    return [];
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Fungsi untuk generate invoice number
function generateInvoiceNumber(clientId, index) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(clientId).padStart(3, '0')}-${String(index + 1).padStart(2, '0')}`;
}

// Fungsi untuk memperbaiki data klien
function fixClientData() {
  console.log('🔧 Memulai perbaikan data klien...\n');
  
  // Data klien yang bermasalah
  const problematicClients = [
    { id: 1, name: "Siti Nurhaliza" },
    { id: 2, name: "Dewi Lestari" },
    { id: 4, name: "Ayu Kartika" },
    { id: 5, name: "Maya Anggraini" },
    { id: 6, name: "Putri Maharani" }
  ];
  
  const fixes = [];
  
  problematicClients.forEach(client => {
    console.log(`\n📋 Memperbaiki data: ${client.name}`);
    
    const fix = {
      clientId: client.id,
      clientName: client.name,
      actions: []
    };
    
    // Tentukan perbaikan berdasarkan klien
    switch (client.id) {
      case 1: // Siti Nurhaliza
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 0),
          amount: 1500000,
          description: 'DP Paket Akad',
          dueDate: '2025-12-01',
          status: 'paid',
          paidDate: '2025-11-01',
          linkedPayment: '2025-11-01'
        });
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 1),
          amount: 1000000,
          description: 'Pelunasan Paket Akad',
          dueDate: '2025-12-10',
          status: 'pending'
        });
        break;
        
      case 2: // Dewi Lestari
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 0),
          amount: 2000000,
          description: 'DP Paket Resepsi',
          dueDate: '2025-11-01',
          status: 'paid',
          paidDate: '2025-10-15',
          linkedPayment: '2025-10-15'
        });
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 1),
          amount: 2000000,
          description: 'Pelunasan Paket Resepsi',
          dueDate: '2025-11-20',
          status: 'paid',
          paidDate: '2025-11-10',
          linkedPayment: '2025-11-10'
        });
        break;
        
      case 4: // Ayu Kartika
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 0),
          amount: 3000000,
          description: 'DP 50% Paket Luxury',
          dueDate: '2025-12-01',
          status: 'paid',
          paidDate: '2025-11-20',
          linkedPayment: '2025-11-20'
        });
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 1),
          amount: 3000000,
          description: 'Pelunasan Paket Luxury',
          dueDate: '2026-01-05',
          status: 'pending'
        });
        break;
        
      case 5: // Maya Anggraini
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 0),
          amount: 1000000,
          description: 'DP Paket Akad',
          dueDate: '2025-11-01',
          status: 'paid',
          paidDate: '2025-10-20',
          linkedPayment: '2025-10-20'
        });
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 1),
          amount: 1500000,
          description: 'Pelunasan Paket Akad',
          dueDate: '2025-11-20',
          status: 'overdue'
        });
        fix.actions.push({
          type: 'update_payment_status',
          from: 'partial',
          to: 'overdue',
          reason: 'Invoice pelunasan sudah jatuh tempo'
        });
        break;
        
      case 6: // Putri Maharani
        fix.actions.push({
          type: 'create_invoice',
          invoiceNumber: generateInvoiceNumber(client.id, 0),
          amount: 1500000,
          description: 'Pembayaran Lunas Paket Wisuda',
          dueDate: '2025-11-30',
          status: 'paid',
          paidDate: '2025-11-15',
          linkedPayment: '2025-11-15'
        });
        break;
    }
    
    fixes.push(fix);
    
    // Tampilkan detail perbaikan
    fix.actions.forEach(action => {
      if (action.type === 'create_invoice') {
        console.log(`  ✅ Membuat invoice: ${action.invoiceNumber}`);
        console.log(`     - Jumlah: Rp ${action.amount.toLocaleString('id-ID')}`);
        console.log(`     - Status: ${action.status}`);
        if (action.linkedPayment) {
          console.log(`     - Terhubung dengan pembayaran: ${action.linkedPayment}`);
        }
      } else if (action.type === 'update_payment_status') {
        console.log(`  ✅ Update status pembayaran: ${action.from} → ${action.to}`);
        console.log(`     - Alasan: ${action.reason}`);
      }
    });
  });
  
  // Simpan hasil perbaikan
  const outputPath = path.join(__dirname, 'client-data-fixes.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixes, null, 2));
  
  console.log(`\n\n✨ Perbaikan selesai!`);
  console.log(`📄 Detail perbaikan disimpan di: client-data-fixes.json`);
  console.log(`\n📊 Ringkasan:`);
  console.log(`   - Total klien diperbaiki: ${fixes.length}`);
  console.log(`   - Total invoice dibuat: ${fixes.reduce((sum, f) => sum + f.actions.filter(a => a.type === 'create_invoice').length, 0)}`);
  console.log(`   - Total status diupdate: ${fixes.reduce((sum, f) => sum + f.actions.filter(a => a.type === 'update_payment_status').length, 0)}`);
  
  return fixes;
}

// Jalankan perbaikan
try {
  const fixes = fixClientData();
  
  console.log('\n\n🎯 Langkah selanjutnya:');
  console.log('1. Jalankan: node apply-client-fixes.js');
  console.log('2. Refresh halaman aplikasi');
  console.log('3. Verifikasi tidak ada error lagi\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
