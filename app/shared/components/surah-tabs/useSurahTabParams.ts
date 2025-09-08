import { useParams, usePathname } from 'next/navigation';

const toNumberParam = (param: string | string[] | undefined): number | undefined => {
  if (!param) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export const useSurahTabParams = () => {
  const { surahId, juzId, pageId } = useParams();
  const pathname = usePathname();

  const currentSurahId = toNumberParam(surahId);
  const currentJuzId = toNumberParam(juzId);
  const currentPageId = toNumberParam(pageId);
  const isTafsirPath = pathname?.includes('/tafsir');

  const getInitialTab = (): 'Surah' | 'Juz' | 'Page' => {
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
