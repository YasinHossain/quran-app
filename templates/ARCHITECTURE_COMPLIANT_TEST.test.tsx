/**
 * @fileoverview Architecture-Compliant Test Template for Week 6
 * @description Complete test template following established architecture patterns
 * @template Replace: ExampleComponent, useExampleData, example
 * @location app/(features)/[feature]/__tests__/
 *
 * Required imports for architecture-compliant testing:
 */

import React from 'react';
import { mockViewport, BREAKPOINTS } from '@/app/testUtils/responsiveTestUtils';
import { createPerformanceTestSuite } from '@/app/testUtils/performanceTestUtils';
import {
  architectureComplianceSection,
  responsiveDesignSection,
  contextIntegrationSection,
  performanceOptimizationSection,
  accessibilitySection,
  userInteractionsSection,
  loadingStatesSection,
  errorHandlingSection,
  hookContextIntegrationSection,
  hookPerformanceSection,
  hookCleanupSection,
  hookDataFetchingSection,
  integrationTestSection,
} from './architecture/test-sections';

// Component under test
import { ExampleComponent } from '../ExampleComponent';
import { useExampleData } from '../hooks/useExampleData';

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
  fetchExampleTranslations: jest.fn(),
}));

jest.mock('@/lib/utils/cn', () => ({
  transformData: jest.fn((data) => data),
  applySettings: jest.fn((text, settings) => text),
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
beforeAll(() => {
  // Mock matchMedia for responsive utilities
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

const defaultProps = {
  id: '1',
  data: mockExampleData,
  onAction: jest.fn(),
  className: '',
};

describe('ExampleComponent - Architecture Compliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Reset viewport to mobile-first
    mockViewport(BREAKPOINTS.mobile);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  architectureComplianceSection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  responsiveDesignSection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  contextIntegrationSection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  performanceOptimizationSection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  accessibilitySection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  userInteractionsSection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  loadingStatesSection({
    Component: ExampleComponent,
    defaultProps,
    mockData: mockExampleData,
  });

  errorHandlingSection({
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

  hookContextIntegrationSection({
    useHook: useExampleData,
    mockData: mockExampleData,
  });

  hookPerformanceSection({
    useHook: useExampleData,
    mockData: mockExampleData,
  });

  hookCleanupSection({
    useHook: useExampleData,
    mockData: mockExampleData,
  });

  hookDataFetchingSection({
    useHook: useExampleData,
    mockData: mockExampleData,
  });
});

// Generate performance test suite
createPerformanceTestSuite('ExampleComponent', ExampleComponent, defaultProps);

integrationTestSection({
  Component: ExampleComponent,
  defaultProps,
  mockData: mockExampleData,
});
