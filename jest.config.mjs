import { createRequire } from 'module';

// Disable V8 transform cache to avoid ENOENT on temp dirs being cleaned mid-run
process.env.JEST_DISABLE_V8_CODE_CACHE = '1';
// Avoid Next.js unhandled rejection filter recursion in Jest (see next/dist/.../unhandled-rejection.js)
process.env.NEXT_UNHANDLED_REJECTION_FILTER = 'disabled';
const require = createRequire(import.meta.url);
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Test environment setup
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  // Keep Jest cache inside the repo for cross-platform stability.
  cacheDirectory: '<rootDir>/.jest-cache',

  // Defaults tuned for developer machines; override locally if needed:
  // - `JEST_MAX_WORKERS=75%`
  // - `JEST_WORKER_IDLE_MEMORY_LIMIT=4GB`
  maxWorkers: process.env.JEST_MAX_WORKERS ?? (process.env.CI ? '50%' : '50%'),
  workerIdleMemoryLimit:
    process.env.JEST_WORKER_IDLE_MEMORY_LIMIT ?? (process.env.CI ? '1GB' : '2GB'),
  // Shared test utilities and polyfills
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
  resolver: '<rootDir>/tests/setup/jest-resolver.cjs',

  // Module mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/$1', '<rootDir>/quran-com/src/$1', '<rootDir>/quran-com/$1'],
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@app/(.*)$': '<rootDir>/src/application/$1',
    '^@infra/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@ui/(.*)$': '<rootDir>/src/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^vitest$': '<rootDir>/tests/setup/vitest-shim.ts',
  },

  // Test file patterns - include our new test structure
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.test.ts?(x)', // Keep existing pattern
  ],

  // Coverage configuration for Phase 4
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/fixtures/**',
    '!**/mocks/**',
    '!src/**/*.stories.{ts,tsx}',
    '!src/domain/interfaces/**',
    '!src/domain/repositories/**',
    '!tests/**/*',
  ],

  // Coverage thresholds - Reasonable starting requirements
  coverageThreshold: {
    // Domain layer threshold - increased gradually as implementation matures
    'src/domain/**/*.ts': {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage provider and reporters
  coverageProvider: 'v8',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'clover'],

  // Test timeout
  testTimeout: 10000, // 10 seconds

  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/out/',
    '<rootDir>/coverage/',
    '<rootDir>/templates/',
    '.*test-utils\\.tsx$',
    '.*\\.fixtures\\.tsx$',
  ],

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Transform ESM modules for Jest
  transformIgnorePatterns: [],

  // Verbose output in CI
  verbose: !!process.env.CI,
};

const nextJestConfig = createJestConfig(customJestConfig);

export default async (...args) => {
  const config = await nextJestConfig(...args);
  // Override Next.js defaults so ESM dependencies used in tests (e.g. MSW) are transformed.
  config.transformIgnorePatterns = [
    '/node_modules/(?!.pnpm)(?!(geist|node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill|msw|until-async)/)',
    '/node_modules/.pnpm/(?!(geist|node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill|msw|until-async)@)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
};
