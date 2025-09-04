import useSWR from 'swr';
import { getJuz, getVersesByJuz } from '@/lib/api';
import type { Juz } from '@/types';
import { useVerseListing } from '@/app/(features)/surah/hooks/useVerseListing';

export function useJuzData(juzId?: string) {
  const verseListing = useVerseListing({
    ...(juzId !== undefined ? { id: juzId } : {}),
    lookup: getVersesByJuz,
  });

  const { data: juz, error: juzError } = useSWR<Juz>(
    juzId ? ['juz', juzId] : null,
    ([, id]: [string, string]) => getJuz(id)
  );

  const { isLoading: versesLoading, ...rest } = verseListing;
  const isLoading = versesLoading || (!juz && !juzError);

  return {
    juz,
    juzError,
    isLoading,
    ...rest,
  } as const;
}
