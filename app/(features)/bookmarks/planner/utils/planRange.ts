import type { PlannerPlan } from '@/types';

const normalizeVerse = (value: number | undefined): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  const rounded = Math.floor(value);
  return rounded >= 1 ? rounded : undefined;
};

export const getPlanStartVerse = (plan: PlannerPlan): number => {
  return normalizeVerse(plan.startVerse) ?? 1;
};

export const getPlanEndVerse = (plan: PlannerPlan): number => {
  const startVerse = getPlanStartVerse(plan);
  const explicitEnd = normalizeVerse(plan.endVerse);
  if (typeof explicitEnd === 'number' && explicitEnd >= startVerse) {
    return explicitEnd;
  }
  if (plan.targetVerses > 0) {
    return startVerse + plan.targetVerses - 1;
  }
  return startVerse;
};

export const clampActualVerseToPlanRange = (plan: PlannerPlan, verse: number): number => {
  const startVerse = getPlanStartVerse(plan);
  const endVerse = getPlanEndVerse(plan);
  const normalized = normalizeVerse(verse);
  if (typeof normalized !== 'number') return startVerse;
  if (normalized < startVerse) return startVerse;
  if (normalized > endVerse) return endVerse;
  return normalized;
};

export const convertPlanProgressToActualVerse = (
  plan: PlannerPlan,
  progressVerse: number
): number => {
  const startVerse = getPlanStartVerse(plan);
  if (plan.targetVerses <= 0) return startVerse;
  const clampedProgress = Math.max(1, Math.min(plan.targetVerses, Math.floor(progressVerse)));
  return startVerse + clampedProgress - 1;
};

export const convertActualVerseToPlanProgress = (plan: PlannerPlan, verse: number): number => {
  if (plan.targetVerses <= 0) return 0;
  const startVerse = getPlanStartVerse(plan);
  const endVerse = getPlanEndVerse(plan);
  const normalized = normalizeVerse(verse);
  if (typeof normalized !== 'number') return 0;
  if (normalized < startVerse) return 0;
  if (normalized > endVerse) return plan.targetVerses;
  return Math.min(plan.targetVerses, normalized - startVerse + 1);
};
