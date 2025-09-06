import { act } from '@testing-library/react';

import { DevicePreset, simulateDevice } from './breakpoints';

/**
 * Performance testing utilities for responsive components
 */
export const testPerformance = {
  measureLayoutShift: async (
    container: HTMLElement,
    deviceTransition: [DevicePreset, DevicePreset]
  ) => {
    const [fromDevice, toDevice] = deviceTransition;

    simulateDevice(fromDevice);
    const initialRects = Array.from(container.children).map((child) =>
      child.getBoundingClientRect()
    );

    simulateDevice(toDevice);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const finalRects = Array.from(container.children).map((child) => child.getBoundingClientRect());

    let totalShift = 0;
    initialRects.forEach((initialRect, index) => {
      const finalRect = finalRects[index];
      if (finalRect) {
        const deltaX = Math.abs(finalRect.x - initialRect.x);
        const deltaY = Math.abs(finalRect.y - initialRect.y);
        totalShift += deltaX + deltaY;
      }
    });

    return {
      totalShift,
      averageShift: totalShift / initialRects.length,
      isStable: totalShift < 50,
    };
  },

  testImageLoading: async (container: HTMLElement) => {
    const images = container.querySelectorAll('img');
    const loadingPromises = Array.from(images).map((img) => {
      return new Promise<{ element: HTMLImageElement; loadTime: number }>((resolve) => {
        const startTime = performance.now();

        if (img.complete) {
          resolve({ element: img, loadTime: 0 });
        } else {
          img.onload = () => {
            resolve({ element: img, loadTime: performance.now() - startTime });
          };
          img.onerror = () => {
            resolve({ element: img, loadTime: -1 });
          };
        }
      });
    });

    const results = await Promise.all(loadingPromises);

    return {
      totalImages: images.length,
      results,
      averageLoadTime:
        results.reduce((sum, r) => sum + Math.max(0, r.loadTime), 0) / results.length,
      failedImages: results.filter((r) => r.loadTime === -1),
    };
  },
};
