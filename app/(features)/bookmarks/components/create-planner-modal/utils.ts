import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

export interface PlannerPlanDefinition {
  surahId: number;
  planName: string;
  versesCount: number;
  startVerse: number;
  endVerse: number;
}

const clampVerse = (chapter: Chapter, verse: number | undefined, fallback: number): number => {
  const max = chapter.verses_count ?? 0;
  if (max <= 0) return fallback;
  if (typeof verse !== 'number' || !Number.isFinite(verse) || verse < 1) {
    return fallback;
  }
  if (verse > max) return max;
  return verse;
};

const pushDefinition = (
  definitions: PlannerPlanDefinition[],
  chapter: Chapter,
  planName: string,
  rangeStart: number,
  rangeEnd: number
): void => {
  const max = chapter.verses_count ?? 0;
  if (max <= 0) return;
  const safeStart = Math.max(1, rangeStart);
  const safeEnd = Math.max(safeStart, Math.min(rangeEnd, max));
  const versesCount = safeEnd - safeStart + 1;
  if (versesCount <= 0) return;

  definitions.push({
    surahId: chapter.id,
    planName,
    versesCount,
    startVerse: safeStart,
    endVerse: safeEnd,
  });
};

export const buildPlannerPlanDefinitions = (
  formData: PlanFormData,
  chapters: Chapter[]
): PlannerPlanDefinition[] => {
  const { startSurah, startVerse, endSurah, endVerse } = formData;
  const trimmedBaseName = formData.planName.trim();

  if (!startSurah || !endSurah || startSurah > endSurah || trimmedBaseName.length === 0) {
    return [];
  }

  const startChapter = chapters.find((c) => c.id === startSurah);
  const endChapter = chapters.find((c) => c.id === endSurah);
  if (!startChapter || !endChapter) return [];

  const normalizedStartVerse = clampVerse(startChapter, startVerse, 1);
  const normalizedEndVerse = clampVerse(endChapter, endVerse, endChapter.verses_count ?? 1);

  if (startSurah === endSurah) {
    if (normalizedStartVerse > normalizedEndVerse) return [];
    const definitions: PlannerPlanDefinition[] = [];
    pushDefinition(
      definitions,
      startChapter,
      trimmedBaseName,
      normalizedStartVerse,
      normalizedEndVerse
    );
    return definitions;
  }

  const definitions: PlannerPlanDefinition[] = [];
  pushDefinition(
    definitions,
    startChapter,
    trimmedBaseName,
    normalizedStartVerse,
    startChapter.verses_count ?? normalizedStartVerse
  );

  for (let surahId = startSurah + 1; surahId < endSurah; surahId++) {
    const chapter = chapters.find((c) => c.id === surahId);
    if (!chapter) continue;
    pushDefinition(definitions, chapter, trimmedBaseName, 1, chapter.verses_count ?? 1);
  }

  pushDefinition(definitions, endChapter, trimmedBaseName, 1, normalizedEndVerse);

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
    estimatedDays?: number,
    options?: { startVerse?: number; endVerse?: number }
  ) => void
): void {
  const definitions = buildPlannerPlanDefinitions(formData, chapters);
  if (definitions.length === 0) return;

  for (const definition of definitions) {
    createPlannerPlan(
      definition.surahId,
      definition.versesCount,
      definition.planName,
      formData.estimatedDays,
      {
        startVerse: definition.startVerse,
        endVerse: definition.endVerse,
      }
    );
  }
}
