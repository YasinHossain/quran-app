import designTokens from './design-system.json' assert { type: 'json' };

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border-color)',
        accent: 'var(--accent)',
        'accent-hover': designTokens.colors.accentHover,
        brand: '#009688',
        
        // Semantic colors for components
        muted: 'var(--text-muted)',
        'card-bg': 'var(--card-background)',
        hover: 'var(--hover-color)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        
        // Bookmark-specific colors
        'bookmark-folder': 'var(--bookmark-folder)',
        'bookmark-pinned': 'var(--bookmark-pinned)',
        'bookmark-lastread': 'var(--bookmark-lastread)',
        'bookmark-general': 'var(--bookmark-general)',
        
        // Common UI colors that work with dark/light themes
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
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
