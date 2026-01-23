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
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

export const buildDailyFocus = ({
  plan,
  surahId,
  surahLabel,
  estimatedDays,
  progress,
  pageMetrics,
  i18n,
}: {
  plan: PlannerCardProps['plan'];
  surahId: string;
  surahLabel: string;
  estimatedDays: number;
  progress: ProgressMetrics;
  pageMetrics: PageMetrics;
  i18n?: PlannerI18nContext;
}): DailyFocusData => {
  const versesPerDay = getVersesPerDay(plan, estimatedDays);
  const goalWindow = buildDailyGoalWindow({
    plan,
    versesPerDay,
    isComplete: progress.isComplete,
    pageMetrics,
    ...(i18n ? { i18n } : {}),
  });

  const { dayLabel, remainingDaysLabel, endsAtValue } = getScheduleDetails({
    plan,
    estimatedDays,
    versesPerDay,
    isComplete: progress.isComplete,
    remainingVerses: progress.remainingVerses,
    ...(i18n ? { i18n } : {}),
  });

  const goalVerseLabel = formatGoalVerseLabel({
    goal: goalWindow,
    surahLabel,
    surahId,
    ...(i18n ? { i18n } : {}),
  });
  const dailyHighlights = getDailyHighlights(goalWindow, i18n);

  const remainingSummary = goalWindow.hasDailyGoal
    ? i18n
      ? i18n.t('planner_remaining_summary', { value: remainingDaysLabel })
      : `Remaining ${remainingDaysLabel}`
    : null;
  const endsAtSummary = goalWindow.hasDailyGoal
    ? i18n
      ? i18n.t('planner_ends_at_summary', { value: endsAtValue })
      : `Ends at ${endsAtValue}`
    : null;

  return {
    hasDailyGoal: goalWindow.hasDailyGoal,
    dayLabel,
    goalVerseLabel,
    dailyHighlights,
    remainingSummary,
    endsAtSummary,
    isComplete: progress.isComplete,
    noGoalMessage: i18n ? i18n.t('planner_no_daily_goal_message') : NO_DAILY_GOAL_MESSAGE,
  };
};
