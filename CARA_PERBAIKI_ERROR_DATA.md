# Cara Memperbaiki Error Data Klien

## Error yang Diperbaiki

Script ini memperbaiki 5 error data klien:

1. **Siti Nurhaliza** - Ada payment history tapi tidak ada invoice yang sesuai
2. **Dewi Lestari** - Ada payment history tapi tidak ada invoice yang sesuai
3. **Ayu Kartika** - Ada payment history tapi tidak ada invoice yang sesuai
4. **Maya Anggraini** - Status pembayaran tidak sesuai (partial → overdue) + tidak ada invoice
5. **Putri Maharani** - Ada payment history tapi tidak ada invoice yang sesuai

## Cara Menggunakan

### Opsi 1: Perbaikan Otomatis dari UI (RECOMMENDED)

Ketika error muncul di aplikasi, klik tombol **"Perbaiki Otomatis"** pada notifikasi error.

Sistem akan:
- Membuat invoice untuk setiap payment history
- Menghubungkan invoice dengan pembayaran yang sudah ada
- Memperbaiki status pembayaran yang tidak sesuai
- Refresh halaman secara otomatis

### Opsi 2: Via Browser Console

1. Buka aplikasi di browser
2. Tekan F12 untuk membuka Developer Tools
3. Buka tab Console
4. Copy-paste isi file `apply-fixes-browser.js`
5. Tekan Enter
6. Refresh halaman (F5)

### Opsi 3: Via Node.js Script

```bash
# 1. Generate file perbaikan
node fix-client-data-errors.js

# 2. Generate script browser
node apply-client-fixes.js

# 3. Jalankan script di browser (lihat Opsi 2)
```

## Detail Perbaikan

### Invoice yang Dibuat

Total: **9 invoice baru**

#### Siti Nurhaliza (2 invoice)
- INV-202511-001-01: Rp 1.500.000 (DP Paket Akad) - PAID
- INV-202511-001-02: Rp 1.000.000 (Pelunasan) - PENDING

#### Dewi Lestari (2 invoice)
- INV-202511-002-01: Rp 2.000.000 (DP Paket Resepsi) - PAID
- INV-202511-002-02: Rp 2.000.000 (Pelunasan) - PAID

#### Ayu Kartika (2 invoice)
- INV-202511-004-01: Rp 3.000.000 (DP 50%) - PAID
- INV-202511-004-02: Rp 3.000.000 (Pelunasan) - PENDING

#### Maya Anggraini (2 invoice)
- INV-202511-005-01: Rp 1.000.000 (DP Paket Akad) - PAID
- INV-202511-005-02: Rp 1.500.000 (Pelunasan) - OVERDUE
- Status pembayaran diupdate: partial → overdue

#### Putri Maharani (1 invoice)
- INV-202511-006-01: Rp 1.500.000 (Pembayaran Lunas) - PAID

## Verifikasi

Setelah perbaikan, verifikasi dengan:

1. Refresh halaman aplikasi
2. Cek notifikasi error - seharusnya hilang
3. Buka halaman Client Management
4. Cek detail klien yang diperbaiki
5. Pastikan invoice muncul di payment history

## File yang Dihasilkan

- `client-data-fixes.json` - Detail perbaikan dalam format JSON
- `apply-fixes-browser.js` - Script untuk dijalankan di browser
- `src/utils/fixClientData.js` - Utility function untuk perbaikan otomatis
- `src/components/ui/FixDataButton.jsx` - Komponen tombol perbaikan

## Troubleshooting

### Error masih muncul setelah perbaikan

1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh halaman dengan hard reload (Ctrl+F5)
3. Cek localStorage di Developer Tools → Application → Local Storage
4. Pastikan data `mua_invoices` sudah berisi invoice baru

### Script tidak berjalan di browser

1. Pastikan tidak ada error di console
2. Cek apakah localStorage `mua_clients` ada
3. Jalankan script satu per satu (copy-paste per bagian)

### Invoice tidak muncul di UI

1. Refresh halaman
2. Cek localStorage `mua_invoices`
3. Trigger storage event: `window.dispatchEvent(new Event('storage'))`

## Catatan Penting

- Perbaikan ini **aman** dan tidak menghapus data yang sudah ada
- Invoice yang dibuat akan otomatis terhubung dengan payment history
- Status pembayaran akan diupdate sesuai dengan kondisi aktual
- Backup data tidak diperlukan karena hanya menambah data, tidak menghapus

## Support

Jika masih ada masalah, hubungi developer atau buka issue di repository.
