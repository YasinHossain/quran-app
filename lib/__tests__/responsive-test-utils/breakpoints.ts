import { getOrientationByWidth } from './orientation';

/**
 * Device presets for responsive testing
 */
export const devicePresets = {
  'iPhone SE': { width: 375, height: 667, orientation: 'portrait' },
  'iPhone 12 Pro': { width: 390, height: 844, orientation: 'portrait' },
  'iPhone 12 Pro Landscape': { width: 844, height: 390, orientation: 'landscape' },
  iPad: { width: 768, height: 1024, orientation: 'portrait' },
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

  const listeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();

  const evaluate = (query: string) => {
    const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/);
    const orientationMatch = query.match(/\(orientation:\s*(landscape|portrait)\)/);

    if (minWidthMatch) {
      const minWidth = parseInt(minWidthMatch[1], 10);
      return currentWidth >= minWidth;
    }
    if (orientationMatch) {
      const orientation = orientationMatch[1];
      return getOrientationByWidth(currentWidth) === orientation;
    }
    return false;
  };

  const matchMediaMock = jest.fn((query: string) => {
    const mockMediaQueryList = {
      matches: evaluate(query),
      media: query,
      onchange: null as ((e: MediaQueryListEvent) => void) | null,
      addEventListener: jest.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event !== 'change') return;
        const set = listeners.get(query) ?? new Set();
        set.add(listener);
        listeners.set(query, set);
      }),
      removeEventListener: jest.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event !== 'change') return;
        const set = listeners.get(query);
        set?.delete(listener);
      }),
      dispatchEvent: jest.fn(),
    };

    return mockMediaQueryList;
  });

  const notify = () => {
    listeners.forEach((set, query) => {
      const matches = evaluate(query);
      set.forEach((listener) => listener({ matches, media: query } as MediaQueryListEvent));
    });
  };

  const setViewportWidth = (width: number) => {
    currentWidth = width;
    notify();
  };

  return {
    matchMediaMock,
    setViewportWidth,
    cleanup: () => {
      listeners.clear();
    },
  };
};

/**
 * Device simulation utilities
 */
export const simulateDevice = (deviceOrWidth: DevicePreset | number) => {
  const device =
    typeof deviceOrWidth === 'number'
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
