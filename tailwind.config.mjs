import defaultTokens from './design-system.json' assert { type: 'json' };
import altTokens from './design-system.alt.json' assert { type: 'json' };
import plugin from 'tailwindcss/plugin';

const tokenSets = {
  base: defaultTokens,
  alt: altTokens,
};
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
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
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
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        base: ['var(--font-base)', 'sans-serif'],
      },
      fontSize: {
        base: 'var(--text-base)',
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
      },
      boxShadow: {
        default: '0 1px 2px rgba(0,0,0,0.05)',
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        modal: '0 4px 6px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const variables = {};
      for (const [name, tokens] of Object.entries(tokenSets)) {
        const selector = name === 'base' ? ':root' : `.theme-${name}`;
        variables[selector] = {
          '--background': tokens.colors.background,
          '--foreground': tokens.colors.foreground,
          '--border-color': tokens.colors.border,
          '--accent': tokens.colors.accent,
          '--accent-hover': tokens.colors.accentHover,
          '--subtle-grey': '#d1d5db',
          '--text-muted': '#6b7280',
          '--card-background': '#ffffff',
          '--hover-color': '#f3f4f6',
          '--success': '#10b981',
          '--warning': '#f59e0b',
          '--error': '#ef4444',
          '--bookmark-folder': '#0d9488',
          '--bookmark-pinned': '#f59e0b',
          '--bookmark-lastread': '#6366f1',
          '--bookmark-general': '#10b981',
        };
        variables[`${selector}[data-theme='dark']`] = {
          '--background': tokens.colors.backgroundDark,
          '--foreground': tokens.colors.foregroundDark,
          '--border-color': tokens.colors.borderDark,
          '--subtle-grey': '#4b5563',
          '--text-muted': '#9ca3af',
          '--card-background': '#374151',
          '--hover-color': '#4b5563',
          '--bookmark-folder': '#14b8a6',
          '--bookmark-pinned': '#fbbf24',
          '--bookmark-lastread': '#818cf8',
          '--bookmark-general': '#34d399',
        };
      }
      addBase(variables);
    }),
  ],
};

export default config;
