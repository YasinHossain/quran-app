import { VerseCard } from '@/app/(features)/surah/components';

import { LoadMoreIndicator } from './LoadMoreIndicator';

import type { Verse as VerseType } from '@/types';

interface VersesListProps {
  verses: VerseType[];
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.Ref<HTMLDivElement>;
  t: (key: string) => string;
}

export function VersesList({
  verses,
  isValidating,
  isReachingEnd,
  loadMoreRef,
  t,
}: VersesListProps): React.JSX.Element {
  return (
    <div className="space-y-4 md:space-y-6">
      {verses.map(
        (verse: VerseType): React.JSX.Element => (
          <VerseCard key={verse.id} verse={verse} />
        )
      )}
      <div ref={loadMoreRef}>
        <LoadMoreIndicator isValidating={isValidating} isReachingEnd={isReachingEnd} t={t} />
      </div>
    </div>
  );
}
