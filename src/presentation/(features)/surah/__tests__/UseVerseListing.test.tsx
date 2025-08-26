import { renderHook, act } from '@testing-library/react';
import useVerseListing from '@/presentation/(features)/surah/hooks/useVerseListing';
import type { Verse } from '@/types';

const verses: Verse[] = [
  { id: 1, verse_key: '1:1' } as Verse,
  { id: 2, verse_key: '1:2' } as Verse,
];

let mockActiveVerse = verses[0];
const setActiveVerse = jest.fn((v) => {
  mockActiveVerse = v as Verse;
});
const openPlayer = jest.fn();

jest.mock('@/presentation/(features)/surah/hooks/useTranslationOptions', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    translationOptions: [],
    wordLanguageOptions: [],
    wordLanguageMap: {},
  })),
}));

jest.mock('@/presentation/(features)/surah/hooks/useInfiniteVerseLoader', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    verses,
    isLoading: false,
    isValidating: false,
    isReachingEnd: false,
  })),
}));

jest.mock('@/presentation/shared/player/context/AudioContext', () => ({
  useAudio: () => ({
    activeVerse: mockActiveVerse,
    setActiveVerse,
    reciter: { name: 'Reciter', path: 'reciter' },
    isPlayerVisible: true,
    openPlayer,
  }),
}));

jest.mock('@/presentation/providers/SettingsContext', () => ({
  useSettings: () => ({
    settings: { translationId: 1, wordLang: 'en', wordTranslationId: 85 },
    setSettings: jest.fn(),
  }),
}));

describe('useVerseListing', () => {
  it('handles next and previous navigation', () => {
    const { result, rerender } = renderHook(() => useVerseListing({ id: '1', lookup: jest.fn() }));

    act(() => {
      result.current.handleNext();
    });
    expect(setActiveVerse).toHaveBeenNthCalledWith(1, verses[1]);

    rerender();

    act(() => {
      result.current.handlePrev();
    });
    expect(setActiveVerse).toHaveBeenNthCalledWith(2, verses[0]);
    expect(openPlayer).toHaveBeenCalledTimes(2);
  });
});
