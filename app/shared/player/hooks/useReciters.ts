import { useMemo } from 'react';
import useSWR from 'swr';

import { getQdcAudioReciters } from '@/lib/audio/qdcAudio';

import type { QdcAudioReciterApi } from '@/lib/audio/qdcAudio';
import type { Reciter } from '@/app/shared/player/types';

const QDC_RECITERS_KEY = 'qdc-audio-reciters';

// Default reciter to use while loading or if API fails
export const DEFAULT_RECITER: Reciter = {
  id: 7,
  name: 'Mishari Rashid al-`Afasy',
  locale: 'Murattal • Hafs',
};

function mapQdcReciterToReciter(reciter: QdcAudioReciterApi): Reciter {
  const displayName = reciter.translated_name?.name || reciter.name;
  const localeParts = [reciter.style?.name, reciter.qirat?.name].filter(
    (part): part is string => Boolean(part)
  );
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
  }, [data]);

  return {
    reciters,
    isLoading: Boolean(isLoading && reciters.length === 0),
    error: error as Error | undefined,
  };
}
