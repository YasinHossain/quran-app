import { useMemo } from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { getAllTafsirResources } from '@/lib/api';
import { TafsirResource } from '@/types';

export const useTafsirOptions = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  // Fetch a broad set so the user can pick any available tafsir
  const { data } = useSWR('tafsir:resources:all', getAllTafsirResources);
  const tafsirOptions: TafsirResource[] = useMemo(() => data || [], [data]);

  const tafsirResource = useMemo(
    () => tafsirOptions.find((t) => t.id === settings.tafsirIds[0]),
    [tafsirOptions, settings.tafsirIds]
  );

  const selectedTafsirName = useMemo(() => {
    if (!settings.tafsirIds || settings.tafsirIds.length === 0) {
      return t('select_tafsir');
    }
    const names = settings.tafsirIds
      .map((id) => tafsirOptions.find((o) => o.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    return names.length ? names.join(', ') : t('select_tafsir');
  }, [settings.tafsirIds, tafsirOptions, t]);

  return { tafsirOptions, tafsirResource, selectedTafsirName };
};
