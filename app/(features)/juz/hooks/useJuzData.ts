import useSWR from 'swr';

import { useVerseListing } from '@/app/(features)/surah/hooks/useVerseListing';
import { getJuz, getVersesByJuz } from '@/lib/api';

import type { Juz } from '@/types';

export function useJuzData(juzId?: string): {
  juz: Juz | undefined;
  juzError: Error | null;
  isLoading: boolean;
  error: string | null;
  verses: import('@/types').Verse[];
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  translationOptions: { id: number; name: string; lang: string }[];
  wordLanguageOptions: { name: string; id: number }[];
  wordLanguageMap: Record<string, number>;
  settings: ReturnType<typeof import('@/app/providers/SettingsContext').useSettings>['settings'];
  setSettings: ReturnType<
    typeof import('@/app/providers/SettingsContext').useSettings
  >['setSettings'];
  activeVerse: ReturnType<
    typeof import('@/app/shared/player/context/AudioContext').useAudio
  >['activeVerse'];
  reciter: ReturnType<
    typeof import('@/app/shared/player/context/AudioContext').useAudio
  >['reciter'];
  isPlayerVisible: ReturnType<
    typeof import('@/app/shared/player/context/AudioContext').useAudio
  >['isPlayerVisible'];
  handleNext: () => boolean;
  handlePrev: () => boolean;
} {
  const verseListing = useVerseListing({
    ...(juzId !== undefined ? { id: juzId } : {}),
    lookup: ({ id, translationIds, page, perPage, wordLang }) =>
      getVersesByJuz({ id, translationIds, page, perPage, wordLang }),
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
