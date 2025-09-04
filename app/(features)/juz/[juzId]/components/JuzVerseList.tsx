import React from 'react';
import { useTranslation } from 'react-i18next';
import { VerseCard } from '@/app/(features)/surah/components';
import type { Verse as VerseType } from '@/types';

interface JuzVerseListProps {
  verses: VerseType[];
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
}

export function JuzVerseList({
  verses,
  loadMoreRef,
  isValidating,
  isReachingEnd,
}: JuzVerseListProps) {
  const { t } = useTranslation();

  if (verses.length === 0) {
    return <div className="text-center py-20 text-muted">{t('no_verses_found_in_juz')}</div>;
  }

  return (
    <>
      {verses.map((v) => (
        <VerseCard key={v.id} verse={v} />
      ))}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isValidating && <span className="text-accent">{t('loading')}</span>}
        {isReachingEnd && <span className="text-muted">{t('end_of_juz')}</span>}
      </div>
    </>
  );
}
