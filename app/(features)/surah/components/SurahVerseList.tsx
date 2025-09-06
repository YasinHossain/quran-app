'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@/app/shared/Spinner';

import { Verse as VerseComponent } from './VerseCard';

import type { Verse as VerseType } from '@/types';

interface SurahVerseListProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
}

export const SurahVerseList = ({
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
}: SurahVerseListProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="w-full relative">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-accent" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
          {error}
        </div>
      ) : verses.length > 0 ? (
        <>
          {verses.map((v) => (
            <React.Fragment key={v.id}>
              <VerseComponent verse={v} />
            </React.Fragment>
          ))}
          <div ref={loadMoreRef} className="py-4 text-center space-x-2">
            {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
            {isReachingEnd && <span className="text-muted">{t('end_of_surah')}</span>}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-muted">{t('no_verses_found')}</div>
      )}
    </div>
  );
};
