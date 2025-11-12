import { useMemo } from 'react';

import {
  buildChapterLookup,
  groupPlannerPlans,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';

import type { Chapter, PlannerPlan } from '@/types';

export const useEffectivePlanIds = ({
  planIds,
  groupKey,
  planner,
  chapters,
}: {
  planIds: string[] | null;
  groupKey: string | null;
  planner: Record<string, PlannerPlan>;
  chapters: Chapter[];
}): string[] =>
  useMemo(() => {
    if (Array.isArray(planIds) && planIds.length > 0) return planIds;
    if (!groupKey) return [];
    const lookup = buildChapterLookup(chapters);
    const groups = groupPlannerPlans(planner, lookup);
    const match = groups.find((g) => g.key === groupKey);
    return match?.planIds ?? [];
  }, [chapters, groupKey, planIds, planner]);

export const usePlanCountLabel = (count: number): string | null =>
  useMemo(
    () => (count <= 1 ? null : `This plan includes ${count} surahs. All will be removed.`),
    [count]
  );
