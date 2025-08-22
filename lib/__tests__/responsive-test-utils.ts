/**
 * Responsive Testing Utilities
 * Comprehensive testing tools for responsive components and behavior
 */

import { renderHook, act } from '@testing-library/react';
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Device presets for responsive testing
 */
export const devicePresets = {
  'iPhone SE': { width: 375, height: 667, orientation: 'portrait' },
  'iPhone 12 Pro': { width: 390, height: 844, orientation: 'portrait' },
  'iPhone 12 Pro Landscape': { width: 844, height: 390, orientation: 'landscape' },
  'iPad': { width: 768, height: 1024, orientation: 'portrait' },
  'iPad Landscape': { width: 1024, height: 768, orientation: 'landscape' },
  'Desktop Small': { width: 1024, height: 768, orientation: 'landscape' },
  'Desktop Large': { width: 1440, height: 900, orientation: 'landscape' },
  'Desktop 4K': { width: 3840, height: 2160, orientation: 'landscape' },
} as const;

export type DevicePreset = keyof typeof devicePresets;

/**
 * Mock window.matchMedia for responsive testing
 */
export const createMatchMediaMock = () => {
  let currentWidth = 1024; // Default desktop width

  const matchMediaMock = jest.fn((query: string) => {
    const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/);
    const orientationMatch = query.match(/\(orientation:\s*(landscape|portrait)\)/);
    
    let matches = false;
    
    if (minWidthMatch) {
      const minWidth = parseInt(minWidthMatch[1], 10);
      matches = currentWidth >= minWidth;
    } else if (orientationMatch) {
      const orientation = orientationMatch[1];
      matches = getCurrentOrientation() === orientation;
    }

    const mockMediaQueryList = {
      matches,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    return mockMediaQueryList;
  });

  const setViewportWidth = (width: number) => {
    currentWidth = width;
  };

  const getCurrentOrientation = () => {
    return currentWidth > 800 ? 'landscape' : 'portrait';
  };

  return {
    matchMediaMock,
    setViewportWidth,
    getCurrentOrientation,
    cleanup: () => {
      // Cleanup function
    }
  };
};

/**
 * Device simulation utilities
 */
export const simulateDevice = (deviceOrWidth: DevicePreset | number) => {
  const device = typeof deviceOrWidth === 'number' 
    ? { width: deviceOrWidth, height: 800, orientation: 'landscape' as const }
    : devicePresets[deviceOrWidth];

  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: device.width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: device.height,
  });

  return device;
};

/**
 * Test responsive hook behavior across breakpoints
 */
export const testResponsiveHook = async <T>(
  hook: () => T,
  testCases: Array<{
    device: DevicePreset | number;
    expected: Partial<T>;
    description: string;
  }>
) => {
  const matchMediaUtils = createMatchMediaMock();
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaUtils.matchMediaMock,
  });

  const results: Array<{ device: DevicePreset | number; result: T; expected: Partial<T> }> = [];

  for (const testCase of testCases) {
    const device = simulateDevice(testCase.device);
    matchMediaUtils.setViewportWidth(device.width);

    const { result } = renderHook(hook);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    results.push({
      device: testCase.device,
      result: result.current,
      expected: testCase.expected,
    });

    Object.entries(testCase.expected).forEach(([key, expectedValue]) => {
      expect(result.current).toHaveProperty(key, expectedValue);
    });
  }

  matchMediaUtils.cleanup();
  return results;
};

/**
 * Responsive component testing wrapper
 */
interface ResponsiveRenderOptions extends RenderOptions {
  device?: DevicePreset | number;
  mockMatchMedia?: boolean;
}

export const renderResponsive = (
  ui: ReactElement,
  options: ResponsiveRenderOptions = {}
) => {
  const { device = 'Desktop Small', mockMatchMedia = true, ...renderOptions } = options;

  let matchMediaUtils: ReturnType<typeof createMatchMediaMock> | undefined;

  if (mockMatchMedia) {
    matchMediaUtils = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaUtils.matchMediaMock,
    });
  }

  const deviceConfig = simulateDevice(device);
  if (matchMediaUtils) {
    matchMediaUtils.setViewportWidth(deviceConfig.width);
  }

  const result = render(ui, renderOptions);

  return {
    ...result,
    setDevice: (newDevice: DevicePreset | number) => {
      const newDeviceConfig = simulateDevice(newDevice);
      if (matchMediaUtils) {
        matchMediaUtils.setViewportWidth(newDeviceConfig.width);
      }
    },
    cleanup: () => {
      if (matchMediaUtils) {
        matchMediaUtils.cleanup();
      }
    },
  };
};

/**
 * Accessibility testing utilities
 */
export const testAccessibility = {
  testFocusManagement: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const tabOrder: HTMLElement[] = [];
    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i] as HTMLElement;
      element.focus();
      tabOrder.push(document.activeElement as HTMLElement);
    }

    return {
      focusableCount: focusableElements.length,
      tabOrder,
      hasLogicalOrder: tabOrder.every((el, i) => el === focusableElements[i]),
    };
  },

  testTouchTargets: (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"], [role="button"]'
    );

    const undersizedTargets: Array<{ element: Element; size: { width: number; height: number } }> = [];

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44;

      if (rect.width < minSize || rect.height < minSize) {
        undersizedTargets.push({
          element,
          size: { width: rect.width, height: rect.height },
        });
      }
    });

    return {
      totalTargets: interactiveElements.length,
      undersizedTargets,
      isCompliant: undersizedTargets.length === 0,
    };
  },

  testReadability: (container: HTMLElement) => {
    const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    const issues: Array<{ element: Element; issue: string }> = [];

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight);

      if (fontSize < 16) {
        issues.push({ element, issue: `Font size ${fontSize}px is below recommended 16px minimum` });
      }

      if (lineHeight && lineHeight / fontSize < 1.4) {
        issues.push({ element, issue: `Line height ratio ${lineHeight / fontSize} is below recommended 1.4` });
      }
    });

    return {
      totalElements: textElements.length,
      issues,
      isReadable: issues.length === 0,
    };
  },
};

/**
 * Performance testing utilities for responsive components
 */
export const testPerformance = {
  measureLayoutShift: async (container: HTMLElement, deviceTransition: [DevicePreset, DevicePreset]) => {
    const [fromDevice, toDevice] = deviceTransition;
    
    simulateDevice(fromDevice);
    const initialRects = Array.from(container.children).map(child => child.getBoundingClientRect());
    
    simulateDevice(toDevice);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    const finalRects = Array.from(container.children).map(child => child.getBoundingClientRect());
    
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
    const loadingPromises = Array.from(images).map(img => {
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
      averageLoadTime: results.reduce((sum, r) => sum + Math.max(0, r.loadTime), 0) / results.length,
      failedImages: results.filter(r => r.loadTime === -1),
    };
  },
};