import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getVerseWithCache } from '@/app/(features)/bookmarks/hooks/verseCache';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Bookmark, Verse } from '@/types';

export interface PinnedVerseEntry {
  bookmark: Bookmark;
  verse: Verse;
}

export const usePinnedPage = (): {
  entries: PinnedVerseEntry[];
  isLoading: boolean;
  error: string | null;
  handleSectionChange: (section: SectionId) => void;
} => {
  const router = useRouter();
  const { pinnedVerses, chapters } = useBookmarks();
  const { settings } = useSettings();
  const [entries, setEntries] = useState<PinnedVerseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translationIds = useMemo(() => settings.translationIds, [settings.translationIds]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    if (pinnedVerses.length === 0) {
      setEntries([]);
      setError(null);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    if (!chapters.length) {
      setIsLoading(true);
      return () => {
        isActive = false;
      };
    }

    const loadVerses = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const verses = await Promise.all(
          pinnedVerses.map((bookmark) =>
            getVerseWithCache(bookmark.verseId, translationIds, chapters, settings.wordLang)
          )
        );

        if (!isActive) return;

        setEntries(
          pinnedVerses.map((bookmark, index) => ({
            bookmark,
            verse: verses[index]!,
          }))
        );
      } catch (err) {
        if (!isActive) return;
        setEntries([]);
        setError(err instanceof Error ? err.message : 'Failed to load pinned verses');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadVerses();

    return () => {
      isActive = false;
    };
  }, [pinnedVerses, translationIds, settings.wordLang, chapters]);

  const handleSectionChange = (section: SectionId): void => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else if (section === 'memorization') {
      router.push('/bookmarks/memorization');
    } else {
      router.push('/bookmarks/pinned');
    }
  };

  return {
    entries,
    isLoading,
    error,
    handleSectionChange,
  };
};
