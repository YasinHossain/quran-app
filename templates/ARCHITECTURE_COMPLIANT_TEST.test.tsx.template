/**
 * @fileoverview Architecture-Compliant Test Template for Week 6
 * @description Complete test template following established architecture patterns
 * @template Replace: ExampleComponent, useExampleData, example
 * @location app/(features)/[feature]/__tests__/
 *
 * Required imports for architecture-compliant testing:
 */

import { createPerformanceTestSuite } from '@/app/testUtils/performanceTestUtils';

import {
  clearTestEnvironment,
  resetTestEnvironment,
  runComponentTests,
  runHookTests,
  runIntegrationTest,
  setupTestEnvironment,
} from './architecture/test-utils';

import { ExampleComponent } from '@/ExampleComponent';
import { useExampleData } from '@/hooks/useExampleData';

/**
 * Mock data following domain patterns
 */
const mockExampleData = {
  id: '1',
  verse_key: '1:1',
  title: 'Test Title',
  description: 'Test description',
  content: 'Test content',
  translations: [
    { id: 131, text: 'Test translation', language: 'en' },
  ],
  words: [
    { id: 1, text: 'Test', position: 1 },
  ],
};

/**
 * Mock external dependencies
 */
jest.mock('@/lib/api/client', () => ({
  fetchExampleData: jest.fn(),
}));

jest.mock('@/lib/utils/cn', () => ({
  transformData: jest.fn((data) => data),
}));

jest.mock('@/lib/text/sanitizeHtml', () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

// Mock i18n for consistent testing
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => options?.defaultValue || key,
  }),
}));

// Setup responsive testing environment
beforeAll(setupTestEnvironment);

const defaultProps = {
  id: '1',
  data: mockExampleData,
  onAction: jest.fn(),
  className: '',
};

describe('ExampleComponent - Architecture Compliance', () => {
  beforeEach(resetTestEnvironment);
  afterEach(clearTestEnvironment);

  runComponentTests({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });
});

describe('useExampleData Hook - Architecture Compliance', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [mockExampleData],
        hasNextPage: false,
      }),
    });
  });

  runHookTests({
    useHook: useExampleData,
    mockData: mockExampleData,
  });
});

// Generate performance test suite
createPerformanceTestSuite('ExampleComponent', ExampleComponent, defaultProps);
runIntegrationTest({
  Component: ExampleComponent,
  defaultProps,
  mockData: mockExampleData,
});
