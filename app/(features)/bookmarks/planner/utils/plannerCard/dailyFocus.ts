import { NO_DAILY_GOAL_MESSAGE } from '@/app/(features)/bookmarks/planner/utils/plannerCard/constants';
import {
  buildDailyGoalWindow,
  formatGoalVerseLabel,
  getDailyHighlights,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/dailyGoal';
import { getVersesPerDay } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';
import { getScheduleDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/schedule';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type {
  DailyFocusData,
  PageMetrics,
  ProgressMetrics,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

export const buildDailyFocus = ({
  plan,
  surahId,
  surahLabel,
  estimatedDays,
  progress,
  pageMetrics,
}: {
  plan: PlannerCardProps['plan'];
  surahId: string;
  surahLabel: string;
  estimatedDays: number;
  progress: ProgressMetrics;
  pageMetrics: PageMetrics;
}): DailyFocusData => {
  const versesPerDay = getVersesPerDay(plan, estimatedDays);
  const goalWindow = buildDailyGoalWindow({
    plan,
    versesPerDay,
    isComplete: progress.isComplete,
    pageMetrics,
  });

  const { dayLabel, remainingDaysLabel, endsAtValue } = getScheduleDetails({
    plan,
    estimatedDays,
    versesPerDay,
    isComplete: progress.isComplete,
    remainingVerses: progress.remainingVerses,
  });

  const goalVerseLabel = formatGoalVerseLabel({
    goal: goalWindow,
    surahLabel,
    surahId,
  });
  const dailyHighlights = getDailyHighlights(goalWindow);

  const remainingSummary = goalWindow.hasDailyGoal ? `Remaining ${remainingDaysLabel}` : null;
  const endsAtSummary = goalWindow.hasDailyGoal ? `Ends at ${endsAtValue}` : null;

  return {
    hasDailyGoal: goalWindow.hasDailyGoal,
    dayLabel,
    goalVerseLabel,
    dailyHighlights,
    remainingSummary,
    endsAtSummary,
    isComplete: progress.isComplete,
    noGoalMessage: NO_DAILY_GOAL_MESSAGE,
  };
};
