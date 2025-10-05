import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

interface SurahTab {
  key: TabKey;
  label: string;
}

interface UseSurahTabConfigResult {
  tabs: SurahTab[];
}

export const useSurahTabConfig = (): UseSurahTabConfigResult => {
  const { t } = useTranslation();

  const tabs = useMemo<SurahTab[]>(
    () => [
      { key: 'Surah', label: t('surah_tab') },
      { key: 'Juz', label: t('juz_tab') },
      { key: 'Page', label: t('page_tab') },
    ],
    [t]
  );

  return { tabs };
};
