import { act } from '@testing-library/react';

export const BREAKPOINTS = {
  mobile: 375, // iPhone SE
  mobileLarge: 414, // iPhone 12 Pro Max
  tablet: 768, // iPad
  desktop: 1024, // Desktop
  desktopLarge: 1280, // Large desktop,
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

/**
 * Mock viewport dimensions for responsive testing
 */
export function mockViewport(width: number | BreakpointName): void {
  const actualWidth = typeof width === 'string' ? BREAKPOINTS[width] : width;

  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: actualWidth,
  });

  Object.defineProperty(window, 'outerWidth', {
    writable: true,
    configurable: true,
    value: actualWidth,
  });

  Object.defineProperty(window.screen, 'width', {
    writable: true,
    configurable: true,
    value: actualWidth,
  });

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

/**
 * Test component behavior across all breakpoints
 */
export function testBreakpoints(testFn: (breakpoint: BreakpointName, width: number) => void): void {
  Object.entries(BREAKPOINTS).forEach(([name, width]) => {
    testFn(name as BreakpointName, width);
  });
}

/**
 * Create a mock for window.matchMedia with responsive breakpoints
 */
export function createMediaQueryMock(): jest.Mock {
  return jest.fn().mockImplementation((query: string) => {
    const match = query.match(/min-width:\s*(\d+)px/);
    const minWidth = match?.[1] ? parseInt(match[1], 10) : 0;

    return {
      matches: window.innerWidth >= minWidth,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
}

/**
 * Setup responsive testing environment
 */
export function setupResponsiveTests(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMediaQueryMock(),
  });

  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}
