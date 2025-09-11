import { getOrientationByWidth } from './orientation';

import type { Orientation } from './orientation';

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
interface MatchMediaMock {
  matchMediaMock: jest.Mock;
  setViewportWidth: (width: number) => void;
  cleanup: () => void;
}

type Listener = (e: MediaQueryListEvent) => void;
type ListenerMap = Map<string, Set<Listener>>;

const parseMinWidth = (query: string): number | null => {
  const m = query.match(/\(min-width:\s*(\d+)px\)/);
  return m ? parseInt(m[1], 10) : null;
};

const parseOrientation = (query: string): Orientation | null => {
  const m = query.match(/\(orientation:\s*(landscape|portrait)\)/);
  return (m?.[1] as Orientation) ?? null;
};

const evaluateQuery = (query: string, width: number): boolean => {
  const min = parseMinWidth(query);
  if (min != null) return width >= min;
  const orientation = parseOrientation(query);
  if (orientation) return getOrientationByWidth(width) === orientation;
  return false;
};

const createMql = (
  query: string,
  listeners: ListenerMap,
  getWidth: () => number
): MediaQueryList => ({
  matches: evaluateQuery(query, getWidth()),
  media: query,
  onchange: null,
  addEventListener: jest.fn((event: string, listener: Listener) => {
    if (event !== 'change') return;
    const set = listeners.get(query) ?? new Set<Listener>();
    set.add(listener);
    listeners.set(query, set);
  }),
  removeEventListener: jest.fn((event: string, listener: Listener) => {
    if (event !== 'change') return;
    const set = listeners.get(query);
    set?.delete(listener);
  }),
  dispatchEvent: jest.fn(),
});

const notifyListeners = (listeners: ListenerMap, getWidth: () => number): void => {
  listeners.forEach((set, query) => {
    const matches = evaluateQuery(query, getWidth());
    set.forEach((listener) => listener({ matches, media: query } as MediaQueryListEvent));
  });
};

export const createMatchMediaMock = (): MatchMediaMock => {
  let currentWidth = 1024; // Default desktop width
  const listeners: ListenerMap = new Map();
  const getWidth = (): number => currentWidth;

  const matchMediaMock = jest.fn(
    (query: string): MediaQueryList => createMql(query, listeners, getWidth)
  );

  const setViewportWidth = (width: number): void => {
    currentWidth = width;
    notifyListeners(listeners, getWidth);
  };

  return {
    matchMediaMock,
    setViewportWidth,
    cleanup: () => listeners.clear(),
  };
};

/**
 * Device simulation utilities
 */
interface SimulatedDevice {
  width: number;
  height: number;
  orientation: Orientation;
}

export const simulateDevice = (deviceOrWidth: DevicePreset | number): SimulatedDevice => {
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
