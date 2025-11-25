# 📝 Cara Menambahkan Data Sample

Tool ini akan menambahkan data sample ke halaman-halaman yang masih kosong di aplikasi MUA Finance Manager.

## 🎯 Data yang Ditambahkan

### 1. **Testimonials** (5 data)
- Ulasan dari klien dengan rating 4-5 bintang
- Status: approved dan pending
- Berbagai jenis layanan (akad, resepsi, wisuda, dll)

### 2. **Service Packages** (5 paket)
- Paket Akad Nikah Premium (Rp 3.5 juta)
- Paket Resepsi Elegant (Rp 4.5 juta)
- Paket Wisuda Fresh (Rp 500 ribu)
- Paket Lamaran Romantic (Rp 2 juta)
- Paket Photoshoot Professional (Rp 1.5 juta)

### 3. **Bookings** (5 booking)
- Booking dengan status confirmed dan pending
- Berbagai jenis acara dan venue
- Sudah termasuk DP dan total amount

### 4. **Leads** (3 prospek)
- Prospek baru dari berbagai sumber (Instagram, TikTok, Referral)
- Status: New, Contacted, Interested
- Lengkap dengan budget dan tanggal acara

## 🚀 Cara Menggunakan

### Metode 1: Via Browser (Paling Mudah)

1. **Buka file HTML**
   ```
   Buka file: tambah-data-sample.html
   ```
   - Double-click file `tambah-data-sample.html` di folder project
   - Atau buka via browser dengan URL: `file:///path/to/tambah-data-sample.html`

2. **Klik tombol "Tambahkan Data Sample"**
   - Tool akan otomatis menambahkan semua data
   - Tunggu hingga muncul pesan sukses
   - Halaman akan otomatis redirect ke dashboard dalam 3 detik

3. **Refresh aplikasi**
   - Buka aplikasi MUA Finance Manager
   - Refresh halaman (F5 atau Ctrl+R)
   - Data baru akan muncul di halaman terkait

### Metode 2: Via Browser Console

1. **Buka aplikasi di browser**
   ```
   http://localhost:5173
   ```

2. **Buka Developer Console**
   - Windows/Linux: `F12` atau `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

3. **Copy-paste script**
   - Buka file `tambah-data-sample.js`
   - Copy semua isi file
   - Paste di console browser
   - Tekan Enter

4. **Refresh halaman**
   - Tekan F5 atau Ctrl+R
   - Data baru akan muncul

### Metode 3: Via Development Server

Jika aplikasi sudah running di development server:

1. **Akses URL tool**
   ```
   http://localhost:5173/tambah-data-sample.html
   ```

2. **Klik tombol untuk menambahkan data**

3. **Kembali ke dashboard**

## 📊 Verifikasi Data

Setelah menambahkan data, cek halaman-halaman berikut:

### ✅ Halaman Testimonials
- Buka: `/testimonials`
- Harus ada 5 testimonials baru
- 3 approved, 2 pending

### ✅ Halaman Service Packages
- Buka: `/service-packages`
- Harus ada 5 paket layanan
- Semua paket dalam status aktif

### ✅ Halaman Booking
- Buka: `/booking`
- Harus ada 5 booking baru
- 3 confirmed, 2 pending

### ✅ Halaman Leads
- Buka: `/leads`
- Harus ada 3 prospek baru
- Status: New, Contacted, Interested

## 🔄 Reset Data

Jika ingin menghapus data sample dan mulai dari awal:

### Via Browser Console:
```javascript
// Hapus semua data
localStorage.removeItem('testimonials');
localStorage.removeItem('service_packages');
localStorage.removeItem('bookings');
localStorage.removeItem('leads');

// Atau hapus semua localStorage
localStorage.clear();

console.log('✅ Data berhasil dihapus');
```

### Via Application Storage:
1. Buka Developer Tools (F12)
2. Tab "Application" atau "Storage"
3. Pilih "Local Storage"
4. Klik kanan → "Clear"

## 💡 Tips

1. **Backup Data Lama**
   - Jika sudah ada data, tool akan skip data yang sudah ada
   - Hanya leads yang akan ditambahkan ke data existing

2. **Jalankan Sekali Saja**
   - Tool sudah dirancang untuk tidak duplikat data
   - Jika dijalankan lagi, data yang sudah ada tidak akan ditimpa

3. **Customize Data**
   - Edit file `tambah-data-sample.js` untuk mengubah data sample
   - Sesuaikan dengan kebutuhan bisnis Anda

## 🐛 Troubleshooting

### Data tidak muncul setelah ditambahkan
- **Solusi**: Refresh halaman dengan hard reload (Ctrl + Shift + R)

### Error "localStorage is full"
- **Solusi**: Hapus data lama atau kurangi jumlah data sample

### Data duplikat
- **Solusi**: Hapus localStorage dan jalankan tool lagi

## 📞 Support

Jika mengalami masalah:
1. Cek browser console untuk error message
2. Pastikan localStorage tidak penuh
3. Coba metode alternatif (HTML tool vs Console)

---

**Dibuat untuk**: MUA Finance Manager  
**Versi**: 1.0  
**Tanggal**: November 2025
