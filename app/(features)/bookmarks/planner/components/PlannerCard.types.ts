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
}
