import {
  getPlanEndVerse,
  getPlanStartVerse,
} from '@/app/(features)/bookmarks/planner/utils/planRange';
import { formatPlannerRangeDetails } from '@/app/(features)/bookmarks/planner/utils/planRangeLabel';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getSurahLabel = (
  surahId: string,
  chapter: PlannerCardProps['chapter'],
  i18n?: PlannerI18nContext
): string => getSurahLabelWithI18n(surahId, chapter, i18n);

const getSurahLabelWithI18n = (
  surahId: string,
  chapter: PlannerCardProps['chapter'],
  i18n?: PlannerI18nContext
): string => {
  const parsedSurahId = Number.parseInt(surahId, 10);
  const fallback = chapter?.name_simple || `Surah ${surahId}`;

  if (!i18n || !Number.isFinite(parsedSurahId)) {
    return fallback;
  }

  return i18n.t(`surah_names.${parsedSurahId}`, fallback);
};

export const buildPlanInfo = ({
  plan,
  surahId,
  surahLabel,
  estimatedDays,
  i18n,
}: {
  plan: PlannerCardProps['plan'];
  surahId: string;
  surahLabel: string;
  estimatedDays: number;
  i18n?: PlannerI18nContext;
}): PlannerCardViewModel['planInfo'] => {
  const planName = plan.notes?.trim()
    ? plan.notes.trim()
    : i18n
      ? i18n.t('planner_default_plan_name', { surah: surahLabel })
      : `Plan for Surah ${surahId}`;
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
          ...(i18n ? { i18n } : {}),
        })
      : null;

  return { displayPlanName, planDetailsText, surahLabel };
};
