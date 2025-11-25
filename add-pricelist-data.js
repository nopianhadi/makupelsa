// Script untuk menambahkan data pricelist dengan gambar
const fs = require('fs');
const path = require('path');

// Fungsi untuk mengkonversi gambar ke base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Error reading ${imagePath}:`, error.message);
    return null;
  }
}

// Daftar gambar yang akan digunakan
const imageFiles = [
  'Photo-30-fa537936.jpeg',
  'Photo-33-d36a1742.jpeg',
  'Photo-36-8018d3a1.jpeg',
  'Photo-44-39478e0a.jpeg',
  'Photo-46-cbf00cf9.jpeg',
  'Photo-49-3ded4a7b.jpeg',
  'Photo-50-cf5ac888.jpeg',
  'Photo-52-422f81b1.jpeg',
  'Photo-61-b0980342.jpeg',
  'Photo-69-da2dceab.jpeg'
];

// Konversi semua gambar ke base64
console.log('Mengkonversi gambar ke base64...');
const imagesBase64 = [];
for (const file of imageFiles) {
  const imagePath = path.join(__dirname, 'public', 'assets', 'images', file);
  const base64 = imageToBase64(imagePath);
  if (base64) {
    imagesBase64.push(base64);
    console.log(`✓ ${file} berhasil dikonversi`);
  } else {
    console.log(`✗ ${file} gagal dikonversi`);
  }
}

console.log(`\nTotal ${imagesBase64.length} gambar berhasil dikonversi\n`);

// Data pricelist yang akan ditambahkan
const pricelistData = [
  {
    title: 'Paket Wedding Elegant 2025',
    description: 'Paket makeup wedding lengkap dengan styling rambut dan aksesoris. Cocok untuk acara pernikahan yang elegan dan mewah.',
    whatsappNumber: '6281234567890',
    images: imagesBase64.slice(0, 2) // 2 gambar pertama
  },
  {
    title: 'Paket Prewedding Premium',
    description: 'Makeup dan styling untuk sesi foto prewedding. Termasuk touch up dan konsultasi tema.',
    whatsappNumber: '6281234567890',
    images: imagesBase64.slice(2, 4) // 2 gambar berikutnya
  },
  {
    title: 'Paket Engagement Party',
    description: 'Makeup natural dan fresh untuk acara lamaran. Tahan lama hingga 8 jam.',
    whatsappNumber: '6281234567890',
    images: imagesBase64.slice(4, 6)
  },
  {
    title: 'Paket Graduation Makeup',
    description: 'Makeup wisuda yang natural dan photogenic. Cocok untuk foto dan video dokumentasi.',
    whatsappNumber: '6281234567890',
    images: imagesBase64.slice(6, 8)
  },
  {
    title: 'Paket Party Makeup',
    description: 'Makeup glamour untuk pesta dan acara malam. Bold dan tahan lama.',
    whatsappNumber: '6281234567890',
    images: imagesBase64.slice(8, 10)
  },
  {
    title: 'Paket Bridesmaid Complete',
    description: 'Paket makeup untuk bridesmaid dengan harga spesial group. Minimal 3 orang.',
    whatsappNumber: '6281234567890',
    images: [imagesBase64[0], imagesBase64[3], imagesBase64[6]]
  },
  {
    title: 'Paket Photoshoot Studio',
    description: 'Makeup untuk sesi foto studio dengan berbagai konsep. Termasuk 2x touch up.',
    whatsappNumber: '6281234567890',
    images: [imagesBase64[1], imagesBase64[4], imagesBase64[7]]
  },
  {
    title: 'Paket Birthday Special',
    description: 'Makeup ulang tahun yang fun dan colorful. Cocok untuk sweet seventeen dan milestone birthday.',
    whatsappNumber: '6281234567890',
    images: [imagesBase64[2], imagesBase64[5], imagesBase64[8]]
  },
  {
    title: 'Paket Corporate Event',
    description: 'Makeup profesional untuk acara kantor, seminar, dan presentasi. Natural dan rapi.',
    whatsappNumber: '6281234567890',
    images: [imagesBase64[3], imagesBase64[6], imagesBase64[9]]
  },
  {
    title: 'Paket Traditional Wedding',
    description: 'Makeup adat dengan riasan tradisional lengkap. Tersedia berbagai adat Nusantara.',
    whatsappNumber: '6281234567890',
    images: [imagesBase64[0], imagesBase64[5], imagesBase64[9]]
  }
];

// Generate ID untuk setiap pricelist
function nanoid(length = 21) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Tambahkan ID dan timestamp ke setiap pricelist
const pricelists = pricelistData.map(item => ({
  ...item,
  id: nanoid(),
  publicId: nanoid(10),
  createdAt: new Date().toISOString()
}));

// Output sebagai JSON yang bisa di-copy paste ke browser console
console.log('='.repeat(80));
console.log('COPY SCRIPT BERIKUT KE BROWSER CONSOLE:');
console.log('='.repeat(80));
console.log('\n// Paste script ini di browser console (F12) saat membuka aplikasi\n');
console.log(`const newPricelists = ${JSON.stringify(pricelists, null, 2)};`);
console.log(`
// Ambil data pricelist yang sudah ada
const existingPricelists = JSON.parse(localStorage.getItem('pricelists') || '[]');

// Gabungkan dengan data baru
const allPricelists = [...existingPricelists, ...newPricelists];

// Simpan ke localStorage
localStorage.setItem('pricelists', JSON.stringify(allPricelists));

console.log('✓ Berhasil menambahkan ' + newPricelists.length + ' pricelist baru!');
console.log('✓ Total pricelist sekarang: ' + allPricelists.length);
console.log('Refresh halaman untuk melihat perubahan.');
`);

console.log('\n' + '='.repeat(80));
console.log('ATAU simpan ke file JSON:');
console.log('='.repeat(80));

// Simpan juga ke file JSON
const outputPath = path.join(__dirname, 'pricelist-data.json');
fs.writeFileSync(outputPath, JSON.stringify(pricelists, null, 2));
console.log(`\n✓ Data juga disimpan ke: ${outputPath}`);
console.log('  Anda bisa import file ini jika diperlukan.\n');
