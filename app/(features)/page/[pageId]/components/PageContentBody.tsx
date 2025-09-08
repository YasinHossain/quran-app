import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { VersesList } from './VersesList';

import type { Verse as VerseType } from '@/types';

interface PageContentBodyProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.Ref<HTMLDivElement>;
  t: (key: string) => string;
}

export function PageContentBody({
  verses,
  isLoading,
  error,
  isValidating,
  isReachingEnd,
  loadMoreRef,
  t,
}: PageContentBodyProps): React.JSX.Element {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (verses.length > 0) {
    return (
      <VersesList
        verses={verses}
        isValidating={isValidating}
        isReachingEnd={isReachingEnd}
        loadMoreRef={loadMoreRef}
        t={t}
      />
    );
  }
  return <EmptyState t={t} />;
}
