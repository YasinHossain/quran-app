'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { SurahNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { formatNumber } from '@/lib/text/localizeNumbers';

import type { Chapter } from '@/types';

interface SurahCardProps {
  chapter: Chapter;
}

export const SurahCard = memo(function SurahCard({ chapter }: SurahCardProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const versesCount = formatNumber(chapter.verses_count, i18n.language, { useGrouping: false });

  return (
    <SurahNavigationCard
      href={buildSurahRoute(chapter.id)}
      scroll
      prefetch={true}
      className="items-center"
      content={{
        id: chapter.id,
        title: t(`surah_names.${chapter.id}`, chapter.name_simple),
        subtitle: `${versesCount} ${t('verses')}`,
        arabic: chapter.name_arabic,
      }}
    />
  );
});
