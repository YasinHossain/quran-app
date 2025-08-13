import useSWR from 'swr';
import { getJuz, getVersesByJuz } from '@/lib/api';
import type { Juz } from '@/types';
import useVerseListing from '@/app/(features)/surah/hooks/useVerseListing';

export function useJuzData(juzId?: string) {
  const verseListing = useVerseListing({ id: juzId, lookup: getVersesByJuz });

  const { data: juz, error: juzError } = useSWR<Juz>(juzId ? ['juz', juzId] : null, ([, id]) =>
    getJuz(id)
  );

  const isLoading = verseListing.isLoading || (!juz && !juzError);

  return {
    juz,
    juzError,
    isLoading,
    ...verseListing,
  } as const;
}

export default useJuzData;
