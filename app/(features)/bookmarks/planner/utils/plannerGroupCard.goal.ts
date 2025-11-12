import { getChapterDisplayName } from '@/app/(features)/bookmarks/planner/utils/planGrouping';

import type { Chapter, PlannerPlan } from '@/types';

interface VersePosition {
  plan: PlannerPlan;
  surahId: number;
  verse: number;
  chapterName: string;
}

const isSingleChapter = (startPosition: VersePosition, endPosition: VersePosition): boolean =>
  startPosition.surahId === endPosition.surahId;

const buildSingleChapterLabel = (
  startPosition: VersePosition,
  endPosition: VersePosition
): string => {
  if (startPosition.verse === endPosition.verse) {
    return `${startPosition.chapterName} ${startPosition.surahId}:${startPosition.verse}`;
  }
  return `${startPosition.chapterName} ${startPosition.surahId}:${startPosition.verse}-${endPosition.verse}`;
};

const buildMultiChapterLabel = (startPosition: VersePosition, endPosition: VersePosition): string =>
  `${startPosition.chapterName} ${startPosition.surahId}:${startPosition.verse} - ${endPosition.chapterName} ${endPosition.surahId}:${endPosition.verse}`;

export const mapGlobalVerseToPosition = (
  plans: PlannerPlan[],
  globalVerse: number | null,
  chapterLookup: Map<number, Chapter>
): VersePosition | null => {
  if (globalVerse === null || globalVerse <= 0) return null;
  if (plans.length === 0) return null;
  let remaining = globalVerse;
  for (const plan of plans) {
    const maxVerse = Math.max(0, plan.targetVerses);
    if (maxVerse === 0) continue;
    if (remaining <= maxVerse) {
      const verse = Math.max(1, Math.min(maxVerse, remaining));
      const chapter = chapterLookup.get(plan.surahId);
      return {
        plan,
        surahId: plan.surahId,
        verse,
        chapterName: getChapterDisplayName(plan, chapter),
      };
    }
    remaining -= maxVerse;
  }

  const lastPlan = plans[plans.length - 1] ?? null;
  if (!lastPlan) return null;
  const lastVerse = Math.max(1, lastPlan.targetVerses);
  const lastChapter = chapterLookup.get(lastPlan.surahId);
  return {
    plan: lastPlan,
    surahId: lastPlan.surahId,
    verse: lastVerse,
    chapterName: getChapterDisplayName(lastPlan, lastChapter),
  };
};

export const formatGoalVerseRangeLabel = (
  plans: PlannerPlan[],
  goalStart: number | null,
  goalEnd: number | null,
  chapterLookup: Map<number, Chapter>
): string => {
  const startPosition = mapGlobalVerseToPosition(plans, goalStart, chapterLookup);
  const endPosition = mapGlobalVerseToPosition(plans, goalEnd, chapterLookup);
  if (!startPosition || !endPosition) {
    return 'All daily goals completed';
  }

  if (isSingleChapter(startPosition, endPosition)) {
    return buildSingleChapterLabel(startPosition, endPosition);
  }

  return buildMultiChapterLabel(startPosition, endPosition);
};
