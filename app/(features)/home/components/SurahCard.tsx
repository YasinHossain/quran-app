'use client';

import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
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
  const router = useRouter();
  const locale = getLocaleFromPathname(pathname) ?? 'en';
  const href = localizeHref(buildSurahRoute(chapter.id), locale);
  const versesCount = formatNumber(chapter.verses_count, i18n.language, { useGrouping: false });

  const prefetchRoute = useCallback(() => {
    try {
      void router.prefetch(href);
    } catch {
      // Ignore prefetch errors
    }
  }, [href, router]);

  return (
    <SurahNavigationCard
      href={href}
      scroll
      prefetch
      onMouseEnter={prefetchRoute}
      onFocus={prefetchRoute}
      onTouchStart={prefetchRoute}
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
