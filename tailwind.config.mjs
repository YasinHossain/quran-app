import designTokens from './design-system.json' assert { type: 'json' };

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      spacing: designTokens.spacing,
      fontFamily: {
        base: [designTokens.typography.fontFamily, 'sans-serif'],
      },
      fontSize: {
        base: designTokens.typography.fontSizeBase,
        h1: designTokens.typography.headings.h1,
        h2: designTokens.typography.headings.h2,
        h3: designTokens.typography.headings.h3,
      },
      borderRadius: {
        DEFAULT: designTokens.components.borderRadius,
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        default: designTokens.components.shadow,
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        modal: '0 4px 6px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
