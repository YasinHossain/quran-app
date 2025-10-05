import { renderHook, act } from '@testing-library/react';

import { useBottomSheetHandlers } from '@/app/shared/navigation/hooks/useBottomSheetHandlers';

const mockGoToSurah = jest.fn();
const mockGoToJuz = jest.fn();
const mockGoToPage = jest.fn();

jest.mock('@/app/shared/navigation/hooks/useNavigationTargets', () => ({
  useNavigationTargets: () => ({
    goToSurah: mockGoToSurah,
    goToJuz: mockGoToJuz,
    goToPage: mockGoToPage,
    getSurahHref: jest.fn(),
    getJuzHref: jest.fn(),
    getPageHref: jest.fn(),
  }),
}));

describe('useBottomSheetHandlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const onClose = jest.fn();
  const onSurahSelect = jest.fn();

  it('invokes navigation targets when handlers run', () => {
    const { result } = renderHook(() => useBottomSheetHandlers(onClose, onSurahSelect));

    act(() => {
      result.current.handleSurahClick(1);
      result.current.handleJuzClick(2);
      result.current.handlePageClick(3);
    });

    expect(onSurahSelect).toHaveBeenCalledWith(1);
    expect(mockGoToSurah).toHaveBeenCalledWith(1);
    expect(mockGoToJuz).toHaveBeenCalledWith(2);
    expect(mockGoToPage).toHaveBeenCalledWith(3);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
