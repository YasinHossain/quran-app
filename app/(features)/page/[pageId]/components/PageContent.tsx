import React from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from '@/app/(features)/surah/[surahId]/components/Verse';
import { Verse as VerseType } from '@/types';
import Spinner from '@/app/shared/Spinner';

interface PageContentProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: (node?: Element | null) => void;
  isHidden: boolean;
}

/**
 * Renders the main content area with verses for a Quran page
 */
export function PageContent({
  verses,
  isLoading,
  error,
  isValidating,
  isReachingEnd,
  loadMoreRef,
  isHidden,
}: PageContentProps) {
  const { t } = useTranslation();

  return (
    <main
      className={`flex-grow bg-surface overflow-y-auto homepage-scrollable-area transition-all duration-300 ${
        isHidden
          ? 'pt-6 lg:pt-10'
          : 'pt-[calc(3.5rem+1.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+2.5rem+env(safe-area-inset-top))]'
      } px-6 lg:px-10 pb-6 lg:pb-10`}
    >
      <div className="w-full relative">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8 text-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-status-error bg-surface border border-status-error/20 p-4 rounded-lg">
            {error}
          </div>
        ) : verses.length > 0 ? (
          <>
            {verses.map((v: VerseType) => (
              <React.Fragment key={v.id}>
                <Verse verse={v} />
              </React.Fragment>
            ))}
            <div ref={loadMoreRef} className="py-4 text-center space-x-2">
              {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
              {isReachingEnd && <span className="text-muted">{t('end_of_page')}</span>}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted">{t('no_verses_found_on_page')}</div>
        )}
      </div>
    </main>
  );
}
