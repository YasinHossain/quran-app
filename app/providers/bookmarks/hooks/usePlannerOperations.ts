'use client';
import { useCallback } from 'react';

import { createPlannerPlan, updatePlannerProgress } from '@/app/providers/bookmarks/bookmark-utils';
import { PlannerPlan } from '@/types';

export interface PlannerOperations {
  addToPlanner(surahId: number, targetVerses?: number): void;
  createPlannerPlan(surahId: number, targetVerses: number, planName?: string): void;
  updatePlannerProgress(surahId: number, completedVerses: number): void;
  removeFromPlanner(surahId: number): void;
}
export default function usePlannerOperations(
  planner: Record<string, PlannerPlan>,
  setPlanner: React.Dispatch<React.SetStateAction<Record<string, PlannerPlan>>>
): PlannerOperations {
  const addToPlanner = useCallback(
    (surahId: number, targetVerses = 10) => {
      const key = surahId.toString();
      if (planner[key]) return;
      const plan = createPlannerPlan(surahId, targetVerses);
      setPlanner((prev) => ({ ...prev, [key]: plan }));
    },
    [planner, setPlanner]
  );
  const createPlan = useCallback(
    (surahId: number, targetVerses: number, planName?: string) => {
      const key = surahId.toString();
      const plan = createPlannerPlan(surahId, targetVerses, planName);
      setPlanner((prev) => ({ ...prev, [key]: plan }));
    },
    [setPlanner]
  );
  const updateProgress = useCallback(
    (surahId: number, completed: number) => {
      setPlanner((prev) => updatePlannerProgress(prev, surahId, completed));
    },
    [setPlanner]
  );
  const removeFromPlanner = useCallback(
    (surahId: number) => {
      const key = surahId.toString();
      setPlanner((prev) => {
        const next = { ...prev };
        delete next[key];
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
