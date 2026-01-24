import { convertPlanProgressToActualVerse } from '@/app/(features)/bookmarks/planner/utils/planRange';
import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';
import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type {
  DailyHighlight,
  PageMetrics,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

export interface DailyGoalWindow {
  hasDailyGoal: boolean;
  startVerse: number | null;
  endVerse: number | null;
  verseCount: number;
  pageLabel: string | null;
  juzLabel: string | null;
}

const computeStartProgressVerse = (plan: PlannerCardProps['plan']): number =>
  Math.min(plan.targetVerses, Math.max(1, plan.completedVerses + 1));

const computeEndProgressVerse = (
  plan: PlannerCardProps['plan'],
  startProgressVerse: number,
  versesPerDay: number
): number | null => {
  if (versesPerDay <= 0) return null;
  // Fixed session boundary: end at the end of the current session bucket.
  // sessionIndex is 1-based and determined from the start verse.
  const sessionIndex = Math.ceil(startProgressVerse / versesPerDay);
  const sessionEnd = sessionIndex * versesPerDay;
  return Math.min(plan.targetVerses, sessionEnd);
};

const getPageRange = (
  startVerse: number | null,
  endVerse: number | null,
  hasDailyGoal: boolean,
  pageMetrics: PageMetrics,
  i18n?: PlannerI18nContext
): { startPage: number | null; endPage: number | null; pageLabel: string | null } => {
  if (!hasDailyGoal || startVerse === null || endVerse === null) {
    return { startPage: null, endPage: null, pageLabel: null };
  }

  const startPage = pageMetrics.getPageForVerse(startVerse, 'start');
  const endPage = pageMetrics.getPageForVerse(endVerse, 'end');

  if (typeof startPage !== 'number' || typeof endPage !== 'number') {
    return { startPage, endPage, pageLabel: null };
  }

  const pageLabel =
    startPage === endPage
      ? i18n
        ? i18n.t('page_number_label', { number: startPage })
        : `Page ${startPage}`
      : i18n
        ? i18n.t('page_range_label', { start: startPage, end: endPage })
        : `Pages ${startPage}-${endPage}`;

  return { startPage, endPage, pageLabel };
};

const getJuzLabel = (
  startPage: number | null,
  endPage: number | null,
  i18n?: PlannerI18nContext
): string | null => {
  if (typeof startPage !== 'number' && typeof endPage !== 'number') return null;

  const startJuz = typeof startPage === 'number' ? getJuzByPage(startPage) : null;
  const endJuz = typeof endPage === 'number' ? getJuzByPage(endPage) : startJuz;

  if (typeof startJuz !== 'number' || typeof endJuz !== 'number') return null;
  if (startJuz === endJuz) {
    return i18n ? i18n.t('juz_number', { number: startJuz }) : `Juz ${startJuz}`;
  }
  return i18n
    ? i18n.t('juz_range_label', { start: startJuz, end: endJuz })
    : `Juz ${startJuz}-${endJuz}`;
};

const getVerseCount = (startVerse: number | null, endVerse: number | null): number => {
  if (startVerse === null || endVerse === null) return 0;
  return Math.max(0, endVerse - startVerse + 1);
};

export const buildDailyGoalWindow = ({
  plan,
  versesPerDay,
  isComplete,
  pageMetrics,
  i18n,
}: {
  plan: PlannerCardProps['plan'];
  versesPerDay: number;
  isComplete: boolean;
  pageMetrics: PageMetrics;
  i18n?: PlannerI18nContext;
}): DailyGoalWindow => {
  if (isComplete || plan.targetVerses <= 0) {
    return {
      hasDailyGoal: false,
      startVerse: null,
      endVerse: null,
      verseCount: 0,
      pageLabel: null,
      juzLabel: null,
    };
  }

  const startProgressVerse = computeStartProgressVerse(plan);
  const endProgressVerse = computeEndProgressVerse(plan, startProgressVerse, versesPerDay);

  const startVerse = convertPlanProgressToActualVerse(plan, startProgressVerse);
  const endVerse =
    typeof endProgressVerse === 'number'
      ? convertPlanProgressToActualVerse(plan, endProgressVerse)
      : null;

  const hasDailyGoal = typeof endVerse === 'number' && endVerse >= startVerse;
  const verseCount = getVerseCount(startVerse, endVerse);
  const { startPage, endPage, pageLabel } = getPageRange(
    startVerse,
    endVerse,
    hasDailyGoal,
    pageMetrics,
    i18n
  );
  const juzLabel = getJuzLabel(startPage, endPage, i18n);

  return {
    hasDailyGoal,
    startVerse,
    endVerse,
    verseCount,
    pageLabel,
    juzLabel,
  };
};

export const formatGoalVerseLabel = ({
  goal,
  surahLabel,
  surahId,
  i18n,
}: {
  goal: DailyGoalWindow;
  surahLabel: string;
  surahId: string;
  i18n?: PlannerI18nContext;
}): string => {
  if (!goal.hasDailyGoal || goal.startVerse === null || goal.endVerse === null) {
    return i18n ? i18n.t('planner_all_daily_goals_completed') : 'All daily goals completed';
  }
  if (goal.endVerse === goal.startVerse) {
    const label = `${surahLabel} ${surahId}:${goal.startVerse}`;
    return i18n ? localizeDigits(label, i18n.language) : label;
  }
  const label = `${surahLabel} ${surahId}:${goal.startVerse} - ${surahLabel} ${surahId}:${goal.endVerse}`;
  return i18n ? localizeDigits(label, i18n.language) : label;
};

export const getDailyHighlights = (
  goal: DailyGoalWindow,
  i18n?: PlannerI18nContext
): DailyHighlight[] => {
  if (!goal.hasDailyGoal) return [];
  const verseLabel =
    goal.verseCount > 0
      ? i18n
        ? `${formatNumber(goal.verseCount, i18n.language, { useGrouping: false })} ${
            goal.verseCount === 1 ? i18n.t('verse') : i18n.t('verses')
          }`
        : `${goal.verseCount} verse${goal.verseCount === 1 ? '' : 's'}`
      : null;
  const highlights = [
    { label: 'Verses today', value: verseLabel },
    { label: 'Pages', value: goal.pageLabel },
    { label: 'Juz', value: goal.juzLabel },
  ];

  return highlights.filter((highlight): highlight is DailyHighlight => Boolean(highlight.value));
};
