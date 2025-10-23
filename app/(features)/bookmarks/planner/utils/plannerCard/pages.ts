import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PageMetrics } from '@/app/(features)/bookmarks/planner/utils/plannerCard/types';

interface PageBounds {
  startPage: number | null;
  endPage: number | null;
  totalPages: number | null;
}

const getPageBounds = (chapter: PlannerCardProps['chapter']): PageBounds => {
  const startPage = typeof chapter?.pages?.[0] === 'number' ? chapter.pages![0] : null;
  const endPage = typeof chapter?.pages?.[1] === 'number' ? chapter.pages![1] : null;
  const totalPages =
    typeof startPage === 'number' && typeof endPage === 'number'
      ? Math.max(1, endPage - startPage + 1)
      : null;

  return { startPage, endPage, totalPages };
};

const computePagesFromVerses = (
  plan: PlannerCardProps['plan'],
  totalPages: number | null,
  verses: number
): number | null => {
  if (!totalPages || plan.targetVerses <= 0) return null;
  if (verses <= 0) return 0;
  const ratio = verses / plan.targetVerses;
  const estimated = Math.round(ratio * totalPages);
  return Math.max(0, Math.min(totalPages, estimated));
};

const getPageCounts = (
  plan: PlannerCardProps['plan'],
  bounds: PageBounds,
  completedPages: number | null
): Pick<PageMetrics, 'completedPagesCount' | 'remainingPagesCount' | 'goalPagesCount'> => {
  const remainingPages =
    bounds.totalPages !== null && completedPages !== null
      ? Math.max(bounds.totalPages - completedPages, 0)
      : bounds.totalPages;

  const completedPagesCount = typeof completedPages === 'number' ? completedPages : null;
  const remainingPagesCount =
    typeof remainingPages === 'number' ? Math.max(0, remainingPages) : null;
  const goalPagesCount =
    typeof bounds.totalPages === 'number' ? Math.max(0, bounds.totalPages) : null;

  return { completedPagesCount, remainingPagesCount, goalPagesCount };
};

const createPageResolver = (
  plan: PlannerCardProps['plan'],
  bounds: PageBounds
): PageMetrics['getPageForVerse'] => {
  if (typeof bounds.startPage !== 'number' || typeof bounds.totalPages !== 'number') {
    const fallback = typeof bounds.startPage === 'number' ? bounds.startPage : null;
    const fallbackResolver: PageMetrics['getPageForVerse'] = () => fallback;
    return fallbackResolver;
  }

  const resolver: PageMetrics['getPageForVerse'] = (verseNumber, mode) => {
    if (plan.targetVerses <= 0) {
      return bounds.startPage as number;
    }
    const cappedVerse = Math.min(Math.max(1, verseNumber), plan.targetVerses);
    const relativeOffset =
      mode === 'start'
        ? Math.floor(((cappedVerse - 1) / plan.targetVerses) * bounds.totalPages!)
        : Math.ceil((cappedVerse / plan.targetVerses) * bounds.totalPages!) - 1;
    const boundedOffset = Math.max(0, Math.min(bounds.totalPages! - 1, relativeOffset));
    return bounds.startPage! + boundedOffset;
  };

  return resolver;
};

export const getPageMetrics = (
  plan: PlannerCardProps['plan'],
  chapter: PlannerCardProps['chapter']
): PageMetrics => {
  const bounds = getPageBounds(chapter);
  const completedPages = computePagesFromVerses(plan, bounds.totalPages, plan.completedVerses);
  const counts = getPageCounts(plan, bounds, completedPages);
  const getPageForVerse = createPageResolver(plan, bounds);

  return {
    startPage: bounds.startPage,
    endPage: bounds.endPage,
    totalPages: bounds.totalPages,
    completedPagesCount: counts.completedPagesCount,
    remainingPagesCount: counts.remainingPagesCount,
    goalPagesCount: counts.goalPagesCount,
    getPageForVerse,
  };
};
