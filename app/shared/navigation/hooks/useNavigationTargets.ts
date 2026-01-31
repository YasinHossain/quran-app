'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildJuzRoute, buildPageRoute, buildSurahRoute } from '@/app/shared/navigation/routes';

interface NavigationTargets {
  readonly goToSurah: (surahId: number | string) => void;
  readonly goToJuz: (juzId: number | string) => void;
  readonly goToPage: (page: number | string) => void;
  readonly getSurahHref: (surahId: number | string) => string;
  readonly getJuzHref: (juzId: number | string) => string;
  readonly getPageHref: (page: number | string) => string;
}

export function useNavigationTargets(): NavigationTargets {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPathname(pathname) ?? 'en', [pathname]);

  const goToSurah = useCallback(
    (surahId: number | string) => {
      router.push(localizeHref(buildSurahRoute(surahId), locale));
    },
    [locale, router]
  );

  const goToJuz = useCallback(
    (juzId: number | string) => {
      router.push(localizeHref(buildJuzRoute(juzId), locale));
    },
    [locale, router]
  );

  const goToPage = useCallback(
    (page: number | string) => {
      router.push(localizeHref(buildPageRoute(page), locale));
    },
    [locale, router]
  );

  return useMemo(
    () => ({
      goToSurah,
      goToJuz,
      goToPage,
      getSurahHref: (surahId) => localizeHref(buildSurahRoute(surahId), locale),
      getJuzHref: (juzId) => localizeHref(buildJuzRoute(juzId), locale),
      getPageHref: (page) => localizeHref(buildPageRoute(page), locale),
    }),
    [goToSurah, goToJuz, goToPage, locale]
  );
}
