import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import type { PlannerPlan } from '@/types';

export interface PlannerCardChapter {
  name_simple: string;
  name_arabic: string;
  pages?: [number, number];
}

export interface PlannerCardProps {
  surahId: string;
  plan: PlannerPlan;
  chapter?: PlannerCardChapter;
  precomputedViewModel?: PlannerCardViewModel;
  progressLabel?: string;
}
