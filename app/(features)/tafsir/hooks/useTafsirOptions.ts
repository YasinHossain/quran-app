import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { useSettings } from '@/app/providers/SettingsContext';
import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { container } from '@/src/infrastructure/di/container';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { TafsirResource } from '@/types';

export const useTafsirOptions = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const repository = useMemo(() => container.getTafsirRepository(), []);
  const resourcesUseCase = useMemo(() => new GetTafsirResourcesUseCase(repository), [repository]);

  // Fetch a broad set so the user can pick any available tafsir
  const { data } = useSWR<TafsirResource[]>(
    'tafsir:resources:all',
    async () => {
      const result = await resourcesUseCase.execute();
      return result.tafsirs.map((t) => ({ id: t.id, name: t.displayName, lang: t.language }));
    },
    {
      onError: (error) =>
        logger.error('Failed to load tafsir resources:', undefined, error as Error),
    }
  );
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
