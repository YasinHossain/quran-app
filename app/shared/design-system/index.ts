/**
 * Design System for Quran App
 *
 * This file contains standardized design tokens, component classes, and utilities
 * that ensure consistency across the application and make it easy for AI agents
 * to implement designs correctly.
 */

// ===== Design Tokens =====
export const designTokens = {
  colors: {
    // Base colors (use CSS variables for theme support)
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    muted: 'var(--text-muted)',
    border: 'var(--border-color)',
    accent: 'var(--accent)',

    // Semantic colors for different bookmark types
    folder: 'var(--bookmark-folder)',
    pinned: 'var(--bookmark-pinned)',
    lastRead: 'var(--bookmark-lastread)',
    general: 'var(--bookmark-general)',

    // State colors
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
  },

  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },

  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  typography: {
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

// ===== Component Classes =====
export const componentClasses = {
  // Card variants
  card: {
    base: 'bg-card-bg border border-border rounded-xl p-6 transition-all duration-200',
    hover: 'hover:shadow-lg hover:scale-[1.02]',
    interactive: 'cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200',
  },

  // Button variants
  button: {
    primary:
      'bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
    secondary:
      'bg-gray-100 dark:bg-gray-800 text-foreground px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
    ghost: 'text-muted hover:text-foreground hover:bg-hover px-4 py-2 rounded-lg transition-colors',
  },

  // Text variants
  text: {
    heading: 'text-foreground font-bold tracking-tight',
    subheading: 'text-muted font-medium',
    body: 'text-foreground',
    muted: 'text-muted',
    caption: 'text-muted text-sm',
  },

  // Layout helpers
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8 space-y-6',
    grid: 'grid gap-6',
    flex: 'flex items-center gap-4',
  },

  // Animation classes
  animation: {
    fadeIn: 'animate-in fade-in duration-300',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-200',
  },
};

// ===== Color Schemes for Different Bookmark Types =====
export const colorSchemes = {
  folder: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-800 dark:text-teal-200',
    icon: 'text-teal-600 dark:text-teal-400',
    hover: 'hover:bg-teal-100 dark:hover:bg-teal-800/30',
  },
  pinned: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-200',
    icon: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:bg-amber-100 dark:hover:bg-amber-800/30',
  },
  lastRead: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-800 dark:text-indigo-200',
    icon: 'text-indigo-600 dark:text-indigo-400',
    hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-800/30',
  },
  general: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-800/30',
  },
  bookmark: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-800/30',
  },
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    icon: 'text-gray-600 dark:text-gray-400',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800/30',
  },
};

// ===== Utility Functions =====
export const utils = {
  // Combine classes with proper precedence
  cn: (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ');
  },

  // Get color scheme by type
  getColorScheme: (type: keyof typeof colorSchemes) => {
    return colorSchemes[type] || colorSchemes.neutral;
  },

  // Create component class string
  createComponentClass: (base: string, variants: string[] = [], custom: string = '') => {
    return utils.cn(base, ...variants, custom);
  },
};

// ===== Pre-built Component Patterns =====
export const patterns = {
  // Card with proper theming
  card: (variant: 'folder' | 'pinned' | 'lastRead' | 'general' = 'general') => {
    const scheme = colorSchemes[variant];
    return utils.cn(
      componentClasses.card.base,
      componentClasses.card.interactive,
      scheme.bg,
      scheme.border,
      scheme.hover
    );
  },

  // Section header
  sectionHeader: () => utils.cn('mb-8 space-y-2'),

  // Grid layouts
  gridResponsive: () => 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  gridTwoCol: () => 'grid grid-cols-1 gap-6 lg:grid-cols-2',
  gridThreeCol: () => 'grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3',

  // Empty states
  emptyState: () => 'flex flex-col items-center justify-center py-16 px-6 text-center',

  // Navigation items
  navItem: (isActive: boolean, variant: keyof typeof colorSchemes = 'neutral') => {
    const scheme = colorSchemes[variant];
    return utils.cn(
      'w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
      isActive
        ? utils.cn(scheme.bg, scheme.border, 'border-2 shadow-md')
        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
    );
  },
};

// ===== AI Implementation Guidelines =====
export const aiGuidelines = {
  /**
   * IMPORTANT: When implementing any UI component, ALWAYS use these guidelines:
   *
   * 1. USE CSS VARIABLES: Always use var(--variable-name) instead of hardcoded colors
   * 2. USE DESIGN TOKENS: Import and use designTokens for consistent spacing, colors, etc.
   * 3. USE COLOR SCHEMES: Apply appropriate colorSchemes for different bookmark types
   * 4. USE COMPONENT CLASSES: Leverage componentClasses for buttons, cards, text, etc.
   * 5. USE PATTERNS: Apply pre-built patterns for common layouts and components
   * 6. ENSURE ACCESSIBILITY: Include proper focus states, ARIA labels, and keyboard navigation
   * 7. ENSURE RESPONSIVENESS: Use responsive grid classes and mobile-first approach
   * 8. ENSURE THEME SUPPORT: All colors should work in both light and dark modes
   *
   * NEVER hardcode colors like 'bg-blue-500' - always use the semantic color system!
   */

  exampleUsage: {
    card: `
      // ✅ CORRECT - Uses design system
      <div className={patterns.card('folder')}>
        <h3 className={componentClasses.text.heading}>Title</h3>
        <p className={componentClasses.text.muted}>Description</p>
      </div>
    `,

    incorrectUsage: `
      // ❌ WRONG - Hardcoded colors, no theme support
      <div className="bg-blue-100 border-blue-200 p-4 rounded-lg">
        <h3 className="text-gray-900 font-bold">Title</h3>
        <p className="text-gray-600">Description</p>
      </div>
    `,
  },
};
