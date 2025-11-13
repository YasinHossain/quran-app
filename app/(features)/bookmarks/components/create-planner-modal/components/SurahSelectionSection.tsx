'use client';

import React, { useCallback, useMemo } from 'react';

import { SurahSelect, type SurahOption } from '@/app/shared/components/go-to/SurahSelect';

import type { PlanFormData } from '@/app/(features)/bookmarks/components/create-planner-modal/types';
import type { Chapter } from '@/types';

interface SurahSelectionSectionProps {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  chapters: Chapter[];
}

const parseNumericValue = (value: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const buildSurahOptions = (chapters: Chapter[]): SurahOption[] =>
  chapters.map((chapter) => ({
    value: String(chapter.id),
    label: `${String(chapter.id).padStart(3, '0')} • ${chapter.name_simple}`,
  }));

const buildVerseOptions = (chapter?: Chapter): SurahOption[] => {
  if (!chapter?.verses_count) return [];
  return Array.from({ length: chapter.verses_count }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  });
};

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

  const surahOptions = useMemo(() => buildSurahOptions(chapters), [chapters]);
  const startChapter = formData.startSurah ? chapterLookup[formData.startSurah] : undefined;
  const endChapter = formData.endSurah ? chapterLookup[formData.endSurah] : undefined;

  const startVerseOptions = useMemo(() => buildVerseOptions(startChapter), [startChapter]);
  const endVerseOptions = useMemo(() => buildVerseOptions(endChapter), [endChapter]);

  const handleStartSurahChange = useCallback(
    (value: string) => {
      const nextSurah = parseNumericValue(value);
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
    (value: string) => {
      const nextSurah = parseNumericValue(value);
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
    (value: string) => {
      onFormDataChange({ startVerse: parseNumericValue(value) });
    },
    [onFormDataChange]
  );

  const handleEndVerseChange = useCallback(
    (value: string) => {
      onFormDataChange({ endVerse: parseNumericValue(value) });
    },
    [onFormDataChange]
  );

  return (
    <div className="space-y-4">
      <RangeBoundarySection
        label="Start"
        surahValue={formData.startSurah}
        verseValue={formData.startVerse}
        surahOptions={surahOptions}
        verseOptions={startVerseOptions}
        onSurahChange={handleStartSurahChange}
        onVerseChange={handleStartVerseChange}
      />

      <RangeBoundarySection
        label="End"
        surahValue={formData.endSurah}
        verseValue={formData.endVerse}
        surahOptions={surahOptions}
        verseOptions={endVerseOptions}
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
  surahOptions: SurahOption[];
  verseOptions: SurahOption[];
  onSurahChange: (value: string) => void;
  onVerseChange: (value: string) => void;
}

const RangeBoundarySection = ({
  label,
  surahValue,
  verseValue,
  surahOptions,
  verseOptions,
  onSurahChange,
  onVerseChange,
}: RangeBoundarySectionProps): React.JSX.Element => {
  const surahString = typeof surahValue === 'number' ? String(surahValue) : '';
  const verseString = typeof verseValue === 'number' ? String(verseValue) : '';
  const hasSurahSelection = surahString.length > 0;

  return (
    <section className="space-y-3">
      <div className="text-sm font-semibold text-foreground">{label}</div>

      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3 w-full">
        <div className="w-full min-w-0">
          <label className="sr-only">Surah</label>
          <SurahSelect
            value={surahString}
            onChange={onSurahChange}
            options={surahOptions}
            placeholder="Select a Surah"
            className="w-full"
          />
        </div>

        <div className="w-full min-w-0">
          <label className="sr-only">Verse</label>
          <SurahSelect
            value={verseString}
            onChange={onVerseChange}
            options={verseOptions}
            placeholder="Verse"
            disabled={!hasSurahSelection || verseOptions.length === 0}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};
