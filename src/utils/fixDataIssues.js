/**
 * Utility untuk memperbaiki masalah validasi data
 * Dapat dipanggil dari console browser atau komponen React
 */

import { validateAllData, autoFixAllData } from './dataValidation';
import { syncAllData } from './paymentSync';

/**
 * Jalankan perbaikan lengkap dan tampilkan hasilnya
 */
export const runFullDataFix = () => {
  console.log('🔍 Memulai validasi data...');
  
  // Validasi awal
  const validationResults = validateAllData();
  
  console.log('\n📊 Hasil Validasi:');
  console.log('==================');
  console.log(`Total Error: ${validationResults.summary.totalErrors}`);
  console.log(`Total Peringatan: ${validationResults.summary.totalWarnings}`);
  
  // Tampilkan detail
  if (validationResults.clients.errors.length > 0) {
    console.log('\n❌ Error Klien:', validationResults.clients.errors);
  }
  if (validationResults.clients.warnings.length > 0) {
    console.log('\n⚠️  Peringatan Klien:', validationResults.clients.warnings);
  }
  if (validationResults.projects.errors.length > 0) {
    console.log('\n❌ Error Proyek:', validationResults.projects.errors);
  }
  if (validationResults.projects.warnings.length > 0) {
    console.log('\n⚠️  Peringatan Proyek:', validationResults.projects.warnings);
  }
  if (validationResults.invoices.errors.length > 0) {
    console.log('\n❌ Error Invoice:', validationResults.invoices.errors);
  }
  if (validationResults.invoices.warnings.length > 0) {
    console.log('\n⚠️  Peringatan Invoice:', validationResults.invoices.warnings);
  }
  
  // Jalankan perbaikan jika diperlukan
  if (!validationResults.summary.isValid || validationResults.summary.totalWarnings > 0) {
    console.log('\n🔧 Menjalankan perbaikan otomatis...');
    
    const fixResults = autoFixAllData();
    console.log(`✅ ${fixResults.message}`);
    
    const syncResults = syncAllData();
    console.log(`✅ ${syncResults.message}`);
    
    // Validasi ulang
    const revalidated = validateAllData();
    console.log('\n📊 Hasil Setelah Perbaikan:');
    console.log(`Total Error: ${revalidated.summary.totalErrors}`);
    console.log(`Total Peringatan: ${revalidated.summary.totalWarnings}`);
    
    if (revalidated.summary.isValid && revalidated.summary.totalWarnings === 0) {
      console.log('\n✨ Semua data sudah valid dan konsisten!');
    } else if (revalidated.summary.isValid) {
      console.log('\n✅ Tidak ada error, tapi masih ada beberapa peringatan.');
    }
    
    return {
      success: true,
      before: validationResults,
      after: revalidated,
      fixed: fixResults.fixedCount
    };
  } else {
    console.log('\n✨ Semua data sudah valid dan konsisten!');
    return {
      success: true,
      message: 'Tidak ada masalah yang perlu diperbaiki'
    };
  }
};

/**
 * Ekspor untuk digunakan di window (browser console)
 */
if (typeof window !== 'undefined') {
  window.fixDataIssues = runFullDataFix;
}

export default runFullDataFix;
