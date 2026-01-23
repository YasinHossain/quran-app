import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type {
  PageMetrics,
  ProgressMetrics,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';
import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

export const buildProgressDetails = ({
  progress,
  pageMetrics,
  i18n,
}: {
  progress: ProgressMetrics;
  pageMetrics: PageMetrics;
  i18n?: PlannerI18nContext;
}): string => {
  const currentPage = pageMetrics.getPageForVerse(progress.currentVerse, 'start');
  const currentJuz = typeof currentPage === 'number' ? getJuzByPage(currentPage) : null;
  const parts: string[] = [];

  if (typeof currentPage === 'number') {
    parts.push(i18n ? i18n.t('page_number_label', { number: currentPage }) : `Page ${currentPage}`);
  }
  if (typeof currentJuz === 'number') {
    parts.push(i18n ? i18n.t('juz_number', { number: currentJuz }) : `Juz ${currentJuz}`);
  }

  return parts.join(' • ');
};
