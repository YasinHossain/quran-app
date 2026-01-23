'use client';

import { memo, type JSX, useCallback, useMemo, useState } from 'react';

import { useTranslationOptions } from '@/app/(features)/surah/hooks/useTranslationOptions';
import { ReaderVerseCard } from '@/app/shared/reader/VerseCard';
import { AddToPlannerModal } from '@/app/shared/verse-planner-modal';
import { Verse as VerseType } from '@/types';

import { useVerseCard } from './verse-card/useVerseCard';

interface VerseProps {
  verse: VerseType;
}

export const Verse = memo(function Verse({ verse }: VerseProps): JSX.Element {
  const { verseRef, isPlaying, isCurrent, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);
  const { resourceLanguagesMap } = useTranslationOptions();
  const [isPlannerModalOpen, setPlannerModalOpen] = useState(false);
  const { verse_key, text_uthmani, translations } = verse;

  const verseSummary = useMemo(() => {
    const [surahPart] = verse_key.split(':');
    const parsedSurah = Number(surahPart);
    return {
      verseKey: verse_key,
      ...(Number.isFinite(parsedSurah) ? { surahId: parsedSurah } : {}),
      arabicText: text_uthmani,
      ...(translations?.[0]?.text ? { translationHtml: translations?.[0]?.text } : {}),
    };
  }, [text_uthmani, translations, verse_key]);

  const handleOpenPlannerModal = useCallback(() => setPlannerModalOpen(true), []);
  const handleClosePlannerModal = useCallback(() => setPlannerModalOpen(false), []);

  return (
    <>
      <ReaderVerseCard
        ref={verseRef}
        verse={verse}
        isPlaying={isCurrent}
        extendArabicSelectionGutter
        actions={{
          verseKey: verse.verse_key,
          verseId: String(verse.id),
          isPlaying,
          isLoadingAudio,
          isBookmarked: isVerseBookmarked,
          onPlayPause: handlePlayPause,
          onAddToPlan: handleOpenPlannerModal,
        }}
        resourceLanguages={resourceLanguagesMap}
      />
      {isPlannerModalOpen ? (
        <AddToPlannerModal isOpen onClose={handleClosePlannerModal} verseSummary={verseSummary} />
      ) : null}
    </>
  );
});
