/**
 * Card typography tokens
 */
export const typography = {
  // Primary text
  primary: {
    navigation: 'font-bold',
    standard: 'font-semibold',
  },

  // Secondary text
  secondary: {
    small: 'text-xs',
    normal: 'text-sm',
  },

  // Arabic text
  arabic: {
    font: "font-['UthmanicHafs1Ver18']",
    size: 'text-2xl',
    weight: 'font-normal',
  },

  // Size variants
  sizes: {
    verse: 'text-lg',
    folderTitle: 'text-lg',
    metadata: 'text-xs',
  },

  // Line heights
  lineHeight: {
    tight: 'leading-tight',
    relaxed: 'leading-relaxed',
  },
} as const;
