'use client';

import { usePathname, useRouter } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { useIntentPrefetch } from '@/app/shared/navigation/hooks/useIntentPrefetch';
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
  const router = useRouter();
  const intentPrefetch = useIntentPrefetch((href) => router.prefetch(href));
  const locale = getLocaleFromPathname(pathname) ?? 'en';
  const href = localizeHref(buildSurahRoute(chapter.id), locale);
  const versesCount = formatNumber(chapter.verses_count, i18n.language, { useGrouping: false });

  return (
    <SurahNavigationCard
      href={href}
      scroll
      prefetch={false}
      onMouseEnter={() => intentPrefetch.onMouseEnter(href)}
      onFocus={() => intentPrefetch.onFocus(href)}
      onTouchStart={(event) => intentPrefetch.onTouchStart(event, href)}
      onTouchMove={intentPrefetch.onTouchMove}
      onTouchEnd={intentPrefetch.onTouchEnd}
      onTouchCancel={intentPrefetch.onTouchCancel}
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
