'use client';
import { useCallback } from 'react';

import { createPlannerPlan, updatePlannerProgress } from '@/app/providers/bookmarks/bookmark-utils';
import { PlannerPlan } from '@/types';

export interface PlannerOperations {
  addToPlanner(surahId: number, targetVerses?: number, estimatedDays?: number): void;
  createPlannerPlan(
    surahId: number,
    targetVerses: number,
    planName?: string,
    estimatedDays?: number
  ): void;
  updatePlannerProgress(planId: string, completedVerses: number): void;
  removeFromPlanner(planId: string): void;
}
export default function usePlannerOperations(
  planner: Record<string, PlannerPlan>,
  setPlanner: React.Dispatch<React.SetStateAction<Record<string, PlannerPlan>>>
): PlannerOperations {
  const addToPlanner = useCallback(
    (surahId: number, targetVerses = 10, estimatedDays?: number) => {
      const plan = createPlannerPlan(surahId, targetVerses, undefined, estimatedDays);
      setPlanner((prev) => ({ ...prev, [plan.id]: plan }));
    },
    [setPlanner]
  );
  const createPlan = useCallback(
    (surahId: number, targetVerses: number, planName?: string, estimatedDays?: number) => {
      const plan = createPlannerPlan(surahId, targetVerses, planName, estimatedDays);
      setPlanner((prev) => ({ ...prev, [plan.id]: plan }));
    },
    [setPlanner]
  );
  const updateProgress = useCallback(
    (planId: string, completed: number) => {
      setPlanner((prev) => updatePlannerProgress(prev, planId, completed));
    },
    [setPlanner]
  );
  const removeFromPlanner = useCallback(
    (planId: string) => {
      setPlanner((prev) => {
        const next = { ...prev };
        delete next[planId];
        return next;
      });
    },
    [setPlanner]
  );
  return {
    addToPlanner,
    createPlannerPlan: createPlan,
    updatePlannerProgress: updateProgress,
    removeFromPlanner,
  };
}
