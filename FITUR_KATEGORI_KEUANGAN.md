# Fitur Kategori Keuangan dengan Filter

## Deskripsi
Fitur baru yang menampilkan card untuk setiap kategori pengeluaran dan pemasukan dengan kemampuan filter interaktif. Data kategori diambil langsung dari **localStorage** dan **real-time sync** dengan data keuangan aktual.

## Fitur Utama

### 1. Category Cards
- **Grid Layout**: Menampilkan semua kategori dalam grid responsif (2 kolom di mobile, 3 di tablet, 6 di desktop)
- **Visual Indicators**: Setiap kategori memiliki icon, warna, dan badge unik
- **Real-time Data**: Menampilkan total, jumlah transaksi, dan persentase untuk setiap kategori

### 2. Toggle Pengeluaran/Pemasukan
- Switch mudah antara kategori pengeluaran dan pemasukan
- Tampilan otomatis berubah sesuai tipe yang dipilih

### 3. Filter Interaktif
- **Klik untuk Filter**: Klik card kategori untuk memfilter data
- **Visual Feedback**: Card yang dipilih akan highlight dengan warna kategori
- **Auto Switch Tab**: Otomatis pindah ke tab yang sesuai saat kategori dipilih
- **Clear Filter**: Tombol untuk menghapus filter dengan mudah

## Sumber Data Kategori

### Kategori Pengeluaran
Data diambil dari **localStorage** dengan key `expense_categories`:
- Default: Kosmetik, Gaji Asisten, Transportasi, Peralatan, Marketing, Lainnya
- Dapat dikustomisasi melalui halaman Pengaturan
- Real-time update saat kategori ditambah/diubah

Icon mapping:
1. **Kosmetik** - Icon: Sparkles (Secondary/Pink)
2. **Gaji Asisten** - Icon: Users (Primary)
3. **Transportasi** - Icon: Car (Accent)
4. **Peralatan** - Icon: Package (Warning)
5. **Marketing** - Icon: Megaphone (Success)
6. **Lainnya** - Icon: MoreHorizontal (Muted)

### Kategori Pemasukan (Service Types)
Data diambil dari **localStorage** dengan key `service_types`:
- Default: Akad, Resepsi, Wisuda, Lainnya
- Dapat dikustomisasi melalui halaman Pengaturan
- Real-time update saat service type ditambah/diubah

Icon mapping:
1. **Akad** - Icon: Heart (Primary)
2. **Resepsi** - Icon: PartyPopper (Secondary)
3. **Wisuda** - Icon: GraduationCap (Accent)
4. **Lainnya** - Icon: Briefcase (Warning)

## Informasi yang Ditampilkan
Setiap card menampilkan:
- Icon kategori dengan warna khas
- Nama kategori
- Total nominal (format Rupiah)
- Jumlah transaksi
- Persentase dari total
- Checkmark saat dipilih

## Cara Penggunaan

### Filter Berdasarkan Kategori
1. Pilih tipe (Pengeluaran/Pemasukan) menggunakan toggle di atas
2. Klik card kategori yang ingin difilter
3. Data di bawah akan otomatis terfilter
4. Klik lagi card yang sama atau tombol "Hapus Filter" untuk reset

### Kombinasi dengan Filter Lain
- Filter kategori dapat dikombinasikan dengan filter tanggal, metode pembayaran, dan jumlah
- Semua filter bekerja secara bersamaan untuk hasil yang lebih spesifik

## Integrasi
Komponen `CategoryCards` terintegrasi dengan:
- `FinancialTracking` (halaman utama)
- `IncomeList` dan `ExpenseList` (untuk menampilkan data terfilter)
- Filter system yang sudah ada
- **localStorage** untuk data kategori dinamis
- **Storage Events** untuk real-time sync saat kategori diupdate

## Real-time Sync
- Listen ke event `EXPENSE_CATEGORIES_UPDATED` untuk update kategori pengeluaran
- Listen ke event `SERVICE_TYPES_UPDATED` untuk update kategori pemasukan
- Otomatis refresh saat ada perubahan di Pengaturan

## File Terkait
- `src/pages/financial-tracking/components/CategoryCards.jsx` - Komponen utama
- `src/pages/financial-tracking/index.jsx` - Integrasi ke halaman

## Responsive Design
- Mobile: 2 kolom grid
- Tablet: 3 kolom grid
- Desktop: 6 kolom grid
- Touch-friendly dengan active state
- Smooth animations dan transitions
