'use client';

import { useCallback, type JSX } from 'react';

import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Verse as VerseType } from '@/types';

interface VerseCardProps {
  verse: VerseType;
}

export function VerseCard({ verse }: VerseCardProps): JSX.Element {
  const { addBookmark, removeBookmark, findBookmark } = useBookmarks();
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);
  const translation = verse.translations?.[0]?.text;

  const handleBookmark = useCallback(() => {
    const verseId = String(verse.id);
    const bookmarkInfo = findBookmark(verseId);
    if (bookmarkInfo) {
      removeBookmark(verseId, bookmarkInfo.folder.id);
    } else {
      addBookmark(verseId, undefined, {
        verseKey: verse.verse_key,
        verseApiId: verse.id,
        verseText: verse.text_uthmani,
        ...(translation ? { translation } : {}),
      });
    }
  }, [addBookmark, removeBookmark, findBookmark, verse, translation]);

  return (
    <ReaderVerseCard
      ref={verseRef}
      verse={verse}
      actions={{
        verseKey: verse.verse_key,
        verseId: String(verse.id),
        isPlaying,
        isLoadingAudio,
        isBookmarked: isVerseBookmarked,
        onPlayPause: handlePlayPause,
        onBookmark: handleBookmark,
      }}
    />
  );
}
