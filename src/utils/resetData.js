/**
 * Utility untuk reset data jika terjadi error
 * Gunakan dengan hati-hati karena akan menghapus data
 */

import { validateAllData, autoFixAllData } from './dataValidation';
import { syncAllData } from './paymentSync';

/**
 * Perbaiki masalah validasi data secara otomatis
 */
export const fixDataIssues = () => {
  console.log('🔍 Memulai validasi data...');
  
  const validationResults = validateAllData();
  
  console.log('\n📊 Hasil Validasi:');
  console.log('==================');
  console.log(`Total Error: ${validationResults.summary.totalErrors}`);
  console.log(`Total Peringatan: ${validationResults.summary.totalWarnings}`);
  
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
  
  if (!validationResults.summary.isValid || validationResults.summary.totalWarnings > 0) {
    console.log('\n🔧 Menjalankan perbaikan otomatis...');
    
    const fixResults = autoFixAllData();
    console.log(`✅ ${fixResults.message}`);
    
    const syncResults = syncAllData();
    console.log(`✅ ${syncResults.message}`);
    
    const revalidated = validateAllData();
    console.log('\n📊 Hasil Setelah Perbaikan:');
    console.log(`Total Error: ${revalidated.summary.totalErrors}`);
    console.log(`Total Peringatan: ${revalidated.summary.totalWarnings}`);
    
    if (revalidated.summary.isValid && revalidated.summary.totalWarnings === 0) {
      console.log('\n✨ Semua data sudah valid dan konsisten!');
      alert('✅ Data berhasil diperbaiki! Halaman akan di-refresh.');
      window.location.reload();
    } else if (revalidated.summary.isValid) {
      console.log('\n✅ Tidak ada error, tapi masih ada beberapa peringatan.');
      alert('✅ Error diperbaiki, tapi masih ada peringatan. Cek console untuk detail.');
    }
    
    return revalidated;
  } else {
    console.log('\n✨ Semua data sudah valid dan konsisten!');
    alert('✅ Tidak ada masalah yang perlu diperbaiki.');
    return validationResults;
  }
};

export const resetGalleryProjects = () => {
  try {
    localStorage.removeItem('gallery_projects');
    console.log('✅ Gallery projects reset');
    return true;
  } catch (error) {
    console.error('Error resetting gallery projects:', error);
    return false;
  }
};

export const resetAllData = () => {
  if (!window.confirm('⚠️ PERINGATAN: Ini akan menghapus SEMUA data aplikasi. Lanjutkan?')) {
    return false;
  }

  try {
    const keysToKeep = ['theme', 'language']; // Keys yang tidak dihapus
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    console.log('✅ All data reset successfully');
    alert('✅ Data berhasil direset. Halaman akan di-refresh.');
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Error resetting all data:', error);
    return false;
  }
};

export const exportData = () => {
  try {
    const data = {};
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      try {
        data[key] = localStorage.getItem(key);
      } catch (err) {
        console.warn(`Could not export key: ${key}`, err);
      }
    });

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mua-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('✅ Data exported successfully');
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        Object.keys(data).forEach(key => {
          try {
            localStorage.setItem(key, data[key]);
          } catch (err) {
            console.warn(`Could not import key: ${key}`, err);
          }
        });

        console.log('✅ Data imported successfully');
        alert('✅ Data berhasil diimport. Halaman akan di-refresh.');
        window.location.reload();
        resolve(true);
      } catch (error) {
        console.error('Error importing data:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };

    reader.readAsText(file);
  });
};

/**
 * Cek detail peringatan data
 */
export const cekPeringatanData = () => {
  console.log('🔍 Mengecek peringatan data...\n');
  
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
  
  console.log('📊 Total Data:');
  console.log(`- Klien: ${clients.length}`);
  console.log(`- Proyek: ${projects.length}`);
  console.log(`- Invoice: ${invoices.length}\n`);
  
  let totalWarnings = 0;
  let totalErrors = 0;
  
  // Cek klien
  console.log('👥 KLIEN:');
  console.log('='.repeat(50));
  clients.forEach((client, index) => {
    const warnings = [];
    const errors = [];
    
    if (!client.name || client.name.trim() === '') {
      errors.push('❌ Nama klien kosong');
    }
    
    if (!client.phone && !client.email) {
      warnings.push('⚠️  Tidak ada kontak (telepon/email)');
    }
    
    if (!client.totalAmount || client.totalAmount <= 0) {
      warnings.push('⚠️  Total amount tidak diset');
    }
    
    if (client.events && client.events.length > 0) {
      client.events.forEach((event, idx) => {
        if (!event.eventDate) {
          warnings.push(`⚠️  Event ${idx + 1} tidak memiliki tanggal`);
        }
        if (!event.serviceType) {
          warnings.push(`⚠️  Event ${idx + 1} tidak memiliki jenis layanan`);
        }
      });
    }
    
    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n${index + 1}. ${client.name || 'TANPA NAMA'} (ID: ${client.id})`);
      errors.forEach(e => console.log(`   ${e}`));
      warnings.forEach(w => console.log(`   ${w}`));
      totalErrors += errors.length;
      totalWarnings += warnings.length;
    }
  });
  
  // Cek proyek
  console.log('\n\n📁 PROYEK:');
  console.log('='.repeat(50));
  projects.forEach((project, index) => {
    const warnings = [];
    const errors = [];
    
    if (!project.title || project.title.trim() === '') {
      errors.push('❌ Judul proyek kosong');
    }
    
    if (!project.client || project.client.trim() === '') {
      warnings.push('⚠️  Proyek tidak memiliki klien');
    }
    
    if (!project.date) {
      warnings.push('⚠️  Proyek tidak memiliki tanggal');
    }
    
    if (!project.budget || project.budget <= 0) {
      warnings.push('⚠️  Budget proyek tidak diset');
    }
    
    if (!project.clientId) {
      warnings.push('⚠️  Proyek tidak memiliki clientId');
    }
    
    if (project.budget && project.paid && project.paid > project.budget) {
      errors.push('❌ Jumlah yang dibayar melebihi budget');
    }
    
    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n${index + 1}. ${project.title || 'TANPA JUDUL'} (ID: ${project.id})`);
      console.log(`   Klien: ${project.client || 'N/A'}`);
      errors.forEach(e => console.log(`   ${e}`));
      warnings.forEach(w => console.log(`   ${w}`));
      totalErrors += errors.length;
      totalWarnings += warnings.length;
    }
  });
  
  console.log('\n\n📊 RINGKASAN:');
  console.log('='.repeat(50));
  console.log(`Total Error: ${totalErrors}`);
  console.log(`Total Peringatan: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✨ Tidak ada masalah ditemukan!');
  } else {
    console.log('\n💡 Untuk memperbaiki otomatis, jalankan: fixDataIssues()');
  }
  
  return { totalErrors, totalWarnings };
};

// Add to window for easy access from console
if (typeof window !== 'undefined') {
  window.cekPeringatanData = cekPeringatanData;
  window.fixDataIssues = fixDataIssues;
  window.resetGalleryProjects = resetGalleryProjects;
  window.resetAllData = resetAllData;
  window.exportData = exportData;
  window.importData = importData;
  
  console.log('✅ Data utilities loaded! Gunakan:');
  console.log('- cekPeringatanData() - Cek detail peringatan');
  console.log('- fixDataIssues() - Perbaiki masalah otomatis');
  console.log('- exportData() - Export semua data');
}
