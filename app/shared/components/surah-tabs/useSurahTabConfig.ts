import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useSurahTabConfig = () => {
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
