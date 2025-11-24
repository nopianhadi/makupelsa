/**
 * Script untuk memperbaiki validasi data secara otomatis
 * Jalankan dengan: node fix-data-validation.js
 */

// Import fungsi validasi dan perbaikan
const { validateAllData, autoFixAllData } = require('./src/utils/dataValidation');
const { syncAllData } = require('./src/utils/paymentSync');

console.log('🔍 Memulai validasi data...\n');

// Jalankan validasi
const validationResults = validateAllData();

console.log('📊 Hasil Validasi:');
console.log('==================');
console.log(`Total Klien: ${validationResults.clients.total}`);
console.log(`Total Proyek: ${validationResults.projects.total}`);
console.log(`Total Invoice: ${validationResults.invoices.total}`);
console.log(`\nTotal Error: ${validationResults.summary.totalErrors}`);
console.log(`Total Peringatan: ${validationResults.summary.totalWarnings}\n`);

// Tampilkan detail error
if (validationResults.clients.errors.length > 0) {
  console.log('❌ Error Klien:');
  validationResults.clients.errors.forEach(error => {
    console.log(`  - ${error.name}:`);
    error.errors.forEach(err => console.log(`    • ${err}`));
  });
  console.log('');
}

if (validationResults.projects.errors.length > 0) {
  console.log('❌ Error Proyek:');
  validationResults.projects.errors.forEach(error => {
    console.log(`  - ${error.title}:`);
    error.errors.forEach(err => console.log(`    • ${err}`));
  });
  console.log('');
}

if (validationResults.invoices.errors.length > 0) {
  console.log('❌ Error Invoice:');
  validationResults.invoices.errors.forEach(error => {
    console.log(`  - ${error.invoiceNumber}:`);
    error.errors.forEach(err => console.log(`    • ${err}`));
  });
  console.log('');
}

// Tampilkan detail peringatan
if (validationResults.clients.warnings.length > 0) {
  console.log('⚠️  Peringatan Klien:');
  validationResults.clients.warnings.forEach(warning => {
    console.log(`  - ${warning.name}:`);
    warning.warnings.forEach(warn => console.log(`    • ${warn}`));
  });
  console.log('');
}

if (validationResults.projects.warnings.length > 0) {
  console.log('⚠️  Peringatan Proyek:');
  validationResults.projects.warnings.forEach(warning => {
    console.log(`  - ${warning.title}:`);
    warning.warnings.forEach(warn => console.log(`    • ${warn}`));
  });
  console.log('');
}

if (validationResults.invoices.warnings.length > 0) {
  console.log('⚠️  Peringatan Invoice:');
  validationResults.invoices.warnings.forEach(warning => {
    console.log(`  - ${warning.invoiceNumber}:`);
    warning.warnings.forEach(warn => console.log(`    • ${warn}`));
  });
  console.log('');
}

// Jalankan perbaikan otomatis jika ada error
if (!validationResults.summary.isValid || validationResults.summary.totalWarnings > 0) {
  console.log('🔧 Menjalankan perbaikan otomatis...\n');
  
  const fixResults = autoFixAllData();
  console.log(`✅ ${fixResults.message}`);
  
  const syncResults = syncAllData();
  console.log(`✅ ${syncResults.message}\n`);
  
  // Validasi ulang setelah perbaikan
  console.log('🔍 Validasi ulang setelah perbaikan...\n');
  const revalidated = validateAllData();
  
  console.log('📊 Hasil Setelah Perbaikan:');
  console.log('===========================');
  console.log(`Total Error: ${revalidated.summary.totalErrors}`);
  console.log(`Total Peringatan: ${revalidated.summary.totalWarnings}`);
  
  if (revalidated.summary.isValid && revalidated.summary.totalWarnings === 0) {
    console.log('\n✨ Semua data sudah valid dan konsisten!');
  } else if (revalidated.summary.isValid) {
    console.log('\n✅ Tidak ada error, tapi masih ada beberapa peringatan.');
    console.log('   Peringatan ini mungkin memerlukan perbaikan manual.');
  } else {
    console.log('\n⚠️  Masih ada beberapa error yang memerlukan perbaikan manual.');
  }
} else {
  console.log('✨ Semua data sudah valid dan konsisten! Tidak perlu perbaikan.\n');
}
