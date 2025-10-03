'use client';

import { memo } from 'react';

import { formatSurahSubtitle } from '@/app/shared/navigation/formatSurahSubtitle';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { SurahNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

import type { Chapter } from '@/types';

interface SurahCardProps {
  chapter: Chapter;
}

export const SurahCard = memo(function SurahCard({ chapter }: SurahCardProps): React.JSX.Element {
  return (
    <SurahNavigationCard
      href={buildSurahRoute(chapter.id)}
      scroll
      className="items-center"
      content={{
        id: chapter.id,
        title: chapter.name_simple,
        subtitle: formatSurahSubtitle(chapter),
        arabic: chapter.name_arabic,
      }}
    />
  );
});
