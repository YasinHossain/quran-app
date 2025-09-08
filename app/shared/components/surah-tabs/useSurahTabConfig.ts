import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface SurahTab {
  key: string;
  label: string;
}

interface UseSurahTabConfigResult {
  tabs: SurahTab[];
}

export const useSurahTabConfig = (): UseSurahTabConfigResult => {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      { key: 'Surah', label: t('surah_tab') },
      { key: 'Juz', label: t('juz_tab') },
      { key: 'Page', label: t('page_tab') },
    ],
    [t]
  );

  return { tabs };
};
