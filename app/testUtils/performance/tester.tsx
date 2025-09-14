import { RenderResult } from '@testing-library/react';
import { ComponentType } from 'react';

import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

import { withRenderTracking, resetRenderTracking, getRenderCount } from './tracking';

export const performanceMocks = {
  mockPerformanceMark: jest.fn(),
  mockPerformanceMeasure: jest.fn(),
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
  reset(): void {
    this.mockPerformanceMark.mockReset();
    this.mockPerformanceMeasure.mockReset();
  },
};

export class PerformanceTester<P extends object> {
  private component: ComponentType<P>;
  private renderResult: RenderResult | null = null;
  private TrackedComponent: ComponentType<P>;

  constructor(component: ComponentType<P>) {
    this.component = component;
    this.TrackedComponent = withRenderTracking(component);
  }

  render(props: P): this {
    resetRenderTracking();
    this.renderResult = renderWithProviders(<this.TrackedComponent {...props} />);
    return this;
  }

  rerender(props: P): this {
    if (!this.renderResult) {
      throw new Error('Must call render() before rerender()');
    }
    this.renderResult.rerender(<this.TrackedComponent {...props} />);
    return this;
  }

  expectRenderCount(count: number): this {
    expect(getRenderCount()).toBe(count);
    return this;
  }

  expectNoRerender(): this {
    return this.expectRenderCount(1);
  }

  expectRerender(): this {
    expect(getRenderCount()).toBeGreaterThan(1);
    return this;
  }

  unmount(): void {
    if (this.renderResult) {
      this.renderResult.unmount();
      this.renderResult = null;
    }
    resetRenderTracking();
  }
}

export function testCallbackStability<T extends (...args: unknown[]) => unknown>(
  callback1: T,
  callback2: T,
  shouldBeStable = true
): void {
  if (shouldBeStable) {
    expect(callback1).toBe(callback2);
  } else {
    expect(callback1).not.toBe(callback2);
  }
}

export function testMemoStability<T>(value1: T, value2: T, shouldBeStable: boolean = true): void {
  if (shouldBeStable) {
    expect(value1).toBe(value2);
  } else {
    expect(value1).not.toBe(value2);
  }
}

export function createPerformanceTestSuite<P extends object>(
  componentName: string,
  Component: ComponentType<P>,
  testProps: P
): void {
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
      const changedProps = { ...testProps } as Record<string, unknown>;
      if (typeof testProps === 'object' && testProps !== null) {
        const firstKey = Object.keys(testProps as Record<string, unknown>)[0];
        if (firstKey) {
          changedProps[firstKey] = 'changed-value';
        }
      }

      tester
        .render(testProps)
        .expectRenderCount(1)
        .rerender(changedProps as P)
        .expectRerender();
    });
  });
}
