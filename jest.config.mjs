import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Test environment setup
  testEnvironment: 'jest-environment-jsdom',
  // Load DOM shims first, then testing-library extensions
  setupFiles: ['<rootDir>/tests/setup/polyfills.ts', '<rootDir>/tests/setup/matchMedia.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@app/(.*)$': '<rootDir>/src/application/$1',
    '^@infra/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@ui/(.*)$': '<rootDir>/src/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
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
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/fixtures/**',
    '!**/mocks/**',
    '!src/**/*.stories.{ts,tsx}',
    '!tests/**/*',
  ],

  // Coverage thresholds - Reasonable starting requirements
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 70,
      lines: 75,
      statements: 75,
    },
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
  transformIgnorePatterns: [
    'node_modules/(?!(node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill)/)',
  ],

  // Verbose output in CI
  verbose: !!process.env.CI,
};

export default createJestConfig(customJestConfig);
