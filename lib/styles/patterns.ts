/**
 * Centralized styling patterns for consistent UI components
 * Use these patterns to maintain design consistency across the application
 */

export const sidebarPatterns = {
  card: {
    base: 'group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02]',
    active: 'bg-accent text-on-accent shadow-lg shadow-accent/30',
    inactive: 'bg-surface text-foreground shadow',
  },
  numberBadge: {
    base: 'flex items-center justify-center rounded-xl font-bold transition-colors',
    sizes: {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-lg',
      lg: 'w-16 h-16 text-xl',
    },
    variants: {
      default: 'bg-number-badge text-accent group-hover:bg-number-badge-hover',
      active: 'bg-number-badge text-accent',
    },
  },
  text: {
    title: {
      active: 'text-on-accent',
      inactive: 'text-foreground',
    },
    subtitle: {
      active: 'text-on-accent/80',
      inactive: 'text-muted',
    },
    arabic: {
      active: 'text-on-accent',
      inactive: 'text-muted group-hover:text-accent',
    },
  },
};

export const buttonPatterns = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-interactive text-foreground hover:bg-interactive-hover',
  ghost: 'text-foreground hover:bg-interactive',
};

export const panelPatterns = {
  base: 'bg-surface border border-border rounded-xl shadow-card',
  modal: 'bg-surface border border-border rounded-xl shadow-modal',
};

/**
 * Helper function to get consistent styling patterns
 */
export const getPattern = <K extends keyof typeof sidebarPatterns>(
  category: K
): (typeof sidebarPatterns)[K] => {
  return sidebarPatterns[category];
};
