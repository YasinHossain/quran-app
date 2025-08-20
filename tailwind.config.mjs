/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
  theme: {
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
    },
  },
  plugins: [],
};

export default config;
