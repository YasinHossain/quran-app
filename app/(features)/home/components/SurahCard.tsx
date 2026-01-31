'use client';

import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { SurahNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { formatNumber } from '@/lib/text/localizeNumbers';

import type { Chapter } from '@/types';

interface SurahCardProps {
  chapter: Chapter;
}

export const SurahCard = memo(function SurahCard({ chapter }: SurahCardProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? 'en';
  const versesCount = formatNumber(chapter.verses_count, i18n.language, { useGrouping: false });

  return (
    <SurahNavigationCard
      href={localizeHref(buildSurahRoute(chapter.id), locale)}
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
