import type { useJuzData } from './useJuzData';

export function useJuzContentProps(
  args: {
    juzId: string;
    t: (key: string) => string;
  } & Pick<
    ReturnType<typeof useJuzData>,
    | 'isLoading'
    | 'error'
    | 'juzError'
    | 'juz'
    | 'verses'
    | 'loadMoreRef'
    | 'isValidating'
    | 'isReachingEnd'
  >
): typeof args {
  const {
    juzId,
    isLoading,
    error,
    juzError,
    juz,
    verses,
    loadMoreRef,
    isValidating,
    isReachingEnd,
    t,
  } = args;

  return {
    juzId,
    isLoading,
    error,
    juzError,
    juz,
    verses,
    loadMoreRef,
    isValidating,
    isReachingEnd,
    t,
  } as const;
}
