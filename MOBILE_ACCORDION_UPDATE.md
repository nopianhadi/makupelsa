# Update Accordion Mobile - Halaman Klien

## Perubahan yang Dilakukan

### 1. ClientDetailModal (Detail Klien)
- **Desktop**: Tetap menggunakan tab horizontal seperti sebelumnya
- **Mobile**: Menggunakan accordion dropdown untuk section:
  - 📅 Acara
  - 💳 Pembayaran  
  - 📄 Invoice
  - 💬 Komunikasi

**Fitur:**
- Section pertama (Acara) terbuka secara default
- Klik header untuk expand/collapse section
- Animasi smooth saat membuka/menutup
- Icon chevron berputar saat expand

### 2. ClientCard (Card Klien)
- **Desktop**: Tetap menampilkan semua informasi secara penuh
- **Mobile**: Menggunakan accordion dropdown untuk section:
  - 📅 Acara (terbuka default)
  - 💳 Pembayaran (tertutup default)
  - ⚙️ Aksi (tertutup default)

**Fitur:**
- Tampilan lebih rapi dan hemat ruang di mobile
- Semua tombol aksi tetap accessible dalam section "Aksi"
- Informasi penting (nama, foto, kontak) tetap terlihat

## Keuntungan

✅ Tampilan mobile lebih rapi dan terorganisir
✅ Mengurangi scrolling berlebihan
✅ User bisa fokus pada informasi yang dibutuhkan
✅ Tetap mempertahankan semua fitur
✅ Responsive - desktop tidak terpengaruh

## Cara Penggunaan

Di mode mobile:
1. Klik header section untuk membuka/menutup
2. Section yang terbuka akan menampilkan detail lengkap
3. Hanya satu atau beberapa section bisa terbuka bersamaan
