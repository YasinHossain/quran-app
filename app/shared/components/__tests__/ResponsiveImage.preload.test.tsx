import { renderHook } from '@testing-library/react';

import './test-helpers';
import { useImagePreload } from '@/app/shared/hooks/image/useImagePreload';

describe('useImagePreload', () => {
  let originalImage: typeof Image;
  let created: Array<{ src: string }>;

  class MockImage {
    src = '';
    constructor() {
      created.push(this);
    }
  }

  beforeEach(() => {
    created = [];
    originalImage = window.Image;
    // @ts-expect-error override for testing
    window.Image = MockImage as unknown as typeof Image;
  });

  afterEach(() => {
    window.Image = originalImage;
  });

  it('preloads images when condition is true', () => {
    const sources = ['/image1.jpg', '/image2.jpg'];
    renderHook(() => useImagePreload(sources, true));
    expect(created.map((img) => img.src)).toEqual(sources);
  });

  it('does not preload when condition is false', () => {
    renderHook(() => useImagePreload(['/image3.jpg'], false));
    expect(created).toHaveLength(0);
  });

  it('cleans up preloaded images on unmount', () => {
    const { unmount } = renderHook(() => useImagePreload(['/cleanup.jpg'], true));
    expect(created[0].src).toBe('/cleanup.jpg');
    unmount();
    expect(created[0].src).toBe('');
  });

  it('handles empty sources array', () => {
    renderHook(() => useImagePreload([], true));
    expect(created).toHaveLength(0);
  });
});
