import React from 'react';

import { JuzHeader } from './JuzHeader';
import { JuzVerseList } from './JuzVerseList';

import type { Juz } from '@/types';
import type { Verse } from '@/types/verse';

interface JuzContentProps {
  juzId: string | null;
  isLoading: boolean;
  error: string | null;
  juzError: Error | null;
  juz: Juz | undefined;
  verses: Verse[];
  loadMoreRef: React.RefObject<HTMLDivElement>;
  isValidating: boolean;
  isReachingEnd: boolean;
  t: (key: string) => string;
}

export function JuzContent({
  juzId,
  isLoading,
  error,
  juzError,
  juz,
  verses,
  loadMoreRef,
  isValidating,
  isReachingEnd,
  t,
}: JuzContentProps): JSX.Element {
  if (!juzId || isLoading) {
    return <div className="text-center py-20 text-accent">{t('loading')}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-status-error bg-surface p-4 rounded-lg">{error}</div>
    );
  }

  if (juzError) {
    return (
      <div className="text-center py-20 text-status-error bg-surface p-4 rounded-lg">
        {t('failed_to_load_juz_info')}
      </div>
    );
  }

  return (
    <>
      <JuzHeader juz={juz} />
      <JuzVerseList
        verses={verses}
        loadMoreRef={loadMoreRef}
        isValidating={isValidating}
        isReachingEnd={isReachingEnd}
      />
    </>
  );
}
