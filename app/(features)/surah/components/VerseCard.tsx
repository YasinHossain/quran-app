'use client';

import { memo, type JSX, useCallback, useMemo, useState } from 'react';

import { ReaderVerseCard } from '@/app/shared/reader/VerseCard';
import { AddToPlannerModal } from '@/app/shared/verse-planner-modal';
import { Verse as VerseType } from '@/types';

import { useVerseCard } from './verse-card/useVerseCard';

interface VerseProps {
  verse: VerseType;
}

export const Verse = memo(function Verse({ verse }: VerseProps): JSX.Element {
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);
  const [isPlannerModalOpen, setPlannerModalOpen] = useState(false);
  const { verse_key, text_uthmani, translations } = verse;

  const verseSummary = useMemo(() => {
    const [surahPart] = verse_key.split(':');
    const parsedSurah = Number(surahPart);
    return {
      verseKey: verse_key,
      surahId: Number.isFinite(parsedSurah) ? parsedSurah : undefined,
      arabicText: text_uthmani,
      translationHtml: translations?.[0]?.text,
    };
  }, [text_uthmani, translations, verse_key]);

  const handleOpenPlannerModal = useCallback(() => setPlannerModalOpen(true), []);
  const handleClosePlannerModal = useCallback(() => setPlannerModalOpen(false), []);

  return (
    <>
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
          onAddToPlan: handleOpenPlannerModal,
        }}
      />
      <AddToPlannerModal
        isOpen={isPlannerModalOpen}
        onClose={handleClosePlannerModal}
        verseSummary={verseSummary}
      />
    </>
  );
});
