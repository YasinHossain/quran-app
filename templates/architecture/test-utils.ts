import { mockViewport, BREAKPOINTS } from '@/app/testUtils/responsiveTestUtils';

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
} from './test-sections';

import type React from 'react';

interface ComponentTestConfig {
  Component: React.ComponentType<any>;
  defaultProps: any;
  mockData: any;
}

interface HookTestConfig {
  useHook: (props: any) => any;
  mockData: any;
}

export const setupTestEnvironment = () => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

export const resetTestEnvironment = () => {
  jest.clearAllMocks();
  localStorage.clear();
  mockViewport(BREAKPOINTS.mobile);
};

export const clearTestEnvironment = () => {
  jest.clearAllTimers();
};

export const runComponentTests = (config: ComponentTestConfig) => {
  architectureComplianceSection(config);
  responsiveDesignSection(config);
  contextIntegrationSection(config);
  performanceOptimizationSection(config);
  accessibilitySection(config);
  userInteractionsSection(config);
  loadingStatesSection(config);
  errorHandlingSection(config);
};

export const runHookTests = (config: HookTestConfig) => {
  hookContextIntegrationSection(config);
  hookPerformanceSection(config);
  hookCleanupSection(config);
  hookDataFetchingSection(config);
};

export const runIntegrationTest = (config: ComponentTestConfig) => {
  integrationTestSection(config);
};
