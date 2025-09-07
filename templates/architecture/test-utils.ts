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

interface ComponentTestConfig<TProps, TData> {
  Component: React.ComponentType<TProps>;
  defaultProps: TProps;
  mockData: TData;
}

interface HookResult<TData> {
  data: TData[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

interface HookTestConfig<TProps, TData> {
  useHook: (props: TProps) => HookResult<TData>;
  mockData: TData;
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

  (globalThis as { IntersectionObserver: jest.Mock }).IntersectionObserver = jest
    .fn()
    .mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  (globalThis as { ResizeObserver: jest.Mock }).ResizeObserver = jest
    .fn()
    .mockImplementation(() => ({
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

export const runComponentTests = <TProps, TData>(config: ComponentTestConfig<TProps, TData>) => {
  architectureComplianceSection(config);
  responsiveDesignSection(config);
  contextIntegrationSection(config);
  performanceOptimizationSection(config);
  accessibilitySection(config);
  userInteractionsSection(config);
  loadingStatesSection(config);
  errorHandlingSection(config);
};

export const runHookTests = <TProps, TData>(config: HookTestConfig<TProps, TData>) => {
  hookContextIntegrationSection(config);
  hookPerformanceSection(config);
  hookCleanupSection(config);
  hookDataFetchingSection(config);
};

export const runIntegrationTest = <TProps, TData>(config: ComponentTestConfig<TProps, TData>) => {
  integrationTestSection(config);
};
