import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { SWRConfig } from 'swr';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useTafsirVerseData } from '@/app/(features)/tafsir/hooks/useTafsirVerseData';
import { SettingsProvider, useSettings } from '@/app/providers/SettingsContext';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { container } from '@/src/infrastructure/di/Container';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import type { Bookmark, Verse, Word } from '@/types';

jest.mock('@/lib/api/verses', () => ({
  getVerseById: jest.fn(),
  getVerseByKey: jest.fn(),
}));

jest.mock('@/app/providers/BookmarkContext', () => ({
  useBookmarks: () => ({
    chapters: [{ id: 2, name_simple: 'Al-Baqarah', verses_count: 286 }],
    updateBookmark: jest.fn(),
  }),
}));

jest.mock('@/app/(features)/tafsir/hooks/useTafsirOptions', () => ({
  useTafsirOptions: () => ({
    tafsirOptions: [{ id: 1, name: 'Sample Tafsir', lang: 'en' }],
    tafsirResource: { id: 1, name: 'Sample Tafsir', lang: 'en' },
    selectedTafsirName: 'Sample Tafsir',
  }),
}));

jest.mock('@/app/(features)/tafsir/hooks/useTranslationOptions', () => ({
  useTranslationOptions: () => ({
    translationOptions: [
      { id: 20, name: 'Translation 20', lang: 'en' },
      { id: 21, name: 'Translation 21', lang: 'en' },
    ],
    selectedTranslationName: 'Translation 20',
  }),
}));

jest.mock('@/app/(features)/tafsir/hooks/useWordTranslations', () => ({
  useWordTranslations: () => ({
    wordLanguageOptions: [
      { name: 'English', id: 85 },
      { name: 'French', id: 95 },
      { name: 'Turkish', id: 105 },
    ],
    wordLanguageMap: {
      english: 85,
      french: 95,
      turkish: 105,
    },
    selectedWordLanguageName: 'English',
    resetWordSettings: jest.fn(),
  }),
}));

jest.mock('@/app/(features)/tafsir/hooks/useVerseNavigation', () => ({
  useVerseNavigation: () => ({
    prev: null,
    next: null,
    navigate: jest.fn(),
    currentSurah: undefined,
  }),
}));

jest.mock('@/app/shared/hooks/useSingleVerse', () => {
  const actual = jest.requireActual('@/app/shared/hooks/useSingleVerse');
  return {
    ...actual,
    usePrefetchSingleVerse: () => async () => undefined,
  };
});

const { getVerseById, getVerseByKey } = jest.requireMock('@/lib/api/verses') as {
  getVerseById: jest.Mock;
  getVerseByKey: jest.Mock;
};

const createVersePayload = (
  target: string,
  translationIdsInput: number | number[],
  wordLang: LanguageCode
): Verse => {
  const translationIds = Array.isArray(translationIdsInput)
    ? translationIdsInput
    : [translationIdsInput];
  const verseKey = target.includes(':') ? target : target;
  const numericId = Number.parseInt(verseKey.replace(':', ''), 10) || translationIds[0] || 0;
  const audioUrl = `audio-${verseKey}`;
  const words: Word[] = [1, 2].map(
    (index) =>
      ({
        id: index,
        uthmani: `word-${index}`,
        [wordLang]: `${wordLang}-word-${index}`,
      }) as Word
  );
  return {
    id: numericId,
    verse_key: verseKey,
    text_uthmani: `uthmani-${verseKey}`,
    audio: { url: audioUrl },
    translations: translationIds.map((id) => ({
      resource_id: id,
      text: `translation-${id}`,
    })),
    words,
  };
};

const createWrapper = (): React.FC<React.PropsWithChildren> => {
  return ({ children }) => (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
        errorRetryInterval: 0,
        errorRetryCount: 0,
      }}
    >
      <SettingsProvider>{children}</SettingsProvider>
    </SWRConfig>
  );
};

const useBookmarkHarness = (bookmark: Bookmark) => {
  const state = useBookmarkVerse(bookmark);
  const { setTranslationIds, setWordLang, setShowByWords, settings } = useSettings();
  return {
    ...state,
    settings,
    setTranslationIds,
    setWordLang,
    setShowByWords,
  };
};

const useTafsirHarness = (surahId: string, ayahId: string) => {
  const state = useTafsirVerseData(surahId, ayahId);
  const { setTranslationIds, setWordLang, setShowByWords, settings } = useSettings();
  return {
    ...state,
    settings,
    setTranslationIds,
    setWordLang,
    setShowByWords,
  };
};

