import React from 'react';

import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';
import { defaultSettings } from '@/app/providers/settingsStorage';
import { DEFAULT_RECITER } from '@/app/shared/player/hooks/useReciters';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import type { UseVerseListingReturn } from '@/app/(features)/surah/hooks/useVerseListing';
import type { Verse } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('SurahVerseList', () => {
  const createVerseListing = (
    overrides: Partial<UseVerseListingReturn> = {}
  ): UseVerseListingReturn => ({
    mode: 'infinite',
    error: null,
    setError: jest.fn(),
    isLoading: false,
    verses: [],
    isValidating: false,
    isReachingEnd: false,
    loadMoreRef: { current: null },
    totalVerses: undefined,
    perPage: 20,
    apiPageToVersesMap: {},
    setApiPageToVersesMap: jest.fn(),
    lookup: jest.fn().mockResolvedValue({ verses: [], totalPages: 1 }),
    resourceId: undefined,
    translationIds: [20],
    wordLang: 'en',
    initialVerses: undefined,
    translationOptions: [],
    wordLanguageOptions: [],
    wordLanguageMap: {},
    settings: defaultSettings,
    setSettings: jest.fn(),
    activeVerse: null,
    reciter: DEFAULT_RECITER,
    isPlayerVisible: false,
    handleNext: jest.fn(() => false),
    handlePrev: jest.fn(() => false),
    ...overrides,
  });

  it('shows spinner while loading', () => {
    renderWithProviders(<SurahVerseList verseListing={createVerseListing({ isLoading: true })} />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('shows error state', () => {
    renderWithProviders(
      <SurahVerseList verseListing={createVerseListing({ error: 'Failed to load content.' })} />
    );
    expect(screen.getByText(/Failed to load content/)).toBeInTheDocument();
  });

  it('renders verses and end-of-surah indicator', () => {
    const verseListing = createVerseListing({
      verses: [
        {
          id: 1,
          verse_key: '1:1',
          text_uthmani: '',
          words: [],
          translations: [],
        } as Verse,
      ],
      isReachingEnd: true,
    });

    renderWithProviders(<SurahVerseList verseListing={verseListing} />);

    // Verse container rendered
    expect(document.querySelector('#verse-1')).toBeInTheDocument();
    expect(document.querySelector('[data-virtuoso-mock]')).toBeInTheDocument();
  });
});
