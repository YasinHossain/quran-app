/**
 * Card color tokens
 */
export const colors = {
  // Text colors
  text: {
    active: 'text-on-accent',
    activeSecondary: 'text-on-accent/80',
    activeSecondaryStrong: 'text-on-accent/90',
    primary: 'text-foreground',
    secondary: 'text-muted',
    hoverAccent: 'group-hover:text-accent',
    accent: 'text-accent',
    error: 'text-error',
  },

  // Background colors
  background: {
    surface: 'bg-surface',
    surfaceHover: 'hover:bg-surface-hover',
    accent: 'bg-accent',
    border: 'border border-border',
    borderHover: 'hover:border-accent/20',
    borderHover30: 'hover:border-accent/30',
    gradientBase: 'bg-gradient-to-br from-accent/10 to-accent/5',
    gradientHover: 'group-hover:from-accent/20 group-hover:to-accent/10',
  },
} as const;
