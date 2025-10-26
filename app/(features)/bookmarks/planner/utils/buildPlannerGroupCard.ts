import {
  buildDailyGoalWindow,
  getDailyHighlights,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/dailyGoal';
import { NO_DAILY_GOAL_MESSAGE } from '@/app/(features)/bookmarks/planner/utils/plannerCard/constants';
import { getJuzMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/juz';
import { getPageMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pages';
import {
  getEstimatedDays,
  getVersesPerDay,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';
import { buildProgressDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progressDetails';
import { getProgressMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progress';
import { getScheduleDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/schedule';
import { buildStats } from '@/app/(features)/bookmarks/planner/utils/plannerCard/stats';

import type { PlannerCardChapter } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import {
  buildGroupRangeLabel,
  buildSurahRangeNameLabel,
  getChapterDisplayName,
  PlannerPlanGroup,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';

import type { Chapter, PlannerPlan } from '@/types';

interface VersePosition {
  plan: PlannerPlan;
  surahId: number;
  verse: number;
  chapterName: string;
}

export interface PlannerGroupCardData {
  key: string;
  surahId: string;
  plan: PlannerPlan;
  chapter?: PlannerCardChapter;
  viewModel: PlannerCardViewModel;
  progressLabel: string;
  planIds: string[];
  planName: string;
}

const sumBy = (plans: PlannerPlan[], selector: (plan: PlannerPlan) => number): number =>
  plans.reduce((total, plan) => total + selector(plan), 0);

const mapGlobalVerseToPosition = (
  plans: PlannerPlan[],
  globalVerse: number | null,
  chapterLookup: Map<number, Chapter>
): VersePosition | null => {
  if (globalVerse === null || globalVerse <= 0) return null;
  if (plans.length === 0) return null;
  let remaining = globalVerse;
  for (const plan of plans) {
    const maxVerse = Math.max(0, plan.targetVerses);
    if (maxVerse === 0) {
      continue;
    }
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
  if (!lastPlan) {
    return null;
  }
  const lastVerse = Math.max(1, lastPlan.targetVerses);
  const lastChapter = chapterLookup.get(lastPlan.surahId);
  return {
    plan: lastPlan,
    surahId: lastPlan.surahId,
    verse: lastVerse,
    chapterName: getChapterDisplayName(lastPlan, lastChapter),
  };
};

const formatGoalVerseRangeLabel = (
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

const getActivePlan = (plans: PlannerPlan[]): PlannerPlan => {
  const incompletePlan = plans.find((plan) => {
    if (plan.targetVerses <= 0) return false;
    return plan.completedVerses < plan.targetVerses;
  });
  return incompletePlan ?? plans[plans.length - 1]!;
};

const buildAggregatedPlan = (
  group: PlannerPlanGroup,
  plans: PlannerPlan[],
  activePlan: PlannerPlan,
  estimatedDays: number
): PlannerPlan => {
  const totalTarget = sumBy(plans, (plan) => Math.max(0, plan.targetVerses));
  const totalCompleted = sumBy(plans, (plan) => Math.max(0, Math.min(plan.completedVerses, plan.targetVerses)));
  const earliestCreated = plans.reduce(
    (earliest, plan) => Math.min(earliest, plan.createdAt),
    Number.POSITIVE_INFINITY
  );
  const latestUpdated = plans.reduce(
    (latest, plan) => Math.max(latest, plan.lastUpdated),
    0
  );

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

const buildAggregatedChapter = (
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): PlannerCardChapter | undefined => {
  if (surahIds.length === 0) return undefined;

  const startId = surahIds[0];
  const endId = surahIds[surahIds.length - 1];
  const startChapter = typeof startId === 'number' ? chapterLookup.get(startId) : undefined;
  const endChapter = typeof endId === 'number' ? chapterLookup.get(endId) : undefined;

  const startPage = typeof startChapter?.pages?.[0] === 'number' ? startChapter.pages![0] : undefined;
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

const formatPlanDetails = (
  group: PlannerPlanGroup,
  totalTarget: number,
  estimatedDays: number,
  chapterLookup: Map<number, Chapter>
): string => {
  const rangeLabel = buildGroupRangeLabel(group.surahIds, chapterLookup);
  const versesText =
    totalTarget > 0 ? `${totalTarget} verse${totalTarget === 1 ? '' : 's'}` : null;
  const daysText =
    estimatedDays > 0 ? `${estimatedDays} day${estimatedDays === 1 ? '' : 's'}` : null;

  const parts = [rangeLabel, versesText, daysText].filter(
    (part): part is string => Boolean(part)
  );

  return parts.join(' • ');
};

const buildProgressLabel = (
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

  const activePlan = getActivePlan(plans);
  const chapter = chapterLookup.get(activePlan.surahId);
  const chapterName = getChapterDisplayName(activePlan, chapter);
  const nextVerse =
    activePlan.targetVerses > 0
      ? Math.min(activePlan.completedVerses + 1, activePlan.targetVerses)
      : 1;
  return `${chapterName} ${activePlan.surahId}:${nextVerse}`;
};

export const buildPlannerGroupCardData = (
  group: PlannerPlanGroup,
  chapterLookup: Map<number, Chapter>
): PlannerGroupCardData => {
  const plans = group.plans.slice().sort((a, b) => a.surahId - b.surahId);
  if (plans.length === 0) {
    const fallbackSurahId = group.surahIds[0] ?? 1;
    const placeholderPlan: PlannerPlan = {
      id: group.planIds[0] ?? `${group.key}-placeholder`,
      surahId: fallbackSurahId,
      targetVerses: 0,
      completedVerses: 0,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      notes: group.planName,
      estimatedDays: 0,
    };
    const placeholderChapter = buildAggregatedChapter(group.surahIds, chapterLookup);
    const rangeLabel = buildGroupRangeLabel(group.surahIds, chapterLookup);
    const viewModel: PlannerCardViewModel = {
      planInfo: {
        displayPlanName: group.planName,
        planDetailsText: rangeLabel,
        surahLabel:
          placeholderChapter?.name_simple ?? `Surah ${placeholderPlan.surahId}`,
      },
      focus: {
        hasDailyGoal: false,
        dayLabel: 'Getting started',
        goalVerseLabel: 'All daily goals completed',
        dailyHighlights: [],
        remainingSummary: null,
        endsAtSummary: null,
        isComplete: true,
        noGoalMessage: NO_DAILY_GOAL_MESSAGE,
      },
      stats: {
        completed: { verses: 0, pages: null, juz: null },
        remaining: { verses: 0, pages: null, juz: null },
        goal: { verses: 0, pages: null, juz: null },
      },
      progress: {
        percent: 0,
        currentVerse: 1,
        currentSecondaryText: '',
      },
    };

    return {
      key: group.key,
      surahId: String(fallbackSurahId),
      plan: placeholderPlan,
      ...(placeholderChapter ? { chapter: placeholderChapter } : {}),
      viewModel,
      progressLabel: 'No progress tracked',
      planIds: group.planIds,
      planName: group.planName,
    };
  }
  const activePlan = getActivePlan(plans);
  const activeChapter = chapterLookup.get(activePlan.surahId);

  const estimatedDaysRaw =
    plans.find((plan) => typeof plan.estimatedDays === 'number' && plan.estimatedDays > 0)
      ?.estimatedDays ?? activePlan.estimatedDays;
  const aggregatedPlan = buildAggregatedPlan(
    group,
    plans,
    activePlan,
    typeof estimatedDaysRaw === 'number' && estimatedDaysRaw > 0 ? Math.round(estimatedDaysRaw) : 0
  );
  const normalizedEstimatedDays = getEstimatedDays(aggregatedPlan);
  const aggregatedChapter = buildAggregatedChapter(group.surahIds, chapterLookup);

  const progressMetrics = getProgressMetrics(aggregatedPlan);
  const pageMetrics = getPageMetrics(aggregatedPlan, aggregatedChapter);
  const juzMetrics = getJuzMetrics(aggregatedPlan, pageMetrics);
  const stats = buildStats({
    plan: aggregatedPlan,
    pageMetrics,
    juzMetrics,
    remainingVerses: progressMetrics.remainingVerses,
  });
  const globalCurrentVerse = Math.min(
    aggregatedPlan.completedVerses + 1,
    aggregatedPlan.targetVerses
  );
  const currentSecondaryText = buildProgressDetails({
    progress: {
      ...progressMetrics,
      currentVerse: globalCurrentVerse,
    },
    pageMetrics,
  });

  const versesPerDay = getVersesPerDay(aggregatedPlan, normalizedEstimatedDays);
  const goalWindow = buildDailyGoalWindow({
    plan: aggregatedPlan,
    versesPerDay,
    isComplete: progressMetrics.isComplete,
    pageMetrics,
  });
  const scheduleDetails = getScheduleDetails({
    plan: aggregatedPlan,
    estimatedDays: normalizedEstimatedDays,
    versesPerDay,
    isComplete: progressMetrics.isComplete,
    remainingVerses: progressMetrics.remainingVerses,
  });
  const dailyFocus = {
    hasDailyGoal: goalWindow.hasDailyGoal,
    dayLabel: scheduleDetails.dayLabel,
    goalVerseLabel: formatGoalVerseRangeLabel(
      plans,
      goalWindow.startVerse,
      goalWindow.endVerse,
      chapterLookup
    ),
    dailyHighlights: getDailyHighlights(goalWindow),
    remainingSummary: goalWindow.hasDailyGoal
      ? `Remaining ${scheduleDetails.remainingDaysLabel}`
      : null,
    endsAtSummary: goalWindow.hasDailyGoal ? `Ends at ${scheduleDetails.endsAtValue}` : null,
    isComplete: progressMetrics.isComplete,
    noGoalMessage: NO_DAILY_GOAL_MESSAGE,
  };

  const currentVerseWithinActivePlan =
    activePlan.targetVerses > 0
      ? Math.min(activePlan.completedVerses + 1, activePlan.targetVerses)
      : 1;

  const planDetailsText = formatPlanDetails(
    group,
    aggregatedPlan.targetVerses,
    normalizedEstimatedDays,
    chapterLookup
  );

  const viewModel: PlannerCardViewModel = {
    planInfo: {
      displayPlanName: group.planName,
      planDetailsText,
      surahLabel: getChapterDisplayName(activePlan, activeChapter),
    },
    focus: dailyFocus,
    stats,
    progress: {
      percent: progressMetrics.percent,
      currentVerse: currentVerseWithinActivePlan,
      currentSecondaryText,
    },
  };

  return {
    key: group.key,
    surahId: String(activePlan.surahId),
    plan: aggregatedPlan,
    ...(aggregatedChapter ? { chapter: aggregatedChapter } : {}),
    viewModel,
    progressLabel: buildProgressLabel(plans, progressMetrics.isComplete, chapterLookup),
    planIds: group.planIds,
    planName: group.planName,
  };
};
