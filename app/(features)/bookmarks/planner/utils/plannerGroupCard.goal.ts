import { getChapterDisplayName } from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import {
  convertPlanProgressToActualVerse,
  getPlanEndVerse,
} from '@/app/(features)/bookmarks/planner/utils/planRange';
import { localizeDigits } from '@/lib/text/localizeNumbers';

import type { Chapter, PlannerPlan } from '@/types';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

interface VersePosition {
  plan: PlannerPlan;
  surahId: number;
  verse: number;
  chapterName: string;
}

const isSingleChapter = (startPosition: VersePosition, endPosition: VersePosition): boolean =>
  startPosition.surahId === endPosition.surahId;

const buildSingleChapterLabel = (
  startPosition: VersePosition,
  endPosition: VersePosition,
  i18n?: PlannerI18nContext
): string => {
  const chapterName = i18n
    ? i18n.t(`surah_names.${startPosition.surahId}`, startPosition.chapterName)
    : startPosition.chapterName;

  if (startPosition.verse === endPosition.verse) {
    const label = `${chapterName} ${startPosition.surahId}:${startPosition.verse}`;
    return i18n ? localizeDigits(label, i18n.language) : label;
  }
  const label = `${chapterName} ${startPosition.surahId}:${startPosition.verse}-${endPosition.verse}`;
  return i18n ? localizeDigits(label, i18n.language) : label;
};

const buildMultiChapterLabel = (
  startPosition: VersePosition,
  endPosition: VersePosition,
  i18n?: PlannerI18nContext
): string => {
  const startName = i18n
    ? i18n.t(`surah_names.${startPosition.surahId}`, startPosition.chapterName)
    : startPosition.chapterName;
  const endName = i18n
    ? i18n.t(`surah_names.${endPosition.surahId}`, endPosition.chapterName)
    : endPosition.chapterName;
  const label = `${startName} ${startPosition.surahId}:${startPosition.verse} - ${endName} ${endPosition.surahId}:${endPosition.verse}`;
  return i18n ? localizeDigits(label, i18n.language) : label;
};

export const mapGlobalVerseToPosition = (
  plans: PlannerPlan[],
  globalVerse: number | null,
  chapterLookup: Map<number, Chapter>
): VersePosition | null => {
  if (globalVerse === null || globalVerse <= 0) return null;
  if (plans.length === 0) return null;
  let remaining = globalVerse;
  for (const plan of plans) {
    const maxVerse = Math.max(0, plan.targetVerses);
    if (maxVerse === 0) continue;
    if (remaining <= maxVerse) {
      const progressVerse = Math.max(1, Math.min(maxVerse, remaining));
      const verse = convertPlanProgressToActualVerse(plan, progressVerse);
      const chapter = chapterLookup.get(plan.surahId);
      return {
        plan,
        surahId: plan.surahId,
        verse,
        chapterName: getChapterDisplayName(plan, chapter),
      };
    }
    remaining -= maxVerse;
  }

  const lastPlan = plans[plans.length - 1] ?? null;
  if (!lastPlan) return null;
  const lastChapter = chapterLookup.get(lastPlan.surahId);
  return {
    plan: lastPlan,
    surahId: lastPlan.surahId,
    verse: getPlanEndVerse(lastPlan),
    chapterName: getChapterDisplayName(lastPlan, lastChapter),
  };
};

export const formatGoalVerseRangeLabel = (
  plans: PlannerPlan[],
  goalStart: number | null,
  goalEnd: number | null,
  chapterLookup: Map<number, Chapter>,
  i18n?: PlannerI18nContext
): string => {
  const startPosition = mapGlobalVerseToPosition(plans, goalStart, chapterLookup);
  const endPosition = mapGlobalVerseToPosition(plans, goalEnd, chapterLookup);
  if (!startPosition || !endPosition) {
    return i18n ? i18n.t('planner_all_daily_goals_completed') : 'All daily goals completed';
  }

  if (isSingleChapter(startPosition, endPosition)) {
    return buildSingleChapterLabel(startPosition, endPosition, i18n);
  }

  return buildMultiChapterLabel(startPosition, endPosition, i18n);
};
