import { useParams, usePathname } from 'next/navigation';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

const toNumberParam = (param: string | string[] | undefined): number | undefined => {
  if (!param) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

interface SurahTabParamsResult {
  currentSurahId: number | undefined;
  currentJuzId: number | undefined;
  currentPageId: number | undefined;
  isTafsirPath: boolean;
  getInitialTab: () => TabKey;
}

export const useSurahTabParams = (): SurahTabParamsResult => {
  const { surahId, juzId, pageId } = useParams();
  const pathname = usePathname();

  const currentSurahId = toNumberParam(surahId);
  const currentJuzId = toNumberParam(juzId);
  const currentPageId = toNumberParam(pageId);
  const isTafsirPath = pathname?.includes('/tafsir');

  const getInitialTab = (): TabKey => {
    if (currentJuzId) return 'Juz';
    if (currentPageId) return 'Page';
    return 'Surah';
  };

  return {
    currentSurahId,
    currentJuzId,
    currentPageId,
    isTafsirPath,
    getInitialTab,
  };
};
