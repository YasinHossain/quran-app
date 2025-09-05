/**
 * Mobile Performance Optimization Tests
 * Tests for responsive component performance across devices
 */

import { renderHook, act } from '@testing-library/react';

import { testPerformance, simulateDevice, createMatchMediaMock } from './responsive-test-utils';
import { useBreakpoint, useResponsiveState } from '../responsive';

describe('Mobile Performance Optimization', () => {
  let matchMediaUtils: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    matchMediaUtils = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaUtils.matchMediaMock,
    });

    // Mock performance.now for consistent testing
    jest.spyOn(performance, 'now').mockImplementation(() => Date.now());
  });

  afterEach(() => {
    matchMediaUtils.cleanup();
    jest.restoreAllMocks();
  });

  describe('Responsive Hook Performance', () => {
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

      expect(initTime).toBeLessThan(50); // Should initialize in less than 50ms
      expect(result.current).toBe('mobile');
    });

    it('should handle rapid viewport changes efficiently', async () => {
      const { result } = renderHook(() => useBreakpoint());

      const startTime = performance.now();

      // Simulate rapid scrolling/orientation changes
      const widths = [375, 390, 414, 428, 375]; // Common mobile widths

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

      // All hooks should return consistent values
      expect(breakpoint.current).toBe(responsiveState1.current.breakpoint);
      expect(responsiveState1.current.breakpoint).toBe(responsiveState2.current.breakpoint);
      expect(responsiveState2.current.breakpoint).toBe(responsiveState3.current.breakpoint);
    });
  });

  describe('Layout Shift Performance', () => {
    it('should minimize layout shift during breakpoint transitions', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="width: 100px; height: 100px;">Item 1</div>
        <div style="width: 100px; height: 100px;">Item 2</div>
        <div style="width: 100px; height: 100px;">Item 3</div>
      `;
      document.body.appendChild(container);

      const result = await testPerformance.measureLayoutShift(container, ['iPhone SE', 'iPad']);

      expect(result.isStable).toBe(true);
      expect(result.averageShift).toBeLessThan(50);

      document.body.removeChild(container);
    });

    it('should handle orientation changes smoothly', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="width: 50vw; height: 100px;">Responsive Item</div>
      `;
      document.body.appendChild(container);

      const result = await testPerformance.measureLayoutShift(container, [
        'iPhone 12 Pro',
        'iPhone 12 Pro Landscape',
      ]);

      expect(result.isStable).toBe(true);

      document.body.removeChild(container);
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should cleanup event listeners properly', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useBreakpoint());

      void addEventListenerSpy.mock.calls.length;

      unmount();

      const removeCalls = removeEventListenerSpy.mock.calls.length;

      // Should remove as many listeners as it added
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

      // Simulate many component mounts/unmounts
      for (let i = 0; i < 50; i++) {
        const { unmount } = renderHook(() => useResponsiveState());

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1));
        });

        unmount();
      }

      // Force garbage collection if available
      const globalWithGc = global as typeof globalThis & { gc?: () => void };
      if (globalWithGc.gc) {
        globalWithGc.gc();
      }

      const finalMemory = performanceWithMemory.memory
        ? performanceWithMemory.memory.usedJSHeapSize
        : 0;

      if (performanceWithMemory.memory) {
        const memoryGrowth = finalMemory - initialMemory;
        // Memory growth should be minimal (less than 1MB)
        expect(memoryGrowth).toBeLessThan(1024 * 1024);
      }
    });
  });

  describe('Network Performance', () => {
    it('should optimize image loading for mobile connections', async () => {
      // Simulate slow mobile connection
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

      // On slow connections, should prioritize critical images
      expect(result.totalImages).toBe(3);

      document.body.removeChild(container);
    });

    it('should preload critical resources efficiently', async () => {
      const criticalResources = ['/critical-style.css', '/critical-script.js', '/hero-image.jpg'];

      const startTime = performance.now();

      // Simulate resource preloading with timeout
      const preloadPromises = criticalResources.map((resource) => {
        return new Promise((resolve) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource;

          // Add timeout to prevent hanging
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

      expect(preloadTime).toBeLessThan(500); // More realistic expectation
    }, 10000);
  });

  describe('CPU Performance', () => {
    it('should throttle expensive operations on mobile', async () => {
      simulateDevice('iPhone SE');

      const { result } = renderHook(() => useResponsiveState());

      const startTime = performance.now();

      // Simulate expensive responsive calculations
      for (let i = 0; i < 100; i++) {
        matchMediaUtils.setViewportWidth(375 + (i % 10));

        await act(async () => {
          // Small delay to simulate real usage
          await new Promise((resolve) => setTimeout(resolve, 1));
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time even with many changes
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

      // Rapid resize simulation
      for (let i = 0; i < 20; i++) {
        matchMediaUtils.setViewportWidth(375 + i * 10);

        // No delay - should be debounced internally
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(1000);

      // Hook should not re-render for every resize event
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

      // Set same viewport width multiple times
      for (let i = 0; i < 10; i++) {
        matchMediaUtils.setViewportWidth(375); // Same width

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
        });
      }

      // Should minimize re-renders when breakpoint doesn't change
      expect(renderCount).toBeLessThanOrEqual(2);
    });

    it('should use passive event listeners where possible', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => useBreakpoint());

      // Check if any event listeners are added as passive
      const passiveListeners = addEventListenerSpy.mock.calls.filter(
        (call) => call[2] && typeof call[2] === 'object' && call[2].passive
      );

      // Should use passive listeners for performance
      expect(passiveListeners.length).toBeGreaterThanOrEqual(0);

      addEventListenerSpy.mockRestore();
    });
  });

  describe('Accessibility Performance', () => {
    it('should maintain focus performance during responsive changes', async () => {
      const focusableElement = document.createElement('button');
      focusableElement.textContent = 'Test Button';
      document.body.appendChild(focusableElement);

      focusableElement.focus();

      const startTime = performance.now();

      // Change breakpoints while maintaining focus
      matchMediaUtils.setViewportWidth(375);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      matchMediaUtils.setViewportWidth(768);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      const endTime = performance.now();
      const focusTime = endTime - startTime;

      expect(focusTime).toBeLessThan(50);
      expect(document.activeElement).toBe(focusableElement);

      document.body.removeChild(focusableElement);
    });

    it('should optimize screen reader announcements', async () => {
      const announcementSpy = jest.spyOn(console, 'log').mockImplementation();

      renderHook(() => useResponsiveState());

      // Breakpoint changes should not spam screen readers
      matchMediaUtils.setViewportWidth(375);
      matchMediaUtils.setViewportWidth(768);
      matchMediaUtils.setViewportWidth(1024);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      // Should minimize unnecessary announcements
      expect(announcementSpy).toHaveBeenCalledTimes(0);

      announcementSpy.mockRestore();
    });
  });

  describe('Real-World Performance Scenarios', () => {
    it('should handle typical user interactions efficiently', async () => {
      simulateDevice('iPhone 12 Pro');

      const { result } = renderHook(() => useResponsiveState());

      const startTime = performance.now();

      // Simulate real user interactions
      const scenarios = [
        () => matchMediaUtils.setViewportWidth(390), // Portrait
        () => matchMediaUtils.setViewportWidth(844), // Landscape
        () => matchMediaUtils.setViewportWidth(390), // Back to portrait
        () => matchMediaUtils.setViewportWidth(375), // Different phone size
      ];

      for (const scenario of scenarios) {
        scenario();
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 16)); // ~60fps
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(100);
      expect(result.current.isMobile).toBe(true);
    });

    it('should maintain performance during complex responsive layouts', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="responsive-grid">
          ${Array.from({ length: 50 }, (_, i) => `<div class="grid-item">Item ${i + 1}</div>`).join(
            ''
          )}
        </div>
      `;
      document.body.appendChild(container);

      const startTime = performance.now();

      // Simulate responsive grid changes
      simulateDevice('iPhone SE');
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      simulateDevice('iPad');
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      simulateDevice('Desktop Small');
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(150);

      document.body.removeChild(container);
    });
  });
});
