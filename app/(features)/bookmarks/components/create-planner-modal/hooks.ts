'use client';

import { useMemo, useState } from 'react';

import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

// Custom hook for planner calculations
const clampVerse = (verse: number | undefined, maxVerse: number, fallback: number): number => {
  if (maxVerse <= 0) return fallback;
  if (typeof verse !== 'number' || !Number.isFinite(verse) || verse < 1) {
    return fallback;
  }
  if (verse > maxVerse) return maxVerse;
  return verse;
};

export function usePlannerCalculations(
  chapters: Chapter[],
  startSurah?: number,
  startVerse?: number,
  endSurah?: number,
  endVerse?: number,
  estimatedDays: number = 5
): { totalVerses: number; versesPerDay: number; isValidRange: boolean } {
  const chapterLookup = useMemo(() => {
    return chapters.reduce<Record<number, Chapter>>((acc, chapter) => {
      acc[chapter.id] = chapter;
      return acc;
    }, {});
  }, [chapters]);

  const startChapter = typeof startSurah === 'number' ? chapterLookup[startSurah] : undefined;
  const endChapter = typeof endSurah === 'number' ? chapterLookup[endSurah] : undefined;

  const normalizedStartVerse =
    startChapter?.verses_count != null
      ? clampVerse(startVerse, startChapter.verses_count, 1)
      : undefined;
  const normalizedEndVerse =
    endChapter?.verses_count != null && endChapter.verses_count > 0
      ? clampVerse(endVerse, endChapter.verses_count, endChapter.verses_count)
      : undefined;

  const calculateTotalVerses = (): number => {
    if (
      typeof startSurah !== 'number' ||
      typeof endSurah !== 'number' ||
      startSurah > endSurah ||
      !startChapter ||
      !endChapter ||
      typeof normalizedStartVerse !== 'number' ||
      typeof normalizedEndVerse !== 'number'
    ) {
      return 0;
    }

    if (startSurah === endSurah) {
      if (normalizedStartVerse > normalizedEndVerse) return 0;
      return normalizedEndVerse - normalizedStartVerse + 1;
    }

    let total = 0;
    total += startChapter.verses_count - (normalizedStartVerse - 1);
    total += normalizedEndVerse;

    for (let surahId = startSurah + 1; surahId < endSurah; surahId++) {
      const chapter = chapterLookup[surahId];
      if (chapter) {
        total += chapter.verses_count;
      }
    }

    return total;
  };

  const totalVerses = calculateTotalVerses();
  const versesPerDay = estimatedDays > 0 ? Math.ceil(totalVerses / estimatedDays) : 0;
  const isValidRange =
    typeof startSurah === 'number' &&
    typeof endSurah === 'number' &&
    startSurah <= endSurah &&
    !!startChapter &&
    !!endChapter &&
    (startSurah !== endSurah ||
      (typeof normalizedStartVerse === 'number' &&
        typeof normalizedEndVerse === 'number' &&
        normalizedStartVerse <= normalizedEndVerse));

  return {
    totalVerses,
    versesPerDay,
    isValidRange,
  };
}

// Helper hook for form state management
export function useFormState(): {
  formData: PlanFormData;
  handleFormDataChange: (updates: Partial<PlanFormData>) => void;
  resetForm: () => void;
} {
  const [formData, setFormData] = useState<PlanFormData>({
    planName: '',
    startSurah: undefined,
    startVerse: undefined,
    endSurah: undefined,
    endVerse: undefined,
    estimatedDays: 5,
  });

  const handleFormDataChange = (updates: Partial<PlanFormData>): void => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = (): void => {
    setFormData({
      planName: '',
      startSurah: undefined,
      startVerse: undefined,
      endSurah: undefined,
      endVerse: undefined,
      estimatedDays: 5,
    });
  };

  return { formData, handleFormDataChange, resetForm };
}
