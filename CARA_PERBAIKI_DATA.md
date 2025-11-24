# Cara Memperbaiki Peringatan Data

## Metode 1: Menggunakan Tombol di Aplikasi (PALING MUDAH)

1. Buka aplikasi di browser
2. Jika ada peringatan data, akan muncul notifikasi di pojok kanan bawah
3. Klik tombol **"Perbaiki Otomatis"**
4. Tunggu proses selesai
5. Aplikasi akan otomatis refresh

## Metode 2: Menggunakan Console Browser

1. Buka aplikasi di browser
2. Tekan `F12` atau klik kanan → Inspect untuk membuka Developer Tools
3. Buka tab **Console**

### Untuk melihat detail peringatan:
```javascript
cekPeringatanData()
```

### Untuk memperbaiki otomatis:
```javascript
fixDataIssues()
```

4. Lihat hasil di console dan ikuti instruksi

## Metode 3: Menggunakan Script Node.js (Untuk Development)

1. Buka terminal di folder project
2. Jalankan perintah:

```bash
node fix-data-validation.js
```

## Apa yang Diperbaiki Otomatis?

Sistem akan memperbaiki:

✅ Sinkronisasi status pembayaran klien
✅ Menghubungkan clientId yang hilang di proyek
✅ Menghubungkan clientId yang hilang di invoice
✅ Menyesuaikan budget proyek dengan total amount klien
✅ Inkonsistensi dalam total pembayaran

## Peringatan yang Mungkin Masih Muncul

Beberapa peringatan memerlukan perbaikan manual:

⚠️ Klien tidak memiliki kontak (telepon/email)
⚠️ Event tidak memiliki tanggal atau jenis layanan
⚠️ Proyek tidak memiliki tanggal
⚠️ Budget proyek tidak diset

Untuk peringatan ini, Anda perlu mengedit data secara manual di aplikasi.

## Troubleshooting

Jika masih ada masalah setelah perbaikan:

1. Coba refresh halaman (F5)
2. Jalankan perbaikan lagi
3. Cek console browser untuk detail error
4. Export data sebagai backup: `exportData()`
5. Hubungi developer jika masalah berlanjut

## Fungsi Utility Lainnya

Di console browser, Anda juga bisa menggunakan:

```javascript
// Export semua data sebagai backup
exportData()

// Reset gallery projects
resetGalleryProjects()

// Reset SEMUA data (HATI-HATI!)
resetAllData()
```
