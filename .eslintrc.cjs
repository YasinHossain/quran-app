// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
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
    'react/display-name': 'off', // You're using memo properly
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
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
      excludedFiles: ['*.client.tsx', '*.test.tsx'],
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
    // Test files can be longer
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
      rules: {
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
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
