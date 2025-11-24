// Script untuk testing sinkronisasi data pembayaran
import { dataStore } from './dataStore';
import { 
  validatePaymentConsistency, 
  fixPaymentInconsistency,
  getClientPaymentSummary,
  exportPaymentData 
} from './paymentSync';

/**
 * Test 1: Validasi semua data klien
 */
export const testValidateAllClients = () => {
  console.log('🧪 Test 1: Validasi Semua Data Klien');
  console.log('=====================================');
  
  const clients = dataStore.getClients();
  const results = [];
  
  clients.forEach(client => {
    const validation = validatePaymentConsistency(client.id);
    results.push({
      clientId: client.id,
      clientName: client.name,
      isValid: validation.isValid,
      errors: validation.errors
    });
    
    console.log(`\n📋 ${client.name}:`);
    console.log(`   Status: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}`);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }
  });
  
  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.filter(r => !r.isValid).length;
  
  console.log('\n📊 Ringkasan:');
  console.log(`   Total Klien: ${clients.length}`);
  console.log(`   Valid: ${validCount}`);
  console.log(`   Invalid: ${invalidCount}`);
  
  return results;
};

/**
 * Test 2: Simulasi pembayaran baru
 */
export const testRecordPayment = (clientId, amount, description = 'Test Payment') => {
  console.log('\n🧪 Test 2: Simulasi Pembayaran Baru');
  console.log('====================================');
  
  const clients = dataStore.getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client) {
    console.log('❌ Klien tidak ditemukan');
    return false;
  }
  
  console.log(`\n📋 Klien: ${client.name}`);
  console.log(`💰 Jumlah: Rp ${amount.toLocaleString('id-ID')}`);
  
  // Sebelum pembayaran
  const beforeSummary = getClientPaymentSummary(clientId);
  console.log('\n📊 Sebelum Pembayaran:');
  console.log(`   Total Amount: Rp ${beforeSummary.totalAmount.toLocaleString('id-ID')}`);
  console.log(`   Total Paid: Rp ${beforeSummary.totalPaid.toLocaleString('id-ID')}`);
  console.log(`   Remaining: Rp ${beforeSummary.remainingAmount.toLocaleString('id-ID')}`);
  console.log(`   Status: ${beforeSummary.paymentStatus}`);
  
  // Simulasi pembayaran
  const newPayment = {
    date: new Date().toISOString().split('T')[0],
    amount: amount,
    description: description,
    method: 'transfer',
    reference: `TEST-${Date.now()}`
  };
  
  const updatedPaymentHistory = [
    ...(client.paymentHistory || []),
    newPayment
  ];
  
  const totalPaid = updatedPaymentHistory.reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = client.totalAmount || 0;
  
  let newPaymentStatus = 'pending';
  if (totalPaid >= totalAmount) {
    newPaymentStatus = 'paid';
  } else if (totalPaid > 0) {
    newPaymentStatus = 'partial';
  }
  
  // Update klien
  dataStore.updateClient(clientId, {
    paymentHistory: updatedPaymentHistory,
    paymentStatus: newPaymentStatus
  });
  
  // Setelah pembayaran
  const afterSummary = getClientPaymentSummary(clientId);
  console.log('\n📊 Setelah Pembayaran:');
  console.log(`   Total Amount: Rp ${afterSummary.totalAmount.toLocaleString('id-ID')}`);
  console.log(`   Total Paid: Rp ${afterSummary.totalPaid.toLocaleString('id-ID')}`);
  console.log(`   Remaining: Rp ${afterSummary.remainingAmount.toLocaleString('id-ID')}`);
  console.log(`   Status: ${afterSummary.paymentStatus}`);
  
  // Validasi
  const validation = validatePaymentConsistency(clientId);
  console.log(`\n✅ Validasi: ${validation.isValid ? 'PASS' : 'FAIL'}`);
  if (!validation.isValid) {
    validation.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }
  
  return validation.isValid;
};

/**
 * Test 3: Perbaikan inkonsistensi
 */
export const testFixInconsistency = () => {
  console.log('\n🧪 Test 3: Perbaikan Inkonsistensi');
  console.log('===================================');
  
  const clients = dataStore.getClients();
  const results = [];
  
  clients.forEach(client => {
    const before = validatePaymentConsistency(client.id);
    
    if (!before.isValid) {
      console.log(`\n📋 ${client.name}:`);
      console.log(`   Status Sebelum: ❌ Invalid`);
      console.log(`   Errors:`);
      before.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
      
      const result = fixPaymentInconsistency(client.id);
      const after = validatePaymentConsistency(client.id);
      
      console.log(`   Status Setelah: ${after.isValid ? '✅ Valid' : '❌ Still Invalid'}`);
      
      results.push({
        clientId: client.id,
        clientName: client.name,
        fixed: after.isValid
      });
    }
  });
  
  const fixedCount = results.filter(r => r.fixed).length;
  console.log(`\n📊 Ringkasan:`);
  console.log(`   Total Diperbaiki: ${fixedCount}/${results.length}`);
  
  return results;
};

