import { getChapterDisplayName } from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { getEstimatedDays } from '@/app/(features)/bookmarks/planner/utils/plannerCard/pacing';
import {
  buildAggregatedChapter,
  buildAggregatedPlan,
  buildProgressLabel,
  formatPlanDetails,
  getActivePlan,
} from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.helpers';

import { computeProgressStats } from './plannerGroupCard.progress';

import type { PlannerGroupCardData } from './plannerGroupCard.types';
import type { PlannerCardChapter } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerPlanGroup } from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import type { Chapter, PlannerPlan } from '@/types';

export { buildPlaceholderCardData } from './plannerGroupCard.placeholder';
export type { PlannerGroupCardData } from './plannerGroupCard.types';

interface NormalizedPlannerTargetsResult {
  plans: PlannerPlan[];
  activePlan: PlannerPlan;
  recentPlan: PlannerPlan;
  aggregatedPlan: PlannerPlan;
  normalizedEstimatedDays: number;
}

interface ChapterGroupingResult {
  aggregatedChapter?: PlannerCardChapter;
  planDetailsText: string;
  surahLabel: string;
}

export const normalizePlannerTargets = (
  group: PlannerPlanGroup
): NormalizedPlannerTargetsResult | null => {
  const plans = group.plans.slice().sort((a, b) => a.surahId - b.surahId);
  if (plans.length === 0) return null;

  const activePlan = getActivePlan(plans);
  const recentPlan = plans.reduce(
    (latest, plan) => (plan.lastUpdated > latest.lastUpdated ? plan : latest),
    plans[0]!
  );

  const estimatedDaysCandidate =
    plans.find((plan) => typeof plan.estimatedDays === 'number' && plan.estimatedDays > 0)
      ?.estimatedDays ?? activePlan.estimatedDays;
  const estimatedDaysSeed =
    typeof estimatedDaysCandidate === 'number' && estimatedDaysCandidate > 0
      ? Math.round(estimatedDaysCandidate)
      : 0;

  const aggregatedPlan = buildAggregatedPlan(group, plans, activePlan, estimatedDaysSeed);
  const normalizedEstimatedDays = getEstimatedDays(aggregatedPlan);

  return { plans, activePlan, recentPlan, aggregatedPlan, normalizedEstimatedDays };
};

export const deriveChapterGrouping = (
  group: PlannerPlanGroup,
  normalized: NormalizedPlannerTargetsResult,
  chapterLookup: Map<number, Chapter>
): ChapterGroupingResult => {
  const aggregatedChapter = buildAggregatedChapter(group.surahIds, chapterLookup);
  const planDetailsText = formatPlanDetails(
    group,
    normalized.aggregatedPlan.targetVerses,
    normalized.normalizedEstimatedDays,
    chapterLookup
  );
  const activeChapter = chapterLookup.get(normalized.activePlan.surahId);
  const surahLabel =
    aggregatedChapter?.name_simple ?? getChapterDisplayName(normalized.activePlan, activeChapter);

  const result: ChapterGroupingResult = {
    planDetailsText,
    surahLabel,
  };

  if (aggregatedChapter) {
    result.aggregatedChapter = aggregatedChapter;
  }

  return result;
};

export const buildGroupCardHeader = (
  group: PlannerPlanGroup,
  grouping: ChapterGroupingResult
): PlannerCardViewModel['planInfo'] => ({
  displayPlanName: group.planName,
  planDetailsText: grouping.planDetailsText,
  surahLabel: grouping.surahLabel,
});

export const buildPlannerCardFromGrouping = (
  group: PlannerPlanGroup,
  normalized: NormalizedPlannerTargetsResult,
  chapterLookup: Map<number, Chapter>
): PlannerGroupCardData => {
  const grouping = deriveChapterGrouping(group, normalized, chapterLookup);
  const progressContext = computeProgressStats(
    {
      aggregatedPlan: normalized.aggregatedPlan,
      normalizedEstimatedDays: normalized.normalizedEstimatedDays,
      plans: normalized.plans,
    },
    grouping.aggregatedChapter,
    chapterLookup
  );
  const planInfo = buildGroupCardHeader(group, grouping);

  return {
    key: group.key,
    surahId: String(normalized.recentPlan.surahId),
    plan: normalized.aggregatedPlan,
    ...(grouping.aggregatedChapter ? { chapter: grouping.aggregatedChapter } : {}),
    viewModel: {
      planInfo,
      focus: progressContext.dailyFocus,
      stats: progressContext.stats,
      progress: progressContext.progress,
    },
    progressLabel: buildProgressLabel(
      normalized.plans,
      progressContext.progressMetrics.isComplete,
      chapterLookup
    ),
    planIds: group.planIds,
    planName: group.planName,
    ...(progressContext.continueVerse ? { continueVerse: progressContext.continueVerse } : {}),
  };
};
