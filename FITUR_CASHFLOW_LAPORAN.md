# Fitur Cashflow dan Laporan Keuangan

## Deskripsi
Menambahkan card **Cashflow** dan **Ringkasan Laporan** di halaman Financial Tracking untuk memberikan insight keuangan yang lebih komprehensif.

## 1. Cashflow Card

### Fitur
- **Total Arus Kas**: Menampilkan total cashflow keseluruhan
- **Arus Kas Bulan Ini**: Menampilkan cashflow untuk bulan berjalan
- **Breakdown**: Pemasukan, Pengeluaran, dan Net Cashflow
- **Rasio Cashflow**: Persentase cashflow terhadap total pemasukan
- **Status Indicator**: Visual indicator (hijau untuk surplus, merah untuk defisit)

### Data yang Ditampilkan

#### Card 1: Total Arus Kas
- Total Net Cashflow (Pemasukan - Pengeluaran)
- Total Pemasukan
- Total Pengeluaran
- Rasio Cashflow (%)
- Icon trending up/down berdasarkan status

#### Card 2: Arus Kas Bulan Ini
- Net Cashflow bulan berjalan
- Pemasukan bulan ini
- Pengeluaran bulan ini
- Status: Surplus atau Defisit
- Icon calendar dengan warna status

### Perhitungan
```javascript
Total Cashflow = Total Pemasukan - Total Pengeluaran
Rasio Cashflow = (Net Cashflow / Total Pemasukan) × 100%
Monthly Cashflow = Pemasukan Bulan Ini - Pengeluaran Bulan Ini
```

## 2. Report Card

### Fitur
- **Ringkasan Laba**: Laba bersih dan margin keuntungan
- **Total Transaksi**: Jumlah transaksi pemasukan dan pengeluaran
- **Kategori Teratas**: Kategori dengan nilai tertinggi
- **Quick Stats**: Statistik cepat rata-rata transaksi
- **Posisi**: Di dalam tab Laporan, sebelum grafik detail

### Data yang Ditampilkan

#### Card 1: Laba Bersih
- Net Profit (Total Pemasukan - Total Pengeluaran)
- Profit Margin (%)
- Icon trending berdasarkan profit/loss

#### Card 2: Total Transaksi
- Total jumlah transaksi
- Breakdown: Jumlah pemasukan dan pengeluaran
- Icon activity

#### Card 3: Kategori Teratas
- Pemasukan terbesar (service type)
- Pengeluaran terbesar (kategori)
- Nominal masing-masing

#### Quick Stats Bar
- Total Pemasukan
- Total Pengeluaran
- Rata-rata Pemasukan per transaksi
- Rata-rata Pengeluaran per transaksi

### Perhitungan
```javascript
Net Profit = Total Pemasukan - Total Pengeluaran
Profit Margin = (Net Profit / Total Pemasukan) × 100%
Rata-rata Pemasukan = Total Pemasukan / Jumlah Transaksi Pemasukan
Rata-rata Pengeluaran = Total Pengeluaran / Jumlah Transaksi Pengeluaran
```

## Integrasi

### Data Source
- **Incomes**: Data dari invoice yang sudah dibayar (paid status)
- **Expenses**: Data dari dataStore.getExpenses()
- **Real-time**: Otomatis update saat ada perubahan data

### Posisi di Halaman
1. My Cards (Saldo Kas & Bank)
2. Financial Summary Cards
3. Quick Actions
4. Category Cards (Filter)
5. Financial Filter Cards
6. Tabs Navigation
7. **Tab Laporan**:
   - **🆕 Cashflow Card** ← Baru
   - **🆕 Report Card** ← Baru
   - Financial Report Page (Grafik & Detail)

### Interaksi
- **Lokasi**: Kedua card berada di dalam **Tab Laporan**
- **Cashflow Card**: Read-only, menampilkan data real-time
- **Report Card**: Menampilkan ringkasan sebelum laporan detail
- **Responsive**: Grid 1 kolom (mobile), 2 kolom (tablet/desktop)

## Visual Design

### Cashflow Card
- Grid 2 kolom (responsive)
- Icon trending dengan warna dinamis (success/error)
- Border dan elevation untuk depth
- Breakdown dengan icon ArrowDownCircle (income) dan ArrowUpCircle (expense)

### Report Card
- Grid 3 kolom (responsive: 1 → 2 → 3)
- Icon berbeda untuk setiap metrik
- Quick stats bar dengan 4 kolom
- Tombol CTA untuk lihat laporan lengkap

## Color Coding
- **Success (Hijau)**: Cashflow positif, profit, pemasukan
- **Error (Merah)**: Cashflow negatif, loss, pengeluaran
- **Primary (Biru)**: Transaksi, aktivitas
- **Warning (Kuning)**: Kategori teratas, highlight
- **Accent (Ungu)**: Laporan, analytics

## File Terkait
- `src/pages/financial-tracking/components/CashflowCard.jsx`
- `src/pages/financial-tracking/components/ReportCard.jsx`
- `src/pages/financial-tracking/index.jsx`

## Responsive Behavior
- **Mobile (< 640px)**: 1 kolom untuk semua card
- **Tablet (640px - 1024px)**: 2 kolom untuk cashflow, 2 kolom untuk report
- **Desktop (> 1024px)**: 2 kolom untuk cashflow, 3 kolom untuk report

## Benefits
1. **Quick Insight**: Melihat kesehatan keuangan dalam sekejap
2. **Trend Analysis**: Memahami tren cashflow bulanan vs total
3. **Performance Metrics**: Profit margin dan rasio cashflow
4. **Category Intelligence**: Mengetahui kategori dengan performa terbaik
5. **Decision Support**: Data untuk pengambilan keputusan bisnis