describe('Verse settings propagation', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }

    getVerseById.mockImplementation(
      (id: string, translationIds: number | number[], wordLang: LanguageCode) =>
        Promise.resolve(createVersePayload(String(id), translationIds, wordLang))
    );
    getVerseByKey.mockImplementation(
      (key: string, translationIds: number | number[], wordLang: LanguageCode) =>
        Promise.resolve(createVersePayload(key, translationIds, wordLang))
    );

    const tafsir = new Tafsir({ id: 1, name: 'Sample Tafsir', lang: 'en' });
    const repository: ITafsirRepository = {
      getAllResources: jest.fn(async () => [tafsir]),
      getResourcesByLanguage: jest.fn(async () => [tafsir]),
      getById: jest.fn(async () => tafsir),
      getTafsirByVerse: jest.fn(async () => '<p>Sample Tafsir</p>'),
      search: jest.fn(async () => [tafsir]),
      cacheResources: jest.fn(async () => undefined),
      getCachedResources: jest.fn(async () => [tafsir]),
    };
    container.setTafsirRepository(repository);
  });

  afterEach(() => {
    getVerseById.mockReset();
    getVerseByKey.mockReset();
    container.reset();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  it('updates bookmark verses when translation and word settings change', async () => {
    const wrapper = createWrapper();
    const bookmark: Bookmark = {
      verseId: '2:255',
      verseKey: '2:255',
      createdAt: Date.now(),
    };

    const { result } = renderHook(() => useBookmarkHarness(bookmark), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.verse?.translations?.map((t) => t.text)).toEqual(['translation-20'])
    );

    const initialAudio = result.current.verse?.audio?.url;
    expect(initialAudio).toBe('audio-2:255');

    act(() => result.current.setShowByWords(true));
    act(() => result.current.setTranslationIds([20, 21]));
    act(() => result.current.setWordLang('fr'));

    await waitFor(() =>
      expect(result.current.verse?.translations?.map((t) => t.text)).toEqual([
        'translation-20',
        'translation-21',
      ])
    );
    await waitFor(() =>
      expect(
        result.current.verse?.words?.map((word) => (word as Record<string, string>)['fr'])
      ).toEqual(['fr-word-1', 'fr-word-2'])
    );
    expect(result.current.verse?.audio?.url).toBe(initialAudio);
  });

  it('keeps pinned verse audio intact while applying new settings', async () => {
    const wrapper = createWrapper();
    const pinnedBookmark: Bookmark = {
      verseId: '3:7',
      verseKey: '3:7',
      createdAt: Date.now(),
    };

    const { result } = renderHook(() => useBookmarkHarness(pinnedBookmark), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.verse?.translations?.map((t) => t.text)).toEqual(['translation-20'])
    );

    const initialAudio = result.current.verse?.audio?.url;
    expect(initialAudio).toBe('audio-3:7');

    act(() => result.current.setTranslationIds([20, 21]));
    act(() => result.current.setWordLang('es'));

    await waitFor(() =>
      expect(result.current.verse?.translations?.map((t) => t.text)).toEqual([
        'translation-20',
        'translation-21',
      ])
    );
    await waitFor(() =>
      expect(
        result.current.verse?.words?.map((word) => (word as Record<string, string>)['es'])
      ).toEqual(['es-word-1', 'es-word-2'])
    );
    expect(result.current.verse?.audio?.url).toBe(initialAudio);
  });

  it('refreshes tafsir verse payloads to honor updated settings', async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(() => useTafsirHarness('2', '255'), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.verse?.translations?.map((t) => t.text)).toEqual(['translation-20'])
    );

    const initialAudio = result.current.verse?.audio?.url;
    expect(initialAudio).toBe('audio-2:255');

    act(() => result.current.setShowByWords(true));
    act(() => result.current.setTranslationIds([20, 21]));
    act(() => result.current.setWordLang('tr'));

    await waitFor(() =>
      expect(result.current.verse?.translations?.map((t) => t.text)).toEqual([
        'translation-20',
        'translation-21',
      ])
    );
    await waitFor(() =>
      expect(
        result.current.verse?.words?.map((word) => (word as Record<string, string>)['tr'])
      ).toEqual(['tr-word-1', 'tr-word-2'])
    );
    expect(result.current.verse?.audio?.url).toBe(initialAudio);
  });
});
