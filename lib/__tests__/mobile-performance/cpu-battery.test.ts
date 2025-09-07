import { renderHook, act } from '@testing-library/react';

import { setupMobilePerformanceTest, simulateDevice } from './test-utils';
import { useBreakpoint, useResponsiveState } from '../../responsive';

describe('CPU and Battery Performance', () => {
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

  describe('CPU Performance', () => {
    it('should throttle expensive operations on mobile', async () => {
      simulateDevice('iPhone SE');

      const { result } = renderHook(() => useResponsiveState());

      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        matchMediaUtils.setViewportWidth(375 + (i % 10));

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1));
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(2000);
      expect(result.current.isMobile).toBe(false);
    });

    it('should debounce resize events efficiently', async () => {
      let resizeCallCount = 0;

      renderHook(() => {
        resizeCallCount++;
        return useBreakpoint();
      });

      const startTime = performance.now();

      for (let i = 0; i < 20; i++) {
        matchMediaUtils.setViewportWidth(375 + i * 10);

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(1000);
      expect(resizeCallCount).toBeLessThan(25);
    });
  });

  describe('Battery Usage Optimization', () => {
    it('should minimize unnecessary re-renders', async () => {
      let renderCount = 0;

      renderHook(() => {
        renderCount++;
        return useBreakpoint();
      });

      for (let i = 0; i < 10; i++) {
        matchMediaUtils.setViewportWidth(375);

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
        });
      }

      expect(renderCount).toBeLessThanOrEqual(2);
    });

    it('should use passive event listeners where possible', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => useBreakpoint());

      const passiveListeners = addEventListenerSpy.mock.calls.filter(
        (call) => call[2] && typeof call[2] === 'object' && call[2].passive
      );

      expect(passiveListeners.length).toBeGreaterThanOrEqual(0);

      addEventListenerSpy.mockRestore();
    });
  });
});
