import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type {
  DailyHighlight,
  PageMetrics,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

export interface DailyGoalWindow {
  hasDailyGoal: boolean;
  startVerse: number | null;
  endVerse: number | null;
  verseCount: number;
  pageLabel: string | null;
  juzLabel: string | null;
}

const computeStartVerse = (plan: PlannerCardProps['plan']): number =>
  Math.min(plan.targetVerses, Math.max(1, plan.completedVerses + 1));

const computeEndVerse = (
  plan: PlannerCardProps['plan'],
  startVerse: number,
  versesPerDay: number
): number | null => {
  if (versesPerDay <= 0) return null;
  // Fixed session boundary: end at the end of the current session bucket.
  // sessionIndex is 1-based and determined from the start verse.
  const sessionIndex = Math.ceil(startVerse / versesPerDay);
  const sessionEnd = sessionIndex * versesPerDay;
  return Math.min(plan.targetVerses, sessionEnd);
};

const getPageRange = (
  startVerse: number | null,
  endVerse: number | null,
  hasDailyGoal: boolean,
  pageMetrics: PageMetrics
): { startPage: number | null; endPage: number | null; pageLabel: string | null } => {
  if (!hasDailyGoal || startVerse === null || endVerse === null) {
    return { startPage: null, endPage: null, pageLabel: null };
  }

  const startPage = pageMetrics.getPageForVerse(startVerse, 'start');
  const endPage = pageMetrics.getPageForVerse(endVerse, 'end');

  if (typeof startPage !== 'number' || typeof endPage !== 'number') {
    return { startPage, endPage, pageLabel: null };
  }

  const pageLabel = startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}-${endPage}`;

  return { startPage, endPage, pageLabel };
};

const getJuzLabel = (startPage: number | null, endPage: number | null): string | null => {
  if (typeof startPage !== 'number' && typeof endPage !== 'number') return null;

  const startJuz = typeof startPage === 'number' ? getJuzByPage(startPage) : null;
  const endJuz = typeof endPage === 'number' ? getJuzByPage(endPage) : startJuz;

  if (typeof startJuz !== 'number' || typeof endJuz !== 'number') return null;
  return startJuz === endJuz ? `Juz ${startJuz}` : `Juz ${startJuz}-${endJuz}`;
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
}: {
  plan: PlannerCardProps['plan'];
  versesPerDay: number;
  isComplete: boolean;
  pageMetrics: PageMetrics;
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

  const startVerse = computeStartVerse(plan);
  const endVerse = computeEndVerse(plan, startVerse, versesPerDay);
  const hasDailyGoal = typeof endVerse === 'number' && endVerse >= startVerse;
  const verseCount = getVerseCount(startVerse, typeof endVerse === 'number' ? endVerse : null);
  const { startPage, endPage, pageLabel } = getPageRange(
    startVerse,
    typeof endVerse === 'number' ? endVerse : null,
    hasDailyGoal,
    pageMetrics
  );
  const juzLabel = getJuzLabel(startPage, endPage);

  return {
    hasDailyGoal,
    startVerse,
    endVerse: typeof endVerse === 'number' ? endVerse : null,
    verseCount,
    pageLabel,
    juzLabel,
  };
};

export const formatGoalVerseLabel = ({
  goal,
  surahLabel,
  surahId,
}: {
  goal: DailyGoalWindow;
  surahLabel: string;
  surahId: string;
}): string => {
  if (!goal.hasDailyGoal || goal.startVerse === null || goal.endVerse === null) {
    return 'All daily goals completed';
  }
  if (goal.endVerse === goal.startVerse) {
    return `${surahLabel} ${surahId}:${goal.startVerse}`;
  }
  return `${surahLabel} ${surahId}:${goal.startVerse} - ${surahLabel} ${surahId}:${goal.endVerse}`;
};

export const getDailyHighlights = (goal: DailyGoalWindow): DailyHighlight[] => {
  if (!goal.hasDailyGoal) return [];
  const verseLabel =
    goal.verseCount > 0 ? `${goal.verseCount} verse${goal.verseCount === 1 ? '' : 's'}` : null;
  const highlights = [
    { label: 'Verses today', value: verseLabel },
    { label: 'Pages', value: goal.pageLabel },
    { label: 'Juz', value: goal.juzLabel },
  ];

  return highlights.filter((highlight): highlight is DailyHighlight => Boolean(highlight.value));
};
