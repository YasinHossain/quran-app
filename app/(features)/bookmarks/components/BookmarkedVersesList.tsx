// app/(features)/bookmarks/components/BookmarkedVersesList.tsx
'use client';
import { useEffect, useState } from 'react';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById } from '@/lib/api';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { Verse } from '@/types';

const BookmarkedVersesList = () => {
  // All hooks must be called before any conditional logic
  const { bookmarkedVerses } = useBookmarks();
  const { settings } = useSettings();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!settings) return; // Skip fetch if settings not loaded

    if (bookmarkedVerses.length === 0) {
      setVerses([]);
      setError(null);
      return;
    }

    // Fetch full verse data for all bookmarks.
    // Handles network failures by capturing errors and clearing verses.
    const fetchBookmarkedVerses = async () => {
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
  }, [bookmarkedVerses, settings]);

  // Early return if settings are not loaded (after all hooks)
  if (!settings) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (bookmarkedVerses.length === 0) {
    return <p className="text-muted">No verses bookmarked yet.</p>;
  }

  if (error) {
    return <p className="text-muted">Failed to load bookmarked verses. {error}</p>;
  }

  return (
    <div className="space-y-4">
      {verses.map((verse) => (
        <div key={verse.id}>
          <p className="font-semibold text-foreground">{verse.verse_key}</p>
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
