import { renderHook, act } from '@testing-library/react';

import {
  useBreakpoint,
  useResponsiveValue,
  useResponsiveState,
  getResponsiveValue,
  getVariantForBreakpoint,
  layoutPatterns,
} from '../responsive';
import { testResponsiveHook, setupMatchMediaMock } from './responsive/test-utils';

describe('Responsive Breakpoints', () => {
  let matchMediaUtils: ReturnType<typeof setupMatchMediaMock>;

  beforeEach(() => {
    matchMediaUtils = setupMatchMediaMock();
  });

  afterEach(() => {
    matchMediaUtils.cleanup();
    jest.clearAllMocks();
  });

  describe('useBreakpoint', () => {
    it('returns correct breakpoints for screen sizes', async () => {
      await testResponsiveHook(
        () => useBreakpoint(),
        [
          { device: 'iPhone SE', expected: 'mobile', description: 'iPhone SE should be mobile' },
          { device: 'iPad', expected: 'tablet', description: 'iPad should be tablet' },
          {
            device: 'Desktop Small',
            expected: 'desktop',
            description: 'Desktop Small should be desktop',
          },
          {
            device: 'Desktop Large',
            expected: 'wide',
            description: 'Desktop Large should be wide',
          },
        ]
      );
    });

    it('handles SSR correctly', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('mobile');

      globalWithWindow.window = originalWindow;
    });

    it('updates breakpoint on resize', () => {
      const { result } = renderHook(() => useBreakpoint());

      act(() => {
        matchMediaUtils.setViewportWidth(375);
      });

      act(() => {
        matchMediaUtils.setViewportWidth(768);
      });

      expect(result.current).toBe('tablet');
    });
  });

  describe('useResponsiveValue', () => {
    it('returns correct values for breakpoints', async () => {
      await testResponsiveHook(
        () => useResponsiveValue({ mobile: 'compact', tablet: 'default', desktop: 'expanded' }),
        [
          { device: 'iPhone SE', expected: 'compact', description: 'Mobile uses compact value' },
          { device: 'iPad', expected: 'default', description: 'Tablet uses default value' },
          {
            device: 'Desktop Small',
            expected: 'expanded',
            description: 'Desktop uses expanded value',
          },
        ]
      );
    });

    it('falls back to mobile when values missing', () => {
      const config = { mobile: 'fallback' };
      expect(getResponsiveValue('tablet', config)).toBe('fallback');
      expect(getResponsiveValue('desktop', config)).toBe('fallback');
    });
  });

  describe('useResponsiveState', () => {
    it('provides comprehensive state', async () => {
      await testResponsiveHook(
        () => useResponsiveState(),
        [
          {
            device: 'iPhone SE',
            expected: {
              breakpoint: 'mobile',
              isMobile: true,
              isTablet: false,
              isDesktop: false,
              variant: 'compact',
            },
            description: 'Mobile device state',
          },
          {
            device: 'iPad',
            expected: {
              breakpoint: 'tablet',
              isMobile: false,
              isTablet: true,
              isDesktop: false,
              variant: 'default',
            },
            description: 'Tablet device state',
          },
        ]
      );
    });
  });

  it('maps breakpoints to variants', () => {
    expect(getVariantForBreakpoint('mobile')).toBe('compact');
    expect(getVariantForBreakpoint('tablet')).toBe('default');
    expect(getVariantForBreakpoint('desktop')).toBe('expanded');
    expect(getVariantForBreakpoint('wide')).toBe('expanded');
  });

  it('includes pt-safe for mobile and tablet headers', () => {
    expect(layoutPatterns.adaptiveHeader.mobile).toContain('pt-safe');
    expect(layoutPatterns.adaptiveHeader.tablet).toContain('pt-safe');
  });

  it('handles rapid breakpoint changes efficiently', async () => {
    const { result } = renderHook(() => useBreakpoint());
    const startTime = performance.now();

    for (let i = 0; i < 20; i++) {
      const width = 375 + i * 50;
      await act(async () => {
        matchMediaUtils.setViewportWidth(width);
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(500);
    expect(['tablet', 'desktop', 'wide']).toContain(result.current);
  });

  describe('Edge Cases', () => {
    it('handles missing window object', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      expect(() => {
        renderHook(() => useBreakpoint());
      }).not.toThrow();

      globalWithWindow.window = originalWindow;
    });

    it('handles zero-dimension viewports', () => {
      matchMediaUtils.setViewportWidth(0);
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('mobile');
    });
  });
});
