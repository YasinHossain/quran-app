import { buildDailyFocus } from '@/app/(features)/bookmarks/planner/utils/plannerCard/dailyFocus';
import { getJuzMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/juz';
import { getEstimatedDays } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';
import { getPageMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pages';
import {
  buildPlanInfo,
  getSurahLabel,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/planInfo';
import { getProgressMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progress';
import { buildProgressDetails } from '@/app/(features)/bookmarks/planner/utils/plannerCard/progressDetails';
import { buildStats } from '@/app/(features)/bookmarks/planner/utils/plannerCard/stats';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

export const createPlannerCardViewModel = (params: PlannerCardProps): PlannerCardViewModel => {
  const surahLabel = getSurahLabel(params.surahId, params.chapter);
  const estimatedDays = getEstimatedDays(params.plan);
  const progress = getProgressMetrics(params.plan);
  const pageMetrics = getPageMetrics(params.plan, params.chapter);
  const juzMetrics = getJuzMetrics(params.plan, pageMetrics);

  const planInfo = buildPlanInfo({
    plan: params.plan,
    surahId: params.surahId,
    surahLabel,
    estimatedDays,
  });
  const focus = buildDailyFocus({
    plan: params.plan,
    surahId: params.surahId,
    surahLabel,
    estimatedDays,
    progress,
    pageMetrics,
  });
  const stats = buildStats({
    plan: params.plan,
    pageMetrics,
    juzMetrics,
    remainingVerses: progress.remainingVerses,
  });
  const currentSecondaryText = buildProgressDetails({
    progress,
    pageMetrics,
  });

  return {
    planInfo,
    focus,
    stats,
    progress: {
      percent: progress.percent,
      currentVerse: progress.currentVerse,
      currentSecondaryText,
    },
  };
};
