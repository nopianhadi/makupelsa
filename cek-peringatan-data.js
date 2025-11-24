/**
 * Script untuk mengecek detail peringatan data
 * Jalankan di browser console dengan: window.cekPeringatanData()
 */

// Fungsi untuk mengecek peringatan data
window.cekPeringatanData = function() {
  console.log('🔍 Mengecek peringatan data...\n');
  
  // Ambil data dari localStorage
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
  
  // Cek invoice
  console.log('\n\n🧾 INVOICE:');
  console.log('='.repeat(50));
  invoices.forEach((invoice, index) => {
    const warnings = [];
    const errors = [];
    
    if (!invoice.invoiceNumber) {
      errors.push('❌ Nomor invoice kosong');
    }
    
    if (!invoice.client || invoice.client.trim() === '') {
      errors.push('❌ Invoice tidak memiliki klien');
    }
    
    if (!invoice.date) {
      errors.push('❌ Invoice tidak memiliki tanggal');
    }
    
    if (!invoice.items || invoice.items.length === 0) {
      errors.push('❌ Invoice tidak memiliki item');
    }
    
    if (!invoice.clientId) {
      warnings.push('⚠️  Invoice tidak memiliki clientId');
    }
    
    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n${index + 1}. ${invoice.invoiceNumber || 'TANPA NOMOR'} (ID: ${invoice.id})`);
      console.log(`   Klien: ${invoice.client || 'N/A'}`);
      errors.forEach(e => console.log(`   ${e}`));
      warnings.forEach(w => console.log(`   ${w}`));
      totalErrors += errors.length;
      totalWarnings += warnings.length;
    }
  });
  
  // Summary
  console.log('\n\n📊 RINGKASAN:');
  console.log('='.repeat(50));
  console.log(`Total Error: ${totalErrors}`);
  console.log(`Total Peringatan: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✨ Tidak ada masalah ditemukan!');
  } else {
    console.log('\n💡 Untuk memperbaiki otomatis, jalankan: fixDataIssues()');
  }
  
  return {
    totalErrors,
    totalWarnings,
    clients: clients.length,
    projects: projects.length,
    invoices: invoices.length
  };
};

// Fungsi untuk melihat data mentah
window.lihatDataMentah = function() {
  console.log('📦 DATA MENTAH:\n');
  
  console.log('👥 KLIEN:');
  console.log(JSON.parse(localStorage.getItem('clients') || '[]'));
  
  console.log('\n📁 PROYEK:');
  console.log(JSON.parse(localStorage.getItem('projects') || '[]'));
  
  console.log('\n🧾 INVOICE:');
  console.log(JSON.parse(localStorage.getItem('invoices') || '[]'));
  
  console.log('\n👨‍💼 TIM:');
  console.log(JSON.parse(localStorage.getItem('team_members') || '[]'));
  
  console.log('\n📅 BOOKING:');
  console.log(JSON.parse(localStorage.getItem('bookings') || '[]'));
  
  console.log('\n🎨 GALLERY:');
  console.log(JSON.parse(localStorage.getItem('gallery_projects') || '[]'));
};

// Fungsi untuk menghitung statistik
window.statistikData = function() {
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
  const teamMembers = JSON.parse(localStorage.getItem('team_members') || '[]');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const gallery = JSON.parse(localStorage.getItem('gallery_projects') || '[]');
  
  console.log('📊 STATISTIK DATA:');
  console.log('='.repeat(50));
  console.log(`👥 Klien: ${clients.length}`);
  console.log(`📁 Proyek: ${projects.length}`);
  console.log(`🧾 Invoice: ${invoices.length}`);
  console.log(`👨‍💼 Tim: ${teamMembers.length}`);
  console.log(`📅 Booking: ${bookings.length}`);
  console.log(`🎨 Gallery: ${gallery.length}`);
  
  // Hitung total pembayaran
  const totalPaid = clients.reduce((sum, client) => {
    return sum + (client.paidAmount || 0);
  }, 0);
  
  const totalAmount = clients.reduce((sum, client) => {
    return sum + (client.totalAmount || 0);
  }, 0);
  
  console.log('\n💰 KEUANGAN:');
  console.log(`Total Amount: Rp ${totalAmount.toLocaleString('id-ID')}`);
  console.log(`Total Paid: Rp ${totalPaid.toLocaleString('id-ID')}`);
  console.log(`Remaining: Rp ${(totalAmount - totalPaid).toLocaleString('id-ID')}`);
  
  return {
    clients: clients.length,
    projects: projects.length,
    invoices: invoices.length,
    teamMembers: teamMembers.length,
    bookings: bookings.length,
    gallery: gallery.length,
    totalAmount,
    totalPaid,
    remaining: totalAmount - totalPaid
  };
};

console.log('✅ Utility loaded! Gunakan:');
console.log('- cekPeringatanData() - Cek detail peringatan');
console.log('- fixDataIssues() - Perbaiki masalah otomatis');
console.log('- lihatDataMentah() - Lihat semua data mentah');
console.log('- statistikData() - Lihat statistik data');
