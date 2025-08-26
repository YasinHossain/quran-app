import { useState, useEffect } from 'react';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Bookmark, Chapter } from '@/types';

interface UseBookmarkVerseReturn {
  bookmark: Bookmark;
  isLoading: boolean;
  error: string | null;
}

export function useBookmarkVerse(bookmark: Bookmark, chapters: Chapter[]): UseBookmarkVerseReturn {
  const { settings } = useSettings();
  const { updateBookmark } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerseData = async () => {
      if (
        bookmark.verseText &&
        bookmark.surahName &&
        bookmark.translation &&
        bookmark.verseKey &&
        bookmark.verseApiId
      ) {
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const translationId = settings.translationIds[0] || settings.translationId || 20;
        const isCompositeKey = /:/.test(bookmark.verseId) || /[^0-9]/.test(bookmark.verseId);
        const verse = await (isCompositeKey
          ? getVerseByKey(bookmark.verseId, translationId)
          : getVerseById(bookmark.verseId, translationId));
        const [surahIdStr] = verse.verse_key.split(':');
        const surahInfo = chapters.find((chapter) => chapter.id === parseInt(surahIdStr));
        updateBookmark(bookmark.verseId, {
          verseKey: verse.verse_key,
          verseText: verse.text_uthmani,
          surahName: surahInfo?.name_simple || `Surah ${surahIdStr}`,
          translation: verse.translations?.[0]?.text,
          verseApiId: verse.id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch verse');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerseData();
  }, [bookmark, settings.translationIds, settings.translationId, updateBookmark, chapters]);

  return { bookmark, isLoading, error };
}
