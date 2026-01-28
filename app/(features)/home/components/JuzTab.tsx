'use client';

import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { useIdleViewportPrefetch } from '@/app/shared/navigation/hooks/useIdleViewportPrefetch';
import { useIntentPrefetch } from '@/app/shared/navigation/hooks/useIntentPrefetch';
import { formatJuzRange } from '@/app/shared/navigation/formatJuzRange';
import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';
import { buildJuzRoute } from '@/app/shared/navigation/routes';
import { JuzNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

import { NavigationCardGrid } from './NavigationCardGrid';

const JUZ_HREF_MATCH = /\/juz\/\d+/;

export const JuzTab = memo(function JuzTab(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const intentPrefetch = useIntentPrefetch((href) => router.prefetch(href));
  const gridRef = useRef<HTMLDivElement | null>(null);
  const locale = getLocaleFromPathname(pathname) ?? 'en';
  const language = i18n?.language ?? 'en';
  const { juzs } = useNavigationDatasets();

  const buildHref = useCallback(
    (juzNumber: number) => localizeHref(buildJuzRoute(juzNumber), locale),
    [locale]
  );

  const prefetch = useCallback((href: string) => router.prefetch(href), [router]);

  useIdleViewportPrefetch({
    enabled: true,
    containerRef: gridRef,
    prefetch,
    hrefMatch: JUZ_HREF_MATCH,
    delayMs: 200,
    limit: 8,
  });

  return (
    <div ref={gridRef}>
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
    </div>
  );
});
