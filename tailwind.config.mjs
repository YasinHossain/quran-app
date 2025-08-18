import designTokens from './design-system.json' assert { type: 'json' };

/**
 * Converts a camelCase string to kebab-case.
 * @param {string} str The string to convert.
 * @returns {string} The kebab-case string.
 */
function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Dynamically generate color mappings from the design system tokens.
// This creates utilities like `bg-background`, `text-foreground`, etc.
const colorEntries = Object.keys(designTokens.colors)
  .filter((key) => !key.endsWith('Dark'))
  .reduce((acc, key) => {
    const name = kebabCase(key);
    // We exclude 'primary' because it will be set to a static brand color.
    if (name !== 'primary') {
      acc[name] = `rgb(var(--color-${name}) / <alpha-value>)`;
    }
    return acc;
  }, {});

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Spread the dynamically generated, theme-aware colors
        ...colorEntries,
        // Statically set the primary brand color. This will not change with the theme.
        primary: '#009688',
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
