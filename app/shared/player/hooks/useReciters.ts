import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { getQdcAudioReciters } from '@/lib/audio/qdcAudio';

import type { Reciter } from '@/app/shared/player/types';
import type { QdcAudioReciterApi } from '@/lib/audio/qdcAudio';

const QDC_RECITERS_KEY = 'qdc-audio-reciters';

// Default reciter to use while loading or if API fails
export const DEFAULT_RECITER: Reciter = {
  id: 173,
  name: 'Mishari Rashid al-`Afasy',
  locale: 'Murattal',
};

function mapQdcReciterToReciter(
  reciter: QdcAudioReciterApi,
  deps: { t: (key: string) => string; exists: (key: string) => boolean }
): Reciter {
  const nameOverrideKey = `reciter_names.${reciter.id}`;
  const localizedName = deps.exists(nameOverrideKey) ? deps.t(nameOverrideKey) : undefined;
  const displayName =
    localizedName || reciter.translated_name?.name || reciter.name || deps.t('unknown_reciter');
  const localeParts = [reciter.style?.name].filter((part): part is string => Boolean(part));
  const locale = localeParts.join(' • ');
  return {
    id: reciter.id,
    name: displayName,
    ...(locale ? { locale } : {}),
  };
}

interface UseRecitersReturn {
  reciters: Reciter[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useReciters(): UseRecitersReturn {
  const { t, i18n } = useTranslation();
  const { data, error, isLoading } = useSWR(
    [QDC_RECITERS_KEY, i18n.language],
    ([_, lang]) => getQdcAudioReciters(lang?.split('-')[0])
  );

  const reciters = useMemo(() => {
    const mapped = (data ?? []).map((reciter) =>
      mapQdcReciterToReciter(reciter, { t, exists: (key) => i18n.exists(key) })
    );
    mapped.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    return mapped;
  }, [data, i18n, t]);

  return {
    reciters,
    isLoading: Boolean(isLoading && reciters.length === 0),
    error: error as Error | undefined,
  };
}
