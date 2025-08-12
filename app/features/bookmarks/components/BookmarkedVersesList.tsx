// app/(features)/bookmarks/components/BookmarkedVersesList.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById } from '@/lib/api';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { Verse } from '@/types';

const BookmarkedVersesList = () => {
  const { bookmarkedVerses, settings } = useSettings();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookmarkedVerses.length === 0) {
      setVerses([]);
      setError(null);
      return;
    }

    const fetchBookmarkedVerses = async () => {
      try {
        const fetched = await Promise.all(
          bookmarkedVerses.map((id) => getVerseById(id, settings.translationId))
        );
        setVerses(fetched);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchBookmarkedVerses();
  }, [bookmarkedVerses, settings.translationId]);

  if (bookmarkedVerses.length === 0) {
    return <p>No verses bookmarked yet.</p>;
  }

  if (error) {
    return <p>Failed to load bookmarked verses. {error}</p>;
  }

  return (
    <div className="space-y-4">
      {verses.map((verse) => (
        <div key={verse.id}>
          <p className="font-semibold">{verse.verse_key}</p>
          <p
            className="text-right"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(verse.text_uthmani) }}
          />
          {verse.translations?.map((t) => (
            <p key={t.resource_id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BookmarkedVersesList;
