import designTokens from './design-system.json' assert { type: 'json' };

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border-color)',
        accent: designTokens.colors.accent,
        'accent-hover': designTokens.colors.accentHover,
        brand: '#009688',
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
