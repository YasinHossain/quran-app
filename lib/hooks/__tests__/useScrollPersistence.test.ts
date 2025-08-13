import { renderHook, act } from '@testing-library/react';
import useScrollPersistence from '@/lib/hooks/useScrollPersistence';

type Tab = 'Surah' | 'Juz' | 'Page';

describe('useScrollPersistence', () => {
  const scrollRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;
  const scrollTops: Record<Tab, number> = { Surah: 0, Juz: 0, Page: 0 };
  const setScrollTops: Record<Tab, jest.Mock> = {
    Surah: jest.fn((top: number) => {
      scrollTops.Surah = top;
    }),
    Juz: jest.fn((top: number) => {
      scrollTops.Juz = top;
    }),
    Page: jest.fn((top: number) => {
      scrollTops.Page = top;
    }),
  };
  const storageKeys: Record<Tab, string> = {
    Surah: 'surahScrollTop',
    Juz: 'juzScrollTop',
    Page: 'pageScrollTop',
  };

  beforeEach(() => {
    sessionStorage.clear();
    Object.values(setScrollTops).forEach((fn) => fn.mockClear());
    scrollTops.Surah = 0;
    scrollTops.Juz = 0;
    scrollTops.Page = 0;
  });

  it('restores scroll position from sessionStorage', () => {
    sessionStorage.setItem('surahScrollTop', '30');
    renderHook(() =>
      useScrollPersistence<Tab>({
        scrollRef,
        activeTab: 'Surah',
        scrollTops,
        setScrollTops,
        storageKeys,
      })
    );
    expect(scrollRef.current?.scrollTop).toBe(30);
  });

  it('stores scroll on scroll event', () => {
    const { result } = renderHook(() =>
      useScrollPersistence<Tab>({
        scrollRef,
        activeTab: 'Surah',
        scrollTops,
        setScrollTops,
        storageKeys,
      })
    );

    act(() => {
      result.current.handleScroll({
        currentTarget: { scrollTop: 42 },
      } as React.UIEvent<HTMLDivElement>);
    });
    expect(setScrollTops.Surah).toHaveBeenCalledWith(42);
    expect(sessionStorage.getItem('surahScrollTop')).toBe('42');
  });

  it('prepares for tab switch', () => {
    const { result } = renderHook(() =>
      useScrollPersistence<Tab>({
        scrollRef,
        activeTab: 'Surah',
        scrollTops,
        setScrollTops,
        storageKeys,
      })
    );
    act(() => {
      scrollRef.current!.scrollTop = 15;
      result.current.prepareForTabSwitch();
    });
    expect(setScrollTops.Surah).toHaveBeenCalledWith(15);
  });

  it('remembers scroll for a tab', () => {
    const { result } = renderHook(() =>
      useScrollPersistence<Tab>({
        scrollRef,
        activeTab: 'Surah',
        scrollTops,
        setScrollTops,
        storageKeys,
      })
    );
    act(() => {
      scrollRef.current!.scrollTop = 25;
      result.current.rememberScroll('Page');
    });
    expect(setScrollTops.Page).toHaveBeenCalledWith(25);
    expect(sessionStorage.getItem('pageScrollTop')).toBe('25');
  });
});
