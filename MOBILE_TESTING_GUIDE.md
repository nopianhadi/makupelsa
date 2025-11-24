# Panduan Testing Mobile Optimization

## Cara Testing di Browser

### 1. Chrome DevTools
1. Buka aplikasi di Chrome
2. Tekan `F12` atau `Ctrl+Shift+I` untuk membuka DevTools
3. Tekan `Ctrl+Shift+M` untuk toggle Device Toolbar
4. Pilih device preset atau custom size:
   - **iPhone SE**: 375 x 667
   - **iPhone 12 Pro**: 390 x 844
   - **Samsung Galaxy S20**: 360 x 800
   - **iPad**: 768 x 1024
   - **Custom**: Atur manual

### 2. Firefox Responsive Design Mode
1. Buka aplikasi di Firefox
2. Tekan `Ctrl+Shift+M`
3. Pilih device atau atur custom size

### 3. Testing di Device Fisik
1. Pastikan device dan komputer di network yang sama
2. Jalankan aplikasi: `npm run dev`
3. Cari IP address komputer: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux)
4. Buka di browser mobile: `http://[IP-ADDRESS]:5173`

## Checklist Testing

### Layout & Spacing
- [ ] Tidak ada horizontal scroll
- [ ] Semua konten terlihat tanpa terpotong
- [ ] Padding dan margin proporsional
- [ ] Gap antar elemen tidak terlalu besar/kecil

### Typography
- [ ] Text mudah dibaca (tidak terlalu kecil/besar)
- [ ] Heading hierarchy jelas
- [ ] Line height nyaman dibaca
- [ ] Tidak ada text overflow

### Components
- [ ] Button ukuran pas untuk di-tap (min 44x44px)
- [ ] Input field mudah diisi
- [ ] Icon proporsional dengan text
- [ ] Card tidak terlalu besar/kecil
- [ ] Badge dan tag terbaca jelas

### Navigation
- [ ] Bottom navigation mudah dijangkau
- [ ] Menu items tidak terlalu rapat
- [ ] Active state terlihat jelas
- [ ] Hamburger menu berfungsi baik

### Modals & Dialogs
- [ ] Modal tidak terpotong
- [ ] Content modal bisa di-scroll
- [ ] Button di modal mudah di-tap
- [ ] Close button mudah dijangkau

### Forms
- [ ] Input field ukuran pas
- [ ] Label terbaca jelas
- [ ] Error message terlihat
- [ ] Select dropdown tidak terpotong
- [ ] Checkbox/radio button mudah di-tap

### Tables
- [ ] Table bisa di-scroll horizontal jika perlu
- [ ] Cell content tidak terlalu rapat
- [ ] Header sticky (jika ada)
- [ ] Action buttons di table mudah di-tap

### Images & Media
- [ ] Image responsive (tidak overflow)
- [ ] Aspect ratio terjaga
- [ ] Loading state terlihat
- [ ] Thumbnail ukuran pas

### Performance
- [ ] Scroll smooth
- [ ] Transition tidak lag
- [ ] Touch response cepat
- [ ] Loading time acceptable

## Ukuran Layar yang Harus Ditest

### Priority 1 (Wajib)
- **360px** - Samsung Galaxy S8/S9 (paling umum)
- **375px** - iPhone SE/6/7/8
- **390px** - iPhone 12/13/14
- **414px** - iPhone Plus models

### Priority 2 (Penting)
- **320px** - iPhone 5/SE (1st gen) - smallest
- **768px** - iPad Portrait
- **1024px** - iPad Landscape

### Priority 3 (Optional)
- **540px** - Surface Duo
- **280px** - Galaxy Fold (folded)

## Orientasi
Test kedua orientasi:
- **Portrait** (vertical)
- **Landscape** (horizontal)

## Browser yang Harus Ditest
- Chrome Mobile
- Safari iOS
- Samsung Internet
- Firefox Mobile

## Common Issues & Solutions

### Issue: Horizontal Scroll
**Solution**: 
- Check `max-width: 100%` pada semua elemen
- Pastikan tidak ada fixed width yang terlalu besar
- Check padding/margin yang overflow

### Issue: Text Terlalu Kecil
**Solution**:
- Minimum font-size: 12px untuk body text
- Minimum 14px untuk button text
- Gunakan responsive font-size

### Issue: Button Terlalu Kecil
**Solution**:
- Minimum touch target: 44x44px
- Tambah padding jika perlu
- Gunakan responsive sizing

### Issue: Modal Terpotong
**Solution**:
- Set `max-height: calc(100vh - 2rem)`
- Tambah `overflow-y: auto`
- Reduce padding di mobile

### Issue: Table Overflow
**Solution**:
- Wrap table dengan `overflow-x: auto`
- Reduce font-size di mobile
- Consider card layout untuk mobile

## Tools Tambahan

### Online Testing
- **BrowserStack**: https://www.browserstack.com/
- **LambdaTest**: https://www.lambdatest.com/
- **Responsively**: https://responsively.app/

### Chrome Extensions
- **Responsive Viewer**: Multiple device preview
- **Mobile Simulator**: Device simulation
- **Window Resizer**: Quick resize presets

## Automated Testing
Untuk testing otomatis, gunakan:
```bash
# Install Playwright
npm install -D @playwright/test

# Run mobile tests
npx playwright test --project=mobile
```

## Reporting Issues
Jika menemukan masalah, catat:
1. Device/Screen size
2. Browser & version
3. Screenshot
4. Steps to reproduce
5. Expected vs Actual behavior

## Tips
- Test dengan koneksi lambat (3G)
- Test dengan dark mode
- Test dengan zoom browser (150%, 200%)
- Test dengan screen reader
- Test dengan keyboard navigation
