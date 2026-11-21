import { getPhysicalScrollState } from '../useTabsScroll';

const overflow = { scrollWidth: 600, clientWidth: 200 };

describe('getPhysicalScrollState', () => {
  it('in LTR, tabs start at the left edge and overflow to the right', () => {
    expect(getPhysicalScrollState({ ...overflow, scrollLeft: 0, isRtl: false })).toEqual({
      canScrollLeft: false,
      canScrollRight: true,
    });
    expect(getPhysicalScrollState({ ...overflow, scrollLeft: 400, isRtl: false })).toEqual({
      canScrollLeft: true,
      canScrollRight: false,
    });
  });

  it('in RTL, tabs start at the right edge and overflow to the left', () => {
    expect(getPhysicalScrollState({ ...overflow, scrollLeft: 0, isRtl: true })).toEqual({
      canScrollLeft: true,
      canScrollRight: false,
    });
    expect(getPhysicalScrollState({ ...overflow, scrollLeft: -400, isRtl: true })).toEqual({
      canScrollLeft: false,
      canScrollRight: true,
    });
    expect(getPhysicalScrollState({ ...overflow, scrollLeft: -200, isRtl: true })).toEqual({
      canScrollLeft: true,
      canScrollRight: true,
    });
  });

  it('reports nothing to scroll when the tabs fit', () => {
    expect(
      getPhysicalScrollState({ scrollWidth: 200, clientWidth: 200, scrollLeft: 0, isRtl: true })
    ).toEqual({ canScrollLeft: false, canScrollRight: false });
  });
});
