import { NO_DAILY_GOAL_MESSAGE } from '@/app/(features)/bookmarks/planner/utils/plannerCard/constants';
import {
  buildDailyGoalWindow,
  getDailyHighlights,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/dailyGoal';
import { getJuzMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/juz';
import { getVersesPerDay } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';
import { getPageMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pages';
import { getProgressMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progress';
import { buildProgressDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progressDetails';
import { getScheduleDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/schedule';
import { buildStats } from '@/app/(features)/bookmarks/planner/utils/plannerCard/stats';
import {
  formatGoalVerseRangeLabel,
  mapGlobalVerseToPosition,
} from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.helpers';

import type { PlannerGroupCardData } from './plannerGroupCard.types';
import type { PlannerCardChapter } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';
import type { Chapter, PlannerPlan } from '@/types';

export interface ProgressInput {
  aggregatedPlan: PlannerPlan;
  normalizedEstimatedDays: number;
  plans: PlannerPlan[];
}

export interface ProgressComputationResult {
  stats: PlannerCardViewModel['stats'];
  progress: PlannerCardViewModel['progress'];
  dailyFocus: PlannerCardViewModel['focus'];
  progressMetrics: ReturnType<typeof getProgressMetrics>;
  continueVerse?: PlannerGroupCardData['continueVerse'];
}

export const computeProgressStats = (
  input: ProgressInput,
  aggregatedChapter: PlannerCardChapter | undefined,
  chapterLookup: Map<number, Chapter>,
  i18n?: PlannerI18nContext
): ProgressComputationResult => {
  const { aggregatedPlan, normalizedEstimatedDays, plans } = input;
  const progressMetrics = getProgressMetrics(aggregatedPlan);
  const pageMetrics = getPageMetrics(aggregatedPlan, aggregatedChapter);
  const juzMetrics = getJuzMetrics(aggregatedPlan, pageMetrics);
  const stats = buildStats({
    plan: aggregatedPlan,
    pageMetrics,
    juzMetrics,
    remainingVerses: progressMetrics.remainingVerses,
  });
  const position = resolveProgressPosition({
    aggregatedPlan,
    plans,
    chapterLookup,
    pageMetrics,
    progressMetrics,
    ...(i18n ? { i18n } : {}),
  });
  const dailyFocus = buildDailyFocus({
    aggregatedPlan,
    normalizedEstimatedDays,
    progressMetrics,
    pageMetrics,
    plans,
    chapterLookup,
    ...(i18n ? { i18n } : {}),
  });

  return {
    stats,
    progressMetrics,
    dailyFocus,
    progress: {
      percent: progressMetrics.percent,
      currentVerse: position.globalCurrentVerse,
      currentSecondaryText: position.currentSecondaryText,
    },
    continueVerse: position.continueVerse,
  };
};

interface DailyFocusParams {
  aggregatedPlan: PlannerPlan;
  normalizedEstimatedDays: number;
  progressMetrics: ReturnType<typeof getProgressMetrics>;
  pageMetrics: ReturnType<typeof getPageMetrics>;
  plans: PlannerPlan[];
  chapterLookup: Map<number, Chapter>;
  i18n?: PlannerI18nContext;
}

const buildDailyFocus = ({
  aggregatedPlan,
  normalizedEstimatedDays,
  progressMetrics,
  pageMetrics,
  plans,
  chapterLookup,
  i18n,
}: DailyFocusParams): PlannerCardViewModel['focus'] => {
  const versesPerDay = getVersesPerDay(aggregatedPlan, normalizedEstimatedDays);
  const goalWindow = buildDailyGoalWindow({
    plan: aggregatedPlan,
    versesPerDay,
    isComplete: progressMetrics.isComplete,
    pageMetrics,
    ...(i18n ? { i18n } : {}),
  });
  const scheduleDetails = getScheduleDetails({
    plan: aggregatedPlan,
    estimatedDays: normalizedEstimatedDays,
    versesPerDay,
    isComplete: progressMetrics.isComplete,
    remainingVerses: Math.max(aggregatedPlan.targetVerses - aggregatedPlan.completedVerses, 0),
    ...(i18n ? { i18n } : {}),
  });

  return {
    hasDailyGoal: goalWindow.hasDailyGoal,
    dayLabel: scheduleDetails.dayLabel,
    goalVerseLabel: formatGoalVerseRangeLabel(
      plans,
      goalWindow.startVerse,
      goalWindow.endVerse,
      chapterLookup,
      i18n
    ),
    dailyHighlights: getDailyHighlights(goalWindow, i18n),
    remainingSummary: goalWindow.hasDailyGoal
      ? i18n
        ? i18n.t('planner_remaining_summary', { value: scheduleDetails.remainingDaysLabel })
        : `Remaining ${scheduleDetails.remainingDaysLabel}`
      : null,
    endsAtSummary: goalWindow.hasDailyGoal
      ? i18n
        ? i18n.t('planner_ends_at_summary', { value: scheduleDetails.endsAtValue })
        : `Ends at ${scheduleDetails.endsAtValue}`
      : null,
    isComplete: progressMetrics.isComplete,
    noGoalMessage: i18n ? i18n.t('planner_no_daily_goal_message') : NO_DAILY_GOAL_MESSAGE,
  };
};

interface PositionInput {
  aggregatedPlan: PlannerPlan;
  plans: PlannerPlan[];
  chapterLookup: Map<number, Chapter>;
  pageMetrics: ReturnType<typeof getPageMetrics>;
  progressMetrics: ReturnType<typeof getProgressMetrics>;
  i18n?: PlannerI18nContext;
}

interface PositionContext {
  globalCurrentVerse: number;
  currentSecondaryText: string;
  continueVerse?: PlannerGroupCardData['continueVerse'];
}

const resolveProgressPosition = ({
  aggregatedPlan,
  plans,
  chapterLookup,
  pageMetrics,
  progressMetrics,
  i18n,
}: PositionInput): PositionContext => {
  const globalCurrentVerse = Math.max(
    1,
    Math.min(aggregatedPlan.completedVerses, aggregatedPlan.targetVerses)
  );
  const mappedPosition =
    globalCurrentVerse > 0
      ? mapGlobalVerseToPosition(plans, globalCurrentVerse, chapterLookup)
      : null;
  const currentSecondaryText = buildProgressDetails({
    progress: { ...progressMetrics, currentVerse: globalCurrentVerse },
    pageMetrics,
    ...(i18n ? { i18n } : {}),
  });

  const continueVerse = mappedPosition
    ? {
        surahId: mappedPosition.surahId,
        verse: mappedPosition.verse,
        verseKey: `${mappedPosition.surahId}:${mappedPosition.verse}`,
      }
    : undefined;

  return { globalCurrentVerse, currentSecondaryText, continueVerse };
};
