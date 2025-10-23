import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type {
  JuzMetrics,
  PageMetrics,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

export const getJuzMetrics = (plan: PlannerCardProps['plan'], pages: PageMetrics): JuzMetrics => {
  const startJuz = typeof pages.startPage === 'number' ? getJuzByPage(pages.startPage) : null;
  const endJuz = typeof pages.endPage === 'number' ? getJuzByPage(pages.endPage) : null;
  const totalJuzCount =
    startJuz && endJuz ? Math.max(1, endJuz - startJuz + 1) : startJuz ? 1 : null;

  const computeJuzCountFromVerses = (verses: number): number | null => {
    if (totalJuzCount === null) return null;
    if (plan.targetVerses <= 0) return 0;
    if (verses <= 0) return 0;
    const ratio = Math.min(1, Math.max(0, verses / plan.targetVerses));
    return Math.max(0, Math.min(totalJuzCount, Math.round(ratio * totalJuzCount)));
  };

  const completedJuzCount = computeJuzCountFromVerses(plan.completedVerses);
  const remainingJuzCount =
    totalJuzCount !== null && completedJuzCount !== null
      ? Math.max(totalJuzCount - completedJuzCount, 0)
      : null;

  return {
    startJuz,
    endJuz,
    totalJuzCount,
    completedJuzCount,
    remainingJuzCount,
    goalJuzCount: totalJuzCount,
  };
};
