import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';

import { updateBookmarkInFolders } from '@/app/providers/bookmarks/bookmark-utils';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Bookmark, Chapter, Folder, Settings, Verse } from '@/types';

const sameVerseId = (a: string | number, b: string | number): boolean => String(a) === String(b);

const FALLBACK_TRANSLATION_ID = 20;
const COMPOSITE_KEY_PATTERN = /:|[^0-9]/;

function resolveTranslationIds(settings: {
  translationIds: number[];
  translationId?: number;
}): number[] {
  if (settings.translationIds.length > 0) {
    return [...settings.translationIds];
  }
  if (settings.translationId !== undefined) {
    return [settings.translationId];
  }
  return [FALLBACK_TRANSLATION_ID];
}

const inferVerseKeyFromId = (rawId: string, chaptersList: Chapter[]): string | null => {
  const numericId = Number.parseInt(rawId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return null;
  }

  let remaining = numericId;
  const orderedChapters = [...chaptersList].sort((a, b) => a.id - b.id);

  for (const chapter of orderedChapters) {
    if (remaining <= chapter.verses_count) {
      return `${chapter.id}:${remaining}`;
    }
    remaining -= chapter.verses_count;
  }

  return null;
};

async function fetchVerseDetails(
  verseId: string,
  translationIds: number[],
  chaptersList: Chapter[],
  wordLang: LanguageCode
): Promise<Verse> {
  const shouldLookupByKey = COMPOSITE_KEY_PATTERN.test(verseId);
  const translationsParam = translationIds.length ? [...translationIds] : [FALLBACK_TRANSLATION_ID];

  if (shouldLookupByKey) {
    return getVerseByKey(verseId, translationsParam, wordLang);
  }

  const inferredKey = inferVerseKeyFromId(verseId, chaptersList);
  if (inferredKey) {
    try {
      return await getVerseByKey(inferredKey, translationsParam, wordLang);
    } catch {
      // Fall back to direct ID lookup if key fetch fails
    }
  }

  return getVerseById(verseId, translationsParam, wordLang);
}

function buildBookmarkMetadata(verse: Verse, chaptersList: Chapter[]): Partial<Bookmark> {
  const [surahIdStr = '0'] = verse.verse_key.split(':');
  const surahId = Number.parseInt(surahIdStr, 10);
  const surahInfo = chaptersList.find((chapter) => chapter.id === surahId);

  const metadata: Partial<Bookmark> = {
    verseKey: verse.verse_key,
    verseText: verse.text_uthmani,
    surahName: surahInfo?.name_simple ?? `Surah ${surahId}`,
    verseApiId: verse.id,
  };

  const primaryTranslation = verse.translations?.[0]?.text;
  if (primaryTranslation !== undefined) {
    metadata.translation = primaryTranslation;
  }

  return metadata;
}

export function useBookmarkMetadata(
  settings: Settings,
  setFolders: Dispatch<SetStateAction<Folder[]>>,
  setPinnedVerses: Dispatch<SetStateAction<Bookmark[]>>
): (verseId: string, chaptersList: Chapter[]) => Promise<void> {
  const resolvedTranslationIds = useMemo(
    () => resolveTranslationIds(settings),
    [settings.translationIds, settings.translationId]
  );
  const wordLang = useMemo(() => ensureLanguageCode(settings.wordLang), [settings.wordLang]);

  return useCallback(
    async (verseId: string, chaptersList: Chapter[]) => {
      try {
        const verse = await fetchVerseDetails(
          verseId,
          resolvedTranslationIds,
          chaptersList,
          wordLang
        );
        const metadata = buildBookmarkMetadata(verse, chaptersList);

        setFolders((prev) => updateBookmarkInFolders(prev, verseId, metadata));
        setPinnedVerses((prev) =>
          prev.map((b) => (sameVerseId(b.verseId, verseId) ? { ...b, ...metadata } : b))
        );
      } catch {
        // Silent fail for metadata fetch errors
      }
    },
    [wordLang, resolvedTranslationIds, setFolders, setPinnedVerses]
  );
}
