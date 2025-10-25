import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

export interface PlannerPlanDefinition {
  surahId: number;
  planName: string;
  versesCount: number;
}

export const buildPlannerPlanDefinitions = (
  formData: PlanFormData,
  chapters: Chapter[]
): PlannerPlanDefinition[] => {
  const { startSurah, endSurah } = formData;
  const trimmedBaseName = formData.planName.trim();

  if (
    !startSurah ||
    !endSurah ||
    startSurah > endSurah ||
    trimmedBaseName.length === 0
  ) {
    return [];
  }

  const definitions: PlannerPlanDefinition[] = [];

  for (let surahId = startSurah; surahId <= endSurah; surahId++) {
    const chapter = chapters.find((c) => c.id === surahId);
    if (!chapter) continue;

    definitions.push({
      surahId,
      planName: trimmedBaseName,
      versesCount: chapter.verses_count,
    });
  }

  return definitions;
};

// Helper function to create planner plans for a range of surahs
export function createPlannerPlansForRange(
  formData: PlanFormData,
  chapters: Chapter[],
  createPlannerPlan: (
    surahId: number,
    versesCount: number,
    planName: string,
    estimatedDays?: number
  ) => void
): void {
  const definitions = buildPlannerPlanDefinitions(formData, chapters);
  if (definitions.length === 0) return;

  for (const definition of definitions) {
    createPlannerPlan(
      definition.surahId,
      definition.versesCount,
      definition.planName,
      formData.estimatedDays
    );
  }
}
