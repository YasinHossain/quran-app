import { useCallback, type Dispatch, type SetStateAction } from 'react';

import { updateBookmarkInFolders } from '@/app/providers/bookmarks/bookmark-utils';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';

import type { Bookmark, Chapter, Folder, Verse } from '@/types';

const FALLBACK_TRANSLATION_ID = 20;
const COMPOSITE_KEY_PATTERN = /:|[^0-9]/;

function resolveTranslationId(settings: {
  translationIds: number[];
  translationId?: number;
}): number {
  const [firstPreferred] = settings.translationIds;
  if (firstPreferred !== undefined) {
    return firstPreferred;
  }
  if (settings.translationId !== undefined) {
    return settings.translationId;
  }
  return FALLBACK_TRANSLATION_ID;
}

async function fetchVerseDetails(verseId: string, translationId: number): Promise<Verse> {
  const shouldLookupByKey = COMPOSITE_KEY_PATTERN.test(verseId);
  return shouldLookupByKey
    ? getVerseByKey(verseId, translationId)
    : getVerseById(verseId, translationId);
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
  settings: { translationIds: number[]; translationId?: number },
  setFolders: Dispatch<SetStateAction<Folder[]>>,
  setPinnedVerses: Dispatch<SetStateAction<Bookmark[]>>
): (verseId: string, chaptersList: Chapter[]) => Promise<void> {
  const { translationIds, translationId } = settings;

  return useCallback(
    async (verseId: string, chaptersList: Chapter[]) => {
      try {
        const translationConfig =
          translationId !== undefined ? { translationIds, translationId } : { translationIds };

        const resolvedTranslationId = resolveTranslationId(translationConfig);
        const verse = await fetchVerseDetails(verseId, resolvedTranslationId);
        const metadata = buildBookmarkMetadata(verse, chaptersList);

        setFolders((prev) => updateBookmarkInFolders(prev, verseId, metadata));
        setPinnedVerses((prev) =>
          prev.map((b) => (b.verseId === verseId ? { ...b, ...metadata } : b))
        );
      } catch {
        // Silent fail for metadata fetch errors
      }
    },
    [translationIds, translationId, setFolders, setPinnedVerses]
  );
}
