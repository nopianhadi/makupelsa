// Script untuk menerapkan optimasi mobile ke semua halaman
// Panduan penggunaan:
// 1. Import mobileClasses dan cn dari './mobileOptimization'
// 2. Ganti class berikut:

export const replacementGuide = {
  // Container & Padding
  'px-4 sm:px-6 lg:px-8': 'mobileClasses.container',
  'px-6': 'mobileClasses.card',
  'p-6': 'mobileClasses.card',
  'p-4': 'mobileClasses.cardCompact',
  
  // Text Sizes
  'text-3xl': 'mobileClasses.heading1',
  'text-2xl': 'mobileClasses.heading2',
  'text-xl': 'mobileClasses.heading3',
  'text-lg': 'mobileClasses.heading4',
  'text-base': 'mobileClasses.textBase',
  'text-sm': 'mobileClasses.textSmall',
  'text-xs': 'mobileClasses.textTiny',
  
  // Icon Sizes
  'w-12 h-12': 'mobileClasses.iconLarge',
  'w-10 h-10': 'mobileClasses.iconMedium',
  'w-8 h-8': 'mobileClasses.iconSmall',
  'w-6 h-6': 'mobileClasses.iconTiny',
  
  // Spacing
  'gap-4': 'mobileClasses.gap',
  'gap-3': 'mobileClasses.gapSmall',
  'gap-2': 'mobileClasses.gapTiny',
  'mb-6': 'mobileClasses.marginBottom',
  'mb-4': 'mobileClasses.marginBottomSmall',
  
  // Grid
  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': 'mobileClasses.grid4',
  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': 'mobileClasses.grid3',
  'grid-cols-1 sm:grid-cols-2': 'mobileClasses.grid2',
};

// Contoh penggunaan:
// Sebelum:
// <div className="px-6 py-4">
//   <h1 className="text-3xl font-bold">Title</h1>
//   <p className="text-sm">Description</p>
// </div>

// Sesudah:
// <div className={cn(mobileClasses.card)}>
//   <h1 className={cn("font-bold", mobileClasses.heading1)}>Title</h1>
//   <p className={mobileClasses.textSmall}>Description</p>
// </div>