/**
 * Test 4: Sinkronisasi invoice ke income
 */
export const testInvoiceToIncomeSync = () => {
  console.log('\n🧪 Test 4: Sinkronisasi Invoice ke Income');
  console.log('==========================================');
  
  const invoices = dataStore.getInvoices() || [];
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  
  console.log(`\n📊 Total Invoice: ${invoices.length}`);
  console.log(`💰 Invoice Lunas: ${paidInvoices.length}`);
  
  const incomes = paidInvoices.map(inv => ({
    id: inv.id,
    clientName: inv.client || 'Klien',
    amount: inv.grandTotal || 0,
    date: inv.date,
    invoiceNumber: inv.invoiceNumber
  }));
  
  console.log('\n📋 Data Income dari Invoice:');
  incomes.forEach(income => {
    console.log(`   ${income.invoiceNumber} - ${income.clientName}: Rp ${income.amount.toLocaleString('id-ID')}`);
  });
  
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  console.log(`\n💵 Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}`);
  
  return incomes;
};

/**
 * Test 5: Export dan analisis data
 */
export const testExportData = () => {
  console.log('\n🧪 Test 5: Export dan Analisis Data');
  console.log('====================================');
  
  const data = exportPaymentData();
  
  console.log('\n📊 Ringkasan Data:');
  console.log(`   Total Klien: ${data.summary.totalClients}`);
  console.log(`   Total Invoice: ${data.summary.totalInvoices}`);
  console.log(`   Total Revenue: Rp ${data.summary.totalRevenue.toLocaleString('id-ID')}`);
  
  console.log('\n📋 Detail Klien:');
  data.clients.forEach(client => {
    console.log(`\n   ${client.name}:`);
    console.log(`   - Total Amount: Rp ${client.totalAmount.toLocaleString('id-ID')}`);
    console.log(`   - Total Paid: Rp ${client.totalPaid.toLocaleString('id-ID')}`);
    console.log(`   - Remaining: Rp ${client.remainingAmount.toLocaleString('id-ID')}`);
    console.log(`   - Status: ${client.paymentStatus}`);
    console.log(`   - Payments: ${client.paymentHistory?.length || 0}`);
  });
  
  console.log('\n📋 Detail Invoice:');
  data.invoices.forEach(invoice => {
    console.log(`   ${invoice.invoiceNumber} - ${invoice.client}: Rp ${invoice.grandTotal.toLocaleString('id-ID')} (${invoice.status})`);
  });
  
  return data;
};

/**
 * Run all tests
 */
export const runAllTests = () => {
  console.log('\n🚀 Menjalankan Semua Test');
  console.log('=========================\n');
  
  const results = {
    test1: testValidateAllClients(),
    test2: null, // Manual test
    test3: testFixInconsistency(),
    test4: testInvoiceToIncomeSync(),
    test5: testExportData()
  };
  
  console.log('\n\n✅ Semua Test Selesai!');
  console.log('======================');
  
  return results;
};

/**
 * Quick test untuk development
 */
export const quickTest = () => {
  console.log('🔍 Quick Test - Payment Sync');
  console.log('============================\n');
  
  const clients = dataStore.getClients();
  const invoices = dataStore.getInvoices();
  
  console.log(`📊 Data Overview:`);
  console.log(`   Clients: ${clients.length}`);
  console.log(`   Invoices: ${invoices.length}`);
  
  if (clients.length > 0) {
    const firstClient = clients[0];
    console.log(`\n📋 Sample Client: ${firstClient.name}`);
    const summary = getClientPaymentSummary(firstClient.id);
    console.log(`   Total: Rp ${summary.totalAmount.toLocaleString('id-ID')}`);
    console.log(`   Paid: Rp ${summary.totalPaid.toLocaleString('id-ID')}`);
    console.log(`   Remaining: Rp ${summary.remainingAmount.toLocaleString('id-ID')}`);
    console.log(`   Status: ${summary.paymentStatus}`);
    
    const validation = validatePaymentConsistency(firstClient.id);
    console.log(`   Valid: ${validation.isValid ? '✅' : '❌'}`);
  }
  
  console.log('\n✅ Quick Test Complete!');
};

// Export untuk digunakan di console browser
if (typeof window !== 'undefined') {
  window.testPaymentSync = {
    testValidateAllClients,
    testRecordPayment,
    testFixInconsistency,
    testInvoiceToIncomeSync,
    testExportData,
    runAllTests,
    quickTest
  };
  
  console.log('💡 Test functions available at: window.testPaymentSync');
  console.log('   - quickTest()');
  console.log('   - runAllTests()');
  console.log('   - testValidateAllClients()');
  console.log('   - testRecordPayment(clientId, amount)');
  console.log('   - testFixInconsistency()');
  console.log('   - testInvoiceToIncomeSync()');
  console.log('   - testExportData()');
}
