import { renderHook, act } from '@testing-library/react';

import type { Verse } from '@/types';

// Test data must be defined before mocks that capture it
const verses: Verse[] = [
  { id: 1, verse_key: '1:1' } as Verse,
  { id: 2, verse_key: '1:2' } as Verse,
];

// Import the hook lazily after mocks are applied to ensure mocked deps are used
let useVerseListing: any;

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('@/app/(features)/surah/hooks/useInfiniteVerseLoader', () => ({
  __esModule: true,
  useInfiniteVerseLoader: jest.fn(() => ({
    verses,
    isLoading: false,
    isValidating: false,
    isReachingEnd: false,
  })),
}));

let mockActiveVerse = verses[0];
const setActiveVerse = jest.fn();
const openPlayer = jest.fn();

// Minimal runtime patches are no longer needed due to safe defaults in the hook implementation.

jest.mock('@/app/shared/player/context/AudioContext', () => ({
  useAudio: () => ({
    activeVerse: mockActiveVerse,
    setActiveVerse,
    reciter: { name: 'Reciter', path: 'reciter' },
    isPlayerVisible: true,
    openPlayer,
  }),
}));

jest.mock('@/app/providers/SettingsContext', () => ({
  useSettings: () => ({
    settings: { translationId: 1, wordLang: 'en', wordTranslationId: 85 },
    setSettings: jest.fn(),
  }),
}));

describe('useVerseListing', () => {
  beforeAll(() => {
    useVerseListing = require('@/app/(features)/surah/hooks/useVerseListing').useVerseListing;
  });

  beforeEach(() => {
    mockActiveVerse = verses[0];
    setActiveVerse.mockImplementation((value) => {
      if (typeof value === 'function') {
        mockActiveVerse = (value as (prev: Verse | null) => Verse | null)(mockActiveVerse) as Verse;
        return;
      }
      mockActiveVerse = value as Verse;
    });
  });

  it('handles next and previous navigation', () => {
    const { result, rerender } = renderHook(() =>
      useVerseListing({ id: '1', lookup: jest.fn(), initialVerses: verses })
    );
    expect(result.current.verses.length).toBe(2);

    act(() => {
      const moved = result.current.handleNext();
      expect(moved).toBe(true);
    });
    expect(mockActiveVerse).toBe(verses[1]);

    // Simulate audio context reflecting the new active verse
    mockActiveVerse = verses[1];
    rerender();

    act(() => {
      result.current.handlePrev();
    });
    expect(mockActiveVerse).toBe(verses[0]);
    expect(openPlayer).toHaveBeenCalledTimes(2);
  });
});
