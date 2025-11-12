import { buildGroupRangeLabel } from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { NO_DAILY_GOAL_MESSAGE } from '@/app/(features)/bookmarks/planner/utils/plannerCard/constants';
import { buildAggregatedChapter } from '@/app/(features)/bookmarks/planner/utils/plannerGroupCard.helpers';

import type { PlannerGroupCardData } from './plannerGroupCard.types';
import type { PlannerPlanGroup } from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import type { Chapter, PlannerPlan } from '@/types';

const buildPlaceholderViewModel = (
  planName: string,
  planDetailsText: string,
  surahLabel: string
): PlannerCardViewModel => ({
  planInfo: {
    displayPlanName: planName,
    planDetailsText,
    surahLabel,
  },
  focus: {
    hasDailyGoal: false,
    dayLabel: 'Getting started',
    goalVerseLabel: 'All daily goals completed',
    dailyHighlights: [],
    remainingSummary: null,
    endsAtSummary: null,
    isComplete: true,
    noGoalMessage: NO_DAILY_GOAL_MESSAGE,
  },
  stats: {
    completed: { verses: 0, pages: null, juz: null },
    remaining: { verses: 0, pages: null, juz: null },
    goal: { verses: 0, pages: null, juz: null },
  },
  progress: {
    percent: 0,
    currentVerse: 1,
    currentSecondaryText: '',
  },
});

export const buildPlaceholderCardData = (
  group: PlannerPlanGroup,
  chapterLookup: Map<number, Chapter>
): PlannerGroupCardData => {
  const fallbackSurahId = group.surahIds[0] ?? 1;
  const placeholderPlan: PlannerPlan = {
    id: group.planIds[0] ?? `${group.key}-placeholder`,
    surahId: fallbackSurahId,
    targetVerses: 0,
    completedVerses: 0,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    notes: group.planName,
    estimatedDays: 0,
  };
  const placeholderChapter = buildAggregatedChapter(group.surahIds, chapterLookup);
  const rangeLabel = buildGroupRangeLabel(group.surahIds, chapterLookup);
  const surahLabel = placeholderChapter?.name_simple ?? `Surah ${placeholderPlan.surahId}`;
  const viewModel = buildPlaceholderViewModel(group.planName, rangeLabel, surahLabel);

  return {
    key: group.key,
    surahId: String(fallbackSurahId),
    plan: placeholderPlan,
    ...(placeholderChapter ? { chapter: placeholderChapter } : {}),
    viewModel,
    progressLabel: 'No progress tracked',
    planIds: group.planIds,
    planName: group.planName,
  };
};
