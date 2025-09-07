import { renderHook, act } from '@testing-library/react';

import {
  useBreakpoint,
  useResponsiveValue,
  getResponsiveValue,
  getVariantForBreakpoint,
  layoutPatterns,
} from '../responsive';
import { testResponsiveHook, setupMatchMediaMock } from './responsive/test-utils';

describe('Responsive Width', () => {
  let matchMediaUtils: ReturnType<typeof setupMatchMediaMock>;

  beforeEach(() => {
    matchMediaUtils = setupMatchMediaMock();
  });
  afterEach(() => {
    matchMediaUtils.cleanup();
    jest.clearAllMocks();
  });

  describe('useBreakpoint', () => {
    it('returns correct breakpoints for devices', async () => {
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

    it('updates on resize', () => {
      const { result } = renderHook(() => useBreakpoint());
      act(() => {
        matchMediaUtils.setViewportWidth(375);
        matchMediaUtils.setViewportWidth(768);
      });
      expect(result.current).toBe('tablet');
    });
  });

  describe('useResponsiveValue', () => {
    it('returns values for breakpoints', async () => {
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

    it('falls back to mobile', () => {
      const config = { mobile: 'fallback' };
      expect(getResponsiveValue('tablet', config)).toBe('fallback');
      expect(getResponsiveValue('desktop', config)).toBe('fallback');
    });
  });

  describe('helpers', () => {
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
  });

  describe('Edge Cases', () => {
    it('handles missing window', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;
      expect(() => {
        renderHook(() => useBreakpoint());
      }).not.toThrow();
      globalWithWindow.window = originalWindow;
    });

    it('handles zero-width viewports', () => {
      matchMediaUtils.setViewportWidth(0);
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('mobile');
    });
  });
});
