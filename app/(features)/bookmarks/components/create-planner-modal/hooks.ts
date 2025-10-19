'use client';

import { useState } from 'react';

import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

// Custom hook for planner calculations
export function usePlannerCalculations(
  chapters: Chapter[],
  startSurah?: number,
  endSurah?: number,
  estimatedDays: number = 5
): { totalVerses: number; versesPerDay: number; isValidRange: boolean } {
  const calculateTotalVerses = (): number => {
    if (!startSurah || !endSurah || startSurah > endSurah) return 0;

    const start = chapters.find((c) => c.id === startSurah);
    const end = chapters.find((c) => c.id === endSurah);

    if (!start || !end) return 0;

    if (startSurah === endSurah) {
      return start.verses_count;
    }

    let total = 0;
    for (let i = startSurah; i <= endSurah; i++) {
      const chapter = chapters.find((c) => c.id === i);
      if (chapter) total += chapter.verses_count;
    }
    return total;
  };

  const totalVerses = calculateTotalVerses();
  const versesPerDay = estimatedDays > 0 ? Math.ceil(totalVerses / estimatedDays) : 0;
  const isValidRange =
    typeof startSurah === 'number' && typeof endSurah === 'number' && startSurah <= endSurah;

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
    endSurah: undefined,
    estimatedDays: 5,
  });

  const handleFormDataChange = (updates: Partial<PlanFormData>): void => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = (): void => {
    setFormData({
      planName: '',
      startSurah: undefined,
      endSurah: undefined,
      estimatedDays: 5,
    });
  };

  return { formData, handleFormDataChange, resetForm };
}
