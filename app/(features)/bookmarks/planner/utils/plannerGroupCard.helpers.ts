import {
  buildSurahRangeNameLabel,
  getChapterDisplayName,
  PlannerPlanGroup,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { mapGlobalVerseToPosition } from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.goal';
import {
  formatPlannerRangeDetails,
  PlannerRangePoint,
} from '@/app/(features)/bookmarks/planner/utils/planRangeLabel';

import type { PlannerCardChapter } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { Chapter, PlannerPlan } from '@/types';

export { formatGoalVerseRangeLabel, mapGlobalVerseToPosition } from './plannerGroupCard.goal';

interface ProgressMergeResult {
  totalTarget: number;
  totalCompleted: number;
  earliestCreated: number;
  latestUpdated: number;
}

const mergeProgress = (plans: PlannerPlan[]): ProgressMergeResult =>
  plans.reduce<ProgressMergeResult>(
    (result, plan) => {
      const safeTarget = Math.max(0, plan.targetVerses);
      const safeCompleted = Math.max(0, Math.min(plan.completedVerses, safeTarget));

      result.totalTarget += safeTarget;
      result.totalCompleted += safeCompleted;
      result.earliestCreated = Math.min(result.earliestCreated, plan.createdAt);
      result.latestUpdated = Math.max(result.latestUpdated, plan.lastUpdated);

      return result;
    },
    {
      totalTarget: 0,
      totalCompleted: 0,
      earliestCreated: Number.POSITIVE_INFINITY,
      latestUpdated: 0,
    }
  );

interface BadgeParams {
  plans: PlannerPlan[];
  isComplete: boolean;
  chapterLookup: Map<number, Chapter>;
}

const resolveChapter = (
  chapterId: number | undefined,
  chapterLookup: Map<number, Chapter>
): Chapter | undefined =>
  typeof chapterId === 'number' ? chapterLookup.get(chapterId) : undefined;

const resolveChapterPage = (chapter: Chapter | undefined, index: 0 | 1): number | undefined => {
  const page = chapter?.pages?.[index];
  return typeof page === 'number' ? page : undefined;
};

const buildChapterPages = (
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): [number, number] | undefined => {
  if (surahIds.length === 0) return undefined;
  const startChapter = resolveChapter(surahIds[0], chapterLookup);
  const endChapter = resolveChapter(surahIds[surahIds.length - 1], chapterLookup);
  const startPage = resolveChapterPage(startChapter, 0);
  const endPage = resolveChapterPage(endChapter, 1);
  return typeof startPage === 'number' && typeof endPage === 'number'
    ? [startPage, endPage]
    : undefined;
};

const badgeForStatus = ({ plans, isComplete, chapterLookup }: BadgeParams): string => {
  if (isComplete) {
    const completedPlan = plans[plans.length - 1]!;
    const chapter = chapterLookup.get(completedPlan.surahId);
    const chapterName = getChapterDisplayName(completedPlan, chapter);
    const verse = Math.max(1, completedPlan.targetVerses);
    return `${chapterName} ${completedPlan.surahId}:${verse}`;
  }
  const recentPlan = plans.reduce(
    (latest, plan) => (plan.lastUpdated > latest.lastUpdated ? plan : latest),
    plans[0]!
  );
  const planForLabel =
    recentPlan.completedVerses >= recentPlan.targetVerses ? getActivePlan(plans) : recentPlan;
  const verse =
    planForLabel === recentPlan
      ? clampCompletedVerse(recentPlan)
      : clampCompletedVerse(planForLabel);
  const chapter = chapterLookup.get(planForLabel.surahId);
  const chapterName = getChapterDisplayName(planForLabel, chapter);
  return `${chapterName} ${planForLabel.surahId}:${verse}`;
};

const clampCompletedVerse = (plan: PlannerPlan): number => {
  if (plan.targetVerses <= 0) return 1;
  const safeTarget = Math.max(1, plan.targetVerses);
  const safeCompleted = Math.max(1, plan.completedVerses);
  return Math.min(safeCompleted, safeTarget);
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
  const progress = mergeProgress(plans);

  return {
    id: group.planIds[0] ?? activePlan.id,
    surahId: activePlan.surahId,
    targetVerses: progress.totalTarget,
    completedVerses: progress.totalCompleted,
    createdAt: Number.isFinite(progress.earliestCreated) ? progress.earliestCreated : Date.now(),
    lastUpdated: progress.latestUpdated || Date.now(),
    notes: group.planName,
    estimatedDays,
  };
};

export const buildAggregatedChapter = (
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): PlannerCardChapter | undefined => {
  if (surahIds.length === 0) return undefined;

  const nameLabel = buildSurahRangeNameLabel(surahIds, chapterLookup);
  const pages = buildChapterPages(surahIds, chapterLookup);
  const baseChapter: PlannerCardChapter = {
    name_simple: nameLabel,
    name_arabic: nameLabel,
  };

  return pages ? { ...baseChapter, pages } : baseChapter;
};

const buildRangePoints = (
  plans: PlannerPlan[],
  totalTarget: number,
  chapterLookup: Map<number, Chapter>
): { start: PlannerRangePoint; end: PlannerRangePoint } | null => {
  if (plans.length === 0 || totalTarget <= 0) return null;
  const startPosition = mapGlobalVerseToPosition(plans, 1, chapterLookup);
  const endPosition = mapGlobalVerseToPosition(plans, totalTarget, chapterLookup);
  if (!startPosition || !endPosition) return null;

  return {
    start: {
      chapterName: startPosition.chapterName,
      surahId: startPosition.surahId,
      verse: startPosition.verse,
    },
    end: {
      chapterName: endPosition.chapterName,
      surahId: endPosition.surahId,
      verse: endPosition.verse,
    },
  };
};

export const formatPlanDetails = (
  group: PlannerPlanGroup,
  totalTarget: number,
  estimatedDays: number,
  chapterLookup: Map<number, Chapter>
): string | null => {
  const rangePoints = buildRangePoints(group.plans, totalTarget, chapterLookup);
  if (!rangePoints) return null;

  return formatPlannerRangeDetails({
    ...rangePoints,
    estimatedDays,
  });
};

export const buildProgressLabel = (
  plans: PlannerPlan[],
  isComplete: boolean,
  chapterLookup: Map<number, Chapter>
): string => {
  if (plans.length === 0) {
    return 'No progress tracked';
  }

  return badgeForStatus({ plans, isComplete, chapterLookup });
};
