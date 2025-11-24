# Fitur Pricelist Gallery - Dokumentasi Lengkap

## 📋 Deskripsi
Fitur untuk mengelola dan membagikan daftar harga layanan dalam bentuk gambar dengan link publik yang dapat dibagikan ke klien.

## ✨ Fitur Utama

### 1. Upload Gambar Pricelist
- Upload **multiple gambar** (maksimal 20 gambar per pricelist)
- Support format PNG, JPG, JPEG
- Kompresi otomatis untuk menghemat storage
- Preview semua gambar sebelum disimpan
- Maksimal ukuran file 5MB per gambar
- Grid view dengan scroll untuk banyak gambar

### 2. CRUD Pricelist
- **Create**: Tambah pricelist baru dengan judul, deskripsi, dan gambar
- **Read**: Lihat semua pricelist yang telah dibuat
- **Update**: Edit informasi pricelist
- **Delete**: Hapus pricelist yang tidak diperlukan

### 3. Link Publik
- Setiap pricelist otomatis mendapat link publik unik
- Link dapat dibagikan ke klien via WhatsApp, email, atau media sosial
- Klien dapat melihat pricelist tanpa perlu login
- Format link: `https://domain.com/pricelist/public/{publicId}`

### 4. Pencarian & Filter
- Cari pricelist berdasarkan judul atau deskripsi
- Tampilan grid yang responsif
- Sorting berdasarkan tanggal pembuatan

## 🎯 Cara Penggunaan

### Menambah Pricelist Baru
1. Buka menu **Pricelist** di sidebar
2. Klik tombol **"Tambah Pricelist"**
3. Isi form:
   - **Judul**: Nama pricelist (contoh: "Paket Wedding 2025")
   - **Deskripsi**: Keterangan singkat (opsional)
   - **Gambar**: Upload 1-20 gambar pricelist (bisa pilih multiple sekaligus)
4. Klik **"Tambah Pricelist"**

**Tips Upload Multiple Images:**
- Pilih semua gambar sekaligus saat upload (Ctrl/Cmd + klik multiple files)
- Atau upload bertahap sampai maksimal 20 gambar
- Gambar pertama akan jadi thumbnail utama
- Hover pada gambar untuk hapus individual
- Grid view otomatis scroll jika banyak gambar

### Membagikan Link Publik
1. Pada card pricelist, klik tombol **"Salin Link"**
2. Link otomatis tersalin ke clipboard
3. Bagikan link ke klien melalui:
   - WhatsApp
   - Email
   - Instagram DM
   - Facebook Messenger
   - Media sosial lainnya

### Mengedit Pricelist
1. Klik icon **Edit** (pensil) pada card pricelist
2. Ubah informasi yang diperlukan
3. Klik **"Simpan Perubahan"**

### Menghapus Pricelist
1. Klik icon **Trash** (tempat sampah) pada card pricelist
2. Konfirmasi penghapusan
3. Pricelist akan dihapus permanen

## 📱 Tampilan Publik

Ketika klien membuka link publik, mereka akan melihat:
- Judul pricelist
- Deskripsi (jika ada)
- **Image carousel** jika ada multiple gambar (sampai 20 gambar)
- Navigasi prev/next untuk ganti gambar
- Indicator jumlah gambar (1/20, 2/20, dst)
- Dots navigation untuk jump ke gambar tertentu
- Gambar dalam ukuran penuh & responsif
- Tanggal pembuatan
- Informasi kontak (opsional)

## 💾 Penyimpanan

### Kapasitas Storage
- Menggunakan localStorage browser
- Limit: ~5MB total untuk semua data
- Notifikasi otomatis jika storage hampir penuh (>80%)

### Tips Menghemat Storage
1. Gunakan gambar dengan ukuran wajar (tidak perlu resolusi sangat tinggi)
2. Hapus pricelist lama yang sudah tidak digunakan
3. Sistem otomatis mengkompresi gambar saat upload

## 🔒 Keamanan & Privasi

- Link publik menggunakan ID unik yang sulit ditebak
- Tidak ada data sensitif yang ditampilkan di halaman publik
- Hanya pemilik akun yang bisa edit/hapus pricelist
- Data tersimpan lokal di browser (tidak di server)

## 📊 Monitoring

### Informasi yang Tersedia
- Total pricelist yang dibuat
- Tanggal pembuatan setiap pricelist
- Status storage (berapa persen terpakai)

## 🎨 Desain & UX

### Responsif
- Desktop: Grid 3 kolom
- Tablet: Grid 2 kolom
- Mobile: Grid 1 kolom

### Interaksi
- Hover effects pada card
- Loading state saat upload gambar
- Konfirmasi sebelum hapus
- Toast notification untuk aksi berhasil

## 🚀 Integrasi dengan Fitur Lain

### Klien Management
- Link pricelist dapat disimpan di data klien
- Kirim pricelist langsung dari halaman klien

### Booking
- Tampilkan pricelist saat klien melakukan booking
- Referensi paket yang dipilih

### Leads
- Bagikan pricelist ke prospek klien
- Track mana pricelist yang paling sering dilihat

## 📝 Best Practices

### Membuat Pricelist Efektif
1. **Judul Jelas**: Gunakan nama yang deskriptif
2. **Gambar Berkualitas**: Pastikan teks di gambar terbaca jelas
3. **Update Berkala**: Perbarui harga sesuai periode
4. **Kategorisasi**: Buat pricelist terpisah per kategori layanan

### Membagikan ke Klien
1. Sertakan pesan personal saat mengirim link
2. Jelaskan isi pricelist secara singkat
3. Berikan call-to-action (contoh: "Hubungi kami untuk booking")
4. Follow up setelah klien melihat pricelist

## 🔧 Troubleshooting

### Gambar Tidak Terupload
- Pastikan ukuran file < 5MB
- Gunakan format PNG, JPG, atau JPEG
- Coba kompres gambar terlebih dahulu

### Storage Penuh
- Hapus pricelist lama yang tidak digunakan
- Gunakan gambar dengan ukuran lebih kecil
- Clear cache browser jika perlu

### Link Tidak Berfungsi
- Pastikan publicId valid
- Cek apakah pricelist sudah dihapus
- Refresh halaman dan coba lagi

## 📈 Statistik & Analytics (Future)

Fitur yang akan datang:
- Jumlah view per pricelist
- Konversi dari view ke booking
- Pricelist paling populer
- Waktu rata-rata view

## 🎯 Use Cases

### 1. Wedding MUA
```
Judul: "Paket Wedding Premium 2025"
Deskripsi: "Paket lengkap untuk hari spesial Anda"
Gambar: Daftar harga dengan breakdown detail
```

### 2. Graduation MUA
```
Judul: "Promo Wisuda Season"
Deskripsi: "Diskon 20% untuk booking grup"
Gambar: Pricelist dengan highlight promo
```

### 3. Photoshoot Package
```
Judul: "Paket Photoshoot Studio"
Deskripsi: "Include makeup + foto + editing"
Gambar: Perbandingan paket Basic, Standard, Premium
```

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi ini terlebih dahulu
2. Lihat bagian Troubleshooting
3. Hubungi tim support

---

**Versi**: 1.0.0  
**Tanggal**: November 2025  
**Status**: ✅ Aktif & Siap Digunakan
