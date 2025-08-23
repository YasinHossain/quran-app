import { useState, useEffect } from 'react';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { getChapters } from '@/lib/api/chapters';
import { useSettings } from '@/app/providers/SettingsContext';
import { BookmarkWithVerse } from '@/types';

interface UseBookmarkVerseReturn {
  bookmarkWithVerse: BookmarkWithVerse;
  isLoading: boolean;
  error: string | null;
}

export function useBookmarkVerse(verseId: string, createdAt: number): UseBookmarkVerseReturn {
  const { settings } = useSettings();
  const [bookmarkWithVerse, setBookmarkWithVerse] = useState<BookmarkWithVerse>({
    verseId,
    createdAt,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerseData = async () => {
      if (bookmarkWithVerse.verse) return; // Already have verse data

      setIsLoading(true);
      setError(null);

      try {
        // Get the default translation from settings
        const translationId = settings.translationIds[0] || settings.translationId || 20; // Default to English

        const isCompositeKey = /:/.test(verseId) || /[^0-9]/.test(verseId);
        const [verse, chapters] = await Promise.all([
          isCompositeKey
            ? getVerseByKey(verseId, translationId)
            : getVerseById(verseId, translationId),
          getChapters(),
        ]);

        // Parse verse key to get surah info
        const [surahIdStr] = verse.verse_key.split(':');
        const surahId = parseInt(surahIdStr);
        const ayahNumber = parseInt(verse.verse_key.split(':')[1]);

        // Find surah info
        const surahInfo = chapters.find((chapter) => chapter.id === surahId);

        setBookmarkWithVerse({
          verseId,
          createdAt,
          verse: {
            id: verse.id,
            verse_key: verse.verse_key,
            text_uthmani: verse.text_uthmani,
            surahId,
            ayahNumber,
            surahNameEnglish: surahInfo?.name_simple || `Surah ${surahId}`,
            surahNameArabic: surahInfo?.name_arabic || '',
            translations: verse.translations?.map((t) => ({
              id: t.id || t.resource_id,
              resource_id: t.resource_id,
              text: t.text,
            })),
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch verse');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerseData();
  }, [
    verseId,
    settings.translationIds,
    settings.translationId,
    bookmarkWithVerse.verse,
    createdAt,
  ]);

  return { bookmarkWithVerse, isLoading, error };
}
