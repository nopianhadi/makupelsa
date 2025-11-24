#!/usr/bin/env node

/**
 * Script cepat untuk menjalankan perbaikan data
 * Usage: node run-fix.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 MUA Finance Manager - Data Fix Tool\n');
console.log('═'.repeat(60));

// Step 1: Generate fixes
console.log('\n📝 Step 1: Menganalisis data dan membuat rencana perbaikan...\n');
require('./fix-client-data-errors.js');

// Step 2: Generate browser script
console.log('\n📝 Step 2: Membuat script untuk browser...\n');
require('./apply-client-fixes.js');

// Step 3: Show instructions
console.log('\n' + '═'.repeat(60));
console.log('\n✅ PERBAIKAN SIAP DIJALANKAN!\n');
console.log('📋 Pilih salah satu cara:\n');

console.log('🔹 CARA 1: Perbaikan Otomatis (TERMUDAH)');
console.log('   1. Buka aplikasi di browser');
console.log('   2. Klik tombol "Perbaiki Otomatis" pada notifikasi error');
console.log('   3. Tunggu hingga selesai dan halaman refresh otomatis\n');

console.log('🔹 CARA 2: Via Browser Console');
console.log('   1. Buka aplikasi di browser');
console.log('   2. Tekan F12 (Developer Tools)');
console.log('   3. Buka tab Console');
console.log('   4. Copy-paste isi file: apply-fixes-browser.js');
console.log('   5. Tekan Enter');
console.log('   6. Refresh halaman (F5)\n');

console.log('🔹 CARA 3: Copy Script Langsung');
console.log('   Script sudah tersedia di: apply-fixes-browser.js');
console.log('   Buka file tersebut dan copy semua isinya\n');

console.log('═'.repeat(60));
console.log('\n📊 Ringkasan Perbaikan:');
console.log('   • 5 klien akan diperbaiki');
console.log('   • 9 invoice akan dibuat');
console.log('   • 1 status pembayaran akan diupdate');
console.log('   • 0 data akan dihapus (aman!)\n');

console.log('📖 Dokumentasi lengkap: CARA_PERBAIKI_ERROR_DATA.md\n');

// Optional: Open browser script in default editor
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Apakah Anda ingin melihat script browser sekarang? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    const scriptPath = path.join(__dirname, 'apply-fixes-browser.js');
    const script = fs.readFileSync(scriptPath, 'utf8');
    
    console.log('\n' + '═'.repeat(60));
    console.log('📄 ISI SCRIPT (Copy semua baris di bawah ini):');
    console.log('═'.repeat(60) + '\n');
    console.log(script);
    console.log('\n' + '═'.repeat(60));
    console.log('📋 Copy script di atas dan paste ke browser console\n');
  } else {
    console.log('\n👍 Oke! Script tersedia di: apply-fixes-browser.js');
    console.log('   Buka file tersebut kapan saja untuk melihat script.\n');
  }
  
  rl.close();
});
