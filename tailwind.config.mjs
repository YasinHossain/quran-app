/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      xs: '475px', // Extra small devices (large phones)
      sm: '640px', // Small devices (tablets)
      md: '768px', // Medium devices (small laptops)
      lg: '1024px', // Large devices (laptops/desktops)
      xl: '1280px', // Extra large devices (large desktops)
      '2xl': '1536px', // 2X large devices (larger desktops)
    },
    extend: {
      colors: {
        // Custom theme colors
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        interactive: 'rgb(var(--color-interactive) / <alpha-value>)',
        'interactive-hover': 'rgb(var(--color-interactive-hover) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        'on-accent': 'rgb(var(--color-on-accent) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',

        // Semantic UI component colors
        'number-badge': 'rgb(var(--color-interactive) / <alpha-value>)',
        'number-badge-hover': 'rgb(52 211 153 / 0.3)',
        'card-hover': 'rgb(var(--color-interactive-hover) / <alpha-value>)',

        // Semantic content colors
        'content-primary': 'rgb(var(--color-content-primary) / <alpha-value>)',
        'content-secondary': 'rgb(var(--color-content-secondary) / <alpha-value>)',
        'content-accent': 'rgb(var(--color-content-accent) / <alpha-value>)',
        'content-muted': 'rgb(var(--color-content-muted) / <alpha-value>)',

        // Semantic status colors
        'status-error': 'rgb(var(--color-status-error) / <alpha-value>)',
        'status-success': 'rgb(var(--color-status-success) / <alpha-value>)',
        'status-warning': 'rgb(var(--color-status-warning) / <alpha-value>)',
        'status-info': 'rgb(var(--color-status-info) / <alpha-value>)',

        // Semantic surface colors
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        'surface-overlay': 'rgb(var(--color-surface-overlay) / <alpha-value>)',
        'surface-glass': 'rgb(var(--color-surface-glass) / <alpha-value>)',

        // Semantic button colors
        'button-primary': 'rgb(var(--color-button-primary) / <alpha-value>)',
        'button-primary-hover': 'rgb(var(--color-button-primary-hover) / <alpha-value>)',
        'button-secondary': 'rgb(var(--color-button-secondary) / <alpha-value>)',
        'button-secondary-hover': 'rgb(var(--color-button-secondary-hover) / <alpha-value>)',

        // Semantic input colors
        'input-background': 'rgb(var(--color-input-background) / <alpha-value>)',
        'input-border': 'rgb(var(--color-input-border) / <alpha-value>)',
        'input-placeholder': 'rgb(var(--color-input-placeholder) / <alpha-value>)',

        // Semantic tooltip colors
        'tooltip-background': 'rgb(var(--color-tooltip-background) / <alpha-value>)',
        'tooltip-text': 'rgb(var(--color-tooltip-text) / <alpha-value>)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        modal: 'var(--shadow-modal)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      backgroundImage: {
        'gradient-emerald': 'var(--gradient-emerald)',
        'gradient-bg': 'var(--gradient-background)',
      },
      // Mobile-first spacing and sizing
      spacing: {
        18: '4.5rem', // 72px
        88: '22rem', // 352px
        112: '28rem', // 448px
        128: '32rem', // 512px
      },
      // Mobile-optimized font sizes
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      // Touch-friendly sizing
      minHeight: {
        touch: '44px', // Minimum touch target size (WCAG)
        'touch-lg': '48px',
      },
      minWidth: {
        touch: '44px',
        'touch-lg': '48px',
      },
      // Mobile-optimized z-index scale
      zIndex: {
        dropdown: '10',
        sticky: '20',
        fixed: '30',
        modal: '40',
        popover: '50',
        tooltip: '60',
        max: '9999',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};

export default config;
