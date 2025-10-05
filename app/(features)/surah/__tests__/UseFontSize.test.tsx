import { renderHook } from '@testing-library/react';

import useFontSize from '@/app/(features)/surah/hooks/useFontSize';

describe('useFontSize', () => {
  it('returns 0% at the minimum boundary', () => {
    const { result } = renderHook(() => useFontSize(10, 10, 20));
    expect(result.current.percentage).toBe(0);
  });

  it('returns 100% at the maximum boundary', () => {
    const { result } = renderHook(() => useFontSize(20, 10, 20));
    expect(result.current.percentage).toBe(100);
  });

  it('clamps values outside the range', () => {
    const below = renderHook(() => useFontSize(5, 10, 20));
    const above = renderHook(() => useFontSize(25, 10, 20));

    expect(below.result.current.percentage).toBe(0);
    expect(above.result.current.percentage).toBe(100);
  });
});
