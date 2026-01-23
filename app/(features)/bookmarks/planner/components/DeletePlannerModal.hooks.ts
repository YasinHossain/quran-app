import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

export const usePlanCountLabel = (count: number): string | null => usePlanCountLabelInner(count);

const usePlanCountLabelInner = (count: number): string | null => {
  const { t } = useTranslation();
  return useMemo(
    () => (count <= 1 ? null : t('planner_delete_multi_surah_warning', { count })),
    [count, t]
  );
};
