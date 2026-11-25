import { useCallback, useMemo } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import {
  getLocaleFromPathname,
  localizeHref,
  stripLocaleFromPathname,
} from '@/app/shared/i18n/localeRouting';
import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { resolveSurahParam } from '@/lib/seo/surahSlugs';

import type { Surah } from '@/types';

export interface TafsirNavTarget {
  surahId: string;
  ayahId: number;
}

interface UseVerseNavigationReturn {
  prev: TafsirNavTarget | null;
  next: TafsirNavTarget | null;
  navigate: (target: TafsirNavTarget | null) => void;
  currentSurah: Surah | undefined;
}

const TAFSIR_VERSE_PATH = /^\/tafsir\/([^/]+)\/([1-9]\d{0,2})\/?$/;

/**
 * The verse a tafsir URL names (`/bn/tafsir/al-baqarah/5` -> `{ surahId: '2', ayahId: '5' }`), or
 * `null` for any other path. Next/Previous switch verses with `history.pushState`, so the address
 * bar (not the server props) is the source of truth for the verse on screen.
 */
export function parseTafsirPathname(
  pathname: string | null | undefined
): { surahId: string; ayahId: string } | null {
  const match = TAFSIR_VERSE_PATH.exec(stripLocaleFromPathname(pathname));
  if (!match) return null;
  let segment = match[1] ?? '';
  try {
    segment = decodeURIComponent(segment);
  } catch {
    return null;
  }
  const surah = resolveSurahParam(segment);
  return surah ? { surahId: String(surah.id), ayahId: match[2]! } : null;
}

/**
 * Switches to another verse without a server round trip: the page renders it from the client
 * cache (the neighbours are prefetched), and `pushState` keeps the address bar, `usePathname` and
 * Back/Forward in sync. A refresh or direct visit still gets the server-rendered page.
 */
function switchTafsirVerse(target: TafsirNavTarget, pathname: string): void {
  const locale = getLocaleFromPathname(pathname) ?? 'en';
  const href = localizeHref(buildTafsirRoute(target.surahId, target.ayahId), locale);
  window.history.pushState(null, '', href);
  window.scrollTo(0, 0);
}

export const useVerseNavigation = (surahId: string, ayahId: string): UseVerseNavigationReturn => {
  const pathname = usePublicPathname();
  const { setSurahListOpen } = useSidebar();
  const { surahs: surahList } = useSurahNavigationData();

  const totalSurahs = surahList.length;
  const currentSurahIndex = Number(surahId) - 1;
  const currentAyahNum = Number(ayahId);

  const prev = useMemo(
    () =>
      currentAyahNum > 1
        ? { surahId, ayahId: currentAyahNum - 1 }
        : currentSurahIndex > 0 && surahList.length > 0
          ? {
              surahId: String(Number(surahId) - 1),
              ayahId: surahList[currentSurahIndex - 1]!.verses,
            }
          : null,
    [currentAyahNum, currentSurahIndex, surahId, surahList]
  );

  const next = useMemo(
    () =>
      surahList.length > 0 && currentAyahNum < (surahList[currentSurahIndex]?.verses ?? 0)
        ? { surahId, ayahId: currentAyahNum + 1 }
        : currentSurahIndex < totalSurahs - 1
          ? { surahId: String(Number(surahId) + 1), ayahId: 1 }
          : null,
    [currentAyahNum, currentSurahIndex, surahId, surahList, totalSurahs]
  );

  const navigate = useCallback(
    (target: TafsirNavTarget | null) => {
      if (!target) return;
      setSurahListOpen(false);
      switchTafsirVerse(target, pathname);
    },
    [pathname, setSurahListOpen]
  );

  const currentSurah = useMemo(
    () => surahList.find((s) => s.number === Number(surahId)),
    [surahList, surahId]
  );

  return { prev, next, navigate, currentSurah };
};
