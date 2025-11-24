# 🧪 Testing Pricelist Feature - Commands

## Quick Test Commands

### 1. Cek Data Pricelist di Console
```javascript
// Buka browser console (F12) dan jalankan:

// Lihat semua pricelist
localStorage.getItem('pricelists')

// Parse dan lihat dalam format readable
JSON.parse(localStorage.getItem('pricelists') || '[]')

// Hitung jumlah pricelist
JSON.parse(localStorage.getItem('pricelists') || '[]').length
```

### 2. Test CRUD Operations
```javascript
// Import dataStore di console
const { dataStore } = await import('./src/utils/dataStore.js')

// Test Create
const newPricelist = dataStore.addPricelist({
  title: 'Test Pricelist',
  description: 'Testing purposes',
  image: 'data:image/png;base64,iVBORw0KG...' // base64 image
})
console.log('Created:', newPricelist)

// Test Read
const allPricelists = dataStore.getPricelists()
console.log('All pricelists:', allPricelists)

// Test Update
dataStore.updatePricelist(newPricelist.id, {
  title: 'Updated Title'
})

// Test Delete
dataStore.deletePricelist(newPricelist.id)

// Test Get by Public ID
const pricelist = dataStore.getPricelistByPublicId('abc123')
console.log('Found:', pricelist)
```

### 3. Test Storage Info
```javascript
// Cek storage usage
const storageInfo = dataStore.getStorageInfo()
console.log('Storage:', storageInfo)
console.log(`Used: ${storageInfo.usedMB}MB / ${storageInfo.percentage}%`)
console.log(`Available: ${storageInfo.availableMB}MB`)
```

### 4. Clear Test Data
```javascript
// Hapus semua pricelist (HATI-HATI!)
localStorage.removeItem('pricelists')

// Atau reset ke array kosong
localStorage.setItem('pricelists', '[]')
```

## Manual Testing Checklist

### Upload & Create
- [ ] Klik "Tambah Pricelist"
- [ ] Isi judul: "Test Pricelist 1"
- [ ] Isi deskripsi: "Testing upload"
- [ ] Upload gambar (PNG/JPG)
- [ ] Cek loading state muncul
- [ ] Cek preview gambar tampil
- [ ] Klik "Tambah Pricelist"
- [ ] Verifikasi pricelist muncul di grid

### Copy Link
- [ ] Klik tombol "Salin Link