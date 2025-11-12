import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerPlan } from '@/types';

export interface ProgressMetrics {
  percent: number;
  remainingVerses: number;
  currentVerse: number;
  isComplete: boolean;
}

export interface PageMetrics {
  startPage: number | null;
  endPage: number | null;
  totalPages: number | null;
  completedPagesCount: number | null;
  remainingPagesCount: number | null;
  goalPagesCount: number | null;
  getPageForVerse: (verseNumber: number, mode: 'start' | 'end') => number | null;
}

export interface JuzMetrics {
  startJuz: number | null;
  endJuz: number | null;
  totalJuzCount: number | null;
  completedJuzCount: number | null;
  remainingJuzCount: number | null;
  goalJuzCount: number | null;
}

export interface DailyHighlight {
  label: string;
  value: string;
}

export interface DailyFocusData {
  hasDailyGoal: boolean;
  dayLabel: string;
  goalVerseLabel: string;
  dailyHighlights: DailyHighlight[];
  remainingSummary: string | null;
  endsAtSummary: string | null;
  isComplete: boolean;
  noGoalMessage: string;
}

export interface PlannerStatsGroup {
  verses: number;
  pages: number | null;
  juz: number | null;
}

export interface PlannerStats {
  completed: PlannerStatsGroup;
  remaining: PlannerStatsGroup;
  goal: PlannerStatsGroup;
}

export interface PlannerCardViewModel {
  planInfo: {
    displayPlanName: string;
    planDetailsText: string | null;
    surahLabel: string;
  };
  focus: DailyFocusData;
  stats: PlannerStats;
  progress: {
    percent: number;
    currentVerse: number;
    currentSecondaryText: string;
  };
}

export interface PlannerCardViewModelParams extends PlannerCardProps {
  plan: PlannerPlan;
}
