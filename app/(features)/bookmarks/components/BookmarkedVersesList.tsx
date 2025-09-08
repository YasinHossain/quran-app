// app/(features)/bookmarks/components/BookmarkedVersesList.tsx
'use client';
import { useEffect, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById } from '@/lib/api';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { Verse } from '@/types';

interface TranslationListProps {
  translations?: Verse['translations'];
}

interface VerseItemProps {
  verse: Verse;
}

interface UseBookmarkedVersesResult {
  verses: Verse[];
  error: string | null;
}

const TranslationList = ({ translations }: TranslationListProps): React.JSX.Element | null => {
  if (!translations) return null;

  return (
    <>
      {translations.map((t) => (
        <p key={t.resource_id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }} />
      ))}
    </>
  );
};

const VerseItem = ({ verse }: VerseItemProps): React.JSX.Element => (
  <div>
    <p className="font-semibold text-foreground">{verse.verse_key}</p>
    <p
      className="text-right"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(verse.text_uthmani) }}
    />
    <TranslationList translations={verse.translations} />
  </div>
);

const useBookmarkedVersesData = (): UseBookmarkedVersesResult => {
  const { bookmarkedVerses } = useBookmarks();
  const { settings } = useSettings();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookmarkedVerses.length === 0) {
      setVerses([]);
      setError(null);
      return;
    }

    const fetchBookmarkedVerses = async (): Promise<void> => {
      try {
        const fetched = await Promise.all(
          bookmarkedVerses.map((id: string) => getVerseById(id, settings.translationId))
        );
        setVerses(fetched);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchBookmarkedVerses();
  }, [bookmarkedVerses, settings.translationId]);

  return { verses, error };
};

export const BookmarkedVersesList = (): JSX.Element => {
  const { bookmarkedVerses } = useBookmarks();
  const { verses, error } = useBookmarkedVersesData();

  if (bookmarkedVerses.length === 0) {
    return <p className="text-muted">No verses bookmarked yet.</p>;
  }

  if (error) {
    return <p className="text-muted">Failed to load bookmarked verses. {error}</p>;
  }

  return (
    <div className="space-y-4">
      {verses.map((verse) => (
        <VerseItem key={verse.id} verse={verse} />
      ))}
    </div>
  );
};
