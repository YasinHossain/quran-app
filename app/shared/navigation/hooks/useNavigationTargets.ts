'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

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

  const goToSurah = useCallback(
    (surahId: number | string) => {
      router.push(buildSurahRoute(surahId));
    },
    [router]
  );

  const goToJuz = useCallback(
    (juzId: number | string) => {
      router.push(buildJuzRoute(juzId));
    },
    [router]
  );

  const goToPage = useCallback(
    (page: number | string) => {
      router.push(buildPageRoute(page));
    },
    [router]
  );

  return useMemo(
    () => ({
      goToSurah,
      goToJuz,
      goToPage,
      getSurahHref: buildSurahRoute,
      getJuzHref: buildJuzRoute,
      getPageHref: buildPageRoute,
    }),
    [goToSurah, goToJuz, goToPage]
  );
}
