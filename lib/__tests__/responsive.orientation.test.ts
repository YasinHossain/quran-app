import { renderHook } from '@testing-library/react';

import { useOrientation, getOrientationValue } from '@/lib/responsive';

import { testResponsiveHook } from './responsive-test-utils/hooks';

const orientationCases = [
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
  { device: 'Desktop Small', expected: 'landscape', description: 'Desktop returns landscape' },
] as const;

const renderUseOrientationWithoutWindow = (): 'portrait' | 'landscape' => {
  const originalWindow = global.window;
  const globalWithWindow = global as typeof globalThis & { window?: unknown };
  // @ts-expect-error – simulate SSR by removing window
  delete globalWithWindow.window;
  try {
    const { result } = renderHook(() => useOrientation());
    return result.current;
  } finally {
    (globalWithWindow as typeof globalThis).window = originalWindow;
  }
};

describe('Responsive Orientation', () => {
  it('useOrientation detects orientation correctly', async () => {
    await testResponsiveHook(() => useOrientation(), [...orientationCases]);
  });

  it('useOrientation handles SSR correctly', () => {
    expect(renderUseOrientationWithoutWindow()).toBe('portrait');
  });

  it('getOrientationValue returns orientation-specific value when available', () => {
    const config = { landscape: 'wide' };
    expect(getOrientationValue(config, 'default', 'landscape')).toBe('wide');
  });

  it('getOrientationValue falls back to default when missing', () => {
    const config = { portrait: 'tall' };
    expect(getOrientationValue(config, 'default', 'landscape')).toBe('default');
  });

  it('handles missing window object gracefully', () => {
    expect(() => {
      renderUseOrientationWithoutWindow();
    }).not.toThrow();
  });
});
