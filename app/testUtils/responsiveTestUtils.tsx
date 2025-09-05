import { act } from '@testing-library/react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

/**
 * @module ResponsiveTestUtils
 * @description Testing utilities for mobile-first responsive design validation
 * @exports mockViewport, testBreakpoints, assertResponsiveClasses, createMediaQueryMock
 * @example
 * ```tsx
 * import { mockViewport, testBreakpoints } from '@/app/testUtils/responsiveTestUtils';
 *
 * it('adapts to different screen sizes', () => {
 *   testBreakpoints((breakpoint) => {
 *     mockViewport(breakpoint);
 *     render(<Component />);
 *     // Test responsive behavior
 *   });
 * });
 * ```
 */

// Standard breakpoints from Tailwind CSS
export const BREAKPOINTS = {
  mobile: 375, // iPhone SE
  mobileLarge: 414, // iPhone 12 Pro Max
  tablet: 768, // iPad
  desktop: 1024, // Desktop
  desktopLarge: 1280, // Large desktop
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

/**
 * Mock viewport dimensions for responsive testing
 */
export function mockViewport(width: number | BreakpointName): void {
  const actualWidth = typeof width === 'string' ? BREAKPOINTS[width] : width;

  // Update window.innerWidth and related properties
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

  // Update screen object
  Object.defineProperty(window.screen, 'width', {
    writable: true,
    configurable: true,
    value: actualWidth,
  });

  // Trigger resize event
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
 * Assert that element has correct responsive classes
 */
export function assertResponsiveClasses(
  element: HTMLElement,
  expectedClasses: {
    base: string[];
    sm?: string[];
    md?: string[];
    lg?: string[];
    xl?: string[];
  }
): void {
  // Check base classes (mobile-first)
  expectedClasses.base.forEach((className) => {
    expect(element).toHaveClass(className);
  });

  // Check responsive classes if provided
  ['sm', 'md', 'lg', 'xl'].forEach((breakpoint) => {
    const classes = expectedClasses[breakpoint as keyof typeof expectedClasses] as
      | string[]
      | undefined;
    if (classes) {
      classes.forEach((className) => {
        expect(element).toHaveClass(`${breakpoint}:${className}`);
      });
    }
  });
}

/**
 * Create a mock for window.matchMedia with responsive breakpoints
 */
export function createMediaQueryMock(): jest.Mock {
  return jest.fn().mockImplementation((query: string) => {
    // Extract width from media query
    const match = query.match(/min-width:\s*(\d+)px/);
    const minWidth = match ? parseInt(match[1], 10) : 0;

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
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMediaQueryMock(),
  });

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

/**
 * Touch-friendly interaction assertions
 */
export function assertTouchFriendly(element: HTMLElement): void {
  const styles = window.getComputedStyle(element);
  const minHeight = parseInt(styles.minHeight, 10);
  const minWidth = parseInt(styles.minWidth, 10);

  // WCAG guideline: minimum 44px touch target
  if (minHeight > 0) {
    expect(minHeight).toBeGreaterThanOrEqual(44);
  }

  if (minWidth > 0) {
    expect(minWidth).toBeGreaterThanOrEqual(44);
  }

  // Check for touch-friendly classes
  const classList = Array.from(element.classList);
  const hasTouchClass = classList.some(
    (className) =>
      className.includes('min-h-11') || // 44px
      className.includes('min-h-touch') ||
      className.includes('h-11') ||
      className.includes('h-12') ||
      className.includes('p-3') ||
      className.includes('p-4')
  );

  if (!hasTouchClass) {
    logger.warn(`Element may not be touch-friendly: ${element.className}`);
  }
}

export { setupResponsiveTests as default };
