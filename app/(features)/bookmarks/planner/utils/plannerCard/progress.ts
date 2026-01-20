import { convertPlanProgressToActualVerse } from '@/app/(features)/bookmarks/planner/utils/planRange';

import type { ProgressMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';
import type { PlannerPlan } from '@/types';

export const getProgressMetrics = (plan: PlannerPlan): ProgressMetrics => {
  const safeTarget = Math.max(0, plan.targetVerses);
  const safeCompleted = Math.max(0, Math.min(plan.completedVerses, safeTarget));

  const percent = safeTarget
    ? Math.min(100, Math.max(0, Math.round((safeCompleted / safeTarget) * 100)))
    : 0;
  const remainingVerses = Math.max(safeTarget - safeCompleted, 0);
  // Show the last completed verse as the current position.
  // If nothing completed yet, default to the first verse.
  const currentProgressVerse =
    safeTarget > 0 ? Math.max(1, Math.min(safeCompleted, safeTarget)) : 1;
  const currentVerse = convertPlanProgressToActualVerse(plan, currentProgressVerse);

  return {
    percent,
    remainingVerses,
    currentVerse,
    isComplete: percent >= 100,
  };
};
