import { renderHook, act } from '@testing-library/react';

import {
  useBreakpoint,
  useResponsiveValue,
  getResponsiveValue,
  getVariantForBreakpoint,
  layoutPatterns,
} from '@/lib/responsive';

import { testResponsiveHook } from './responsive-test-utils/hooks';
import { createMatchMediaMock } from './responsive-test-utils/breakpoints';

const breakpointCases = [
  { device: 'iPhone SE', expected: 'mobile', description: 'iPhone SE should be mobile' },
  { device: 'iPad', expected: 'tablet', description: 'iPad should be tablet' },
  { device: 'Desktop Small', expected: 'desktop', description: 'Desktop Small should be desktop' },
  { device: 'Desktop Large', expected: 'wide', description: 'Desktop Large should be wide' },
] as const;

const responsiveValueCases = [
  { device: 'iPhone SE', expected: 'compact', description: 'Mobile uses compact value' },
  { device: 'iPad', expected: 'default', description: 'Tablet uses default value' },
  { device: 'Desktop Small', expected: 'expanded', description: 'Desktop uses expanded value' },
] as const;

const renderUseBreakpointWithoutWindow = (): 'mobile' | 'tablet' | 'desktop' | 'wide' => {
  const originalWindow = global.window;
  const globalWithWindow = global as typeof globalThis & { window?: unknown };
  // @ts-expect-error – simulate SSR by removing window
  delete globalWithWindow.window;
  try {
    const { result } = renderHook(() => useBreakpoint());
    return result.current;
  } finally {
    (globalWithWindow as typeof globalThis).window = originalWindow;
  }
};

describe('Responsive Width - hooks', () => {
  let matchMediaUtils: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    matchMediaUtils = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaUtils.matchMediaMock,
    });
  });
  afterEach(() => {
    matchMediaUtils.cleanup();
    jest.clearAllMocks();
  });

  it('useBreakpoint returns correct breakpoints for devices', async () => {
    await testResponsiveHook(() => useBreakpoint(), [...breakpointCases]);
  });

  it('useBreakpoint handles SSR correctly', () => {
    expect(renderUseBreakpointWithoutWindow()).toBe('mobile');
  });

  it('useBreakpoint updates on resize', () => {
    const { result } = renderHook(() => useBreakpoint());
    act(() => {
      matchMediaUtils.setViewportWidth(375);
      matchMediaUtils.setViewportWidth(768);
    });
    expect(result.current).toBe('tablet');
  });
});

describe('Responsive Width - helpers and edge cases', () => {
  it('useResponsiveValue returns values for breakpoints', async () => {
    await testResponsiveHook(
      () => useResponsiveValue({ mobile: 'compact', tablet: 'default', desktop: 'expanded' }),
      [...responsiveValueCases]
    );
  });

  it('getResponsiveValue falls back to mobile', () => {
    const config = { mobile: 'fallback' };
    expect(getResponsiveValue('tablet', config)).toBe('fallback');
    expect(getResponsiveValue('desktop', config)).toBe('fallback');
  });

  it('getVariantForBreakpoint maps breakpoints to variants', () => {
    expect(getVariantForBreakpoint('mobile')).toBe('compact');
    expect(getVariantForBreakpoint('tablet')).toBe('default');
    expect(getVariantForBreakpoint('desktop')).toBe('expanded');
    expect(getVariantForBreakpoint('wide')).toBe('expanded');
  });

  it('layoutPatterns includes pt-safe for mobile and tablet headers', () => {
    expect(layoutPatterns.adaptiveHeader.mobile).toContain('pt-safe');
    expect(layoutPatterns.adaptiveHeader.tablet).toContain('pt-safe');
  });

  it('handles missing window', () => {
    expect(() => {
      renderUseBreakpointWithoutWindow();
    }).not.toThrow();
  });
});

describe('Responsive Width - zero width', () => {
  it('handles zero-width viewports', () => {
    const matchMediaUtils = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaUtils.matchMediaMock,
    });
    matchMediaUtils.setViewportWidth(0);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('mobile');
    matchMediaUtils.cleanup();
  });
});
