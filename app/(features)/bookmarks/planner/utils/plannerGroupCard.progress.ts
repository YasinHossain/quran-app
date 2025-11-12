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
  chapterLookup: Map<number, Chapter>
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
  });
  const dailyFocus = buildDailyFocus({
    aggregatedPlan,
    normalizedEstimatedDays,
    progressMetrics,
    pageMetrics,
    plans,
    chapterLookup,
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
}

const buildDailyFocus = ({
  aggregatedPlan,
  normalizedEstimatedDays,
  progressMetrics,
  pageMetrics,
  plans,
  chapterLookup,
}: DailyFocusParams): PlannerCardViewModel['focus'] => {
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

  return {
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
};

interface PositionInput {
  aggregatedPlan: PlannerPlan;
  plans: PlannerPlan[];
  chapterLookup: Map<number, Chapter>;
  pageMetrics: ReturnType<typeof getPageMetrics>;
  progressMetrics: ReturnType<typeof getProgressMetrics>;
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
