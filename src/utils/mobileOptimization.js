// Mobile Optimization Utility Classes
// Digunakan untuk mengecilkan komponen di mode mobile

export const mobileClasses = {
  // Container & Layout
  container: 'px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6',
  containerCompact: 'px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4',
  
  // Card & Panel
  card: 'p-2 sm:p-4 lg:p-6',
  cardCompact: 'p-2 sm:p-3 lg:p-4',
  
  // Text Sizes
  heading1: 'text-lg sm:text-2xl lg:text-3xl',
  heading2: 'text-base sm:text-xl lg:text-2xl',
  heading3: 'text-sm sm:text-lg lg:text-xl',
  heading4: 'text-sm sm:text-base lg:text-lg',
  textBase: 'text-xs sm:text-sm lg:text-base',
  textSmall: 'text-[10px] sm:text-xs lg:text-sm',
  textTiny: 'text-[9px] sm:text-[10px] lg:text-xs',
  
  // Icon Sizes
  iconLarge: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12',
  iconMedium: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10',
  iconSmall: 'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6',
  iconTiny: 'w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5',
  
  // Spacing
  gap: 'gap-2 sm:gap-3 lg:gap-4',
  gapSmall: 'gap-1 sm:gap-2 lg:gap-3',
  gapTiny: 'gap-1 sm:gap-1.5 lg:gap-2',
  
  marginBottom: 'mb-2 sm:mb-4 lg:mb-6',
  marginBottomSmall: 'mb-2 sm:mb-3 lg:mb-4',
  
  // Grid
  grid1: 'grid-cols-1',
  grid2: 'grid-cols-1 sm:grid-cols-2',
  grid3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  grid4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  grid5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  
  // Button
  button: 'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:py-2.5 lg:text-base',
  buttonSmall: 'px-2 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-xs lg:px-3 lg:py-2 lg:text-sm',
  
  // Badge & Tag
  badge: 'px-1.5 py-0.5 text-[9px] sm:px-2 sm:py-1 sm:text-[10px] lg:px-2.5 lg:py-1 lg:text-xs',
  
  // Input
  input: 'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:py-2.5 lg:text-base',
  
  // Avatar
  avatarLarge: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
  avatarMedium: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12',
  avatarSmall: 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8',
};

// Helper function untuk menggabungkan classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
