import { DAY_IN_MS } from '@/app/(features)/bookmarks/planner/utils/plannerCard/constants';
import { getActiveDayNumber } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

const getDayLabel = (
  isComplete: boolean,
  estimatedDays: number,
  activeDayNumber: number,
  i18n?: PlannerI18nContext
): string =>
  i18n
    ? isComplete
      ? estimatedDays === 1
        ? i18n.t('planner_completed_in_one_day', { days: estimatedDays })
        : i18n.t('planner_completed_in_days', { days: estimatedDays })
      : i18n.t('planner_day_of_total', { day: activeDayNumber, total: estimatedDays })
    : isComplete
      ? `Completed in ${estimatedDays} day${estimatedDays === 1 ? '' : 's'}`
      : `Day ${activeDayNumber} of ${estimatedDays}`;

const getRemainingDays = (
  isComplete: boolean,
  versesPerDay: number,
  remainingVerses: number
): number => {
  if (isComplete || versesPerDay <= 0) return 0;
  return Math.max(0, Math.ceil(remainingVerses / versesPerDay));
};

const getProjectedCompletionLabel = (remainingDays: number): string | null => {
  if (remainingDays <= 0) return null;
  const projectedDate = new Date(Date.now() + remainingDays * DAY_IN_MS);
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
      projectedDate
    );
  } catch {
    return projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const formatRemainingDaysLabel = (
  isComplete: boolean,
  remainingDays: number,
  i18n?: PlannerI18nContext
): string => {
  if (i18n) {
    if (isComplete) return i18n.t('completed');
    if (remainingDays <= 0) return i18n.t('planner_due_today');
    if (remainingDays === 1) return i18n.t('planner_one_day', { count: 1 });
    return i18n.t('planner_n_days', { count: remainingDays });
  }

  if (isComplete) return 'Completed';
  if (remainingDays <= 0) return 'Due today';
  if (remainingDays === 1) return '1 day';
  return `${remainingDays} days`;
};

export const getScheduleDetails = ({
  plan,
  estimatedDays,
  versesPerDay,
  isComplete,
  remainingVerses,
  i18n,
}: {
  plan: PlannerCardProps['plan'];
  estimatedDays: number;
  versesPerDay: number;
  isComplete: boolean;
  remainingVerses: number;
  i18n?: PlannerI18nContext;
}): {
  dayLabel: string;
  remainingDaysLabel: string;
  endsAtValue: string;
} => {
  const normalizedEstimatedDays = Math.max(1, Math.round(estimatedDays));
  const activeDayNumber = getActiveDayNumber(plan, normalizedEstimatedDays, versesPerDay);
  const dayLabel = getDayLabel(isComplete, normalizedEstimatedDays, activeDayNumber, i18n);
  const remainingDays = getRemainingDays(isComplete, versesPerDay, remainingVerses);
  const projectedCompletionLabel = (() => {
    if (remainingDays <= 0) return null;
    const projectedDate = new Date(Date.now() + remainingDays * DAY_IN_MS);
    if (!i18n) {
      return getProjectedCompletionLabel(remainingDays);
    }
    try {
      return new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric' }).format(
        projectedDate
      );
    } catch {
      return getProjectedCompletionLabel(remainingDays);
    }
  })();
  const remainingDaysLabel = formatRemainingDaysLabel(isComplete, remainingDays, i18n);
  const endsAtValue = !isComplete && projectedCompletionLabel ? projectedCompletionLabel : '—';

  return { dayLabel, remainingDaysLabel, endsAtValue };
};
