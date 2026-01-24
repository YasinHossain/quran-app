import {
  buildPlaceholderCardData,
  buildPlannerCardFromGrouping,
  normalizePlannerTargets,
} from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.parts';

import type { PlannerPlanGroup } from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import type { PlannerGroupCardData } from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.parts';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';
import type { Chapter } from '@/types';

export type { PlannerGroupCardData } from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.parts';

export const buildPlannerGroupCardData = (
  group: PlannerPlanGroup,
  chapterLookup: Map<number, Chapter>,
  i18n?: PlannerI18nContext
): PlannerGroupCardData => {
  const normalized = normalizePlannerTargets(group);
  if (!normalized) {
    return buildPlaceholderCardData(group, chapterLookup, i18n);
  }

  return buildPlannerCardFromGrouping(group, normalized, chapterLookup, i18n);
};
