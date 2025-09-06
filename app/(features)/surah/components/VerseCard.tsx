'use client';

import { memo } from 'react';

import { VerseArabic } from '@/app/shared/VerseArabic';
import { Verse as VerseType } from '@/types';

import { useVerseCard } from './verse-card/useVerseCard';
import { VerseActions } from './verse-card/VerseActions';
import { VerseTranslations } from './verse-card/VerseTranslations';

interface VerseProps {
  verse: VerseType;
}

export const Verse = memo(function Verse({ verse }: VerseProps): React.JSX.Element {
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);

  return (
    <div id={`verse-${verse.id}`} ref={verseRef} className="mb-8 pb-8 border-b border-border">
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        <VerseActions
          verseKey={verse.verse_key}
          verseId={String(verse.id)}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isVerseBookmarked}
          onPlayPause={handlePlayPause}
        />

        <div className="space-y-6 md:flex-grow">
          <VerseArabic verse={verse} />
          <VerseTranslations verse={verse} />
        </div>
      </div>
    </div>
  );
});
