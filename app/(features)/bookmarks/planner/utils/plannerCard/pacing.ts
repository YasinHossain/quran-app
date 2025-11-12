import { DEFAULT_ESTIMATED_DAYS } from './constants';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';

export const getEstimatedDays = (plan: PlannerCardProps['plan']): number =>
  typeof plan.estimatedDays === 'number' && plan.estimatedDays > 0
    ? plan.estimatedDays
    : DEFAULT_ESTIMATED_DAYS;

export const getVersesPerDay = (plan: PlannerCardProps['plan'], estimatedDays: number): number =>
  plan.targetVerses > 0 && estimatedDays > 0
    ? Math.max(1, Math.ceil(plan.targetVerses / estimatedDays))
    : plan.targetVerses;

export const getActiveDayNumber = (
  plan: PlannerCardProps['plan'],
  estimatedDays: number,
  versesPerDay: number
): number => {
  if (estimatedDays <= 0 || versesPerDay <= 0) return 1;
  return Math.min(estimatedDays, Math.max(1, Math.floor(plan.completedVerses / versesPerDay) + 1));
};
