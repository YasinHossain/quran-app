import React from 'react';
import { renderToString } from 'react-dom/server';

import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';
import { defaultSettings } from '@/app/providers/settingsStorage';
import { DEFAULT_RECITER } from '@/app/shared/player/hooks/useReciters';
import { ReaderServerDataProvider } from '@/app/shared/reader/ReaderServerData';
import {
  renderWithProviders,
  renderWithProvidersAsync,
  screen,
  TestProviders,
} from '@/app/testUtils/renderWithProviders';

import type { UseVerseListingReturn } from '@/app/(features)/surah/hooks/useVerseListing';
import type { PrerenderedVerse, Verse } from '@/types';

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

  describe('server render of a long surah', () => {
    const SURAH_ID = 2;
    const TOTAL = 286;
    const keyOf = (n: number): string => `${SURAH_ID}:${n}`;
    const fullVerse = (n: number): Verse =>
      ({
        id: 1000 + n,
        verse_key: keyOf(n),
        verse_number: n,
        text_uthmani: `arabic-${n}`,
        words: [],
        translations: [{ resource_id: 20, text: `translation-${n}` }],
      }) as Verse;
    const prerendered: PrerenderedVerse[] = Array.from({ length: TOTAL }, (_, i) => ({
      verseKey: keyOf(i + 1),
      arabic: `arabic-${i + 1}`,
      translations: [{ resourceId: 20, html: `translation-${i + 1}` }],
    }));
    const firstPage = Array.from({ length: 10 }, (_, i) => fullVerse(i + 1));

    const renderList = (): React.JSX.Element => (
      <ReaderServerDataProvider verses={prerendered}>
        <SurahVerseList
          surahId={SURAH_ID}
          resourceKind="surah"
          verseListing={createVerseListing({
            mode: 'quran-com',
            resourceId: String(SURAH_ID),
            totalVerses: TOTAL,
            perPage: 10,
            verses: firstPage,
            initialVerses: firstPage,
            apiPageToVersesMap: { 1: firstPage },
            isReachingEnd: true,
          })}
        />
      </ReaderServerDataProvider>
    );

    // Verse keys in document order: virtualized rows (#verse-<id>) and prerendered text rows.
    const collectVerseKeys = (root: ParentNode): string[] =>
      Array.from(root.querySelectorAll('[id^="verse-"], [data-verse-key]')).map((el) => {
        const key = el.getAttribute('data-verse-key');
        if (key) return key;
        const id = Number(el.id.replace('verse-', ''));
        return keyOf(id - 1000);
      });

    it('includes every verse once, in order, with Arabic and translation text', () => {
      const container = document.createElement('div');
      container.innerHTML = renderToString(<TestProviders>{renderList()}</TestProviders>);

      const expectedKeys = Array.from({ length: TOTAL }, (_, i) => keyOf(i + 1));
      expect(collectVerseKeys(container)).toEqual(expectedKeys);
      expect(container.textContent).toContain('arabic-286');
      expect(container.textContent).toContain('translation-286');
    });

    it('drops the prerendered text on a client render, leaving the virtualized list', async () => {
      await renderWithProvidersAsync(renderList());

      expect(document.querySelector('[data-verse-key]')).not.toBeInTheDocument();
      expect(document.querySelector('#verse-1001')).toBeInTheDocument();
    });
  });
});
