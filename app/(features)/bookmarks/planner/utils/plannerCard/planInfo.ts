import {
  getPlanEndVerse,
  getPlanStartVerse,
} from '@/app/(features)/bookmarks/planner/utils/planRange';
import { formatPlannerRangeDetails } from '@/app/(features)/bookmarks/planner/utils/planRangeLabel';

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
  const planDetailsText =
    plan.targetVerses > 0
      ? formatPlannerRangeDetails({
          start: { chapterName: surahLabel, surahId, verse: startVerse },
          end: { chapterName: surahLabel, surahId, verse: endVerse },
          estimatedDays,
        })
      : null;

  return { displayPlanName, planDetailsText, surahLabel };
};
