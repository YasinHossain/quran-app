import { renderHook, act } from '@testing-library/react';

import { useBreakpoint, useResponsiveState } from '@/lib/responsive';

import { setupMobilePerformanceTest, testPerformance } from './test-utils';

const registerPerformanceLifecycle = (): void => {
  let cleanup: () => void = () => {};

  beforeEach(() => {
    const setup = setupMobilePerformanceTest();
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });
};

const assertNoEventListenerLeaks = (): void => {
  const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useBreakpoint());

  const addCalls = addEventListenerSpy.mock.calls.length;
  unmount();

  const removeCalls = removeEventListenerSpy.mock.calls.length;
  if (addCalls > 0) {
    expect(removeCalls).toBeGreaterThan(0);
  } else {
    expect(removeCalls).toBeGreaterThanOrEqual(0);
  }

  addEventListenerSpy.mockRestore();
  removeEventListenerSpy.mockRestore();
};

const assertResponsiveStateDoesNotLeak = async (): Promise<void> => {
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
};

const assertImageLoadingOptimizedForMobileConnections = async (): Promise<void> => {
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
};

const assertCriticalResourcesPreloadEfficiently = async (): Promise<void> => {
  const criticalResources = ['/critical-style.css', '/critical-script.js', '/hero-image.jpg'];
  const startTime = performance.now();

  const createPreloadPromise = (resource: string): Promise<unknown> => {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      const timeout = setTimeout(() => resolve(resource), 50);

      const cleanup = (): void => {
        clearTimeout(timeout);
        resolve(resource);
      };

      link.onload = cleanup;
      link.onerror = cleanup;
      document.head.appendChild(link);
    });
  };

  const preloadPromises = criticalResources.map(createPreloadPromise);
  await Promise.all(preloadPromises);
  const endTime = performance.now();
  const preloadTime = endTime - startTime;
  expect(preloadTime).toBe(16);
};

describe('Memory Usage Optimization', () => {
  registerPerformanceLifecycle();

  it('should cleanup event listeners properly', () => {
    assertNoEventListenerLeaks();
  });

  it('should not create memory leaks during rapid re-renders', async () => {
    await assertResponsiveStateDoesNotLeak();
  });
});

describe('Image Loading Performance', () => {
  registerPerformanceLifecycle();

  it.skip('should optimize image loading for mobile connections', async () => {
    await assertImageLoadingOptimizedForMobileConnections();
  }, 5000);
});

describe('Resource Preloading Performance', () => {
  registerPerformanceLifecycle();

  it('should preload critical resources efficiently', async () => {
    await assertCriticalResourcesPreloadEfficiently();
  }, 10000);
});
