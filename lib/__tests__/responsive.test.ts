import { renderHook, act } from '@testing-library/react';

import {
  useBreakpoint,
  useOrientation,
  useResponsiveValue,
  useResponsiveState,
  getResponsiveValue,
  getVariantForBreakpoint,
  layoutPatterns,
} from '../responsive';
import { testResponsiveHook, createMatchMediaMock } from './responsive-test-utils';

describe('Responsive System', () => {
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

  describe('useBreakpoint', () => {
    it('should return correct breakpoints for different screen sizes', async () => {
      await testResponsiveHook(
        () => useBreakpoint(),
        [
          {
            device: 'iPhone SE',
            expected: 'mobile',
            description: 'iPhone SE should be mobile breakpoint',
          },
          {
            device: 'iPad',
            expected: 'tablet',
            description: 'iPad should be tablet breakpoint',
          },
          {
            device: 'Desktop Small',
            expected: 'desktop',
            description: 'Desktop Small should be desktop breakpoint',
          },
          {
            device: 'Desktop Large',
            expected: 'wide',
            description: 'Desktop Large should be wide breakpoint',
          },
        ]
      );
    });

    it('should handle SSR correctly', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('mobile');

      globalWithWindow.window = originalWindow;
    });

    it('should update breakpoint when window resizes', () => {
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

  describe('useOrientation', () => {
    it('should detect orientation correctly', async () => {
      await testResponsiveHook(
        () => useOrientation(),
        [
          {
            device: 'iPhone 12 Pro',
            expected: 'portrait',
            description: 'Portrait device should return portrait',
          },
          {
            device: 'iPhone 12 Pro Landscape',
            expected: 'landscape',
            description: 'Landscape device should return landscape',
          },
          {
            device: 'Desktop Small',
            expected: 'landscape',
            description: 'Desktop should return landscape',
          },
        ]
      );
    });

    it('should handle SSR correctly', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('portrait');

      globalWithWindow.window = originalWindow;
    });
  });

  describe('useResponsiveValue', () => {
    it('should return correct values for different breakpoints', async () => {
      const config = {
        mobile: 'compact',
        tablet: 'medium',
        desktop: 'expanded',
        wide: 'full',
      };

      await testResponsiveHook(
        () => useResponsiveValue(config),
        [
          {
            device: 'iPhone SE',
            expected: 'compact',
            description: 'Mobile should use mobile value',
          },
          {
            device: 'iPad',
            expected: 'medium',
            description: 'Tablet should use tablet value',
          },
          {
            device: 'Desktop Small',
            expected: 'expanded',
            description: 'Desktop should use desktop value',
          },
        ]
      );
    });

    it('should fall back to mobile value when other values are missing', () => {
      const config = { mobile: 'fallback' };
      expect(getResponsiveValue('tablet', config)).toBe('fallback');
      expect(getResponsiveValue('desktop', config)).toBe('fallback');
    });
  });

  describe('useResponsiveState', () => {
    it('should provide comprehensive responsive state', async () => {
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
            description: 'Mobile device should have correct state',
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
            description: 'Tablet device should have correct state',
          },
        ]
      );
    });
  });

  describe('getVariantForBreakpoint', () => {
    it('should map breakpoints to correct variants', () => {
      expect(getVariantForBreakpoint('mobile')).toBe('compact');
      expect(getVariantForBreakpoint('tablet')).toBe('default');
      expect(getVariantForBreakpoint('desktop')).toBe('expanded');
      expect(getVariantForBreakpoint('wide')).toBe('expanded');
    });
  });

  describe('layoutPatterns.adaptiveHeader', () => {
    it('includes pt-safe for mobile and tablet', () => {
      expect(layoutPatterns.adaptiveHeader.mobile).toContain('pt-safe');
      expect(layoutPatterns.adaptiveHeader.tablet).toContain('pt-safe');
    });
  });

  describe('Performance', () => {
    it('should handle rapid breakpoint changes efficiently', async () => {
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
  });

  describe('Edge Cases', () => {
    it('should handle missing window object gracefully', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      expect(() => {
        renderHook(() => useBreakpoint());
      }).not.toThrow();

      expect(() => {
        renderHook(() => useOrientation());
      }).not.toThrow();

      globalWithWindow.window = originalWindow;
    });

    it('should handle zero-dimension viewports', () => {
      matchMediaUtils.setViewportWidth(0);

      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('mobile');
    });
  });
});
