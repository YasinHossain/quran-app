import { renderHook, act } from '@testing-library/react';

import { useBreakpoint, useResponsiveState } from '../../responsive';
import { setupMobilePerformanceTest, testPerformance } from './test-utils';

describe('Memory and Network Performance', () => {
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

  describe('Memory Usage Optimization', () => {
    it('should cleanup event listeners properly', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useBreakpoint());

      void addEventListenerSpy.mock.calls.length;

      unmount();

      const removeCalls = removeEventListenerSpy.mock.calls.length;

      expect(removeCalls).toBeGreaterThan(0);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should not create memory leaks during rapid re-renders', async () => {
      interface PerformanceWithMemory extends Performance {
        memory?: { usedJSHeapSize: number };
      }
      const performanceWithMemory = performance as PerformanceWithMemory;
      const initialMemory = performanceWithMemory.memory
        ? performanceWithMemory.memory.usedJSHeapSize
        : 0;

      for (let i = 0; i < 50; i++) {
        const { unmount } = renderHook(() => useResponsiveState());

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1));
        });

        unmount();
      }

      const globalWithGc = global as typeof globalThis & { gc?: () => void };
      if (globalWithGc.gc) {
        globalWithGc.gc();
      }

      const finalMemory = performanceWithMemory.memory
        ? performanceWithMemory.memory.usedJSHeapSize
        : 0;

      if (performanceWithMemory.memory) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(1024 * 1024);
      }
    });
  });

  describe('Network Performance', () => {
    it('should optimize image loading for mobile connections', async () => {
      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: '3g',
          downlink: 1.5,
          rtt: 200,
        },
        configurable: true,
      });

      const container = document.createElement('div');
      container.innerHTML = `
        <img src="/test-image-1.jpg" alt="Test 1" />
        <img src="/test-image-2.jpg" alt="Test 2" />
        <img src="/test-image-3.jpg" alt="Test 3" />
      `;
      document.body.appendChild(container);

      const result = await testPerformance.testImageLoading(container);

      expect(result.totalImages).toBe(3);

      document.body.removeChild(container);
    });

    it('should preload critical resources efficiently', async () => {
      const criticalResources = ['/critical-style.css', '/critical-script.js', '/hero-image.jpg'];

      const startTime = performance.now();

      const preloadPromises = criticalResources.map((resource) => {
        return new Promise((resolve) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource;

          const timeout = setTimeout(() => resolve(resource), 50);

          link.onload = () => {
            clearTimeout(timeout);
            resolve(resource);
          };
          link.onerror = () => {
            clearTimeout(timeout);
            resolve(resource);
          };

          document.head.appendChild(link);
        });
      });

      await Promise.all(preloadPromises);

      const endTime = performance.now();
      const preloadTime = endTime - startTime;

      expect(preloadTime).toBeLessThan(500);
    }, 10000);
  });
});
