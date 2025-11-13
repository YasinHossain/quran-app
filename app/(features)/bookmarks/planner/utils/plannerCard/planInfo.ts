import { getPlanEndVerse, getPlanStartVerse } from '@/app/(features)/bookmarks/planner/utils/planRange';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getSurahLabel = (surahId: string, chapter: PlannerCardProps['chapter']): string =>
  chapter?.name_simple || `Surah ${surahId}`;

export const buildPlanInfo = ({
  plan,
  surahId,
  surahLabel,
  estimatedDays,
}: {
  plan: PlannerCardProps['plan'];
  surahId: string;
  surahLabel: string;
  estimatedDays: number;
}): PlannerCardViewModel['planInfo'] => {
  const planName = plan.notes?.trim() ? plan.notes.trim() : `Plan for Surah ${surahId}`;
  const normalizedPlanName = planName.trim();
  const cleanedPlanName = normalizedPlanName
    .replace(new RegExp(`\\s*[-–—]\\s*${escapeRegex(surahLabel)}$`, 'i'), '')
    .trim();
  const displayPlanName = cleanedPlanName.length > 0 ? cleanedPlanName : normalizedPlanName;

  const startVerse = getPlanStartVerse(plan);
  const endVerse = getPlanEndVerse(plan);
  const goalRangeText =
    plan.targetVerses > 0
      ? `${surahLabel} ${surahId}:${startVerse} to ${surahLabel} ${surahId}:${endVerse}`
      : null;
  const planDurationText =
    estimatedDays > 0 ? `${estimatedDays} day${estimatedDays === 1 ? '' : 's'}` : null;
  const planDetailsParts = [goalRangeText, planDurationText].filter((part): part is string =>
    Boolean(part)
  );
  const planDetailsText = planDetailsParts.length > 0 ? planDetailsParts.join(' \u2022 ') : null;

  return { displayPlanName, planDetailsText, surahLabel };
};
