import { useMemo } from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTafsirResources } from '@/lib/api';
import { TafsirResource } from '@/types';

export const useTafsirOptions = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const { data } = useSWR('tafsirs', getTafsirResources);
  const tafsirOptions: TafsirResource[] = useMemo(() => data || [], [data]);

  const tafsirResource = useMemo(
    () => tafsirOptions.find((t) => t.id === settings.tafsirIds[0]),
    [tafsirOptions, settings.tafsirIds]
  );

  const selectedTafsirName = useMemo(() => {
    const names = settings.tafsirIds
      .map((id) => tafsirOptions.find((o) => o.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    return names.length ? names.join(', ') : t('select_tafsir');
  }, [settings.tafsirIds, tafsirOptions, t]);

  return { tafsirOptions, tafsirResource, selectedTafsirName };
};
