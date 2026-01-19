'use client';

import React, { useCallback, useMemo } from 'react';

import { SurahVerseSelector } from '@/app/shared/components/SurahVerseSelector';

import type { PlanFormData } from '@/app/(features)/bookmarks/components/create-planner-modal/types';
import type { Chapter } from '@/types';

interface SurahSelectionSectionProps {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  chapters: Chapter[];
}

const clampVerseToChapter = (
  verse: number | undefined,
  chapter: Chapter,
  fallback: number
): number => {
  const maxVerse = chapter.verses_count;
  if (!maxVerse || maxVerse <= 0) return fallback;
  if (typeof verse !== 'number' || !Number.isFinite(verse) || verse < 1) return fallback;
  if (verse > maxVerse) return maxVerse;
  return verse;
};

export const SurahSelectionSection = ({
  formData,
  onFormDataChange,
  chapters,
}: SurahSelectionSectionProps): React.JSX.Element => {
  const chapterLookup = useMemo(() => {
    return chapters.reduce<Record<number, Chapter>>((acc, chapter) => {
      acc[chapter.id] = chapter;
      return acc;
    }, {});
  }, [chapters]);

  const handleStartSurahChange = useCallback(
    (nextSurah: number | undefined) => {
      const chapter = nextSurah ? chapterLookup[nextSurah] : undefined;
      const updates: Partial<PlanFormData> = { startSurah: nextSurah };
      if (!chapter) {
        updates.startVerse = undefined;
      } else {
        updates.startVerse = clampVerseToChapter(formData.startVerse, chapter, 1);
      }
      onFormDataChange(updates);
    },
    [chapterLookup, formData.startVerse, onFormDataChange]
  );

  const handleEndSurahChange = useCallback(
    (nextSurah: number | undefined) => {
      const chapter = nextSurah ? chapterLookup[nextSurah] : undefined;
      const updates: Partial<PlanFormData> = { endSurah: nextSurah };
      if (!chapter) {
        updates.endVerse = undefined;
      } else {
        updates.endVerse = clampVerseToChapter(
          formData.endVerse,
          chapter,
          chapter.verses_count ?? 1
        );
      }
      onFormDataChange(updates);
    },
    [chapterLookup, formData.endVerse, onFormDataChange]
  );

  const handleStartVerseChange = useCallback(
    (nextVerse: number | undefined) => {
      onFormDataChange({ startVerse: nextVerse });
    },
    [onFormDataChange]
  );

  const handleEndVerseChange = useCallback(
    (nextVerse: number | undefined) => {
      onFormDataChange({ endVerse: nextVerse });
    },
    [onFormDataChange]
  );

  return (
    <div className="space-y-4">
      <RangeBoundarySection
        label="Start"
        surahValue={formData.startSurah}
        verseValue={formData.startVerse}
        chapters={chapters}
        onSurahChange={handleStartSurahChange}
        onVerseChange={handleStartVerseChange}
      />

      <RangeBoundarySection
        label="End"
        surahValue={formData.endSurah}
        verseValue={formData.endVerse}
        chapters={chapters}
        onSurahChange={handleEndSurahChange}
        onVerseChange={handleEndVerseChange}
      />
    </div>
  );
};

interface RangeBoundarySectionProps {
  label: string;
  surahValue: number | undefined;
  verseValue: number | undefined;
  chapters: Chapter[];
  onSurahChange: (value: number | undefined) => void;
  onVerseChange: (value: number | undefined) => void;
}

const RangeBoundarySection = ({
  label,
  surahValue,
  verseValue,
  chapters,
  onSurahChange,
  onVerseChange,
}: RangeBoundarySectionProps): React.JSX.Element => {
  return (
    <section>
      <SurahVerseSelector
        chapters={chapters}
        selectedSurah={surahValue}
        selectedVerse={verseValue}
        onSurahChange={onSurahChange}
        onVerseChange={onVerseChange}
        surahLabel={`${label} Surah`}
        verseLabel="Verse"
      />
    </section>
  );
};
