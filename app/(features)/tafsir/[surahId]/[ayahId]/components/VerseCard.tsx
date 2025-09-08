'use client';
import { useCallback } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Verse as VerseType } from '@/types';

import { VerseActions } from './verse-card/VerseActions';
import { VerseContent } from './verse-card/VerseContent';

interface VerseCardProps {
  verse: VerseType;
}

export function VerseCard({ verse }: VerseCardProps): JSX.Element {
  const { addBookmark, removeBookmark, findBookmark, isBookmarked } = useBookmarks();

  const isVerseBookmarked = isBookmarked(String(verse.id));

  const handleBookmark = useCallback(() => {
    const verseId = String(verse.id);
    const bookmarkInfo = findBookmark(verseId);
    if (bookmarkInfo) {
      removeBookmark(verseId, bookmarkInfo.folder.id);
    } else {
      addBookmark(verseId);
    }
  }, [addBookmark, removeBookmark, findBookmark, verse.id]);

  return (
    <div className="relative rounded-md border bg-surface p-6 shadow">
      {/* Mobile: stacked layout, Desktop: side-by-side */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        <VerseActions
          verse={verse}
          isPlaying={false}
          isLoadingAudio={false}
          isVerseBookmarked={isVerseBookmarked}
          onBookmark={handleBookmark}
        />

        <VerseContent verse={verse} />
      </div>
    </div>
  );
}
