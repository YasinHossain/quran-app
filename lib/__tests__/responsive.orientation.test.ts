import { renderHook } from '@testing-library/react';

import { useOrientation, getOrientationValue } from '../responsive';
import { testResponsiveHook } from './responsive/test-utils';

describe('Responsive Orientation', () => {
  describe('useOrientation', () => {
    it('detects orientation correctly', async () => {
      await testResponsiveHook(
        () => useOrientation(),
        [
          {
            device: 'iPhone 12 Pro',
            expected: 'portrait',
            description: 'Portrait device returns portrait',
          },
          {
            device: 'iPhone 12 Pro Landscape',
            expected: 'landscape',
            description: 'Landscape device returns landscape',
          },
          {
            device: 'Desktop Small',
            expected: 'landscape',
            description: 'Desktop returns landscape',
          },
        ]
      );
    });

    it('handles SSR correctly', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('portrait');

      globalWithWindow.window = originalWindow;
    });
  });

  describe('getOrientationValue', () => {
    it('returns orientation-specific value when available', () => {
      const config = { landscape: 'wide' };
      expect(getOrientationValue(config, 'default', 'landscape')).toBe('wide');
    });

    it('falls back to default when orientation value is missing', () => {
      const config = { portrait: 'tall' };
      expect(getOrientationValue(config, 'default', 'landscape')).toBe('default');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing window object', () => {
      const originalWindow = global.window;
      const globalWithWindow = global as typeof globalThis & { window?: unknown };
      delete globalWithWindow.window;

      expect(() => {
        renderHook(() => useOrientation());
      }).not.toThrow();

      globalWithWindow.window = originalWindow;
    });
  });
});
