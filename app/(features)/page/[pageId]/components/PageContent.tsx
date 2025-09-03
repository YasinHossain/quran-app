import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { Verse as VerseType } from '@/types';

import { VerseCard } from '@/app/(features)/surah/components';
import Spinner from '@/app/shared/Spinner';

interface PageContentProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: (node?: Element | null) => void;
  isHidden: boolean;
  className?: string;
}

/**
 * Renders the main content area with verses for a Quran page.
 * Implements mobile-first responsive design and performance optimization.
 *
 * Features:
 * - Infinite scrolling with load more functionality
 * - Loading and error states
 * - Mobile-first responsive layout
 * - Performance optimized with memo() wrapper
 */
export const PageContent = memo(function PageContent({
  verses,
  isLoading,
  error,
  isValidating,
  isReachingEnd,
  loadMoreRef,
  isHidden,
  className,
}: PageContentProps) {
  const { t } = useTranslation();

  return (
    <main
      className={`
        flex-grow bg-surface overflow-y-auto homepage-scrollable-area transition-all duration-300
        ${
          isHidden
            ? 'pt-4 md:pt-6 lg:pt-10'
            : 'pt-[calc(3.5rem+1rem+env(safe-area-inset-top))] md:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+2.5rem+env(safe-area-inset-top))]'
        }
        px-4 md:px-6 lg:px-10 pb-4 md:pb-6 lg:pb-10
        ${className || ''}
      `.trim()}
    >
      <div className="w-full relative space-y-4 md:space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12 md:py-20">
            <Spinner className="h-6 w-6 md:h-8 md:w-8 text-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-12 md:py-20 text-status-error bg-surface border border-status-error/20 p-4 md:p-6 rounded-lg mx-2 md:mx-0">
            <p className="text-sm md:text-base">{error}</p>
          </div>
        ) : verses.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {verses.map((verse: VerseType) => (
              <VerseCard key={verse.id} verse={verse} />
            ))}
            <div ref={loadMoreRef} className="py-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                {isValidating && <Spinner className="inline h-4 w-4 md:h-5 md:w-5 text-accent" />}
                {isReachingEnd && (
                  <span className="text-muted text-sm md:text-base">{t('end_of_page')}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 md:py-20 text-muted">
            <p className="text-sm md:text-base">{t('no_verses_found_on_page')}</p>
          </div>
        )}
      </div>
    </main>
  );
});

export default PageContent;
