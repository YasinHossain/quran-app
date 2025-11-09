import {
  buildGroupRangeLabel,
  getChapterDisplayName,
  PlannerPlanGroup,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { NO_DAILY_GOAL_MESSAGE } from '@/app/(features)/bookmarks/planner/utils/plannerCard/constants';
import {
  buildDailyGoalWindow,
  getDailyHighlights,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/dailyGoal';
import { getJuzMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/juz';
import {
  getEstimatedDays,
  getVersesPerDay,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';
import { getPageMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pages';
import { getProgressMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progress';
import { buildProgressDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progressDetails';
import { getScheduleDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/schedule';
import { buildStats } from '@/app/(features)/bookmarks/planner/utils/plannerCard/stats';
import {
  buildAggregatedChapter,
  buildAggregatedPlan,
  buildProgressLabel,
  formatGoalVerseRangeLabel,
  formatPlanDetails,
  getActivePlan,
  mapGlobalVerseToPosition,
} from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.helpers';

import type { PlannerCardChapter } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import type { Chapter, PlannerPlan } from '@/types';

export interface PlannerGroupCardData {
  key: string;
  surahId: string;
  plan: PlannerPlan;
  chapter?: PlannerCardChapter;
  viewModel: PlannerCardViewModel;
  progressLabel: string;
  planIds: string[];
  planName: string;
  continueVerse?: {
    surahId: number;
    verse: number;
    verseKey: string;
  };
}

const buildPlaceholderCardData = (
  group: PlannerPlanGroup,
  chapterLookup: Map<number, Chapter>
): PlannerGroupCardData => {
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
      surahLabel: placeholderChapter?.name_simple ?? `Surah ${placeholderPlan.surahId}`,
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
};

export const buildPlannerGroupCardData = (
  group: PlannerPlanGroup,
  chapterLookup: Map<number, Chapter>
): PlannerGroupCardData => {
  const plans = group.plans.slice().sort((a, b) => a.surahId - b.surahId);
  if (plans.length === 0) {
    return buildPlaceholderCardData(group, chapterLookup);
  }
  const activePlan = getActivePlan(plans);
  const activeChapter = chapterLookup.get(activePlan.surahId);
  const recentPlan = plans.reduce(
    (acc, p) => (p.lastUpdated > acc.lastUpdated ? p : acc),
    plans[0]!
  );

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
  // Global position is the last completed verse across the aggregated plan
  const globalCurrentVerse = Math.max(
    1,
    Math.min(aggregatedPlan.completedVerses, aggregatedPlan.targetVerses)
  );
  const currentPosition =
    globalCurrentVerse > 0
      ? mapGlobalVerseToPosition(plans, globalCurrentVerse, chapterLookup)
      : null;

  // Secondary details should reflect the aggregated current position across the full group
  const currentSecondaryText = buildProgressDetails({
    progress: { ...progressMetrics, currentVerse: globalCurrentVerse },
    pageMetrics,
  });

  // Compute daily goal across the aggregated plan (group-centric)
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
    remainingVerses: Math.max(aggregatedPlan.targetVerses - aggregatedPlan.completedVerses, 0),
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
      surahLabel:
        aggregatedChapter?.name_simple ??
        getChapterDisplayName(activePlan, chapterLookup.get(activePlan.surahId)),
    },
    focus: dailyFocus,
    stats,
    progress: {
      percent: progressMetrics.percent,
      currentVerse: globalCurrentVerse,
      currentSecondaryText,
    },
  };

  return {
    key: group.key,
    surahId: String(recentPlan.surahId),
    plan: aggregatedPlan,
    ...(aggregatedChapter ? { chapter: aggregatedChapter } : {}),
    viewModel,
    progressLabel: buildProgressLabel(plans, progressMetrics.isComplete, chapterLookup),
    planIds: group.planIds,
    planName: group.planName,
    ...(currentPosition
      ? {
          continueVerse: {
            surahId: currentPosition.surahId,
            verse: currentPosition.verse,
            verseKey: `${currentPosition.surahId}:${currentPosition.verse}`,
          },
        }
      : {}),
  };
};
