import { renderHook } from '@testing-library/react';
import useScrollCentering from '@/lib/hooks/useScrollCentering';

type Tab = 'Surah' | 'Juz' | 'Page';

const makeRect = (top: number, bottom: number): DOMRect => ({
  top,
  bottom,
  left: 0,
  right: 0,
  width: 0,
  height: bottom - top,
  x: 0,
  y: top,
  toJSON: () => ({}),
});

describe('useScrollCentering', () => {
  const scrollRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    scrollRef.current!.innerHTML = '';
    sessionStorage.clear();
  });

  const setup = () => {
    const activeEl = document.createElement('div');
    activeEl.dataset.active = 'true';
    activeEl.scrollIntoView = jest.fn();
    scrollRef.current!.appendChild(activeEl);
    jest.spyOn(scrollRef.current!, 'getBoundingClientRect').mockReturnValue(makeRect(0, 100));
    jest.spyOn(activeEl, 'getBoundingClientRect').mockReturnValue(makeRect(200, 250));
    return activeEl;
  };

  it('centers active element when outside view', () => {
    const activeEl = setup();
    renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 0, Juz: 0, Page: 0 },
      })
    );
    expect(activeEl.scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
  });

  it('skips centering when flag is set', () => {
    sessionStorage.setItem('skipCenterSurah', '1');
    const activeEl = setup();
    renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 0, Juz: 0, Page: 0 },
      })
    );
    expect(activeEl.scrollIntoView).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('skipCenterSurah')).toBeNull();
  });

  it('exposes skipNextCentering', () => {
    const { result } = renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 0, Juz: 0, Page: 0 },
      })
    );
    result.current.skipNextCentering('Surah');
    expect(sessionStorage.getItem('skipCenterSurah')).toBe('1');
  });
});
