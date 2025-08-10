import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ),
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
