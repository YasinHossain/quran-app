/**
 * Card Design Token System
 *
 * Centralized design tokens extracted from existing card components
 * to ensure visual consistency while preserving current designs.
 */

// Base spacing system
export const spacing = {
  // Padding variants from existing components
  compact: 'p-4', // Navigation cards
  comfortable: 'p-5', // Bookmark cards
  spacious: 'p-6', // Folder cards

  // Gap variants
  tight: 'gap-2',
  normal: 'gap-4',
  loose: 'gap-6',

  // Margins
  listSpacing: 'space-y-2',
  listMargin: 'ml-2',
  listMarginBottom: 'mb-4',
  listMarginBottom6: 'mb-6',
} as const;

// Typography system based on current usage
export const typography = {
  // Primary text (main content)
  primary: {
    navigation: 'font-bold', // Surah cards
    standard: 'font-semibold', // Juz, Page, others
  },

  // Secondary text (details)
  secondary: {
    small: 'text-xs',
    normal: 'text-sm',
  },

  // Special typography
  arabic: {
    font: 'font-amiri',
    size: 'text-xl',
    weight: 'font-bold',
  },

  // Sizes for different content types
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

// Color system preserving current patterns
export const colors = {
  // Text color states
  text: {
    // Active states
    active: 'text-on-accent',
    activeSecondary: 'text-on-accent/80',
    activeSecondaryStrong: 'text-on-accent/90',

    // Inactive states
    primary: 'text-foreground',
    secondary: 'text-muted',

    // Hover states
    hoverAccent: 'group-hover:text-accent',

    // Special colors
    accent: 'text-accent',
    error: 'text-red-600',
  },

  // Background color states
  background: {
    // Card backgrounds
    surface: 'bg-surface',
    surfaceHover: 'hover:bg-surface-hover',
    accent: 'bg-accent',

    // Border variants
    border: 'border border-border',
    borderHover: 'hover:border-accent/20',
    borderHover30: 'hover:border-accent/30',

    // Gradient containers (folder icons)
    gradientBase: 'bg-gradient-to-br from-accent/10 to-accent/5',
    gradientHover: 'group-hover:from-accent/20 group-hover:to-accent/10',
  },
} as const;

// Shadow system
export const shadows = {
  // Base shadows
  none: '',
  subtle: 'shadow-sm',
  normal: 'shadow',
  elevated: 'shadow-lg',

  // Active state shadows
  accent: 'shadow-lg shadow-accent/30',

  // Hover shadows
  hoverElevated: 'hover:shadow-lg',
  hoverMedium: 'hover:shadow-md',
} as const;

// Border radius system
export const borderRadius = {
  // Card containers
  card: 'rounded-xl',

  // Inner elements
  inner: 'rounded-lg',
  full: 'rounded-full',
} as const;

// Animation and transition system
export const animations = {
  // Transition configurations
  transitions: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    transform: 'transition transform',
    colors: 'transition-colors',
    colorsNormal: 'transition-colors duration-200',
    opacity: 'transition-opacity duration-200',
  },

  // Hover effects
  hover: {
    // Scale effects (navigation)
    scaleSmall: 'hover:scale-[1.02]',

    // Translate effects (folders/bookmarks)
    translateUp: 'hover:-translate-y-1',
    translateUpSmall: 'hover:-translate-y-0.5',
  },

  // Framer Motion configurations
  framer: {
    // Entry animations
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },

    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },

    // Transition configurations
    spring: { type: 'spring', stiffness: 400, damping: 25 },
    smooth: { duration: 0.2 },
    medium: { duration: 0.3 },
  },
} as const;

