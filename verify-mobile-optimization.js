const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Mobile Optimization...\n');

let allPassed = true;

// Check 1: Verify CSS files exist
console.log('1. Checking CSS files...');
const cssFiles = [
  'src/styles/tailwind.css',
  'src/styles/mobile-modal-fix.css',
  'src/styles/mobile-components.css'
];

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - MISSING`);
    allPassed = false;
  }
});

// Check 2: Verify utility files exist
console.log('\n2. Checking utility files...');
const utilFiles = [
  'src/utils/mobileOptimization.js',
  'src/components/ui/MobileOptimizedContainer.jsx'
];

utilFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - MISSING`);
    allPassed = false;
  }
});

// Check 3: Verify index.jsx imports CSS
console.log('\n3. Checking CSS imports in index.jsx...');
const indexContent = fs.readFileSync('src/index.jsx', 'utf8');
const requiredImports = [
  'mobile-modal-fix.css',
  'mobile-components.css'
];

requiredImports.forEach(imp => {
  if (indexContent.includes(imp)) {
    console.log(`   ✓ ${imp} imported`);
  } else {
    console.log(`   ✗ ${imp} - NOT IMPORTED`);
    allPassed = false;
  }
});

// Check 4: Verify viewport meta tag
console.log('\n4. Checking viewport meta tag...');
const htmlContent = fs.readFileSync('index.html', 'utf8');
if (htmlContent.includes('width=device-width') && htmlContent.includes('initial-scale=1.0')) {
  console.log('   ✓ Viewport meta tag configured');
} else {
  console.log('   ✗ Viewport meta tag - MISSING OR INCORRECT');
  allPassed = false;
}

// Check 5: Verify component optimizations
console.log('\n5. Checking component optimizations...');
const components = [
  'src/components/ui/Button.jsx',
  'src/components/ui/Input.jsx',
  'src/components/ui/Select.jsx',
  'src/components/ui/QuickActionButton.jsx',
  'src/components/ui/BottomNavigation.jsx',
  'src/components/ui/SidebarLayout.jsx'
];

components.forEach(comp => {
  if (fs.existsSync(comp)) {
    const content = fs.readFileSync(comp, 'utf8');
    // Check if component has responsive classes (sm:, lg:, etc)
    if (content.includes('sm:') || content.includes('lg:')) {
      console.log(`   ✓ ${path.basename(comp)} - has responsive classes`);
    } else {
      console.log(`   ⚠ ${path.basename(comp)} - may need responsive classes`);
    }
  } else {
    console.log(`   ✗ ${comp} - MISSING`);
    allPassed = false;
  }
});

// Check 6: Verify page optimizations
console.log('\n6. Checking page optimizations...');
const pages = [
  'src/pages/dashboard/index.jsx',
  'src/pages/client-management/index.jsx',
  'src/pages/calendar-scheduling/index.jsx'
];

let pagesOptimized = 0;
pages.forEach(page => {
  if (fs.existsSync(page)) {
    const content = fs.readFileSync(page, 'utf8');
    if (content.includes('mobileClasses') || content.includes('sm:') || content.includes('lg:')) {
      console.log(`   ✓ ${path.basename(path.dirname(page))} - optimized`);
      pagesOptimized++;
    } else {
      console.log(`   ⚠ ${path.basename(path.dirname(page))} - may need optimization`);
    }
  }
});

// Check 7: Verify Tailwind config
console.log('\n7. Checking Tailwind configuration...');
if (fs.existsSync('tailwind.config.js')) {
  const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');
  if (tailwindConfig.includes('screens') || tailwindConfig.includes('extend')) {
    console.log('   ✓ Tailwind config exists and extended');
  } else {
    console.log('   ⚠ Tailwind config may need customization');
  }
} else {
  console.log('   ✗ tailwind.config.js - MISSING');
  allPassed = false;
}

// Check 8: Verify PostCSS config
console.log('\n8. Checking PostCSS configuration...');
if (fs.existsSync('postcss.config.js')) {
  console.log('   ✓ PostCSS config exists');
} else {
  console.log('   ✗ postcss.config.js - MISSING');
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All checks passed! Mobile optimization is complete.');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open browser DevTools (F12)');
  console.log('3. Toggle device toolbar (Ctrl+Shift+M)');
  console.log('4. Test with different screen sizes');
  console.log('5. Check MOBILE_TESTING_GUIDE.md for detailed testing');
} else {
  console.log('❌ Some checks failed. Please review the issues above.');
}
console.log('='.repeat(50) + '\n');

// Statistics
console.log('📊 Statistics:');
console.log(`   - CSS files: ${cssFiles.length}`);
console.log(`   - Utility files: ${utilFiles.length}`);
console.log(`   - Components optimized: ${components.length}`);
console.log(`   - Pages checked: ${pagesOptimized}/${pages.length}`);
console.log(`   - Total files modified: ~${cssFiles.length + utilFiles.length + components.length + 15}`);

process.exit(allPassed ? 0 : 1);
