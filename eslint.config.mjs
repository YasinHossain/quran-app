import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import noRawColorClasses from './scripts/eslint/no-raw-color-classes.mjs';
import noThemeConditionals from './scripts/eslint/no-theme-conditionals.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const tokenRules = {
  rules: {
    'no-raw-color-classes': noRawColorClasses,
    'no-theme-conditionals': noThemeConditionals,
  },
};

const eslintConfig = [
  {
    ignores: ['mcp-server'],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ),
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'token-rules': tokenRules,
    },
    rules: {
      'token-rules/no-raw-color-classes': 'error',
      'token-rules/no-theme-conditionals': 'error',
    },
  },
  {
    files: ['**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
