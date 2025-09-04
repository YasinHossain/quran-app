import { render, RenderResult } from '@testing-library/react';
import { ReactElement, ComponentType } from 'react';

/**
 * @module PerformanceTestUtils
 * @description Testing utilities for verifying memo() and performance optimizations
 * @exports testMemoization, testReRenderCount, mockPerformance, PerformanceTester
 * @example
 * ```tsx
 * import { testMemoization } from '@/app/testUtils/performanceTestUtils';
 *
 * it('should not re-render when props unchanged', () => {
 *   const result = testMemoization(Component, { prop: 'value' });
 *   expect(result.renderCount).toBe(1);
 * });
 * ```
 */

let renderCount = 0;
let lastProps: any = null;

/**
 * Higher-order component to track renders
 */
function withRenderTracking<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  const TrackedComponent = (props: P) => {
    renderCount++;
    lastProps = props;
    return <Component {...props} />;
  };

  TrackedComponent.displayName = `TrackedComponent(${Component.displayName || Component.name})`;
  return TrackedComponent;
}

/**
 * Reset render tracking counters
 */
export function resetRenderTracking(): void {
  renderCount = 0;
  lastProps = null;
}

/**
 * Get current render count
 */
export function getRenderCount(): number {
  return renderCount;
}

/**
 * Get last rendered props
 */
export function getLastProps(): any {
  return lastProps;
}

/**
 * Test memoization effectiveness of a component
 */
export function testMemoization<P extends object>(
  Component: ComponentType<P>,
  initialProps: P,
  changedProps?: Partial<P>
): {
  renderCount: number;
  rerender: (props: P) => void;
  unmount: () => void;
} {
  resetRenderTracking();

  const TrackedComponent = withRenderTracking(Component);
  const { rerender, unmount } = render(<TrackedComponent {...initialProps} />);

  const initialRenderCount = getRenderCount();

  return {
    renderCount: initialRenderCount,
    rerender: (newProps: P) => {
      rerender(<TrackedComponent {...newProps} />);
    },
    unmount,
  };
}

/**
 * Performance measurement utilities
 */
export const performanceMocks = {
  /**
   * Mock performance.mark for performance testing
   */
  mockPerformanceMark: jest.fn(),

  /**
   * Mock performance.measure for performance testing
   */
  mockPerformanceMeasure: jest.fn(),

  /**
   * Setup performance mocking
   */
  setup(): void {
    Object.defineProperty(global, 'performance', {
      writable: true,
      value: {
        mark: this.mockPerformanceMark,
        measure: this.mockPerformanceMeasure,
        now: jest.fn(() => Date.now()),
        getEntriesByType: jest.fn(() => []),
        getEntriesByName: jest.fn(() => []),
      },
    });
  },

  /**
   * Reset performance mocks
   */
  reset(): void {
    this.mockPerformanceMark.mockReset();
    this.mockPerformanceMeasure.mockReset();
  },
};

/**
 * Test component re-render behavior
 */
export class PerformanceTester<P extends object> {
  private component: ComponentType<P>;
  private renderResult: RenderResult | null = null;
  private TrackedComponent: ComponentType<P>;

  constructor(component: ComponentType<P>) {
    this.component = component;
    this.TrackedComponent = withRenderTracking(component);
  }

  /**
   * Initial render with props
   */
  render(props: P): this {
    resetRenderTracking();
    this.renderResult = render(<this.TrackedComponent {...props} />);
    return this;
  }

  /**
   * Re-render with new props
   */
  rerender(props: P): this {
    if (!this.renderResult) {
      throw new Error('Must call render() before rerender()');
    }
    this.renderResult.rerender(<this.TrackedComponent {...props} />);
    return this;
  }

  /**
   * Assert render count
   */
  expectRenderCount(count: number): this {
    expect(getRenderCount()).toBe(count);
    return this;
  }

  /**
   * Assert component did not re-render
   */
  expectNoRerender(): this {
    return this.expectRenderCount(1);
  }

  /**
   * Assert component re-rendered
   */
  expectRerender(): this {
    expect(getRenderCount()).toBeGreaterThan(1);
    return this;
  }

  /**
   * Clean up
   */
  unmount(): void {
    if (this.renderResult) {
      this.renderResult.unmount();
      this.renderResult = null;
    }
    resetRenderTracking();
  }
}

/**
 * Test useCallback effectiveness
 */
export function testCallbackStability(
  callback1: Function,
  callback2: Function,
  shouldBeStable: boolean = true
): void {
  if (shouldBeStable) {
    expect(callback1).toBe(callback2);
  } else {
    expect(callback1).not.toBe(callback2);
  }
}

/**
 * Test useMemo effectiveness
 */
export function testMemoStability<T>(value1: T, value2: T, shouldBeStable: boolean = true): void {
  if (shouldBeStable) {
    expect(value1).toBe(value2);
  } else {
    expect(value1).not.toBe(value2);
  }
}

/**
 * Create a performance test suite for a component
 */
export function createPerformanceTestSuite<P extends object>(
  componentName: string,
  Component: ComponentType<P>,
  testProps: P
) {
  describe(`${componentName} Performance`, () => {
    let tester: PerformanceTester<P>;

    beforeEach(() => {
      tester = new PerformanceTester(Component);
      performanceMocks.setup();
    });

    afterEach(() => {
      tester.unmount();
      performanceMocks.reset();
    });

    it('should be memoized and not re-render with same props', () => {
      tester.render(testProps).expectRenderCount(1).rerender(testProps).expectNoRerender();
    });

    it('should re-render when props change', () => {
      const changedProps = { ...testProps };
      // Modify a prop to force re-render
      if (typeof testProps === 'object' && testProps !== null) {
        const firstKey = Object.keys(testProps)[0];
        if (firstKey) {
          (changedProps as any)[firstKey] = 'changed-value';
        }
      }

      tester.render(testProps).expectRenderCount(1).rerender(changedProps).expectRerender();
    });
  });
}

export default PerformanceTester;
