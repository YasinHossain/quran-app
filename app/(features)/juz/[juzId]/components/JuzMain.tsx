import React from 'react';

import { JuzContent } from './JuzContent';

export function JuzMain({
  isHidden,
  contentProps,
}: {
  isHidden: boolean;
  contentProps: {
    juzId: string;
    isLoading: boolean;
    error: string | null;
    juzError: Error | null;
    juz: import('@/types').Juz | undefined;
    verses: import('@/types/verse').Verse[];
    loadMoreRef: React.RefObject<HTMLDivElement>;
    isValidating: boolean;
    isReachingEnd: boolean;
    t: (key: string) => string;
  };
}): JSX.Element {
  return (
    <main
      className={`flex-grow bg-surface overflow-y-auto homepage-scrollable-area transition-all duration-300 ${
        isHidden
          ? 'pt-6 lg:pt-10'
          : 'pt-[calc(3.5rem+1.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+2.5rem+env(safe-area-inset-top))]'
      } px-6 lg:px-10 pb-6 lg:pb-10`}
    >
      <div className="w-full relative">
        <JuzContent {...contentProps} />
      </div>
    </main>
  );
}

