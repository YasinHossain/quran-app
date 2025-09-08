import { useCallback, type Dispatch, type SetStateAction } from 'react';

import { updateBookmarkInFolders } from '@/app/providers/bookmarks/bookmark-utils';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';

import type { Bookmark, Chapter, Folder } from '@/types';

export function useBookmarkMetadata(
  settings: { translationIds: number[]; translationId?: number },
  setFolders: Dispatch<SetStateAction<Folder[]>>,
  setPinnedVerses: Dispatch<SetStateAction<Bookmark[]>>
): (verseId: string, chaptersList: Chapter[]) => Promise<void> {
  return useCallback(
    async (verseId: string, chaptersList: Chapter[]) => {
      try {
        const translationId = settings.translationIds[0] || settings.translationId || 20;
        const isCompositeKey = /:/.test(verseId) || /[^0-9]/.test(verseId);
        const verse = await (isCompositeKey
          ? getVerseByKey(verseId, translationId)
          : getVerseById(verseId, translationId));
        const [surahIdStr] = verse.verse_key.split(':');
        const surahInfo = chaptersList.find((chapter) => chapter.id === parseInt(surahIdStr));

        const metadata = {
          verseKey: verse.verse_key,
          verseText: verse.text_uthmani,
          surahName: surahInfo?.name_simple || `Surah ${surahIdStr}`,
          translation: verse.translations?.[0]?.text,
          verseApiId: verse.id,
        };

        setFolders((prev) => updateBookmarkInFolders(prev, verseId, metadata));
        setPinnedVerses((prev) =>
          prev.map((b) => (b.verseId === verseId ? { ...b, ...metadata } : b))
        );
      } catch {
        // Silent fail for metadata fetch errors
      }
    },
    [settings.translationIds, settings.translationId, setFolders, setPinnedVerses]
  );
}
