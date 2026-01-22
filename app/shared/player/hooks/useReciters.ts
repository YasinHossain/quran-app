import { useMemo } from 'react';
import useSWR from 'swr';

import { i18n } from '@/app/i18n';
import { getQdcAudioReciters } from '@/lib/audio/qdcAudio';

import type { Reciter } from '@/app/shared/player/types';
import type { QdcAudioReciterApi } from '@/lib/audio/qdcAudio';

const QDC_RECITERS_KEY = 'qdc-audio-reciters';

// Default reciter to use while loading or if API fails
export const DEFAULT_RECITER: Reciter = {
  id: 7,
  name: 'Mishari Rashid al-`Afasy',
  locale: 'Murattal',
};

function mapQdcReciterToReciter(reciter: QdcAudioReciterApi): Reciter {
  const nameOverrideKey = `reciter_names.${reciter.id}`;
  const localizedName = i18n.exists(nameOverrideKey) ? i18n.t(nameOverrideKey) : undefined;
  const displayName =
    localizedName || reciter.translated_name?.name || reciter.name || i18n.t('unknown_reciter');
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
  const { data, error, isLoading } = useSWR(QDC_RECITERS_KEY, getQdcAudioReciters);

  const reciters = useMemo(() => {
    const mapped = (data ?? []).map(mapQdcReciterToReciter);
    mapped.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    return mapped;
  }, [data, i18n.language]);

  return {
    reciters,
    isLoading: Boolean(isLoading && reciters.length === 0),
    error: error as Error | undefined,
  };
}
