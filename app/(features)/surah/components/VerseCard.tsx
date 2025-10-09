'use client';

import { memo, type JSX } from 'react';

import { ReaderVerseCard } from '@/app/shared/reader';
import { Verse as VerseType } from '@/types';

import { useVerseCard } from './verse-card/useVerseCard';

interface VerseProps {
  verse: VerseType;
}

export const Verse = memo(function Verse({ verse }: VerseProps): JSX.Element {
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);

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
      }}
    />
  );
});
