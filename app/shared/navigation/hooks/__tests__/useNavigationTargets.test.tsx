import { act, renderHook } from '@testing-library/react';

import { useNavigationTargets } from '@/app/shared/navigation/hooks/useNavigationTargets';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('useNavigationTargets', () => {
  it('returns href builders that match route helpers', () => {
    const { result } = renderHook(() => useNavigationTargets());
    expect(result.current.getSurahHref(5)).toBe('/surah/5');
    expect(result.current.getJuzHref(3)).toBe('/juz/3');
    expect(result.current.getPageHref(200)).toBe('/page/200');
  });

  it('pushes routes via router when actions are invoked', () => {
    const push = jest.fn();
    const mockedRouter = require('next/navigation').useRouter as jest.Mock;
    mockedRouter.mockReturnValue({ push });

    const { result } = renderHook(() => useNavigationTargets());

    act(() => {
      result.current.goToSurah(1);
      result.current.goToJuz(2);
      result.current.goToPage(3);
    });

    expect(push).toHaveBeenNthCalledWith(1, '/surah/1');
    expect(push).toHaveBeenNthCalledWith(2, '/juz/2');
    expect(push).toHaveBeenNthCalledWith(3, '/page/3');
  });
});
