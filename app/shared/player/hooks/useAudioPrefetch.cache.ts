import { ILogger } from '@/src/domain/interfaces/ILogger';

import { PrefetchedAudio } from './useAudioPrefetch.types';

export function cleanupOldCache(
  cache: Map<string, PrefetchedAudio>,
  maxCacheSize: number,
  logger: ILogger
): void {
  let totalSize = 0;
  const entries = Array.from(cache.entries());

  for (const [, audio] of entries) totalSize += audio.size;

  if (totalSize > maxCacheSize) {
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    while (totalSize > maxCacheSize * 0.8 && entries.length > 0) {
      const [url, audio] = entries.shift()!;
      totalSize -= audio.size;
      if (audio.objectUrl) URL.revokeObjectURL(audio.objectUrl);
      cache.delete(url);
      logger.debug('Audio cache cleanup', { removedUrl: url, newTotalSize: totalSize });
    }
  }
}

export function clearCacheMap(cache: Map<string, PrefetchedAudio>, logger: ILogger): void {
  for (const [, audio] of cache) {
    if (audio.objectUrl) URL.revokeObjectURL(audio.objectUrl);
  }
  cache.clear();
  logger.debug('Audio cache cleared');
}

export function getCacheStatsFromMap(cache: Map<string, PrefetchedAudio>): {
  count: number;
  totalSize: number;
} {
  let totalSize = 0;
  for (const [, audio] of cache) totalSize += audio.size;
  return { count: cache.size, totalSize };
}
