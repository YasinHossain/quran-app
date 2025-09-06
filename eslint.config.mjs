import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import { noRawColorClasses } from './tools/scripts/eslint/no-raw-color-classes.mjs';
import { noThemeConditionals } from './tools/scripts/eslint/no-theme-conditionals.mjs';

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
    ignores: ['mcp-server', '.next', 'node_modules', 'out', 'coverage'],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ),
  // Base configuration for all TypeScript/JavaScript files
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    rules: {
      // Size & complexity limits
      'max-lines': [
        'warn',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines-per-function': [
        'warn',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      complexity: ['warn', 10],
      'max-params': ['warn', 4],
      'max-depth': ['warn', 3],
      'max-nested-callbacks': ['warn', 3],

      // Import organization
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-cycle': 'error',
      'unused-imports/no-unused-imports': 'error',

      // TypeScript strictness
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // React best practices
      'react/display-name': 'off', // Using memo properly
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'token-rules': tokenRules,
    },
    rules: {
      'token-rules/no-raw-color-classes': 'error',
      'token-rules/no-theme-conditionals': 'error',
      // Prefer app/shared/icons wrappers over direct lucide-react imports
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'lucide-react',
              message: "Use icons from '@/app/shared/icons' to keep consistency and theming.",
            },
          ],
        },
      ],
    },
  },
  // Tighter limits for pages
  {
    files: ['app/**/page.tsx', 'app/**/layout.tsx'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 120,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Tighter limits for server components
  {
    files: ['app/**/*.tsx'],
    ignores: ['**/*.client.tsx', '**/*.test.tsx'],
    rules: {
      'max-lines': [
        'warn',
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Client components can be slightly larger
  {
    files: ['**/*.client.tsx'],
    rules: {
      'max-lines': [
        'warn',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Hooks should be compact
  {
    files: ['**/hooks/*.ts', '**/hooks/*.tsx'],
    rules: {
      'max-lines': [
        'warn',
        {
          max: 120,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Infrastructure layer - repositories and services
  {
    files: ['src/infrastructure/**/*.ts', 'src/application/**/*.ts'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Context providers
  {
    files: ['app/providers/*.tsx'],
    rules: {
      'max-lines': [
        'warn',
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Utilities
  {
    files: ['lib/**/*.ts'],
    rules: {
      'max-lines': [
        'warn',
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Allow lucide-react imports inside the icon wrapper module
  {
    files: ['app/shared/icons/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  // Allow larger functions in config and tooling files with long tables
  {
    files: [
      'config/**/*.{ts,js,mjs}',
      'tools/**/*.{ts,js,mjs}',
      'scripts/**/*.{ts,js,mjs}',
      'src/infrastructure/errors/**/*.{ts,js,mjs}',
      'src/infrastructure/monitoring/**/*.{ts,js,mjs}',
      'src/infrastructure/repositories/**/*.{ts,js,mjs}',
      'lib/**/token-map/**/*.{ts,js,mjs}',
    ],
    rules: {
      'max-lines-per-function': [
        'warn',
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // Test files can be longer and more permissive
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'max-lines': [
        'warn',
        {
          max: 350,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
];

export default eslintConfig;
