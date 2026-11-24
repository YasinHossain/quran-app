import { buildDailyFocus } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/dailyFocus';
import { getJuzMetrics } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/juz';
import { getEstimatedDays } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/pacing';
import { getPageMetrics } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/pages';
import {
  buildPlanInfo,
  getSurahLabel,
} from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/planInfo';
import { getProgressMetrics } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/progress';
import { buildProgressDetails } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/progressDetails';
import { buildStats } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/stats';

import type { PlannerCardProps } from '@/app/[lang]/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerCard/types';
import type { PlannerI18nContext } from '@/app/[lang]/(features)/bookmarks/planner/utils/plannerI18n';

export const createPlannerCardViewModel = (
  params: PlannerCardProps,
  i18n?: PlannerI18nContext
): PlannerCardViewModel => {
  const surahLabel = getSurahLabel(params.surahId, params.chapter, i18n);
  const estimatedDays = getEstimatedDays(params.plan);
  const progress = getProgressMetrics(params.plan);
  const pageMetrics = getPageMetrics(params.plan, params.chapter);
  const juzMetrics = getJuzMetrics(params.plan, pageMetrics);

  const planInfo = buildPlanInfo({
    plan: params.plan,
    surahId: params.surahId,
    surahLabel,
    estimatedDays,
    ...(i18n ? { i18n } : {}),
  });
  const focus = buildDailyFocus({
    plan: params.plan,
    surahId: params.surahId,
    surahLabel,
    estimatedDays,
    progress,
    pageMetrics,
    ...(i18n ? { i18n } : {}),
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
    ...(i18n ? { i18n } : {}),
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
