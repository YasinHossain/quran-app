import { renderHook, act } from '@testing-library/react';
import useVerseListing from '@/app/(features)/surah/hooks/useVerseListing';
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

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: [] })),
}));

jest.mock('swr/infinite', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [{ verses, totalPages: 1 }],
    size: 1,
    setSize: jest.fn(),
    isValidating: false,
  })),
}));

jest.mock('@/app/(features)/player/context/AudioContext', () => ({
  useAudio: () => ({
    activeVerse: mockActiveVerse,
    setActiveVerse,
    reciter: { name: 'Reciter', path: 'reciter' },
    isPlayerVisible: true,
    openPlayer,
  }),
}));

jest.mock('@/lib/api', () => ({
  getTranslations: jest.fn().mockResolvedValue([]),
  getWordTranslations: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/app/providers/SettingsContext', () => ({
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
