import type { ProgressMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';
import type { PlannerPlan } from '@/types';

export const getProgressMetrics = (plan: PlannerPlan): ProgressMetrics => {
  const percent = plan.targetVerses
    ? Math.min(100, Math.max(0, Math.round((plan.completedVerses / plan.targetVerses) * 100)))
    : 0;
  const remainingVerses = Math.max(plan.targetVerses - plan.completedVerses, 0);
  // Show the last completed verse as the current position.
  // If nothing completed yet, default to the first verse.
  const currentVerse =
    plan.targetVerses > 0 ? Math.max(1, Math.min(plan.completedVerses, plan.targetVerses)) : 1;

  return {
    percent,
    remainingVerses,
    currentVerse,
    isComplete: percent >= 100,
  };
};
