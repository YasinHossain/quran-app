import { renderHook, act } from '@testing-library/react';

import { useBreakpoint, useResponsiveState } from '@/lib/responsive';

import { setupMobilePerformanceTest, simulateDevice } from './test-utils';

describe('Hook Initialization Performance', () => {
  let matchMediaUtils: ReturnType<typeof setupMobilePerformanceTest>['matchMediaUtils'];
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupMobilePerformanceTest();
    matchMediaUtils = setup.matchMediaUtils;
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it('should initialize quickly on mobile devices', async () => {
    simulateDevice('iPhone SE');
    matchMediaUtils.setViewportWidth(375);
    const startTime = performance.now();
    const { result } = renderHook(() => useBreakpoint());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const endTime = performance.now();
    const initTime = endTime - startTime;
    expect(initTime).toBeLessThan(50);
    expect(result.current).toBe('mobile');
  });
});

describe('Viewport Changes Performance', () => {
  let matchMediaUtils: ReturnType<typeof setupMobilePerformanceTest>['matchMediaUtils'];
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupMobilePerformanceTest();
    matchMediaUtils = setup.matchMediaUtils;
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it('should handle rapid viewport changes efficiently', async () => {
    const { result } = renderHook(() => useBreakpoint());
    const startTime = performance.now();
    const widths = [375, 390, 414, 428, 375];

    for (const width of widths) {
      matchMediaUtils.setViewportWidth(width);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(100);
    expect(result.current).toBe('mobile');
  });
});

describe('Multiple Hooks Performance', () => {
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupMobilePerformanceTest();
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it('should maintain performance with multiple responsive hooks', async () => {
    const startTime = performance.now();
    const { result: breakpoint } = renderHook(() => useBreakpoint());
    const { result: responsiveState1 } = renderHook(() => useResponsiveState());
    const { result: responsiveState2 } = renderHook(() => useResponsiveState());
    const { result: responsiveState3 } = renderHook(() => useResponsiveState());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const endTime = performance.now();
    const initTime = endTime - startTime;
    expect(initTime).toBeLessThan(100);
    expect(breakpoint.current).toBe(responsiveState1.current.breakpoint);
    expect(responsiveState1.current.breakpoint).toBe(responsiveState2.current.breakpoint);
    expect(responsiveState2.current.breakpoint).toBe(responsiveState3.current.breakpoint);
  });
});