// Layout system
export const layout = {
  // Heights
  height: {
    fixed: 'h-[80px]', // Navigation cards
    auto: 'h-auto',
  },

  // Flex configurations
  flex: {
    // Container layouts
    row: 'flex items-center',
    column: 'flex flex-col',
    spaceBetween: 'flex items-center justify-between',

    // Item behaviors
    grow: 'flex-grow min-w-0',
    shrink: 'flex-shrink-0',

    // Content alignment
    alignStart: 'items-start',
    alignCenter: 'items-center',
    justifyBetween: 'justify-between',
  },

  // Special layout patterns
  patterns: {
    // Navigation card content (3-part layout)
    navigationContent: 'flex-grow min-w-0',

    // Icon containers
    iconContainer: 'flex-shrink-0 p-3 rounded-lg',

    // Progress bars
    progressBar: 'w-full h-1.5 bg-surface-hover rounded-full overflow-hidden',
    progressFill: 'h-full bg-gradient-to-r from-accent to-accent/80 rounded-full',
  },
} as const;

// State management tokens
export const states = {
  // Opacity states
  opacity: {
    hidden: 'opacity-0',
    visible: 'opacity-100',
    hover: 'opacity-0 group-hover:opacity-100',
  },

  // Interactive states
  interactive: {
    cursor: 'cursor-pointer',
    touchManipulation: 'touch-manipulation',

    // Focus states
    focusRing:
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  },

  // Content states
  content: {
    truncate: 'truncate',
    clamp2: 'line-clamp-2',
    whitespaceNowrap: 'whitespace-nowrap',
  },
} as const;

// Composite patterns for common use cases
export const patterns = {
  // Complete card base classes
  navigationCard: [
    layout.flex.row,
    spacing.normal,
    borderRadius.card,
    animations.transitions.transform,
    animations.hover.scaleSmall,
    layout.height.fixed,
    'group',
  ].join(' '),

  folderCard: [
    spacing.spacious,
    borderRadius.card,
    colors.background.surface,
    colors.background.border,
    shadows.subtle,
    animations.transitions.normal,
    animations.hover.translateUp,
    shadows.hoverElevated,
    colors.background.borderHover,
    states.interactive.cursor,
    states.interactive.touchManipulation,
    states.interactive.focusRing,
    'group relative',
  ].join(' '),

  bookmarkCard: [
    borderRadius.card,
    colors.background.surface,
    colors.background.border,
    spacing.comfortable,
    spacing.listMarginBottom,
    colors.background.borderHover30,
    colors.background.surfaceHover,
    animations.transitions.fast,
    states.interactive.cursor,
    shadows.hoverMedium,
    animations.hover.translateUpSmall,
    'group',
  ].join(' '),

  // Text patterns
  primaryText: (isActive: boolean) =>
    [isActive ? colors.text.active : colors.text.primary, typography.lineHeight.tight, 'mb-0'].join(
      ' '
    ),

  secondaryText: (isActive: boolean) =>
    [
      typography.secondary.small,
      isActive ? colors.text.activeSecondary : colors.text.secondary,
      typography.lineHeight.tight,
      'mt-2 mb-0',
    ].join(' '),

  arabicText: (isActive: boolean) =>
    [
      typography.arabic.font,
      typography.arabic.size,
      typography.arabic.weight,
      animations.transitions.colors,
      states.content.whitespaceNowrap,
      isActive ? colors.text.active : `${colors.text.secondary} ${colors.text.hoverAccent}`,
    ].join(' '),
} as const;

// Export convenience functions
export const buildCardClasses = (
  variant: 'navigation' | 'folder' | 'bookmark',
  isActive: boolean = false
) => {
  const base = patterns[`${variant}Card`];

  if (variant === 'navigation') {
    const background = isActive
      ? `${colors.background.accent} ${colors.text.active}`
      : `${colors.background.surface} ${colors.text.primary}`;
    const shadow = isActive ? shadows.accent : shadows.normal;
    return `${base} ${background} ${shadow}`;
  }

  return base;
};

export const buildTextClasses = (
  type: 'primary' | 'secondary' | 'arabic',
  isActive: boolean = false,
  variant: 'navigation' | 'folder' | 'bookmark' = 'navigation'
) => {
  if (type === 'arabic') {
    return patterns.arabicText(isActive);
  }

  const textPattern = type === 'primary' ? patterns.primaryText : patterns.secondaryText;
  return textPattern(isActive);
};
