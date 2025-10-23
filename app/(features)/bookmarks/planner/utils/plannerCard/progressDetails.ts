import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type {
  PageMetrics,
  ProgressMetrics,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

export const buildProgressDetails = ({
  progress,
  pageMetrics,
}: {
  progress: ProgressMetrics;
  pageMetrics: PageMetrics;
}): string => {
  const currentPage = pageMetrics.getPageForVerse(progress.currentVerse, 'start');
  const currentJuz = typeof currentPage === 'number' ? getJuzByPage(currentPage) : null;
  const parts: string[] = [];

  if (typeof currentPage === 'number') parts.push(`Page ${currentPage}`);
  if (typeof currentJuz === 'number') parts.push(`Juz ${currentJuz}`);

  return parts.join(' • ');
};
