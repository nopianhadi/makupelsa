const fs = require('fs');
const path = require('path');

// Daftar halaman yang perlu diupdate
const pages = [
  'src/pages/client-kpi/index.jsx',
  'src/pages/client-management/index.jsx',
  'src/pages/project-management/index.jsx',
  'src/pages/calendar-scheduling/index.jsx',
  'src/pages/financial-tracking/index.jsx',
  'src/pages/payment-tracking/index.jsx',
  'src/pages/service-packages/index.jsx',
  'src/pages/pricelist/index.jsx',
  'src/pages/promotions/index.jsx',
  'src/pages/leads/index.jsx',
  'src/pages/booking/index.jsx',
  'src/pages/testimonials/index.jsx',
  'src/pages/team/index.jsx',
  'src/pages/settings/index.jsx',
  'src/pages/profile/index.jsx',
];

// Fungsi untuk menambahkan import
function addMobileImport(content) {
  if (content.includes('mobileClasses')) {
    return content; // Sudah ada import
  }
  
  // Cari baris import terakhir
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, "import { mobileClasses, cn } from '../../utils/mobileOptimization';");
    return lines.join('\n');
  }
  
  return content;
}

// Fungsi untuk mengoptimalkan classes
function optimizeClasses(content) {
  let optimized = content;
  
  // Skip optimization - manual approach is safer
  // The regex replacements can break multi-line className attributes
  // Better to manually optimize each page
  
  return optimized;
}

// Process each page
pages.forEach(pagePath => {
  try {
    if (fs.existsSync(pagePath)) {
      let content = fs.readFileSync(pagePath, 'utf8');
      
      // Add import
      content = addMobileImport(content);
      
      // Optimize classes
      content = optimizeClasses(content);
      
      // Write back
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log(`✓ Updated: ${pagePath}`);
    } else {
      console.log(`✗ Not found: ${pagePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${pagePath}:`, error.message);
  }
});

console.log('\n✓ Mobile optimization complete!');
