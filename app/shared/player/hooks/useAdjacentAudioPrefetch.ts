import { useEffect } from 'react';

import { ILogger } from '@/src/domain/interfaces/ILogger';

export function useAdjacentAudioPrefetch(params: {
  enabled: boolean;
  currentAudioUrl: string | null;
  prefetchNext: boolean;
  prefetchPrevious: boolean;
  getNextAudioUrl?: () => string | null;
  getPreviousAudioUrl?: () => string | null;
  prefetchAudio: (url: string) => Promise<string | null>;
  logger: ILogger;
}) {
  const {
    enabled,
    currentAudioUrl,
    prefetchNext,
    prefetchPrevious,
    getNextAudioUrl,
    getPreviousAudioUrl,
    prefetchAudio,
    logger,
  } = params;

  useEffect(() => {
    if (!enabled || !currentAudioUrl) return;
    const tasks: Promise<void>[] = [];

    if (prefetchNext && getNextAudioUrl) {
      const nextUrl = getNextAudioUrl();
      if (nextUrl) {
        tasks.push(
          prefetchAudio(nextUrl)
            .then(() => logger.debug('Next audio prefetched', { nextUrl }))
            .catch(() => {})
        );
      }
    }

    if (prefetchPrevious && getPreviousAudioUrl) {
      const previousUrl = getPreviousAudioUrl();
      if (previousUrl) {
        tasks.push(
          prefetchAudio(previousUrl)
            .then(() => logger.debug('Previous audio prefetched', { previousUrl }))
            .catch(() => {})
        );
      }
    }

    if (tasks.length) Promise.allSettled(tasks);
  }, [
    enabled,
    currentAudioUrl,
    prefetchNext,
    prefetchPrevious,
    getNextAudioUrl,
    getPreviousAudioUrl,
    prefetchAudio,
    logger,
  ]);
}
