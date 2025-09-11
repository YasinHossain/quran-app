import { act, renderHook } from '@testing-library/react';

import { useScrollCentering } from '@/lib/hooks/useScrollCentering';

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

const scrollRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;

const createEls = (): { surahEl: HTMLDivElement; juzEl: HTMLDivElement } => {
  const surahEl = document.createElement('div');
  const juzEl = document.createElement('div');
  surahEl.scrollIntoView = jest.fn();
  juzEl.scrollIntoView = jest.fn();
  scrollRef.current!.innerHTML = '';
  scrollRef.current!.appendChild(surahEl);
  scrollRef.current!.appendChild(juzEl);
  return { surahEl, juzEl };
};

const setupRects = (container: DOMRect, target: DOMRect, el: HTMLElement): void => {
  jest.spyOn(scrollRef.current!, 'getBoundingClientRect').mockReturnValue(container);
  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(target);
};

describe('useScrollCentering - core behavior', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
    scrollRef.current!.innerHTML = '';
  });

  it('centers active element on initial render when outside view', () => {
    const { surahEl } = createEls();
    surahEl.dataset.active = 'true';
    setupRects(makeRect(0, 100), makeRect(200, 250), surahEl);

    renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 0, Juz: 0, Page: 0 },
      })
    );
    expect(surahEl.scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
  });

  it('does not recenter when element is already in view after scrolling', () => {
    const { surahEl } = createEls();
    surahEl.dataset.active = 'true';
    setupRects(makeRect(0, 100), makeRect(10, 20), surahEl);

    renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 50, Juz: 0, Page: 0 },
      })
    );
    expect(surahEl.scrollIntoView).not.toHaveBeenCalled();
  });
});

describe('useScrollCentering - tab switching', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
    scrollRef.current!.innerHTML = '';
  });

  it('centers element after switching tabs', () => {
    const { surahEl, juzEl } = createEls();
    surahEl.dataset.active = 'true';
    setupRects(makeRect(0, 100), makeRect(200, 250), juzEl);

    const { result, rerender } = renderHook(
      ({ activeTab }) =>
        useScrollCentering<Tab>({
          scrollRef,
          activeTab,
          selectedIds: { Surah: 1, Juz: 1, Page: null },
          scrollTops: { Surah: 0, Juz: 0, Page: 0 },
        }),
      { initialProps: { activeTab: 'Surah' as Tab } }
    );
    act(() => result.current.prepareForTabSwitch('Juz'));
    delete surahEl.dataset.active;
    juzEl.dataset.active = 'true';
    rerender({ activeTab: 'Juz' });
    expect(juzEl.scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
  });
});

describe('useScrollCentering - helpers', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
    scrollRef.current!.innerHTML = '';
  });

  it('skipNextCentering prevents centering and clears the session flag', () => {
    const { surahEl } = createEls();
    surahEl.dataset.active = 'true';
    setupRects(makeRect(0, 100), makeRect(200, 250), surahEl);
    sessionStorage.setItem('skipCenterSurah', '1');

    renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 0, Juz: 0, Page: 0 },
      })
    );
    expect(surahEl.scrollIntoView).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('skipCenterSurah')).toBeNull();
  });

  it('exposes skipNextCentering helper', () => {
    const { result } = renderHook(() =>
      useScrollCentering<Tab>({
        scrollRef,
        activeTab: 'Surah',
        selectedIds: { Surah: 1, Juz: null, Page: null },
        scrollTops: { Surah: 0, Juz: 0, Page: 0 },
      })
    );
    act(() => result.current.skipNextCentering('Surah'));
    expect(sessionStorage.getItem('skipCenterSurah')).toBe('1');
  });
});
