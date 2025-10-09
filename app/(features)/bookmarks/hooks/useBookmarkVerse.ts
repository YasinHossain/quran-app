import { useState, useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { Bookmark, Chapter } from '@/types';

type VerseTranslation = { text?: string };
interface VerseApiResponse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations?: VerseTranslation[];
}

function isBookmarkComplete(b: Bookmark): boolean {
  return Boolean(b.verseText && b.surahName && b.translation && b.verseKey && b.verseApiId);
}

function getPrimaryTranslationId(settings: {
  translationIds: number[];
  translationId?: number;
}): number {
  return settings.translationIds[0] || settings.translationId || 20;
}

function isCompositeVerseId(id: string): boolean {
  return /:/.test(id) || /[^0-9]/.test(id);
}

const inferVerseKeyFromId = (rawId: string, chapters: Chapter[]): string | null => {
  const numericId = Number.parseInt(rawId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;

  let remaining = numericId;
  const orderedChapters = [...chapters].sort((a, b) => a.id - b.id);

  for (const chapter of orderedChapters) {
    if (remaining <= chapter.verses_count) {
      return `${chapter.id}:${remaining}`;
    }
    remaining -= chapter.verses_count;
  }

  return null;
};

async function fetchVerseByIdOrKey(
  verseId: string,
  translationId: number,
  chapters: Chapter[]
): Promise<VerseApiResponse> {
  if (isCompositeVerseId(verseId)) {
    return getVerseByKey(verseId, translationId);
  }

  const inferredKey = inferVerseKeyFromId(verseId, chapters);
  if (inferredKey) {
    try {
      return await getVerseByKey(inferredKey, translationId);
    } catch {
      // Fallback to direct ID lookup
    }
  }

  return getVerseById(verseId, translationId);
}

function findSurahNameFromKey(verseKey: string, chapters: Chapter[]): string {
  const [surahIdStr] = verseKey.split(':');
  const surah = surahIdStr ? chapters.find((c) => c.id === parseInt(surahIdStr, 10)) : undefined;
  return surah?.name_simple || `Surah ${surahIdStr || ''}`;
}

interface UseBookmarkVerseReturn {
  bookmark: Bookmark;
  isLoading: boolean;
  error: string | null;
}

export function useBookmarkVerse(bookmark: Bookmark, chapters: Chapter[]): UseBookmarkVerseReturn {
  const { settings } = useSettings();
  const { translationIds, translationId } = settings;
  const { updateBookmark } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerseData = async (): Promise<void> => {
      if (isBookmarkComplete(bookmark)) return;
      if (chapters.length === 0) return;

      setIsLoading(true);
      setError(null);
      try {
        const primaryTransId = getPrimaryTranslationId({ translationIds, translationId });
        const verse = await fetchVerseByIdOrKey(bookmark.verseId, primaryTransId, chapters);
        const surahName = findSurahNameFromKey(verse.verse_key, chapters);
        updateBookmark(bookmark.verseId, {
          verseKey: verse.verse_key,
          verseText: verse.text_uthmani,
          surahName,
          ...(verse.translations?.[0]?.text && { translation: verse.translations[0].text }),
          verseApiId: verse.id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch verse');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerseData();
  }, [bookmark, translationIds, translationId, updateBookmark, chapters]);

  return { bookmark, isLoading, error };
}
