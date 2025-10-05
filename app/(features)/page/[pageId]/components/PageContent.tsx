import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PageContentBody } from './PageContentBody';

import type { Verse as VerseType } from '@/types';

interface PageContentProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.Ref<HTMLDivElement>;
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
}: PageContentProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <main
      className={`
        flex-grow bg-background overflow-y-auto homepage-scrollable-area transition-all duration-300
        ${
          isHidden
            ? 'pt-4 md:pt-6 lg:pt-10'
            : 'pt-[calc(3.5rem+1rem+env(safe-area-inset-top))] md:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+2.5rem+env(safe-area-inset-top))]'
        }
        px-4 md:px-6 lg:px-10 pb-4 md:pb-6 lg:pb-10 lg:mr-[20.7rem]
        ${className || ''}
      `.trim()}
    >
      <div className="w-full relative space-y-4 md:space-y-6">
        <PageContentBody
          verses={verses}
          isLoading={isLoading}
          error={error}
          isValidating={isValidating}
          isReachingEnd={isReachingEnd}
          loadMoreRef={loadMoreRef}
          t={t}
        />
      </div>
    </main>
  );
});
