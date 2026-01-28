'use client';

import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { useIntentPrefetch } from '@/app/shared/navigation/hooks/useIntentPrefetch';
import { formatJuzRange } from '@/app/shared/navigation/formatJuzRange';
import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';
import { buildJuzRoute } from '@/app/shared/navigation/routes';
import { JuzNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

import { NavigationCardGrid } from './NavigationCardGrid';

export const JuzTab = memo(function JuzTab(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const intentPrefetch = useIntentPrefetch((href) => router.prefetch(href));
  const locale = getLocaleFromPathname(pathname) ?? 'en';
  const language = i18n?.language ?? 'en';
  const { juzs } = useNavigationDatasets();

  const buildHref = useCallback(
    (juzNumber: number) => localizeHref(buildJuzRoute(juzNumber), locale),
    [locale]
  );

  return (
    <NavigationCardGrid>
      {juzs.map((juz) => {
        const href = buildHref(juz.number);
        return (
          <JuzNavigationCard
            key={juz.number}
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
              id: juz.number,
              title: t('juz_number', { number: juz.number, defaultValue: `Juz ${juz.number}` }),
              subtitle: formatJuzRange(juz, t, language),
            }}
          />
        );
      })}
    </NavigationCardGrid>
  );
});
