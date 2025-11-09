import {
  buildGroupRangeLabel,
  buildSurahRangeNameLabel,
  getChapterDisplayName,
  PlannerPlanGroup,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';

import type { PlannerCardChapter } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { Chapter, PlannerPlan } from '@/types';

interface VersePosition {
  plan: PlannerPlan;
  surahId: number;
  verse: number;
  chapterName: string;
}

const sumBy = (plans: PlannerPlan[], selector: (plan: PlannerPlan) => number): number =>
  plans.reduce((total, plan) => total + selector(plan), 0);

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

  if (startPosition.surahId === endPosition.surahId) {
    if (startPosition.verse === endPosition.verse) {
      return `${startPosition.chapterName} ${startPosition.surahId}:${startPosition.verse}`;
    }
    return `${startPosition.chapterName} ${startPosition.surahId}:${startPosition.verse}-${endPosition.verse}`;
  }

  return `${startPosition.chapterName} ${startPosition.surahId}:${startPosition.verse} - ${endPosition.chapterName} ${endPosition.surahId}:${endPosition.verse}`;
};

export const getActivePlan = (plans: PlannerPlan[]): PlannerPlan => {
  const incompletePlan = plans.find(
    (plan) => plan.targetVerses > 0 && plan.completedVerses < plan.targetVerses
  );
  return incompletePlan ?? plans[plans.length - 1]!;
};

export const buildAggregatedPlan = (
  group: PlannerPlanGroup,
  plans: PlannerPlan[],
  activePlan: PlannerPlan,
  estimatedDays: number
): PlannerPlan => {
  const totalTarget = sumBy(plans, (plan) => Math.max(0, plan.targetVerses));
  const totalCompleted = sumBy(plans, (plan) =>
    Math.max(0, Math.min(plan.completedVerses, plan.targetVerses))
  );
  const earliestCreated = plans.reduce(
    (earliest, plan) => Math.min(earliest, plan.createdAt),
    Number.POSITIVE_INFINITY
  );
  const latestUpdated = plans.reduce((latest, plan) => Math.max(latest, plan.lastUpdated), 0);

  return {
    id: group.planIds[0] ?? activePlan.id,
    surahId: activePlan.surahId,
    targetVerses: totalTarget,
    completedVerses: totalCompleted,
    createdAt: Number.isFinite(earliestCreated) ? earliestCreated : Date.now(),
    lastUpdated: latestUpdated || Date.now(),
    notes: group.planName,
    estimatedDays,
  };
};

export const buildAggregatedChapter = (
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): PlannerCardChapter | undefined => {
  if (surahIds.length === 0) return undefined;

  const startId = surahIds[0];
  const endId = surahIds[surahIds.length - 1];
  const startChapter = typeof startId === 'number' ? chapterLookup.get(startId) : undefined;
  const endChapter = typeof endId === 'number' ? chapterLookup.get(endId) : undefined;

  const startPage =
    typeof startChapter?.pages?.[0] === 'number' ? startChapter.pages![0] : undefined;
  const endPage = typeof endChapter?.pages?.[1] === 'number' ? endChapter.pages![1] : undefined;

  const nameLabel = buildSurahRangeNameLabel(surahIds, chapterLookup);

  if (typeof startPage === 'number' && typeof endPage === 'number') {
    return {
      name_simple: nameLabel,
      name_arabic: nameLabel,
      pages: [startPage, endPage],
    };
  }

  return {
    name_simple: nameLabel,
    name_arabic: nameLabel,
  };
};

export const formatPlanDetails = (
  group: PlannerPlanGroup,
  totalTarget: number,
  estimatedDays: number,
  chapterLookup: Map<number, Chapter>
): string => {
  const rangeLabel = buildGroupRangeLabel(group.surahIds, chapterLookup);
  const versesText = totalTarget > 0 ? `${totalTarget} verse${totalTarget === 1 ? '' : 's'}` : null;
  const daysText =
    estimatedDays > 0 ? `${estimatedDays} day${estimatedDays === 1 ? '' : 's'}` : null;

  const parts = [rangeLabel, versesText, daysText].filter((part): part is string => Boolean(part));

  return parts.join(' • ');
};

export const buildProgressLabel = (
  plans: PlannerPlan[],
  isComplete: boolean,
  chapterLookup: Map<number, Chapter>
): string => {
  if (plans.length === 0) {
    return 'No progress tracked';
  }

  if (isComplete) {
    const lastPlan = plans[plans.length - 1]!;
    const chapter = chapterLookup.get(lastPlan.surahId);
    const verseNumber = Math.max(1, lastPlan.targetVerses);
    const chapterName = getChapterDisplayName(lastPlan, chapter);
    return `${chapterName} ${lastPlan.surahId}:${verseNumber}`;
  }

  const recentPlan = plans.reduce(
    (acc, plan) => (plan.lastUpdated > acc.lastUpdated ? plan : acc),
    plans[0]!
  );
  const recentCompleted =
    recentPlan.targetVerses > 0
      ? Math.max(1, Math.min(recentPlan.completedVerses, recentPlan.targetVerses))
      : 1;

  const planForLabel =
    recentPlan.completedVerses >= recentPlan.targetVerses ? getActivePlan(plans) : recentPlan;

  const chapter = chapterLookup.get(planForLabel.surahId);
  const chapterName = getChapterDisplayName(planForLabel, chapter);
  const currentVerse =
    planForLabel === recentPlan
      ? recentCompleted
      : planForLabel.targetVerses > 0
        ? Math.max(1, Math.min(planForLabel.completedVerses, planForLabel.targetVerses))
        : 1;

  return `${chapterName} ${planForLabel.surahId}:${currentVerse}`;
};
