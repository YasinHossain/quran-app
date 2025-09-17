import { useCallback, useMemo, useRef, useState } from 'react';

import { getStableTranslationIds } from './utils';

import type { UseVerseListingParams, UseVerseListingReturn } from './types';

export interface VerseListingErrorState {
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  handleLoaderError: (message: string) => void;
}

export function useVerseListingErrorState(): VerseListingErrorState {
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const handleLoaderError = useCallback((message: string) => setError(message), []);
  return { error, loadMoreRef, handleLoaderError };
}

export function useStableTranslationIds(settings: UseVerseListingReturn['settings']): string {
  return useMemo(
    () => getStableTranslationIds(settings.translationIds, settings.translationId),
    [settings.translationIds, settings.translationId]
  );
}

export function resolveVerses(
  initialVerses: UseVerseListingParams['initialVerses'],
  loadedVerses: UseVerseListingReturn['verses']
): UseVerseListingReturn['verses'] {
  return initialVerses?.length ? initialVerses : loadedVerses;
}
