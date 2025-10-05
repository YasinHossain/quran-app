import { useEffect } from 'react';

import { ILogger } from '@/src/domain/interfaces/ILogger';

type PrefetchTaskConfig = {
  shouldPrefetch: boolean;
  resolveUrl?: () => string | null;
  prefetchAudio: (url: string) => Promise<string | null>;
  logger: ILogger;
  descriptor: 'next' | 'previous';
};

const createPrefetchTask = ({
  shouldPrefetch,
  resolveUrl,
  prefetchAudio,
  logger,
  descriptor,
}: PrefetchTaskConfig): Promise<void> | null => {
  if (!shouldPrefetch || !resolveUrl) {
    return null;
  }

  const url = resolveUrl();
  if (!url) {
    return null;
  }

  const logContext = descriptor === 'next' ? { nextUrl: url } : { previousUrl: url };
  const logMessage = descriptor === 'next' ? 'Next audio prefetched' : 'Previous audio prefetched';

  return prefetchAudio(url)
    .then(() => {
      logger.debug(logMessage, logContext);
    })
    .catch((): void => {});
};

type AdjacentAudioPrefetchParams = {
  enabled: boolean;
  currentAudioUrl: string | null;
  prefetchNext: boolean;
  prefetchPrevious: boolean;
  getNextAudioUrl?: () => string | null;
  getPreviousAudioUrl?: () => string | null;
  prefetchAudio: (url: string) => Promise<string | null>;
  logger: ILogger;
};

const queueAdjacentPrefetch = (params: AdjacentAudioPrefetchParams): void => {
  if (!params.enabled || !params.currentAudioUrl) {
    return;
  }

  const tasks = [
    (() => {
      const cfg: PrefetchTaskConfig = {
        shouldPrefetch: params.prefetchNext,
        prefetchAudio: params.prefetchAudio,
        logger: params.logger,
        descriptor: 'next',
      };
      if (params.getNextAudioUrl) cfg.resolveUrl = params.getNextAudioUrl;
      return createPrefetchTask(cfg);
    })(),
    (() => {
      const cfg: PrefetchTaskConfig = {
        shouldPrefetch: params.prefetchPrevious,
        prefetchAudio: params.prefetchAudio,
        logger: params.logger,
        descriptor: 'previous',
      };
      if (params.getPreviousAudioUrl) cfg.resolveUrl = params.getPreviousAudioUrl;
      return createPrefetchTask(cfg);
    })(),
  ].filter((task): task is Promise<void> => task !== null);

  if (tasks.length > 0) {
    void Promise.allSettled(tasks);
  }
};

export function useAdjacentAudioPrefetch(params: AdjacentAudioPrefetchParams): void {
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

  useEffect((): void => {
    const cfg: AdjacentAudioPrefetchParams = {
      enabled,
      currentAudioUrl,
      prefetchNext,
      prefetchPrevious,
      prefetchAudio,
      logger,
    };
    if (getNextAudioUrl) cfg.getNextAudioUrl = getNextAudioUrl;
    if (getPreviousAudioUrl) cfg.getPreviousAudioUrl = getPreviousAudioUrl;
    queueAdjacentPrefetch(cfg);
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
